/**
 * Entropy and Strength Calculation Utilities
 * 
 * Provides utilities for calculating password strength,
 * time-to-crack estimates, and cost estimates.
 */

/**
 * Strength level based on entropy
 */
export type StrengthLevel = 'weak' | 'moderate' | 'strong' | 'very-strong' | 'excessive';

/**
 * Strength assessment result
 */
export interface StrengthAssessment {
  /** Strength level */
  level: StrengthLevel;
  /** Human-readable label */
  label: string;
  /** Color for UI display (Tailwind class) */
  color: string;
  /** Percentage (0-100) for progress bar */
  percentage: number;
}

/**
 * Time to crack estimate
 */
export interface TimeToCrackEstimate {
  /** Time in seconds (average case) */
  seconds: number;
  /** Human-readable format */
  formatted: string;
}

/**
 * Cost to crack estimate
 */
export interface CostToCrackEstimate {
  /** Cost in USD (average case) */
  usd: number;
  /** Human-readable format */
  formatted: string;
}

/** Labels for {@link formatTime} / {@link calculateTimeToCrack} (i18n) */
export interface TimeFormatLabels {
  invalid: string;
  milliseconds: string;
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  years: string;
  thousandYears: string;
  millionYears: string;
  billionYears: string;
  trillionYears: string;
  scientificYears: string;
}

/** Labels for {@link formatCost} / {@link calculateCostToCrack} (i18n) */
export interface CostFormatLabels {
  invalid: string;
  suffixThousands: string;
  suffixMillions: string;
  suffixBillions: string;
  suffixTrillions: string;
  scientific: string;
}

const DEFAULT_TIME_FORMAT_LABELS: TimeFormatLabels = {
  invalid: 'Invalid',
  milliseconds: 'milliseconds',
  seconds: 'seconds',
  minutes: 'minutes',
  hours: 'hours',
  days: 'days',
  years: 'years',
  thousandYears: 'thousand years',
  millionYears: 'million years',
  billionYears: 'billion years',
  trillionYears: 'trillion years',
  scientificYears: '{mantissa} × 10^{exp} years',
};

const DEFAULT_COST_FORMAT_LABELS: CostFormatLabels = {
  invalid: 'Invalid',
  suffixThousands: 'K',
  suffixMillions: 'M',
  suffixBillions: 'B',
  suffixTrillions: 'T',
  scientific: '{mantissa} × 10^{exp}',
};

/**
 * Assesses password strength based on entropy
 * 
 * Entropy levels based on NIST and industry standards:
 * - <= 40 bits: Weak - Vulnerable to attacks
 * - 40-60 bits: Moderate - Minimum for basic security
 * - 60-80 bits: Strong - Secure for most uses
 * - 80-120 bits: Very Strong - Highly secure
 * - 120+ bits: Excessive - Highly secure, but not practical for most uses
 * 
 * @param entropy - Entropy in bits
 * @returns Strength assessment
 */
export function assessStrength(entropy: number): StrengthAssessment {
  if (entropy <= 40) {
    return {
      level: 'weak',
      label: 'Weak',
      color: 'bg-destructive',
      percentage: Math.min((entropy / 40) * 25, 25),
    };
  }

  if (entropy <= 60) {
    return {
      level: 'moderate',
      label: 'Moderate',
      color: 'bg-amber-500',
      percentage: 25 + ((entropy - 40) / 20) * 50,
    };
  }

  if (entropy <= 80) {
    return {
      level: 'strong',
      label: 'Strong',
      color: 'bg-emerald-500',
      percentage: 75 + ((entropy - 60) / 20) * 25,
    };
  }

  if (entropy <= 128) {
    return {
      level: 'very-strong',
      label: 'Very Strong',
      color: 'bg-emerald-600',
      percentage: 100,
    };
  }

  return {
    level: 'excessive',
    label: 'Excessive',
    color: 'bg-blue-500',
    percentage: 100,
  };
}

/**
 * Formats time in human-readable format
 *
 * @param seconds - Time in seconds
 * @param labels - Unit strings (defaults to English)
 * @returns Human-readable time string
 */
