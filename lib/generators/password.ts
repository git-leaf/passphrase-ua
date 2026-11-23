/**
 * Password Generator
 *
 * Generates passwords from a Character set using Secure random.
 * No network access; deterministic when given a fixed byte source.
 */

import { cryptoRandomBytes, randomInts, type RandomBytes } from "@/lib/random/secure-random"
import { GeneratorError } from "./errors"
import type { GeneratedSecret } from "./types"

/**
 * Options for password generation
 */
export interface PasswordOptions {
  /** Number of characters, within PASSWORD_LIMITS */
  length: number
  /** Include lowercase letters (a-z) */
  includeLowercase: boolean
  /** Include uppercase letters (A-Z) */
  includeUppercase: boolean
  /** Include numbers (0-9) */
  includeNumbers: boolean
  /** Include symbols */
  includeSymbols: boolean
  /** The Symbol set the symbols draw from */
  symbolSet: string
  /** Exclude AMBIGUOUS_CHARACTERS */
  excludeAmbiguous: boolean
}

/**
 * Allowed password lengths (inclusive)
 */
export const PASSWORD_LIMITS = { minLength: 8, maxLength: 64 } as const

/** Every symbol a Symbol set may hold: the printable ASCII characters that are neither letters, digits nor space */
export const SYMBOLS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

/** The symbols a Password draws from unless the visitor edits them */
export const DEFAULT_SYMBOL_SET = "!@#$%^&*()_+-=[]{}|;:,.<>?"

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  symbolSet: DEFAULT_SYMBOL_SET,
  excludeAmbiguous: false,
}

const CHARACTER_CLASSES = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
} as const

/**
 * The Symbol set text holds: its SYMBOLS, each once, in the order they first appear.
 * Anything else is dropped, so every character of the Character set is drawn equally often.
 */
export function toSymbolSet(text: string): string {
  return [...new Set(text)].filter((char) => SYMBOLS.includes(char)).join("")
}

/** Characters that look alike in many fonts, grouped by look-alike */
export const AMBIGUOUS_CHARACTERS = "ilLI1|oO0"

/** The Character set the options draw from, empty when no enabled class holds a character */
export function passwordCharacterSet(options: PasswordOptions): string {
  let characters = ""
  if (options.includeLowercase) characters += CHARACTER_CLASSES.lowercase
  if (options.includeUppercase) characters += CHARACTER_CLASSES.uppercase
  if (options.includeNumbers) characters += CHARACTER_CLASSES.numbers
  if (options.includeSymbols) characters += toSymbolSet(options.symbolSet)

  if (options.excludeAmbiguous) {
    characters = [...characters].filter((char) => !AMBIGUOUS_CHARACTERS.includes(char)).join("")
  }

  return characters
}

/** The Character set of valid options; throws for options generatePassword refuses */
function checkedCharacterSet(options: PasswordOptions): string {
  const { length } = options
  if (!Number.isInteger(length) || length < PASSWORD_LIMITS.minLength || length > PASSWORD_LIMITS.maxLength) {
    throw new GeneratorError(
      "invalid-length",
      `Password length must be between ${PASSWORD_LIMITS.minLength} and ${PASSWORD_LIMITS.maxLength}`,
    )
  }

  if (!options.includeLowercase && !options.includeUppercase && !options.includeNumbers && !options.includeSymbols) {
    throw new GeneratorError("no-character-classes", "At least one character class must be enabled")
  }

  const characters = passwordCharacterSet(options)
  if (characters.length === 0) {
    throw new GeneratorError("empty-character-set", "The enabled character classes hold no characters")
  }
  return characters
}

/**
 * The Entropy of any Password these options produce
 *
 * @throws GeneratorError `invalid-length`, `no-character-classes` or `empty-character-set`
 */
export function passwordEntropy(options: PasswordOptions): number {
  return options.length * Math.log2(checkedCharacterSet(options).length)
}

/**
 * Generates a password
 *
 * @param options - Password options
 * @param bytes - Byte source; defaults to the platform CSPRNG
 * @throws GeneratorError `invalid-length`, `no-character-classes` or `empty-character-set`
 */
export function generatePassword(options: PasswordOptions, bytes: RandomBytes = cryptoRandomBytes): GeneratedSecret {
  const characters = checkedCharacterSet(options)

  const secret = randomInts(options.length, characters.length, bytes)
    .map((index) => characters[index])
    .join("")

  return { secret, entropy: passwordEntropy(options) }
}
