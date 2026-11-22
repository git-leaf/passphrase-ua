import { locales, type Locale } from "./translations"

// Where the visitor's language choice is kept; the privacy page lists it
const STORAGE_KEY = "locale"

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/**
 * Picks the UI locale: the user's saved choice, else the first browser language
 * whose primary language is supported (e.g. "uk-UA" → "uk"), else the fallback.
 */
export function resolvePreferredLocale(
  saved: string | null,
  browserLanguages: readonly string[],
  fallback: Locale,
): Locale {
  if (saved !== null && isLocale(saved)) return saved

  for (const language of browserLanguages) {
    const primary = language.split("-")[0].toLowerCase()
    if (isLocale(primary)) return primary
  }

  return fallback
}

/** The visitor's locale in this browser: their saved choice, else the browser language, else English */
export function preferredLocale(): Locale {
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language]
  return resolvePreferredLocale(readSavedLocale(), browserLanguages, "en")
}

/** Keeps the visitor's language choice, so the root sends them to it next time */
export function rememberLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Storage can be blocked or full; the choice still applies to the page it leads to
  }
}

function readSavedLocale(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
