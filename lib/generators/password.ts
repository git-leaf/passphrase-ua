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
  /** Exclude ambiguous characters (i, l, L, I, 1, |, o, O, 0) */
  excludeAmbiguous: boolean
}

/**
 * Allowed password lengths (inclusive)
 */
export const PASSWORD_LIMITS = { minLength: 8, maxLength: 64 } as const

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
}

const CHARACTER_CLASSES = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const

// Characters that look alike in many fonts
const AMBIGUOUS = "il1LIo0O|"

function buildCharacterSet(options: PasswordOptions): string {
  let characters = ""
  if (options.includeLowercase) characters += CHARACTER_CLASSES.lowercase
  if (options.includeUppercase) characters += CHARACTER_CLASSES.uppercase
  if (options.includeNumbers) characters += CHARACTER_CLASSES.numbers
  if (options.includeSymbols) characters += CHARACTER_CLASSES.symbols

  if (options.excludeAmbiguous) {
    characters = [...characters].filter((char) => !AMBIGUOUS.includes(char)).join("")
  }

  return characters
}

/**
 * Generates a password
 *
 * @param options - Password options
 * @param bytes - Byte source; defaults to the platform CSPRNG
 * @throws GeneratorError `invalid-length` or `no-character-classes`
 */
export function generatePassword(options: PasswordOptions, bytes: RandomBytes = cryptoRandomBytes): GeneratedSecret {
  const { length } = options
  if (!Number.isInteger(length) || length < PASSWORD_LIMITS.minLength || length > PASSWORD_LIMITS.maxLength) {
    throw new GeneratorError(
      "invalid-length",
      `Password length must be between ${PASSWORD_LIMITS.minLength} and ${PASSWORD_LIMITS.maxLength}`,
    )
  }

  const characters = buildCharacterSet(options)
  if (characters.length === 0) {
    throw new GeneratorError("no-character-classes", "At least one character class must be enabled")
  }

  const secret = randomInts(length, characters.length, bytes)
    .map((index) => characters[index])
    .join("")

  return { secret, entropy: length * Math.log2(characters.length) }
}
