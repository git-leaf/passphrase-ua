/**
 * Passphrase Generator
 *
 * Generates passphrases from a loaded Wordlist using Secure random.
 * No network access; deterministic when given a fixed byte source.
 */

import { cryptoRandomBytes, randomInts, type RandomBytes } from '@/lib/random/secure-random';
import type { Wordlist } from '@/lib/wordlists/types';
import { GeneratorError } from './errors';
import type { GeneratedSecret } from './types';

/**
 * Capitalization style for passphrase words
 */
export type CapitalizationStyle =
  | 'none'           // words as they appear in the Wordlist
  | 'first'          // First letter of each word
  | 'random'         // Random letter per word
  | 'all'            // ALL UPPERCASE
  | 'random-word';   // One random WORD in UPPERCASE

/**
 * Options for passphrase generation
 */
export interface PassphraseOptions {
  /** Number of words, within PASSPHRASE_LIMITS */
  wordCount: number;
  /** Separator, at most PASSPHRASE_LIMITS.maxSeparatorLength characters */
  separator: string;
  capitalization: CapitalizationStyle;
  /** Append a random four-digit number */
  includeNumber: boolean;
  /** Use each word's Transliteration where the Wordlist has one */
  useTransliteration: boolean;
}

/**
 * Allowed word counts (inclusive) and separator length
 */
export const PASSPHRASE_LIMITS = { minWords: 3, maxWords: 12, maxSeparatorLength: 3 } as const;

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 6,
  separator: '-',
  capitalization: 'none',
  includeNumber: false,
  useTransliteration: false,
};

const NUMBER_RANGE = 10000;

function capitalize(word: string, style: CapitalizationStyle, bytes: RandomBytes): string {
  switch (style) {
    case 'first':
      return word.charAt(0).toUpperCase() + word.slice(1);
    case 'random': {
      const index = randomInts(1, word.length, bytes)[0];
      return word.slice(0, index) + word.charAt(index).toUpperCase() + word.slice(index + 1);
    }
    case 'all':
      return word.toUpperCase();
    default:
      return word;
  }
}

/**
 * Generates a passphrase
 *
 * Entropy counts only distinct words, so Transliterations that collide
 * don't overstate it. Capitalization randomness is not counted.
 *
 * @param wordlist - Loaded Wordlist to draw from
 * @param options - Passphrase options
 * @param bytes - Byte source; defaults to the platform CSPRNG
 * @throws GeneratorError `invalid-word-count` or `invalid-separator`
 */
export function generatePassphrase(
  wordlist: Wordlist,
  options: PassphraseOptions,
  bytes: RandomBytes = cryptoRandomBytes
): GeneratedSecret {
  const { wordCount, separator, capitalization, includeNumber, useTransliteration } = options;

  if (
    !Number.isInteger(wordCount) ||
    wordCount < PASSPHRASE_LIMITS.minWords ||
    wordCount > PASSPHRASE_LIMITS.maxWords
  ) {
    throw new GeneratorError(
      'invalid-word-count',
      `Word count must be between ${PASSPHRASE_LIMITS.minWords} and ${PASSPHRASE_LIMITS.maxWords}`
    );
  }
  if ([...separator].length > PASSPHRASE_LIMITS.maxSeparatorLength) {
    throw new GeneratorError(
      'invalid-separator',
      `Separator must be at most ${PASSPHRASE_LIMITS.maxSeparatorLength} characters`
    );
  }

  const tokens = wordlist.entries.map((entry) =>
    useTransliteration && entry.transliteration ? entry.transliteration : entry.word
  );

  const picked = randomInts(wordCount, tokens.length, bytes).map((index) => tokens[index]);

  let words: string[];
  if (capitalization === 'random-word') {
    const upper = randomInts(1, wordCount, bytes)[0];
    words = picked.map((word, index) => (index === upper ? word.toUpperCase() : word));
  } else {
    words = picked.map((word) => capitalize(word, capitalization, bytes));
  }

  let secret = words.join(separator);
  let entropy = wordCount * Math.log2(new Set(tokens).size);

  if (includeNumber) {
    const number = randomInts(1, NUMBER_RANGE, bytes)[0];
    secret += separator + String(number).padStart(4, '0');
    entropy += Math.log2(NUMBER_RANGE);
  }

  return { secret, entropy };
}
