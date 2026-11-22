// @vitest-environment jsdom
import { readdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { translations } from "@/lib/i18n/translations"
import { createWordlistSource } from "@/lib/wordlists/wordlist-source"

const en = translations.en
const uk = translations.uk

/** Reads a file from public/ the way the deployed app serves it */
async function readPublic(path: string) {
  return readFile(join("public", path), "utf8")
}

// Browser APIs jsdom lacks; the network serves public/ like the deployed app, 404 included
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const path = input instanceof Request ? new URL(input.url).pathname : String(input)
    try {
      return new Response(await readPublic(path))
    } catch {
      return new Response(null, { status: 404 })
    }
  })
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  // jsdom has no service worker; a test may add one
  Reflect.deleteProperty(navigator, "serviceWorker")
})

/**
 * Renders the page as the root layout does. Modules are reloaded so every test
 * starts with fresh Secrets and default options.
 */
async function renderApp() {
  vi.resetModules()
  const [{ default: Home }, { I18nProvider }, { ThemeProvider }, { Toaster }, { OfflineSupport }] = await Promise.all([
    import("@/app/page"),
    import("@/lib/i18n"),
    import("@/app/components/theme-provider"),
    import("@/app/components/ui/toaster"),
    import("@/app/components/offline-support"),
  ])
  const user = userEvent.setup()
  render(
    <I18nProvider defaultLocale="en">
      <ThemeProvider defaultTheme="system">
        <Home />
        <Toaster />
        <OfflineSupport />
      </ThemeProvider>
    </I18nProvider>,
  )
  return user
}

/** The Secret currently shown */
function shownSecret() {
  return screen.getByRole("code").textContent ?? ""
}

// Default Password: 16 characters from lowercase, uppercase, numbers and symbols
const DEFAULT_PASSWORD = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|;:,.<>?]{16}$/

async function untilDefaultPasswordShown() {
  await waitFor(() => expect(shownSecret()).toMatch(DEFAULT_PASSWORD))
}

/** Lengthens the Password by one character with the length slider */
async function lengthenPassword(user: UserEvent) {
  screen.getByRole("slider").focus()
  await user.keyboard("{ArrowRight}")
}

async function chooseUnderscoreSeparator(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: `${en.passphrase.separatorUnderscore} _` }))
}

/** Waits until no Passphrase is being generated */
async function untilPassphraseSettled() {
  await waitFor(() => expect(screen.getByRole("button", { name: en.passphrase.generate })).toBeTruthy())
}

/** Matches a Passphrase of `count` words from the default Ukrainian Wordlist, joined by `separator` */
async function ukrainianPassphrase(count: number, separator: string) {
  const wordlists = createWordlistSource(readPublic)
  const { entries } = await wordlists.load({ language: "uk", id: "wordlist" })
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const word = `(?:${entries.map((entry) => escape(entry.word)).join("|")})`
  return new RegExp(`^${word}(?:${escape(separator)}${word}){${count - 1}}$`, "u")
}

