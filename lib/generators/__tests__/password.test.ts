import { describe, expect, it } from "vitest"
import { GeneratorError } from "../errors"
import { DEFAULT_PASSWORD_OPTIONS, generatePassword, type PasswordOptions } from "../password"

const onlyNumbers: PasswordOptions = {
  ...DEFAULT_PASSWORD_OPTIONS,
  includeLowercase: false,
  includeUppercase: false,
  includeNumbers: true,
  includeSymbols: false,
}

/** A byte source that always returns the same byte. */
const constantBytes = (value: number) => (buffer: Uint8Array) => {
  buffer.fill(value)
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

    expect(secret).not.toMatch(/[il1Lo0O]/)
  })

  it("reports entropy as length × log2(character set size)", () => {
    // 26 + 26 + 10 + 26 symbols = 88 characters
    expect(generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 16 }).entropy).toBeCloseTo(103.35, 2)
    // 10 digits, 8 characters
    expect(generatePassword({ ...onlyNumbers, length: 8 }).entropy).toBeCloseTo(26.58, 2)
  })

  it("counts the smaller character set when ambiguous characters are excluded", () => {
    // 88 minus i, l, 1, L, o, 0, O = 81 characters
    const { entropy } = generatePassword({
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 16,
      excludeAmbiguous: true,
    })

    expect(entropy).toBeCloseTo(101.44, 2)
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
