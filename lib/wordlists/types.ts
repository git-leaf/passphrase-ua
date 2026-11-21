/**
 * Wordlist Types
 */

/**
 * A single word, with its Transliteration when the Wordlist has one
 */
export interface WordlistEntry {
  /** Word in the Wordlist's language */
  word: string
  /** Latin-alphabet rendering, if available */
  transliteration?: string
}

/**
 * A loaded Wordlist, entries in file order
 */
export interface Wordlist {
  entries: WordlistEntry[]
}