describe("generator page", () => {
  it("shows a Password of the default length and Character set on load", async () => {
    await renderApp()

    await untilDefaultPasswordShown()
  })

  it("shows a Passphrase of six words from the default Ukrainian Wordlist", async () => {
    const user = await renderApp()
    const sixWords = await ukrainianPassphrase(6, "-")

    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))

    await waitFor(() => expect(shownSecret()).toMatch(sixWords))
  })

  it("regenerates the Password when its length changes", async () => {
    const user = await renderApp()
    await untilDefaultPasswordShown()

    await lengthenPassword(user)

    await waitFor(() => expect(shownSecret()).toHaveLength(17))
  })

  it("regenerates the Passphrase when its Separator changes", async () => {
    const user = await renderApp()
    const sixWordsWithUnderscores = await ukrainianPassphrase(6, "_")
    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))

    await chooseUnderscoreSeparator(user)

    await waitFor(() => expect(shownSecret()).toMatch(sixWordsWithUnderscores))
  })

  it("copies the shown Secret to the clipboard and confirms it", async () => {
    const user = await renderApp()
    await untilDefaultPasswordShown()

    await user.click(screen.getByRole("button", { name: en.output.copy }))

    expect(await navigator.clipboard.readText()).toBe(shownSecret())
    expect(await screen.findByText(en.toast.copied)).toBeTruthy()
  })

  it("keeps each Generation method's options and latest Secret when switching between them", async () => {
    const user = await renderApp()
    const sixWordsWithUnderscores = await ukrainianPassphrase(6, "_")
    await untilDefaultPasswordShown()
    await lengthenPassword(user)
    await waitFor(() => expect(shownSecret()).toHaveLength(17))
    const password = shownSecret()

    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))
    await chooseUnderscoreSeparator(user)
    await waitFor(() => expect(shownSecret()).toMatch(sixWordsWithUnderscores))
    const passphrase = shownSecret()

    await user.click(screen.getByRole("tab", { name: en.tabs.password }))
    expect(shownSecret()).toBe(password)

    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))
    await untilPassphraseSettled()
    expect(shownSecret()).toBe(passphrase)

    // The options survived too: new Secrets still use them
    await user.click(screen.getByRole("button", { name: en.passphrase.generate }))
    await untilPassphraseSettled()
    expect(shownSecret()).toMatch(sixWordsWithUnderscores)
    await user.click(screen.getByRole("tab", { name: en.tabs.password }))
    await user.click(screen.getByRole("button", { name: en.password.generate }))
    expect(shownSecret()).toHaveLength(17)
  })

  it("switches the interface to Ukrainian and remembers the choice", async () => {
    const user = await renderApp()
    await untilDefaultPasswordShown()

    await user.click(screen.getByRole("button", { name: en.header.toggleLanguage }))
    await user.click(await screen.findByRole("menuitem", { name: /Українська/ }))

    expect(screen.getByRole("tab", { name: uk.tabs.passphrase })).toBeTruthy()
    expect(screen.getByText(uk.header.subtitle)).toBeTruthy()
    expect(screen.getByRole("button", { name: uk.header.toggleLanguage })).toBeTruthy()

    cleanup()
    await renderApp()
    expect(screen.getByRole("tab", { name: uk.tabs.passphrase })).toBeTruthy()
  })

  it("hands every page and Wordlist to the service worker for offline use", async () => {
    const postMessage = vi.fn()
    const registration = { active: { postMessage } }
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register: vi.fn(async () => registration), ready: Promise.resolve(registration) },
    })
    const wordlists = await Promise.all(
      ["en", "uk"].map(async (language) =>
        (await readdir(join("public/wordlists", language))).map((file) => `/wordlists/${language}/${file}`),
      ),
    )

    // Every route in app/, e.g. app/privacy/page.tsx is /privacy
    const pages = (await readdir("app", { recursive: true }))
      .filter((file) => /(^|\/)page\.tsx$/.test(file))
      .map((file) => "/" + dirname(file).replace(/^\.$/, ""))

    await renderApp()

    await waitFor(() => expect(postMessage).toHaveBeenCalled())
    const { type, urls } = postMessage.mock.calls[0][0]
    expect(type).toBe("cache-for-offline")
    expect(pages).toContain("/privacy")
    expect(urls).toEqual(expect.arrayContaining([...pages, ...wordlists.flat()]))
  })

  it("shows when the app is offline", async () => {
    await renderApp()
    await untilDefaultPasswordShown()

    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false)
    act(() => window.dispatchEvent(new Event("offline")))
    expect(screen.getByText(en.header.offline)).toBeTruthy()

    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true)
    act(() => window.dispatchEvent(new Event("online")))
    expect(screen.queryByText(en.header.offline)).toBeNull()
  })
})
