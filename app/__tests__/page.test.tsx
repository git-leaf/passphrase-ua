// @vitest-environment jsdom
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { translations } from "@/lib/i18n/translations"

const en = translations.en

// Browser APIs jsdom lacks; the wordlist files are served from public/ as the app would fetch them
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
  vi.stubGlobal("fetch", async (path: string) => new Response(await readFile(join("public", path), "utf8")))
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
})

/**
 * Renders the page as the root layout does. Modules are reloaded so every test
 * starts with a fresh Generator session.
 */
async function renderApp() {
  vi.resetModules()
  const [{ default: Home }, { I18nProvider }, { ThemeProvider }, { Toaster }] = await Promise.all([
    import("@/app/page"),
    import("@/lib/i18n"),
    import("@/app/components/theme-provider"),
    import("@/app/components/ui/toaster"),
  ])
  const user = userEvent.setup()
  render(
    <I18nProvider defaultLocale="en">
      <ThemeProvider defaultTheme="system">
        <Home />
        <Toaster />
      </ThemeProvider>
    </I18nProvider>,
  )
  return user
}

/** The Secret currently shown */
function shownSecret() {
  return screen.getByRole("code").textContent ?? ""
}

/** Matches a Passphrase of `count` words from the Wordlist file, joined by `separator` */
async function passphrasePattern(wordlistPath: string, count: number, separator: string) {
  const text = await readFile(join("public", wordlistPath), "utf8")
  const words = text
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => line.trim().split(/\s+/)[0])
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const word = `(?:${words.map(escape).join("|")})`
  return new RegExp(`^${word}(?:${escape(separator)}${word}){${count - 1}}$`, "u")
}

describe("generator page", () => {
  it("shows a Password of the default length on load", async () => {
    await renderApp()

    await waitFor(() => expect(shownSecret()).toHaveLength(16))
  })

  it("shows a Passphrase of six words from the default Ukrainian Wordlist", async () => {
    const user = await renderApp()
    const sixUkrainianWords = await passphrasePattern("/wordlists/uk/wordlist.txt", 6, "-")

    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))

    await waitFor(() => expect(shownSecret()).toMatch(sixUkrainianWords))
  })

  it("regenerates the Password when its length changes", async () => {
    const user = await renderApp()
    await waitFor(() => expect(shownSecret()).toHaveLength(16))

    screen.getByRole("slider").focus()
    await user.keyboard("{ArrowRight}")

    await waitFor(() => expect(shownSecret()).toHaveLength(17))
  })

  it("regenerates the Passphrase when its Separator changes", async () => {
    const user = await renderApp()
    const sixWordsWithUnderscores = await passphrasePattern("/wordlists/uk/wordlist.txt", 6, "_")
    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))

    await user.click(screen.getByRole("button", { name: new RegExp(`^${en.passphrase.separatorUnderscore}`) }))

    await waitFor(() => expect(shownSecret()).toMatch(sixWordsWithUnderscores))
  })

  it("copies the shown Secret to the clipboard and confirms it", async () => {
    const user = await renderApp()
    await waitFor(() => expect(shownSecret()).toHaveLength(16))

    await user.click(screen.getByRole("button", { name: en.output.copy }))

    expect(await navigator.clipboard.readText()).toBe(shownSecret())
    expect(await screen.findByText(en.toast.copied)).toBeTruthy()
  })

  it("keeps each Generation method's options and latest Secret when switching between them", async () => {
    const user = await renderApp()
    await waitFor(() => expect(shownSecret()).toHaveLength(16))
    screen.getByRole("slider").focus()
    await user.keyboard("{ArrowRight}")
    await waitFor(() => expect(shownSecret()).toHaveLength(17))
    const password = shownSecret()

    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))
    await user.click(screen.getByRole("button", { name: new RegExp(`^${en.passphrase.separatorUnderscore}`) }))
    await waitFor(() => expect(shownSecret()).toContain("_"))
    const passphrase = shownSecret()

    await user.click(screen.getByRole("tab", { name: en.tabs.password }))
    expect(shownSecret()).toBe(password)
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("17")

    await user.click(screen.getByRole("tab", { name: en.tabs.passphrase }))
    expect(shownSecret()).toBe(passphrase)
  })

  it("switches the interface to Ukrainian and remembers the choice", async () => {
    const user = await renderApp()
    await waitFor(() => expect(shownSecret()).toHaveLength(16))

    await user.click(screen.getByRole("button", { name: "Toggle language" }))
    await user.click(await screen.findByRole("menuitem", { name: /Українська/ }))

    expect(screen.getByRole("tab", { name: translations.uk.tabs.passphrase })).toBeTruthy()
    expect(screen.getByText(translations.uk.header.subtitle)).toBeTruthy()

    cleanup()
    await renderApp()
    expect(screen.getByRole("tab", { name: translations.uk.tabs.passphrase })).toBeTruthy()
  })
})
