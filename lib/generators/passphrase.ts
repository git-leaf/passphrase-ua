/**
 * Passphrase Generator
 *
 * Generates passphrases from a loaded Wordlist using Secure random.
 * No network access; deterministic when given a fixed byte source.
 */

import { cryptoRandomBytes, randomInts, type RandomBytes } from "@/lib/random/secure-random"
import type { Wordlist } from "@/lib/wordlists/types"
import { GeneratorError } from "./errors"
import type { GeneratedSecret } from "./types"

/**
 * A generated Passphrase, with the size of the Word pool it was drawn from
 */
export interface PassphraseSecret extends GeneratedSecret {
  wordPoolSize: number
}

/**
 * Capitalization style for passphrase words
 */
export type CapitalizationStyle =
  | "none" // words as they appear in the Wordlist
  | "first" // First letter of each word
  | "random" // Random letter per word
  | "all" // ALL UPPERCASE
  | "random-word" // One random WORD in UPPERCASE

export const CAPITALIZATION_STYLES = Object.keys({
  none: true,
  first: true,
  random: true,
  all: true,
  "random-word": true,
} satisfies Record<CapitalizationStyle, true>) as CapitalizationStyle[]

/**
 * Options for passphrase generation
 */
export interface PassphraseOptions {
  /** Number of words, within PASSPHRASE_LIMITS */
  wordCount: number
  /** Separator, at most PASSPHRASE_LIMITS.maxSeparatorLength characters */
  separator: string
  capitalization: CapitalizationStyle
  /** Append a random four-digit number */
  includeNumber: boolean
  /** Use each word's Transliteration where the Wordlist has one */
  useTransliteration: boolean
}

/**
 * Allowed word counts (inclusive) and separator length
 */
export const PASSPHRASE_LIMITS = { minWords: 3, maxWords: 12, maxSeparatorLength: 3 } as const

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 6,
  separator: "-",
  capitalization: "none",
  includeNumber: false,
  useTransliteration: false,
}

const NUMBER_RANGE = 10000

function capitalize(word: string, style: CapitalizationStyle, bytes: RandomBytes): string {
  switch (style) {
    case "first":
      return word.charAt(0).toUpperCase() + word.slice(1)
    case "random": {
      const index = randomInts(1, word.length, bytes)[0]
      return word.slice(0, index) + word.charAt(index).toUpperCase() + word.slice(index + 1)
    }
    case "all":
      return word.toUpperCase()
    default:
      return word
  }
}

/**
 * The Word pool: the distinct words a Passphrase with these options draws from
 *
 * Words are compared as they can appear in the Passphrase: as their Transliteration
 * when it's on, and in one case when capitalization changes case. A word is left out
 * when the Separator could be found in it or across its edges, and no Separator
 * needs a Wordlist where no word begins another, so every Passphrase splits back
 * into its words one way only.
 *
 * @throws GeneratorError `separator-required` or `invalid-separator`
 */
function wordPool(wordlist: Wordlist, { separator, capitalization, useTransliteration }: PassphraseOptions): string[] {
  // Every style but "none" can uppercase any letter, so words that differ only in case may come out the same
  const fold = capitalization === "none" ? (text: string) => text : (text: string) => text.toUpperCase()
  const foldedSeparator = fold(separator)

  const pool = new Map<string, string>()
  for (const entry of wordlist.entries) {
    const word = useTransliteration && entry.transliteration ? entry.transliteration : entry.word
    const key = fold(word)
    const between = foldedSeparator + key + foldedSeparator
    if (separator && between.indexOf(foldedSeparator, 1) !== foldedSeparator.length + key.length) continue
    if (!pool.has(key)) pool.set(key, word)
  }

  if (!separator && !isPrefixFree([...pool.keys()])) {
    throw new GeneratorError("separator-required", "This Wordlist has words that begin others, so it needs a Separator")
  }
  if (pool.size === 0) {
    throw new GeneratorError("invalid-separator", "Every word contains the Separator")
  }
  return [...pool.values()]
}

/** Whether no word begins another; sorted, a word that begins others comes right before one of them */
function isPrefixFree(words: string[]): boolean {
  const sorted = [...words].sort()
  return sorted.every((word, index) => index === 0 || !word.startsWith(sorted[index - 1]))
}

/**
 * Generates a passphrase
 *
 * Entropy counts the words of the Word pool, so words that would read the same
 * don't overstate it. Capitalization randomness is not counted.
 *
 * @param wordlist - Loaded Wordlist to draw from
 * @param options - Passphrase options
 * @param bytes - Byte source; defaults to the platform CSPRNG
 * @throws GeneratorError `invalid-word-count`, `invalid-separator` or `separator-required`
 */
export function generatePassphrase(
  wordlist: Wordlist,
  options: PassphraseOptions,
  bytes: RandomBytes = cryptoRandomBytes,
): PassphraseSecret {
  const { wordCount, separator, capitalization, includeNumber } = options

  if (
    !Number.isInteger(wordCount) ||
    wordCount < PASSPHRASE_LIMITS.minWords ||
    wordCount > PASSPHRASE_LIMITS.maxWords
  ) {
    throw new GeneratorError(
      "invalid-word-count",
      `Word count must be between ${PASSPHRASE_LIMITS.minWords} and ${PASSPHRASE_LIMITS.maxWords}`,
    )
  }
  if ([...separator].length > PASSPHRASE_LIMITS.maxSeparatorLength) {
    throw new GeneratorError(
      "invalid-separator",
      `Separator must be at most ${PASSPHRASE_LIMITS.maxSeparatorLength} characters`,
    )
  }

  const pool = wordPool(wordlist, options)
  const picked = randomInts(wordCount, pool.length, bytes).map((index) => pool[index])

  let words: string[]
  if (capitalization === "random-word") {
    const upper = randomInts(1, wordCount, bytes)[0]
    words = picked.map((word, index) => (index === upper ? word.toUpperCase() : word))
  } else {
    words = picked.map((word) => capitalize(word, capitalization, bytes))
  }

  let secret = words.join(separator)
  let entropy = wordCount * Math.log2(pool.length)

  if (includeNumber) {
    const number = randomInts(1, NUMBER_RANGE, bytes)[0]
    secret += separator + String(number).padStart(4, "0")
    entropy += Math.log2(NUMBER_RANGE)
  }

  return { secret, entropy, wordPoolSize: pool.length }
}
