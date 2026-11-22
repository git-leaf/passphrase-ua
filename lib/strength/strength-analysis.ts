/**
 * Strength analysis
 *
 * Turns a Secret's entropy and an Attacker model into everything the UI
 * shows about its strength, formatted for the user's locale.
 */

import { translations, type Locale } from "@/lib/i18n/translations"

export type StrengthLevel = "weak" | "moderate" | "strong" | "very-strong" | "excessive"

/**
 * Upper bound (inclusive, in bits) of each Strength level, weakest first
 */
export const STRENGTH_BANDS: readonly { level: StrengthLevel; maxBits: number }[] = [
  { level: "weak", maxBits: 40 },
  { level: "moderate", maxBits: 60 },
  { level: "strong", maxBits: 80 },
  { level: "very-strong", maxBits: 128 },
  { level: "excessive", maxBits: Infinity },
]

export interface AttackerModel {
  /** Candidate Secrets tested per second */
  guessesPerSecond: number
  /** US dollars per block of 2^32 guesses */
  costPer2pow32: number
}

export const ATTACKER_PRESETS = {
  guessesPerSecond: [1e6, 1e9, 1e12, 1e15],
  costPer2pow32: [0.001, 0.01, 0.1, 1],
} as const

export const DEFAULT_ATTACKER: AttackerModel = { guessesPerSecond: 1e12, costPer2pow32: 0.01 }

export interface StrengthAnalysis {
  level: StrengthLevel
  /** How full the strength bar is, 0-100 */
  percentage: number
  /** Formatted entropy, e.g. "77.55 bits" */
  entropy: string
  /** Formatted Combinations */
  combinations: string
  /** Formatted average Time to crack */
  timeToCrack: string
  /** Formatted average Cost to crack */
  costToCrack: string
}

// Counts at or above this are shown in scientific notation
const EXACT_LIMIT = 1e15

/**
 * Analyzes a Secret's strength
 *
 * Time and cost are averages: the attacker finds the Secret after trying
 * half the Combinations. Non-finite or non-positive guess rates, and
 * non-finite or negative costs, give the locale's "invalid" text. A time or
 * cost too large for a number reads as more than the largest power of ten
 * it can hold, and a time under a millisecond as less than a millisecond.
 *
 * @param entropy - Entropy in bits
 * @param attacker - Attacker model
 * @param locale - Locale for numbers and unit words
 */
export function analyzeStrength(entropy: number, attacker: AttackerModel, locale: Locale): StrengthAnalysis {
  const output = translations[locale].output
  const halfCombinations = Math.pow(2, entropy - 1)

  return {
    level: levelOf(entropy),
    percentage: percentageOf(entropy),
    entropy: `${fixed(entropy, locale)} ${output.bits}`,
    combinations: formatCombinations(entropy, locale),
    timeToCrack:
      Number.isFinite(attacker.guessesPerSecond) && attacker.guessesPerSecond > 0
        ? formatTime(halfCombinations / attacker.guessesPerSecond, locale)
        : output.timeUnits.invalid,
    costToCrack:
      Number.isFinite(attacker.costPer2pow32) && attacker.costPer2pow32 >= 0
        ? formatCost(costOf(halfCombinations, attacker.costPer2pow32), locale)
        : output.costUnits.invalid,
  }
}

/** Dollars to try the guesses; free guesses cost exactly $0, never -0 or 0 × Infinity. */
function costOf(guesses: number, costPer2pow32: number): number {
  return costPer2pow32 === 0 ? 0 : (guesses / 2 ** 32) * costPer2pow32
}

function levelOf(entropy: number): StrengthLevel {
  return STRENGTH_BANDS.find((band) => entropy <= band.maxBits)!.level
}

function percentageOf(entropy: number): number {
  if (entropy <= 40) return Math.max(0, (entropy / 40) * 25)
  if (entropy <= 60) return 25 + ((entropy - 40) / 20) * 50
  if (entropy <= 80) return 75 + ((entropy - 60) / 20) * 25
  return 100
}

