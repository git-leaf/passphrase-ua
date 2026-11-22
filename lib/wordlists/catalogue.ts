/**
 * Wordlist catalogue
 *
 * The Wordlists the app offers, per language, in display order.
 * Everything else (dropdowns, defaults, translations, loading) is keyed by these ids.
 */

export type WordlistLanguage = "en" | "uk"

export interface WordlistInfo {
  /** File path under public/ */
  path: string
  /** Number of words in the file */
  size: number
  /** Whether entries carry a Transliteration */
  transliteration: boolean
  /** Whether no word begins another, so a Passphrase can go without a Separator */
  prefixFree: boolean
}

export const WORDLIST_CATALOGUE = {
  en: {
    "eff-large": { path: "/wordlists/en/eff_large_diceware.txt", size: 7776, transliteration: false, prefixFree: true },
    "eff-short": { path: "/wordlists/en/eff_short_diceware.txt", size: 1296, transliteration: false, prefixFree: true },
    "eff-short-2": {
      path: "/wordlists/en/eff_short_diceware_2.txt",
      size: 1296,
      transliteration: false,
      prefixFree: true,
    },
    original: { path: "/wordlists/en/original_diceware.txt", size: 7776, transliteration: false, prefixFree: false },
    beale: { path: "/wordlists/en/beale_diceware.txt", size: 7776, transliteration: false, prefixFree: false },
  },
  uk: {
    wordlist: { path: "/wordlists/uk/wordlist.txt", size: 10870, transliteration: true, prefixFree: false },
    short: { path: "/wordlists/uk/short_diceware.txt", size: 1296, transliteration: true, prefixFree: false },
    long: { path: "/wordlists/uk/long_diceware.txt", size: 7776, transliteration: true, prefixFree: false },
  },
} as const satisfies Record<WordlistLanguage, Record<string, WordlistInfo>>

export type WordlistId<L extends WordlistLanguage = WordlistLanguage> = keyof (typeof WORDLIST_CATALOGUE)[L]

/** A language together with one of its Wordlists */
export type WordlistChoice = {
  [L in WordlistLanguage]: { language: L; id: WordlistId<L> }
}[WordlistLanguage]

export const DEFAULT_WORDLIST: { [L in WordlistLanguage]: WordlistId<L> } = {
  en: "eff-large",
  uk: "wordlist",
}

export function wordlistInfo(choice: WordlistChoice): WordlistInfo {
  return (WORDLIST_CATALOGUE[choice.language] as Record<string, WordlistInfo>)[choice.id]
}

/** The file paths of every Wordlist in the catalogue */
export function wordlistPaths(): string[] {
  return Object.values(WORDLIST_CATALOGUE).flatMap((wordlists) =>
    Object.values(wordlists).map((info: WordlistInfo) => info.path),
  )
}

/** The languages with Wordlists */
export function wordlistLanguages(): WordlistLanguage[] {
  return Object.keys(WORDLIST_CATALOGUE) as WordlistLanguage[]
}

/** The language's Wordlists in display order */
export function wordlistIds<L extends WordlistLanguage>(language: L): WordlistId<L>[] {
  return Object.keys(WORDLIST_CATALOGUE[language]) as WordlistId<L>[]
}
