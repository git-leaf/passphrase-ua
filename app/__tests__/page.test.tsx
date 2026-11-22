// @vitest-environment jsdom
import { readdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import type { ReactNode } from "react"
import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import axe from "axe-core"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { locales, translations, type Locale } from "@/lib/i18n/translations"
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
  // jsdom can't load another page; tests follow a link by rendering the page it points to
  document.addEventListener("click", preventNavigation)
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  // jsdom has no service worker; a test may add one
  Reflect.deleteProperty(navigator, "serviceWorker")
  history.replaceState(null, "", "/")
  document.removeEventListener("click", preventNavigation)
})

function preventNavigation(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest("a[href]")) event.preventDefault()
}

type PageModule = Promise<{ default: () => ReactNode }>

/** The page of each path after the language, e.g. /uk/password */
const LOCALIZED_PAGES: Record<string, () => PageModule> = {
  "": () => import("@/app/[locale]/page"),
  "/password": () => import("@/app/[locale]/password/page"),
  "/learn": () => import("@/app/[locale]/learn/page"),
  "/privacy": () => import("@/app/[locale]/privacy/page"),
}

/** The paths without a language, which send the visitor to one */
const LANGUAGE_PICKERS: Record<string, () => PageModule> = {
  "/": () => import("@/app/(language-picker)/page"),
  "/privacy": () => import("@/app/(language-picker)/privacy/page"),
}

/**
 * Renders the page at a path as its root layout does. Modules are reloaded so every
 * test starts with fresh Secrets and default options.
 */
async function renderApp(path: string) {
  vi.resetModules()
  await renderPage(path)
  return userEvent.setup()
}

/** Follows a link the way client-side navigation does: the app's state stays */
async function followLink(user: UserEvent, link: HTMLElement) {
  await user.click(link)
  cleanup()
  await renderPage(link.getAttribute("href") ?? "")
}

