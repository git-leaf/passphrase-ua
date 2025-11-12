/**
 * Tests for Password Generator
 * 
 * Run with: pnpm test (when testing framework is set up)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generatePassword,
  validateConfig,
  buildCharset,
  calculateEntropy,
  CHARSETS,
  DEFAULT_CONFIG,
  type PasswordConfig,
} from '../password';

describe('validateConfig', () => {
  it('should accept valid configuration', () => {
    expect(() => {
      validateConfig(DEFAULT_CONFIG);
    }).not.toThrow();
  });

  it('should throw error if length is too small', () => {
    expect(() => {
      validateConfig({
        ...DEFAULT_CONFIG,
        length: 0,
      });
    }).toThrow('Password length must be between 1 and 128 characters');
  });

  it('should throw error if length is too large', () => {
    expect(() => {
      validateConfig({
        ...DEFAULT_CONFIG,
        length: 129,
      });
    }).toThrow('Password length must be between 1 and 128 characters');
  });

  it('should throw error if no character types are selected', () => {
    expect(() => {
      validateConfig({
        length: 16,
        includeLowercase: false,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,
        excludeAmbiguous: false,
      });
    }).toThrow('At least one character type must be selected');
  });

  it('should throw error if custom symbols are empty when symbols are enabled', () => {
    expect(() => {
      validateConfig({
        ...DEFAULT_CONFIG,
        customSymbols: '',
      });
    }).toThrow('Custom symbols cannot be empty when symbols are enabled');
  });
});

describe('buildCharset', () => {
  it('should include lowercase when enabled', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });

    expect(charset).toBe(CHARSETS.LOWERCASE);
  });

  it('should include uppercase when enabled', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: false,
      includeUppercase: true,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });

    expect(charset).toBe(CHARSETS.UPPERCASE);
  });

  it('should include numbers when enabled', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: true,
      includeSymbols: false,
      excludeAmbiguous: false,
    });

    expect(charset).toBe(CHARSETS.NUMBERS);
  });

  it('should include default symbols when enabled', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: true,
      excludeAmbiguous: false,
    });

    expect(charset).toBe(CHARSETS.SYMBOLS);
  });

  it('should use custom symbols when provided', () => {
    const customSymbols = '@#$%';
    const charset = buildCharset({
      length: 16,
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: true,
      customSymbols,
      excludeAmbiguous: false,
    });

    expect(charset).toBe(customSymbols);
  });

  it('should exclude ambiguous characters when enabled', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: false,
      excludeAmbiguous: true,
    });

    // Should not contain ambiguous characters
    expect(charset).not.toContain('i');
    expect(charset).not.toContain('l');
    expect(charset).not.toContain('1');
    expect(charset).not.toContain('L');
    expect(charset).not.toContain('o');
    expect(charset).not.toContain('0');
    expect(charset).not.toContain('O');
  });

  it('should combine multiple character sets', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    });

    expect(charset).toContain('a'); // lowercase
    expect(charset).toContain('A'); // uppercase
    expect(charset).toContain('5'); // numbers
    expect(charset).toContain('!'); // symbols
  });

  it('should remove duplicate characters', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });

    // Count occurrences of 'a'
    const count = charset.split('').filter((c) => c === 'a').length;
    expect(count).toBe(1);
  });
});

describe('calculateEntropy', () => {
  it('should calculate entropy correctly', () => {
    // 16 characters from 94-character charset
    const entropy = calculateEntropy(16, 94);
    expect(entropy).toBeCloseTo(105.2, 1);
  });

  it('should return 0 for invalid inputs', () => {
    expect(calculateEntropy(0, 94)).toBe(0);
    expect(calculateEntropy(16, 0)).toBe(0);
    expect(calculateEntropy(-1, 94)).toBe(0);
  });

  it('should calculate entropy for different charset sizes', () => {
    // Lowercase only (26 characters)
    const entropyLowercase = calculateEntropy(16, 26);
    expect(entropyLowercase).toBeCloseTo(75.2, 1);

    // Lowercase + uppercase (52 characters)
    const entropyMixed = calculateEntropy(16, 52);
    expect(entropyMixed).toBeCloseTo(90.6, 1);

    // All characters (94 characters)
    const entropyAll = calculateEntropy(16, 94);
    expect(entropyAll).toBeCloseTo(105.2, 1);
  });
});

describe('generatePassword', () => {
  it('should generate password with correct length', () => {
    const result = generatePassword({
      length: 20,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    });

    expect(result.password).toHaveLength(20);
  });

  it('should only use characters from enabled sets', () => {
    const result = generatePassword({
      length: 100, // Long password for better statistical analysis
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });

    // Should only contain lowercase letters
    expect(result.password).toMatch(/^[a-z]+$/);
  });

  it('should not contain ambiguous characters when excluded', () => {
    const result = generatePassword({
      length: 100,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: false,
      excludeAmbiguous: true,
    });

    const ambiguous = ['i', 'l', '1', 'L', 'o', '0', 'O'];
    const containsAmbiguous = ambiguous.some((char) =>
      result.password.includes(char)
    );
    expect(containsAmbiguous).toBe(false);
  });

  it('should include metadata in result', () => {
    const config: PasswordConfig = {
      length: 16,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    };

    const result = generatePassword(config);

    expect(result.metadata.method).toBe('password');
    expect(result.metadata.length).toBe(16);
    expect(result.metadata.charsetSize).toBeGreaterThan(0);
    expect(result.metadata.timestamp).toBeGreaterThan(0);
    expect(result.metadata.config).toEqual(config);
  });

  it('should calculate correct entropy', () => {
    const result = generatePassword({
      length: 16,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    });

    // 94 characters in full charset
    const expectedEntropy = 16 * Math.log2(94);
    expect(result.entropy).toBeCloseTo(expectedEntropy, 1);
  });

  it('should generate different passwords on subsequent calls', () => {
    const config: PasswordConfig = DEFAULT_CONFIG;
    const result1 = generatePassword(config);
    const result2 = generatePassword(config);

    // Extremely unlikely to generate the same password twice
    expect(result1.password).not.toBe(result2.password);
  });

  it('should throw error for invalid configuration', () => {
    expect(() => {
      generatePassword({
        length: 16,
        includeLowercase: false,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,
        excludeAmbiguous: false,
      });
    }).toThrow();
  });
});

describe('Security considerations', () => {
  it('should use Web Crypto API', () => {
    // Mock window.crypto to ensure it's being used
    const mockGetRandomValues = vi.fn((array) => {
      // Fill with predictable values for testing
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    });

    const originalCrypto = window.crypto;
    Object.defineProperty(window, 'crypto', {
      value: {
        getRandomValues: mockGetRandomValues,
      },
      writable: true,
    });

    generatePassword(DEFAULT_CONFIG);

    expect(mockGetRandomValues).toHaveBeenCalled();

    // Restore original crypto
    Object.defineProperty(window, 'crypto', {
      value: originalCrypto,
      writable: true,
    });
  });

  it('should throw error if Web Crypto API is unavailable', () => {
    const originalCrypto = window.crypto;
    
    // @ts-expect-error - Intentionally setting to undefined for testing
    Object.defineProperty(window, 'crypto', {
      value: undefined,
      writable: true,
    });

    expect(() => {
      generatePassword(DEFAULT_CONFIG);
    }).toThrow('Web Crypto API not available');

    // Restore original crypto
    Object.defineProperty(window, 'crypto', {
      value: originalCrypto,
      writable: true,
    });
  });
});

describe('Edge cases', () => {
  it('should handle minimum length (1 character)', () => {
    const result = generatePassword({
      length: 1,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });

    expect(result.password).toHaveLength(1);
  });

  it('should handle maximum length (128 characters)', () => {
    const result = generatePassword({
      length: 128,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });

    expect(result.password).toHaveLength(128);
  });

  it('should handle single character set with ambiguous exclusion', () => {
    const result = generatePassword({
      length: 50,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: true,
    });

    // Should not contain 'l', 'o' from lowercase
    expect(result.password).not.toContain('l');
    expect(result.password).not.toContain('o');
  });
});

