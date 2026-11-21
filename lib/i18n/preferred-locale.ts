import type { Locale } from "./translations"

const supportedLocales: readonly Locale[] = ["en", "uk"]

function isLocale(value: string): value is Locale {
  return (supportedLocales as readonly string[]).includes(value)
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
