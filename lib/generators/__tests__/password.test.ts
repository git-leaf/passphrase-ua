import { describe, expect, it } from "vitest"
import { GeneratorError } from "../errors"
import { DEFAULT_PASSWORD_OPTIONS, generatePassword, passwordEntropy, type PasswordOptions } from "../password"

const onlyNumbers: PasswordOptions = {
  ...DEFAULT_PASSWORD_OPTIONS,
  includeLowercase: false,
  includeUppercase: false,
  includeNumbers: true,
  includeSymbols: false,
}

const onlySymbols: PasswordOptions = { ...onlyNumbers, includeNumbers: false, includeSymbols: true }

/** A byte source that always returns the same byte. */
const constantBytes = (value: number) => (buffer: Uint8Array) => {
  buffer.fill(value)
}

/** A byte source that returns 0, 1, 2, … one byte per call. */
const countingBytes = () => {
  let next = 0
  return (buffer: Uint8Array) => {
    buffer.fill(next++)
  }
}

describe("generatePassword", () => {
  it("produces a secret of the requested length", () => {
    const { secret } = generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 20 })

    expect(secret).toHaveLength(20)
  })

  it("draws only from the enabled character classes", () => {
    const { secret } = generatePassword({ ...onlyNumbers, length: 64 })

    expect(secret).toMatch(/^[0-9]{64}$/)
  })

  it("picks characters by index into the character set", () => {
    // Byte 3 → index 3 of "0123456789"
    const { secret } = generatePassword({ ...onlyNumbers, length: 8 }, constantBytes(3))

    expect(secret).toBe("33333333")
  })

  it("never uses ambiguous characters when they are excluded", () => {
    const { secret } = generatePassword({
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 64,
      excludeAmbiguous: true,
    })

    expect(secret).not.toMatch(/[il1LIo0O|]/)
  })

  it.each([
    ["lowercase", { includeLowercase: true }, "abcdefghjkmnpqrstuvwxyz"],
    ["uppercase", { includeUppercase: true }, "ABCDEFGHJKMNPQRSTUVWXYZ"],
    ["numbers", { includeNumbers: true }, "23456789"],
    ["symbols", { includeSymbols: true }, "!@#$%^&*()_+-=[]{};:,.<>?"],
  ])("drops the ambiguous characters from the %s when they are excluded", (_, classes, expected) => {
    const options: PasswordOptions = {
      ...DEFAULT_PASSWORD_OPTIONS,
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: true,
      ...classes,
    }

    // Bytes 0, 1, 2, … pick the Character set in order
    const { secret } = generatePassword({ ...options, length: expected.length }, countingBytes())

    expect(secret).toBe(expected)
  })

  it("reports entropy as length × log2(character set size)", () => {
    // 26 + 26 + 10 + 26 symbols = 88 characters
    expect(generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 16 }).entropy).toBeCloseTo(103.35, 2)
    // 10 digits, 8 characters
    expect(generatePassword({ ...onlyNumbers, length: 8 }).entropy).toBeCloseTo(26.58, 2)
  })

  it("counts the smaller character set when ambiguous characters are excluded", () => {
    // 88 minus i, l, 1, L, I, o, 0, O, | = 79 characters
    const { entropy } = generatePassword({
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 16,
      excludeAmbiguous: true,
    })

    expect(entropy).toBeCloseTo(100.86, 2)
  })

  it("draws symbols only from an edited Symbol set", () => {
    const options: PasswordOptions = { ...onlySymbols, symbolSet: "#-_" }

    // Bytes 0, 1, 2, … pick the Character set in order
    expect(generatePassword({ ...options, length: 9 }, countingBytes()).secret).toBe("#-_#-_#-_")
    expect(passwordEntropy({ ...options, length: 8 })).toBeCloseTo(12.68, 2)
  })

  it("counts each symbol once and ignores anything in the Symbol set that isn't an ASCII symbol", () => {
    // Only "#" and "-" are ASCII symbols, each counted once
    const options: PasswordOptions = { ...onlySymbols, symbolSet: "#a-#1 -é😀\u200b€", length: 8 }

    expect(generatePassword(options, countingBytes()).secret).toBe("#-#-#-#-")
    expect(passwordEntropy(options)).toBe(8)
  })

  it("draws from the other character classes when the Symbol set is empty", () => {
    const options: PasswordOptions = { ...onlyNumbers, includeSymbols: true, symbolSet: "", length: 64 }

    expect(generatePassword(options).secret).toMatch(/^[0-9]{64}$/)
    // 10 digits, 8 characters
    expect(passwordEntropy({ ...options, length: 8 })).toBeCloseTo(26.58, 2)
  })

  it.each([
    ["is empty", { symbolSet: "" }],
    ["holds only ambiguous characters that are excluded", { symbolSet: "|", excludeAmbiguous: true }],
  ])("rejects a Symbol set that %s, with no other class, with empty-character-set", (_, symbols) => {
    expect(() => generatePassword({ ...onlySymbols, ...symbols })).toThrow(
      expect.objectContaining({ code: "empty-character-set" }),
    )
  })

  it.each([7, 65, 12.5])("rejects length %s with invalid-length", (length) => {
    expect(() => generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length })).toThrow(
      expect.objectContaining({ code: "invalid-length" }),
    )
  })

  it("rejects options with no character class with no-character-classes", () => {
    const run = () => generatePassword({ ...onlyNumbers, includeNumbers: false })

    expect(run).toThrow(GeneratorError)
    expect(run).toThrow(expect.objectContaining({ code: "no-character-classes" }))
  })
})
