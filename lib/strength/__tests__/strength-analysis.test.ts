import { describe, expect, it } from 'vitest';
import { analyzeStrength, DEFAULT_ATTACKER, type AttackerModel } from '../strength-analysis';

// Six words from a 7,776-word Diceware list: 7776^6 ≈ 2.2107 × 10^23 combinations
const SIX_DICEWARE_WORDS = 6 * Math.log2(7776);
// Eight digits: exactly 10^8 combinations
const EIGHT_DIGITS = 8 * Math.log2(10);

const trillionPerSecond: AttackerModel = { guessesPerSecond: 1e12, costPer2pow32: 0.01 };

describe('analyzeStrength', () => {
  describe('strength level', () => {
    it.each([
      [0, 'weak'],
      [40, 'weak'],
      [40.01, 'moderate'],
      [60, 'moderate'],
      [60.01, 'strong'],
      [80, 'strong'],
      [80.01, 'very-strong'],
      [128, 'very-strong'],
      [128.01, 'excessive'],
    ])('%s bits is %s', (entropy, level) => {
      expect(analyzeStrength(entropy, DEFAULT_ATTACKER, 'en').level).toBe(level);
    });

    it('fills the bar proportionally up to Strong and fully from Very Strong', () => {
      expect(analyzeStrength(20, DEFAULT_ATTACKER, 'en').percentage).toBeCloseTo(12.5);
      expect(analyzeStrength(50, DEFAULT_ATTACKER, 'en').percentage).toBeCloseTo(50);
      expect(analyzeStrength(70, DEFAULT_ATTACKER, 'en').percentage).toBeCloseTo(87.5);
      expect(analyzeStrength(100, DEFAULT_ATTACKER, 'en').percentage).toBe(100);
    });
  });

  describe('combinations', () => {
    it('shows exact counts with locale grouping', () => {
      expect(analyzeStrength(EIGHT_DIGITS, DEFAULT_ATTACKER, 'en').combinations).toBe(
        '100,000,000'
      );
      expect(analyzeStrength(EIGHT_DIGITS, DEFAULT_ATTACKER, 'uk').combinations).toBe(
        '100 000 000'
      );
    });

    it('uses scientific notation for large counts without rounding entropy down', () => {
      expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, 'en').combinations).toBe(
        '~2.21 × 10^23'
      );
      expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, 'uk').combinations).toBe(
        '~2,21 × 10^23'
      );
    });
  });

  describe('time to crack (average: half the combinations)', () => {
    it('formats short times in milliseconds', () => {
      // 2^39 / 10^12 s ≈ 549.76 ms
      expect(analyzeStrength(40, trillionPerSecond, 'en').timeToCrack).toBe(
        '549.76 milliseconds'
      );
    });

    it('formats long times in localized large units', () => {
      // 7776^6 / 2 / 10^12 s ≈ 3,502.7 years
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, 'en').timeToCrack).toBe(
        '3.50 thousand years'
      );
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, 'uk').timeToCrack).toBe(
        '3,50 тис. років'
      );
    });

    it.each([0, -5, Number.NaN])('is invalid for a guess rate of %s', (guessesPerSecond) => {
      const attacker = { ...trillionPerSecond, guessesPerSecond };
      expect(analyzeStrength(60, attacker, 'en').timeToCrack).toBe('Invalid');
      expect(analyzeStrength(60, attacker, 'uk').timeToCrack).toBe('Некоректно');
    });
  });

  describe('cost to crack (average: half the combinations)', () => {
    it('prices blocks of 2^32 guesses in localized units', () => {
      // 7776^6 / 2 / 2^32 × $0.01 ≈ $257.36 billion
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, 'en').costToCrack).toBe(
        '$257.36B'
      );
      expect(analyzeStrength(SIX_DICEWARE_WORDS, trillionPerSecond, 'uk').costToCrack).toBe(
        '$257,36 млрд.'
      );
    });

    it.each([-1, Number.NaN])('is invalid for a cost of %s', (costPer2pow32) => {
      const attacker = { ...trillionPerSecond, costPer2pow32 };
      expect(analyzeStrength(60, attacker, 'en').costToCrack).toBe('Invalid');
    });
  });

  it('formats entropy with two decimals in the locale', () => {
    expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, 'en').entropy).toBe('77.55 bits');
    expect(analyzeStrength(SIX_DICEWARE_WORDS, DEFAULT_ATTACKER, 'uk').entropy).toBe(
      '77,55 бітів'
    );
  });
});
