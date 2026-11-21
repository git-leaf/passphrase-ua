/**
 * Strength analysis
 *
 * Turns a Secret's entropy and an Attacker model into everything the UI
 * shows about its strength, formatted for the user's locale.
 */

import { translations, type Locale } from '@/lib/i18n/translations';

export type StrengthLevel = 'weak' | 'moderate' | 'strong' | 'very-strong' | 'excessive';

/**
 * Upper bound (inclusive, in bits) of each Strength level, weakest first
 */
export const STRENGTH_BANDS: readonly { level: StrengthLevel; maxBits: number }[] = [
  { level: 'weak', maxBits: 40 },
  { level: 'moderate', maxBits: 60 },
  { level: 'strong', maxBits: 80 },
  { level: 'very-strong', maxBits: 128 },
  { level: 'excessive', maxBits: Infinity },
];

export interface AttackerModel {
  /** Candidate Secrets tested per second */
  guessesPerSecond: number;
  /** US dollars per block of 2^32 guesses */
  costPer2pow32: number;
}

export const ATTACKER_PRESETS = {
  guessesPerSecond: [1e6, 1e9, 1e12, 1e15],
  costPer2pow32: [0.001, 0.01, 0.1, 1],
} as const;

export const DEFAULT_ATTACKER: AttackerModel = { guessesPerSecond: 1e12, costPer2pow32: 0.01 };

export interface StrengthAnalysis {
  level: StrengthLevel;
  /** How full the strength bar is, 0-100 */
  percentage: number;
  /** Formatted entropy, e.g. "77.55 bits" */
  entropy: string;
  /** Formatted Combinations */
  combinations: string;
  /** Formatted average Time to crack */
  timeToCrack: string;
  /** Formatted average Cost to crack */
  costToCrack: string;
}

// Counts at or above this are shown in scientific notation
const EXACT_LIMIT = 1e15;

/**
 * Analyzes a Secret's strength
 *
 * Time and cost are averages: the attacker finds the Secret after trying
 * half the Combinations. Non-finite or non-positive guess rates, and
 * non-finite or negative costs, give the locale's "invalid" text.
 *
 * @param entropy - Entropy in bits
 * @param attacker - Attacker model
 * @param locale - Locale for numbers and unit words
 */
export function analyzeStrength(
  entropy: number,
  attacker: AttackerModel,
  locale: Locale
): StrengthAnalysis {
  const output = translations[locale].output;
  const halfCombinations = Math.pow(2, entropy - 1);

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
        ? formatCost((halfCombinations / 2 ** 32) * attacker.costPer2pow32, locale)
        : output.costUnits.invalid,
  };
}

function levelOf(entropy: number): StrengthLevel {
  return STRENGTH_BANDS.find((band) => entropy <= band.maxBits)!.level;
}

function percentageOf(entropy: number): number {
  if (entropy <= 40) return Math.max(0, (entropy / 40) * 25);
  if (entropy <= 60) return 25 + ((entropy - 40) / 20) * 50;
  if (entropy <= 80) return 75 + ((entropy - 60) / 20) * 25;
  return 100;
}

/** A number with exactly two decimals, grouped for the locale. */
function fixed(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Splits a positive number into a two-decimal mantissa and a power of ten. */
function scientific(value: number, locale: Locale): { mantissa: string; exp: number } {
  let exp = Math.floor(Math.log10(value));
  let mantissa = value / 10 ** exp;
  // Rounding 9.996 to two decimals would print "10.00"
  if (mantissa >= 9.995) {
    mantissa /= 10;
    exp += 1;
  }
  return { mantissa: fixed(mantissa, locale), exp };
}

function formatCombinations(entropy: number, locale: Locale): string {
  const combinations = Math.pow(2, entropy);
  if (combinations < EXACT_LIMIT) {
    return new Intl.NumberFormat(locale).format(Math.round(combinations));
  }
  const { mantissa, exp } = scientific(combinations, locale);
  return `~${mantissa} × 10^${exp}`;
}

const TIME_STEPS = [
  { unit: 'seconds', seconds: 1 },
  { unit: 'minutes', seconds: 60 },
  { unit: 'hours', seconds: 3600 },
  { unit: 'days', seconds: 86400 },
] as const;

const SECONDS_PER_YEAR = 365.25 * 86400;

const YEAR_STEPS = [
  { unit: 'years', years: 1 },
  { unit: 'thousandYears', years: 1e3 },
  { unit: 'millionYears', years: 1e6 },
  { unit: 'billionYears', years: 1e9 },
  { unit: 'trillionYears', years: 1e12 },
] as const;

function formatTime(seconds: number, locale: Locale): string {
  const units = translations[locale].output.timeUnits;

  if (seconds < 1) {
    return `${fixed(seconds * 1000, locale)} ${units.milliseconds}`;
  }

  const years = seconds / SECONDS_PER_YEAR;
  if (years < 1) {
    const step = [...TIME_STEPS].reverse().find((s) => seconds >= s.seconds)!;
    return `${fixed(seconds / step.seconds, locale)} ${units[step.unit]}`;
  }

  if (years < 1e15) {
    const step = [...YEAR_STEPS].reverse().find((s) => years >= s.years)!;
    return `${fixed(years / step.years, locale)} ${units[step.unit]}`;
  }

  const { mantissa, exp } = scientific(years, locale);
  return units.scientificYears.replace('{mantissa}', mantissa).replace('{exp}', String(exp));
}

const COST_STEPS = [
  { suffix: 'suffixThousands', usd: 1e3 },
  { suffix: 'suffixMillions', usd: 1e6 },
  { suffix: 'suffixBillions', usd: 1e9 },
  { suffix: 'suffixTrillions', usd: 1e12 },
] as const;

function formatCost(usd: number, locale: Locale): string {
  const units = translations[locale].output.costUnits;

  if (usd < 1e3) {
    return `$${fixed(usd, locale)}`;
  }

  if (usd < 1e15) {
    const step = [...COST_STEPS].reverse().find((s) => usd >= s.usd)!;
    return `$${fixed(usd / step.usd, locale)}${units[step.suffix]}`;
  }

  const { mantissa, exp } = scientific(usd, locale);
  return units.scientific.replace('{mantissa}', `$${mantissa}`).replace('{exp}', String(exp));
}
