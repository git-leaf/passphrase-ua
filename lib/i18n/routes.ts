/**
 * Where each page lives: every page is served once per language, under that
 * language's prefix, so search engines index Ukrainian and English separately.
 * The root (/) only picks a language and redirects (docs/adr/0012).
 */

import { locales, type Locale } from "./translations"

/** Each page's path after the language prefix; the Passphrase generator is the home page */
const PAGE_PATHS = {
  passphrase: "",
  password: "/password",
  learn: "/learn",
  privacy: "/privacy",
} as const

export type Page = keyof typeof PAGE_PATHS

export const pages = Object.keys(PAGE_PATHS) as Page[]

/** The page's URL path in one language, e.g. "/uk/password" */
export function pagePath(page: Page, locale: Locale): string {
  return `/${locale}${PAGE_PATHS[page]}`
}

/**
 * The page's URL in every language, keyed by hreflang. Visitors in any other
 * language get the root, which picks their language, or else English.
 */
export function languageAlternates(page: Page): Record<Locale | "x-default", string> {
  const byLocale = Object.fromEntries(locales.map((locale) => [locale, pagePath(page, locale)])) as Record<
    Locale,
    string
  >
  return { ...byLocale, "x-default": page === "passphrase" ? "/" : byLocale.en }
}

/** Every page in every language */
export function localizedPaths(): string[] {
  return pages.flatMap((page) => locales.map((locale) => pagePath(page, locale)))
}

/** Where the app is deployed, for the absolute URLs search engines need */
export const SITE_URL = new URL("https://movapass.net")