export function formatTime(
  seconds: number,
  labels: TimeFormatLabels = DEFAULT_TIME_FORMAT_LABELS
): string {
  if (seconds < 0) {
    return labels.invalid;
  }

  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(2)} ${labels.milliseconds}`;
  }

  if (seconds < 60) {
    return `${seconds.toFixed(2)} ${labels.seconds}`;
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(2)} ${labels.minutes}`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(2)} ${labels.hours}`;
  }

  const days = hours / 24;
  if (days < 365.25) {
    return `${days.toFixed(2)} ${labels.days}`;
  }

  const years = days / 365.25;
  if (years < 1000) {
    return `${years.toFixed(2)} ${labels.years}`;
  }

  if (years < 1000000) {
    return `${(years / 1000).toFixed(2)} ${labels.thousandYears}`;
  }

  if (years < 1000000000) {
    return `${(years / 1000000).toFixed(2)} ${labels.millionYears}`;
  }

  if (years < 1000000000000) {
    return `${(years / 1000000000).toFixed(2)} ${labels.billionYears}`;
  }

  if (years < 1e15) {
    return `${(years / 1000000000000).toFixed(2)} ${labels.trillionYears}`;
  }

  const exp = Math.floor(Math.log10(years));
  const mantissa = years / Math.pow(10, exp);
  return labels.scientificYears
    .replace('{mantissa}', mantissa.toFixed(2))
    .replace('{exp}', String(exp));
}

/**
 * Calculates time to crack password (average case)
 * 
 * Average case assumes attacker tries half of all possible combinations.
 * Formula: time = (2^entropy / 2) / guessesPerSecond
 * 
 * @param entropy - Entropy in bits
 * @param guessesPerSecond - Number of guesses per second
 * @returns Time to crack estimate
 */
export function calculateTimeToCrack(
  entropy: number,
  guessesPerSecond: number,
  labels: TimeFormatLabels = DEFAULT_TIME_FORMAT_LABELS
): TimeToCrackEstimate {
  if (entropy <= 0 || guessesPerSecond <= 0) {
    return {
      seconds: 0,
      formatted: labels.invalid,
    };
  }

  // Calculate average case: half of all possible combinations
  // 2^entropy / 2 = 2^(entropy - 1)
  const avgCombinations = Math.pow(2, entropy - 1);
  const seconds = avgCombinations / guessesPerSecond;

  return {
    seconds,
    formatted: formatTime(seconds, labels),
  };
}

/**
 * Formats cost in human-readable format
 *
 * @param usd - Cost in USD
 * @param labels - Suffix strings (defaults to English)
 * @returns Human-readable cost string
 */
export function formatCost(
  usd: number,
  labels: CostFormatLabels = DEFAULT_COST_FORMAT_LABELS
): string {
  if (usd < 0) {
    return labels.invalid;
  }

  if (usd < 1) {
    return `$${usd.toFixed(2)}`;
  }

  if (usd < 1000) {
    return `$${usd.toFixed(2)}`;
  }

  if (usd < 1000000) {
    return `$${(usd / 1000).toFixed(2)}${labels.suffixThousands}`;
  }

  if (usd < 1000000000) {
    return `$${(usd / 1000000).toFixed(2)}${labels.suffixMillions}`;
  }

  if (usd < 1000000000000) {
    return `$${(usd / 1000000000).toFixed(2)}${labels.suffixBillions}`;
  }

  if (usd < 1e15) {
    return `$${(usd / 1000000000000).toFixed(2)}${labels.suffixTrillions}`;
  }

  const exp = Math.floor(Math.log10(usd));
  const mantissa = usd / Math.pow(10, exp);
  return labels.scientific
    .replace('{mantissa}', `$${mantissa.toFixed(2)}`)
    .replace('{exp}', String(exp));
}

/**
 * Calculates cost to crack password (average case)
 * 
 * Average case assumes attacker tries half of all possible combinations.
 * Formula: cost = (2^entropy / 2) / 2^32 × costPer2pow32
 * 
 * @param entropy - Entropy in bits
 * @param costPer2pow32 - Cost per 2^32 guesses in USD
 * @returns Cost to crack estimate
 */
export function calculateCostToCrack(
  entropy: number,
  costPer2pow32: number,
  labels: CostFormatLabels = DEFAULT_COST_FORMAT_LABELS
): CostToCrackEstimate {
  if (entropy <= 0 || costPer2pow32 < 0) {
    return {
      usd: 0,
      formatted: labels.invalid,
    };
  }

  // Calculate average case: half of all possible combinations
  // 2^entropy / 2 = 2^(entropy - 1)
  const avgCombinations = Math.pow(2, entropy - 1);

  // Number of 2^32 blocks
  const blocks = avgCombinations / Math.pow(2, 32);

  // Total cost
  const usd = blocks * costPer2pow32;

  return {
    usd,
    formatted: formatCost(usd, labels),
  };
}

/**
 * Formats large numbers in human-readable scientific notation
 * 
 * @param value - Number to format (can be bigint or number)
 * @returns Human-readable number string
 */
export function formatLargeNumber(value: bigint | number): string {
  const str = value.toString();
  
  // For small numbers, use comma formatting
  if (str.length <= 15) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // For large numbers, use scientific notation
  const exp = str.length - 1;
  const mantissa = str[0] + '.' + str.slice(1, 4);
  return `~${mantissa} × 10^${exp}`;
}

/**
 * Calculates the number of possible combinations
 * 
 * Formula: combinations = charsetSize^length = 2^entropy
 * 
 * @param entropy - Entropy in bits
 * @returns Number of combinations as bigint (if possible) or approximation string
 */
export function calculateCombinations(entropy: number): string {
  if (entropy <= 0) {
    return '0';
  }

  // For small entropy, calculate exact value
  if (entropy <= 100) {
    try {
      const combinations = BigInt(2) ** BigInt(Math.floor(entropy));
      return formatLargeNumber(combinations);
    } catch {
      // Fallback to approximation if BigInt fails
    }
  }

  // For large entropy, use scientific notation
  const exp = Math.floor(entropy * Math.log10(2));
  const mantissa = Math.pow(10, entropy * Math.log10(2) - exp);
  return `~${mantissa.toFixed(2)} × 10^${exp}`;
}

/**
 * Common guess rates for time-to-crack estimates
 */
export const GUESS_RATES = {
  /** Online attack with rate limiting (1,000 guesses/sec) */
  ONLINE_SLOW: 1e3,
  /** Online attack without rate limiting (1 million guesses/sec) */
  ONLINE_FAST: 1e6,
  /** Offline attack with GPU (1 billion guesses/sec) */
  OFFLINE_GPU: 1e9,
  /** Offline attack with GPU cluster (1 trillion guesses/sec) */
  OFFLINE_CLUSTER: 1e12,
  /** Advanced adversary (1 quadrillion guesses/sec) */
  ADVANCED: 1e15,
} as const;

/**
 * Common cost estimates per 2^32 guesses
 */
export const COST_ESTIMATES = {
  /** Low cost (e.g., cloud computing) */
  LOW: 0.001,
  /** Medium cost */
  MEDIUM: 0.01,
  /** High cost */
  HIGH: 0.1,
  /** Very high cost */
  VERY_HIGH: 1.0,
} as const;