async function renderPage(path: string) {
  const [, locale, rest = ""] = /^\/(en|uk)(\/[^?#]*)?(?:[?#].*)?$/.exec(path) ?? []
  if (!locale) {
    const { default: Page } = await LANGUAGE_PICKERS[path]()
    render(<Page />)
    return
  }
  // The browser is at the page's URL, query included
  history.replaceState(null, "", path)
  const [{ default: Page }, { I18nProvider }, { ThemeProvider }, { Toaster }, { OfflineSupport }] = await Promise.all([
    LOCALIZED_PAGES[rest](),
    import("@/lib/i18n"),
    import("@/app/components/theme-provider"),
    import("@/app/components/ui/toaster"),
    import("@/app/components/offline-support"),
  ])
  render(
    <I18nProvider locale={locale as Locale}>
      <ThemeProvider defaultTheme="system">
        <Page />
        <Toaster />
        <OfflineSupport />
      </ThemeProvider>
    </I18nProvider>,
  )
}

/** Where the page sent the browser with location.replace, if anywhere; `at` is the current URL's query and anchor */
function stubRedirect(at: { search?: string; hash?: string } = {}) {
  const replace = vi.fn()
  vi.stubGlobal("location", { ...location, search: "", hash: "", ...at, replace })
  return replace
}

/**
 * Every axe violation on the rendered page, one line per element so a failure names the rule and shows the element.
 * The root layout's <html lang> and <title> are rendered by Next.js on the server, not here.
 */
async function accessibilityViolations() {
  const { violations } = await axe.run(document, {
    rules: { "html-has-lang": { enabled: false }, "document-title": { enabled: false } },
  })
  return violations.flatMap(({ id, nodes }) => nodes.map((node) => `${id}: ${node.html.slice(0, 120)}`))
}

/**
 * Axe violations with every collapsed section open, such as Advanced options, so what is inside is checked too.
 * Some groups keep one section open at a time, like the FAQ, so the page is checked after each one opens.
 */
async function violationsWithEverySectionOpen(user: UserEvent) {
  const violations = new Set(await accessibilityViolations())
  // A collapsible section is a button inside a heading
  const sections = screen.queryAllByRole("heading").flatMap((heading) => within(heading).queryAllByRole("button"))
  for (const section of sections) {
    if (section.getAttribute("aria-expanded") === "false") await user.click(section)
    for (const violation of await accessibilityViolations()) violations.add(violation)
  }
  return [...violations]
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
    await renderApp("/en/password")

    await untilDefaultPasswordShown()
  })

  it("opens on a Passphrase of six words from the default Ukrainian Wordlist", async () => {
    await renderApp("/en")
    const sixWords = await ukrainianPassphrase(6, "-")

    await waitFor(() => expect(shownSecret()).toMatch(sixWords))
  })

  it("regenerates the Password when its length changes", async () => {
    const user = await renderApp("/en/password")
    await untilDefaultPasswordShown()

    await lengthenPassword(user)

    await waitFor(() => expect(shownSecret()).toHaveLength(17))
  })

  it("regenerates the Passphrase when its Separator changes", async () => {
    const user = await renderApp("/en")
    const sixWordsWithUnderscores = await ukrainianPassphrase(6, "_")

    await chooseUnderscoreSeparator(user)

    await waitFor(() => expect(shownSecret()).toMatch(sixWordsWithUnderscores))
  })

  it("opens on the options in the URL", async () => {
    await renderApp("/en?words=5&sep=_")
    const fiveWordsWithUnderscores = await ukrainianPassphrase(5, "_")

    await waitFor(() => expect(shownSecret()).toMatch(fiveWordsWithUnderscores))
    expect(screen.getByText(`5 ${en.passphrase.words}`)).toBeTruthy()
  })

  it("opens on the default for each invalid option in the URL", async () => {
    await renderApp("/en/password?length=20&symbols=maybe&lower=0&upper=0&numbers=0")

    await waitFor(() => expect(shownSecret()).toMatch(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|;:,.<>?]{20}$/))
  })

  it("shows the options that differ from the defaults in the URL, without adding history entries", async () => {
    const user = await renderApp("/en/password")
    await untilDefaultPasswordShown()
    const entries = history.length

    await lengthenPassword(user)
    await waitFor(() => expect(location.search).toBe("?length=17"))

    screen.getByRole("slider").focus()
    await user.keyboard("{ArrowLeft}")
    await waitFor(() => expect(location.search).toBe(""))
    expect(location.pathname).toBe("/en/password")
    expect(history.length).toBe(entries)
  })

  it("writes the URL once the options settle, never while the page first renders", async () => {
    const replaceState = vi.spyOn(history, "replaceState")
    const user = await renderApp("/en/password?length=20&symbols=maybe")
    // Next.js takes over history only after the page's own effects have run; the one call so far opened the page
    expect(replaceState.mock.calls.map(([, , url]) => url)).toEqual(["/en/password?length=20&symbols=maybe"])
    await waitFor(() => expect(location.search).toBe("?length=20"))

    screen.getByRole("slider").focus()
    replaceState.mockClear()
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}")
    await waitFor(() => expect(location.search).toBe("?length=24"))
    expect(replaceState).toHaveBeenCalledTimes(1)
  })

  it("keeps each Generation method's options in the URL of its own page", async () => {
    const user = await renderApp("/en/password?length=20")
    await waitFor(() => expect(shownSecret()).toHaveLength(20))

    await followLink(user, screen.getByRole("link", { name: en.tabs.passphrase }))
    await chooseUnderscoreSeparator(user)
    await waitFor(() => expect(location.search).toBe("?sep=_"))

    await followLink(user, screen.getByRole("link", { name: en.tabs.password }))
    await waitFor(() => expect(location.search).toBe("?length=20"))
  })

  it("copies the shown Secret to the clipboard and confirms it", async () => {
    const user = await renderApp("/en/password")
    await untilDefaultPasswordShown()

    await user.click(screen.getByRole("button", { name: en.output.copy }))

    expect(await navigator.clipboard.readText()).toBe(shownSecret())
    expect(await screen.findByText(en.toast.copied)).toBeTruthy()
  })

  it("keeps each Generation method's options and latest Secret when moving between their pages", async () => {
    const user = await renderApp("/en/password")
    const sixWordsWithUnderscores = await ukrainianPassphrase(6, "_")
    await untilDefaultPasswordShown()
    await lengthenPassword(user)
    await waitFor(() => expect(shownSecret()).toHaveLength(17))
    const password = shownSecret()

    await followLink(user, screen.getByRole("link", { name: en.tabs.passphrase }))
    await chooseUnderscoreSeparator(user)
    await waitFor(() => expect(shownSecret()).toMatch(sixWordsWithUnderscores))
    const passphrase = shownSecret()

    await followLink(user, screen.getByRole("link", { name: en.tabs.password }))
    expect(shownSecret()).toBe(password)

    await followLink(user, screen.getByRole("link", { name: en.tabs.passphrase }))
    await untilPassphraseSettled()
    expect(shownSecret()).toBe(passphrase)

    // The options survived too: new Secrets still use them
    await user.click(screen.getByRole("button", { name: en.passphrase.generate }))
    await untilPassphraseSettled()
    expect(shownSecret()).toMatch(sixWordsWithUnderscores)
    await followLink(user, screen.getByRole("link", { name: en.tabs.password }))
    await user.click(screen.getByRole("button", { name: en.password.generate }))
    expect(shownSecret()).toHaveLength(17)
  })

  it("serves each page in each language at its own URL, marking the current page", async () => {
    const pages = [
      { path: "", view: "passphrase", shows: (t: typeof en) => t.passphrase.generate },
      { path: "/password", view: "password", shows: (t: typeof en) => t.password.generate },
      { path: "/learn", view: "learn", shows: (t: typeof en) => t.learn.title },
    ] as const

    for (const locale of locales) {
      const t = translations[locale]
      for (const { path, view, shows } of pages) {
        cleanup()
        await renderApp(`/${locale}${path}`)

        expect(screen.getByText(t.header.subtitle)).toBeTruthy()
        expect(await screen.findByText(shows(t))).toBeTruthy()
        expect(screen.getByRole("link", { current: "page" }).textContent).toBe(t.tabs[view])
      }

      cleanup()
      await renderApp(`/${locale}/privacy`)
      expect(screen.getByRole("heading", { level: 1, name: t.privacy.title })).toBeTruthy()
    }
  })

  it("links every Learn section by an anchor", async () => {
    await renderApp("/en/learn")

    const faq = document.getElementById("faq")
    expect(faq && within(faq).getByRole("heading", { name: en.learn.faq.title })).toBeTruthy()
  })

  it("moves to the same page in Ukrainian and sends the visitor there from the root next time", async () => {
    const user = await renderApp("/en/learn")

    await user.click(screen.getByRole("button", { name: en.header.toggleLanguage }))
    await followLink(user, await screen.findByRole("menuitem", { name: /Українська/ }))

    expect(screen.getByRole("link", { current: "page" }).textContent).toBe(uk.tabs.learn)
    expect(screen.getByRole("heading", { name: uk.learn.title })).toBeTruthy()
    expect(screen.getByRole("button", { name: uk.header.toggleLanguage })).toBeTruthy()

    cleanup()
    const redirect = stubRedirect()
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"])
    await renderApp("/")
    await waitFor(() => expect(redirect).toHaveBeenCalledWith("/uk"))
  })

  it("keeps the Learn section when switching language", async () => {
    const user = await renderApp("/en/learn#faq")

    await user.click(screen.getByRole("button", { name: en.header.toggleLanguage }))

    expect((await screen.findByRole("menuitem", { name: /Українська/ })).getAttribute("href")).toBe("/uk/learn#faq")
  })

  it("generates nothing on Learn, so no Wordlist is downloaded", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
    await renderApp("/en/learn")

    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(fetchSpy.mock.calls.map(([url]) => String(url)).filter((url) => url.includes("/wordlists/"))).toEqual([])
  })

  it("sends the root and the old privacy URL to the browser's language, else English", async () => {
    const languages = vi.spyOn(navigator, "languages", "get")
    const cases = [
      { path: "/", browser: ["uk-UA", "en"], to: "/uk" },
      { path: "/", browser: ["de-DE"], to: "/en" },
      { path: "/privacy", browser: ["uk"], to: "/uk/privacy" },
      { path: "/privacy", browser: ["en-GB"], to: "/en/privacy" },
      {
        path: "/privacy",
        browser: ["uk"],
        at: { search: "?ref=x", hash: "#contact" },
        to: "/uk/privacy?ref=x#contact",
      },
    ]

    for (const { path, browser, at, to } of cases) {
      cleanup()
      const redirect = stubRedirect(at)
      languages.mockReturnValue(browser)

      await renderApp(path)

      await waitFor(() => expect(redirect).toHaveBeenCalledWith(to))
    }
  })

  it("never puts the Secret in a URL", async () => {
    for (const path of ["/en", "/en/password", "/en?words=4&sep=.", "/en/password?length=12"]) {
      cleanup()
      const user = await renderApp(path)
      await waitFor(() => expect(location.search).toBe(path.replace(/^[^?]*/, "")))
      await waitFor(() => expect(shownSecret()).not.toBe(""))
      const secret = shownSecret()
      await user.click(screen.getByRole("button", { name: en.header.toggleLanguage }))
      await screen.findAllByRole("menuitem")

      const urls = [location.href, ...document.querySelectorAll("a[href]")].map(String)
      expect(urls.filter((url) => url.includes(secret) || url.includes(encodeURIComponent(secret)))).toEqual([])
    }
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

    // Every route in app/ in every language, e.g. app/[locale]/learn/page.tsx is /en/learn and /uk/learn
    const pages = (await readdir("app", { recursive: true }))
      .filter((file) => /(^|\/)page\.tsx$/.test(file))
      .map((file) => ("/" + dirname(file).replace(/^\.$/, "")).replace(/\/\([^)]+\)/g, "").replace(/^$/, "/"))
      .flatMap((page) => (page.includes("[locale]") ? locales.map((locale) => page.replace("[locale]", locale)) : page))
      .map((page) => page.replace(/(.)\/$/, "$1"))

    await renderApp("/en")

    await waitFor(() => expect(postMessage).toHaveBeenCalled())
    const { type, urls } = postMessage.mock.calls[0][0]
    expect(type).toBe("cache-for-offline")
    expect(pages).toEqual(expect.arrayContaining(["/", "/uk/privacy", "/en/learn"]))
    expect(urls).toEqual(expect.arrayContaining([...pages, ...wordlists.flat()]))
  })

  it("shows when the app is offline", async () => {
    await renderApp("/en/password")
    await untilDefaultPasswordShown()

    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false)
    act(() => window.dispatchEvent(new Event("offline")))
    expect(screen.getByText(en.header.offline)).toBeTruthy()

    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true)
    act(() => window.dispatchEvent(new Event("online")))
    expect(screen.queryByText(en.header.offline)).toBeNull()
  })
})

describe("accessibility", () => {
  const views: Record<string, (locale: Locale) => Promise<UserEvent>> = {
    "the Passphrase generator": async (locale) => {
      const user = await renderApp(`/${locale}`)
      await waitFor(() => expect(shownSecret()).not.toBe(""))
      return user
    },
    "the Password generator": async (locale) => {
      const user = await renderApp(`/${locale}/password`)
      await untilDefaultPasswordShown()
      return user
    },
    Learn: (locale) => renderApp(`/${locale}/learn`),
    Privacy: (locale) => renderApp(`/${locale}/privacy`),
  }

  for (const locale of locales) {
    for (const [view, openView] of Object.entries(views)) {
      it(`finds no violations on ${view} in ${locale === "en" ? "English" : "Ukrainian"}`, async () => {
        const user = await openView(locale)

        expect(await violationsWithEverySectionOpen(user)).toEqual([])
      })
    }
  }

  it("finds no violations on the page that picks a language", async () => {
    stubRedirect()
    const user = await renderApp("/")

    expect(await violationsWithEverySectionOpen(user)).toEqual([])
  })
})