/** A number with exactly two decimals, grouped for the locale. */
function fixed(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Splits a positive number into a two-decimal mantissa and a power of ten. */
function scientific(value: number, locale: Locale): { mantissa: string; exp: number } {
  let exp = Math.floor(Math.log10(value))
  let mantissa = value / 10 ** exp
  // Rounding 9.996 to two decimals would print "10.00"
  if (mantissa >= 9.995) {
    mantissa /= 10
    exp += 1
  }
  return { mantissa: fixed(mantissa, locale), exp }
}

function formatCombinations(entropy: number, locale: Locale): string {
  const combinations = Math.pow(2, entropy)
  if (combinations < EXACT_LIMIT) {
    return new Intl.NumberFormat(locale).format(Math.round(combinations))
  }
  const { mantissa, exp } = scientific(combinations, locale)
  return `~${mantissa} × 10^${exp}`
}

const SECONDS_PER_YEAR = 365.25 * 86400

// A time or cost past the largest number reads as more than these powers of ten
const MAX_YEARS_EXP = Math.floor(Math.log10(Number.MAX_VALUE / SECONDS_PER_YEAR))
const MAX_USD_EXP = Math.floor(Math.log10(Number.MAX_VALUE))

/** Units of time, smallest first; the last starts scientific notation. */
const TIME_STEPS = [
  { unit: "milliseconds", size: 1e-3 },
  { unit: "seconds", size: 1 },
  { unit: "minutes", size: 60 },
  { unit: "hours", size: 3600 },
  { unit: "days", size: 86400 },
  { unit: "years", size: SECONDS_PER_YEAR },
  { unit: "thousandYears", size: 1e3 * SECONDS_PER_YEAR },
  { unit: "millionYears", size: 1e6 * SECONDS_PER_YEAR },
  { unit: "billionYears", size: 1e9 * SECONDS_PER_YEAR },
  { unit: "trillionYears", size: 1e12 * SECONDS_PER_YEAR },
  { unit: "scientificYears", size: 1e15 * SECONDS_PER_YEAR },
] as const

/**
 * The largest step a value reaches, or the step above it when the value,
 * rounded to two decimals, already reaches that one: 59.996 seconds reads
 * "1.00 minutes", not "60.00 seconds". Values below the first step use it.
 */
function stepFor<Step extends { size: number }>(value: number, steps: readonly Step[]): Step {
  const index = Math.max(
    0,
    steps.findLastIndex((step) => value >= step.size),
  )
  const step = steps[index]
  const next = steps[index + 1]
  const rounded = Math.round((value / step.size) * 100) / 100
  return next && rounded * step.size >= next.size ? next : step
}

function formatTime(seconds: number, locale: Locale): string {
  const units = translations[locale].output.timeUnits

  if (!Number.isFinite(seconds)) {
    return units.moreThan.replace("{exp}", String(MAX_YEARS_EXP))
  }

  if (seconds < 1e-3) {
    return units.lessThanMillisecond
  }

  const step = stepFor(seconds, TIME_STEPS)
  if (step.unit === "scientificYears") {
    const { mantissa, exp } = scientific(seconds / SECONDS_PER_YEAR, locale)
    return units.scientificYears.replace("{mantissa}", mantissa).replace("{exp}", String(exp))
  }
  return `${fixed(seconds / step.size, locale)} ${units[step.unit]}`
}

/** Units of US dollars, smallest first; the last starts scientific notation. */
const COST_STEPS = [
  { suffix: null, size: 1 },
  { suffix: "suffixThousands", size: 1e3 },
  { suffix: "suffixMillions", size: 1e6 },
  { suffix: "suffixBillions", size: 1e9 },
  { suffix: "suffixTrillions", size: 1e12 },
  { suffix: "scientific", size: 1e15 },
] as const

function formatCost(usd: number, locale: Locale): string {
  const units = translations[locale].output.costUnits

  if (!Number.isFinite(usd)) {
    return units.moreThan.replace("{amount}", `$10^${MAX_USD_EXP}`)
  }

  const step = stepFor(usd, COST_STEPS)
  if (step.suffix === "scientific") {
    const { mantissa, exp } = scientific(usd, locale)
    return units.scientific.replace("{mantissa}", `$${mantissa}`).replace("{exp}", String(exp))
  }
  return `$${fixed(usd / step.size, locale)}${step.suffix ? units[step.suffix] : ""}`
}
