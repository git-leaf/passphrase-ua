import { describe, expect, it } from "vitest"
import { analyzeStrength, DEFAULT_ATTACKER, type AttackerModel } from "../strength-analysis"

// Six words from a 7,776-word Diceware list: 7776^6 ≈ 2.2107 × 10^23 combinations
const SIX_DICEWARE_WORDS = 6 * Math.log2(7776)
// Eight digits: exactly 10^8 combinations
const EIGHT_DIGITS = 8 * Math.log2(10)

const trillionPerSecond: AttackerModel = { guessesPerSecond: 1e12, costPer2pow32: 0.01 }

// A Julian year, the year the app counts in
const SECONDS_PER_YEAR = 365.25 * 86_400

describe("analyzeStrength", () => {
  describe("strength level", () => {
    it.each([
      [0, "weak"],
      [40, "weak"],
      [40.01, "moderate"],
      [60, "moderate"],
      [60.01, "strong"],
      [80, "strong"],
      [80.01, "very-strong"],
      [128, "very-strong"],
      [128.01, "excessive"],
    ])("%s bits is %s", (entropy, level) => {
      expect(analyzeStrength(entropy, DEFAULT_ATTACKER, "en").level).toBe(level)
    })

    it("fills the bar proportionally up to Strong and fully from Very Strong", () => {
      expect(analyzeStrength(20, DEFAULT_ATTACKER, "en").percentage).toBeCloseTo(12.5)
      expect(analyzeStrength(50, DEFAULT_ATTACKER, "en").percentage).toBeCloseTo(50)
      expect(analyzeStrength(70, DEFAULT_ATTACKER, "en").percentage).toBeCloseTo(87.5)
      expect(analyzeStrength(100, DEFAULT_ATTACKER, "en").percentage).toBe(100)
    })
  })

  describe("combinations", () => {
    it("shows exact counts with locale grouping", () => {
      expect(analyzeStrength(EIGHT_DIGITS, DEFAULT_ATTACKER, "en").combinations).toBe("100,000,000")
      expect(analyzeStrength(EIGHT_DIGITS, DEFAULT_ATTACKER, "uk").combinations).toBe("100 000 000")
    })

    it("uses scientific notation for large counts without rounding entropy down", () => {
      expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, "en").combinations).toBe("~2.21 × 10^23")
      expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, "uk").combinations).toBe("~2,21 × 10^23")
    })
  })

  describe("time to crack (average: half the combinations)", () => {
    it("formats short times in milliseconds", () => {
      // 2^39 / 10^12 s ≈ 549.76 ms
      expect(analyzeStrength(40, trillionPerSecond, "en").timeToCrack).toBe("549.76 milliseconds")
    })

    it("reads sub-millisecond times as less than a millisecond", () => {
      // 2^19 / 10^12 s ≈ 0.0005 ms
      expect(analyzeStrength(20, trillionPerSecond, "en").timeToCrack).toBe("less than a millisecond")
      expect(analyzeStrength(20, trillionPerSecond, "uk").timeToCrack).toBe("менше мілісекунди")
    })

    it("formats long times in localized large units", () => {
      // 7776^6 / 2 / 10^12 s ≈ 3,502.7 years
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, "en").timeToCrack).toBe("3.50 thousand years")
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, "uk").timeToCrack).toBe("3,50 тис. років")
    })

    // 1 bit: half the Combinations is exactly one guess, so the time is 1 / Guess rate
    it.each([
      [0.999_996, "1.00 seconds"],
      [59.8, "59.80 seconds"],
      [59.996, "1.00 minutes"],
      [3_599.9, "1.00 hours"],
      [86_399.9, "1.00 days"],
      [365.249 * 86_400, "1.00 years"],
      [999.996 * SECONDS_PER_YEAR, "1.00 thousand years"],
      [999.996e12 * SECONDS_PER_YEAR, "1.00 × 10^15 years"],
    ])("rolls %s seconds over to the next unit once rounded: %s", (seconds, expected) => {
      const attacker = { ...trillionPerSecond, guessesPerSecond: 1 / seconds }
      expect(analyzeStrength(1, attacker, "en").timeToCrack).toBe(expected)
    })

    it("reads a time too long for a number as more than the largest it can count", () => {
      // 2^399 / 10^-300 s ≈ 10^420 s, past the largest number, about 5.7 × 10^300 years
      const attacker = { ...trillionPerSecond, guessesPerSecond: 1e-300 }
      expect(analyzeStrength(400, attacker, "en").timeToCrack).toBe("more than 10^300 years")
      expect(analyzeStrength(400, attacker, "uk").timeToCrack).toBe("понад 10^300 років")
    })

    it.each([0, -5, Number.NaN])("is invalid for a guess rate of %s", (guessesPerSecond) => {
      const attacker = { ...trillionPerSecond, guessesPerSecond }
      expect(analyzeStrength(60, attacker, "en").timeToCrack).toBe("Invalid")
      expect(analyzeStrength(60, attacker, "uk").timeToCrack).toBe("Некоректно")
    })
  })

  describe("cost to crack (average: half the combinations)", () => {
    it("prices blocks of 2^32 guesses in localized units", () => {
      // 7776^6 / 2 / 2^32 × $0.01 ≈ $257.36 billion
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, "en").costToCrack).toBe("$257.36B")
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, "uk").costToCrack).toBe("$257,36 млрд.")
    })

    // 33 bits: half the Combinations is exactly 2^32 guesses, so the cost is the Cost per 2^32 guesses
    it.each([
      [995, "$995.00"],
      [999.996, "$1.00K"],
      [999_996, "$1.00M"],
      [999.996e6, "$1.00B"],
      [999.996e9, "$1.00T"],
      [999.996e12, "$1.00 × 10^15"],
    ])("rolls $%s over to the next unit once rounded: %s", (costPer2pow32, expected) => {
      const attacker = { ...trillionPerSecond, costPer2pow32 }
      expect(analyzeStrength(33, attacker, "en").costToCrack).toBe(expected)
    })

    it("reads a cost too large for a number as more than the largest it can count", () => {
      // 2^399 / 2^32 × $10^300 ≈ $10^410, past the largest number, about 1.8 × 10^308
      const attacker = { ...trillionPerSecond, costPer2pow32: 1e300 }
      expect(analyzeStrength(400, attacker, "en").costToCrack).toBe("more than $10^308")
      expect(analyzeStrength(400, attacker, "uk").costToCrack).toBe("понад $10^308")
    })

    it.each([-1, Number.NaN])("is invalid for a cost of %s", (costPer2pow32) => {
      const attacker = { ...trillionPerSecond, costPer2pow32 }
      expect(analyzeStrength(60, attacker, "en").costToCrack).toBe("Invalid")
    })
  })

  it("formats entropy with two decimals in the locale", () => {
    expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, "en").entropy).toBe("77.55 bits")
    expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, "uk").entropy).toBe("77,55 бітів")
  })
})
