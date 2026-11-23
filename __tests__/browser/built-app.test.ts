/**
 * The built app in a real Chrome: what jsdom can't check, namely colour contrast, the root
 * layout's <html lang> and <title>, and the service worker. Run with `pnpm check:browser`,
 * which builds the app first; `pnpm check` leaves this file out.
 */

import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import type { AxeResults } from "axe-core"
import { afterAll, beforeAll, describe, expect, it, onTestFinished } from "vitest"
import { DEFAULT_PASSPHRASE_OPTIONS } from "@/lib/generators/passphrase"
import { localizedPaths, locales, pagePath, pages, translations } from "@/lib/i18n"
import { wordlistPaths } from "@/lib/wordlists/catalogue"
import { startBuiltApp, type BuiltAppServer } from "./built-app-server"
import { launchChrome, type Chrome } from "./chrome"

const themes = ["light", "dark"] as const

let server: BuiltAppServer | undefined
let chrome: Chrome | undefined
let axeSource: string

beforeAll(async () => {
  axeSource = await readFile(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8")
  server = await startBuiltApp()
  chrome = await launchChrome()
})

afterAll(async () => {
  await chrome?.close()
  await server?.stop()
})

function running() {
  if (!server || !chrome) throw new Error("The server or Chrome did not start")
  return { server, chrome }
}

// The functions below run in the page, so they use only what the browser provides

/** The Secret currently shown, or "" */
function shownSecret() {
  return document.querySelector("code")?.textContent ?? ""
}

/**
 * Every axe violation on the page, one line per element, first as loaded, then after each
 * collapsed section opens, because some groups keep only one section open at a time, like the FAQ.
 * A collapsed section is found by its trigger, a button inside a heading, as every accordion in
 * the app renders it; a collapsible built another way would go unchecked.
 */
async function violationsWithEverySectionOpen() {
  const { axe } = window as unknown as { axe: { run(context: Document): Promise<AxeResults> } }
  const violations = new Set<string>()
  // Contrast is only right once transitions and animations have finished
  const settle = async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const ending = document
      .getAnimations()
      .filter((animation) => animation.playState === "running" && animation.effect?.getTiming().iterations !== Infinity)
    await Promise.all(ending.map((animation) => animation.finished))
  }
  const check = async () => {
    for (const { id, nodes } of (await axe.run(document)).violations) {
      for (const node of nodes) violations.add(`${id}: ${node.html.slice(0, 120)}`)
    }
  }

  await settle()
  await check()
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role=heading]")
  for (const trigger of [...headings].flatMap((heading) => [...heading.querySelectorAll("button")])) {
    if (trigger.getAttribute("aria-expanded") === "false") {
      trigger.click()
      await settle()
      await check()
    }
  }
  return [...violations]
}

/** Whether the service worker keeps every page, every Wordlist and every file this page loaded */
async function keptOffline(pages: string[], wordlists: string[]) {
  const loaded = performance
    .getEntriesByType("resource")
    .map((entry) => new URL(entry.name))
    .filter((url) => url.origin === location.origin && !url.search)
    .map((url) => url.pathname)
  const kept = await Promise.all([...pages, ...wordlists, ...loaded].map((url) => caches.match(url)))
  return kept.every(Boolean)
}

describe.each(locales)("in %s", (locale) => {
  describe.each(themes)("in the %s theme", (theme) => {
    it.each(pages)("serves the %s page with its language and title, and no axe violations", async (page) => {
      const tab = await running().chrome.newTab()
      onTestFinished(() => tab.close())
      await tab.emulateColorScheme(theme)
      await tab.goto(running().server.origin + pagePath(page, locale))
      if (page === "passphrase" || page === "password") await tab.waitFor("a Secret", shownSecret)

      expect(await tab.evaluate(() => document.documentElement.lang)).toBe(locale)
      expect(await tab.evaluate(() => document.title)).toBe(translations[locale].meta[page].title)
      expect(await tab.evaluate(() => [...document.documentElement.classList])).toContain(theme)
      await tab.addScript(axeSource)
      expect(await tab.evaluate(violationsWithEverySectionOpen)).toEqual([])
    })
  })
})

// Last, because it stops the server
describe("offline", () => {
  it("reloads and generates a Passphrase with the server stopped, after a first visit", async () => {
    const { server, chrome } = running()
    const tab = await chrome.newTab({ isolated: true })
    await tab.goto(server.origin + pagePath("passphrase", "uk"))
    await tab.waitFor("a Passphrase", shownSecret)
    // The pages app/components/offline-support.tsx hands over: every page, plus the root and old /privacy
    await tab.waitFor(
      "the service worker to keep the app",
      keptOffline,
      ["/", "/privacy", ...localizedPaths()],
      wordlistPaths(),
    )

    await server.stop()
    await expect(fetch(server.origin)).rejects.toThrow()
    await tab.reload()

    const passphrase = await tab.waitFor("a Passphrase generated offline", shownSecret)
    expect(passphrase.split(DEFAULT_PASSPHRASE_OPTIONS.separator)).toHaveLength(DEFAULT_PASSPHRASE_OPTIONS.wordCount)
  })
})
