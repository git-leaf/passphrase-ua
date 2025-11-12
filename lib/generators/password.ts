/**
 * Password Generator
 * 
 * Generates cryptographically secure passwords using Web Crypto API.
 * All functions are pure and testable.
 */

/**
 * Configuration for password generation
 */
export interface PasswordConfig {
  /** Length of the password (8-128 characters recommended) */
  length: number;
  /** Include lowercase letters (a-z) */
  includeLowercase: boolean;
  /** Include uppercase letters (A-Z) */
  includeUppercase: boolean;
  /** Include numbers (0-9) */
  includeNumbers: boolean;
  /** Include symbols */
  includeSymbols: boolean;
  /** Custom symbol set (if empty, uses default) */
  customSymbols?: string;
  /** Exclude ambiguous characters (i, l, 1, L, o, 0, O) */
  excludeAmbiguous: boolean;
}

/**
 * Result of password generation with metadata
 */
export interface PasswordResult {
  /** Generated password */
  password: string;
  /** Entropy in bits */
  entropy: number;
  /** Character set size used */
  charsetSize: number;
  /** Metadata about generation */
  metadata: {
    method: 'password';
    length: number;
    charsetSize: number;
    timestamp: number;
    config: PasswordConfig;
  };
}

/**
 * Character sets for password generation
 */
export const CHARSETS = {
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  AMBIGUOUS: 'il1Lo0O', // Characters that look similar
} as const;

/**
 * Validates password generation configuration
 * 
 * @param config - Password configuration
 * @throws Error if configuration is invalid
 */
export function validateConfig(config: PasswordConfig): void {
  // Validate length
  if (!Number.isInteger(config.length) || config.length < 1 || config.length > 128) {
    throw new Error('Password length must be between 1 and 128 characters');
  }

  // Validate at least one character type is selected
  if (
    !config.includeLowercase &&
    !config.includeUppercase &&
    !config.includeNumbers &&
    !config.includeSymbols
  ) {
    throw new Error('At least one character type must be selected');
  }

  // Validate custom symbols (if provided)
  if (config.customSymbols !== undefined && config.includeSymbols) {
    if (config.customSymbols.length === 0) {
      throw new Error('Custom symbols cannot be empty when symbols are enabled');
    }
  }
}

/**
 * Builds a charset string based on configuration
 * 
 * @param config - Password configuration
 * @returns Character set string
 */
export function buildCharset(config: PasswordConfig): string {
  let charset = '';

  if (config.includeLowercase) {
    charset += CHARSETS.LOWERCASE;
  }

  if (config.includeUppercase) {
    charset += CHARSETS.UPPERCASE;
  }

  if (config.includeNumbers) {
    charset += CHARSETS.NUMBERS;
  }

  if (config.includeSymbols) {
    // Use custom symbols if provided, otherwise use default
    charset += config.customSymbols || CHARSETS.SYMBOLS;
  }

  // Remove ambiguous characters if requested
  if (config.excludeAmbiguous) {
    charset = charset
      .split('')
      .filter((char) => !CHARSETS.AMBIGUOUS.includes(char))
      .join('');
  }

  // Remove duplicate characters (in case of overlapping sets)
  charset = [...new Set(charset.split(''))].join('');

  if (charset.length === 0) {
    throw new Error('Character set is empty after applying filters');
  }

  return charset;
}

/**
 * Generates cryptographically secure random values
 * Uses Web Crypto API for CSPRNG
 * 
 * @param length - Number of random values to generate
 * @param max - Maximum value (exclusive)
 * @returns Array of random integers in range [0, max)
 */
export function getSecureRandomValues(length: number, max: number): number[] {
  if (typeof window === 'undefined' || !window.crypto?.getRandomValues) {
    throw new Error('Web Crypto API not available');
  }

  const randomValues: number[] = [];
  
  // Calculate how many bits we need
  const bitsNeeded = Math.ceil(Math.log2(max));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const maxValidValue = Math.floor((256 ** bytesNeeded) / max) * max;

  // Generate random values with rejection sampling to avoid modulo bias
  while (randomValues.length < length) {
    const buffer = new Uint8Array(bytesNeeded);
    window.crypto.getRandomValues(buffer);

    // Convert bytes to number
    let value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = (value << 8) | buffer[i];
    }

    // Reject values that would cause bias
    if (value < maxValidValue) {
      randomValues.push(value % max);
    }
  }

  return randomValues;
}

/**
 * Calculates entropy for a password
 * 
 * Formula: entropy = length × log₂(charset_size)
 * 
 * @param length - Password length
 * @param charsetSize - Size of character set
 * @returns Entropy in bits
 */
export function calculateEntropy(length: number, charsetSize: number): number {
  if (length <= 0 || charsetSize <= 0) {
    return 0;
  }
  return length * Math.log2(charsetSize);
}

/**
 * Generates a password based on configuration
 * 
 * This is a pure function that uses Web Crypto API for secure randomness.
 * All generation happens client-side with no network requests.
 * 
 * @param config - Password generation configuration
 * @returns Password generation result with metadata
 * @throws Error if configuration is invalid or Web Crypto API is unavailable
 */
export function generatePassword(config: PasswordConfig): PasswordResult {
  // Validate configuration
  validateConfig(config);

  // Build character set
  const charset = buildCharset(config);
  const charsetSize = charset.length;

  // Generate random indices
  const randomIndices = getSecureRandomValues(config.length, charsetSize);

  // Build password from random indices
  const password = randomIndices.map((index) => charset[index]).join('');

  // Calculate entropy
  const entropy = calculateEntropy(config.length, charsetSize);

  // Return result with metadata
  return {
    password,
    entropy,
    charsetSize,
    metadata: {
      method: 'password',
      length: config.length,
      charsetSize,
      timestamp: Date.now(),
      config,
    },
  };
}

/**
 * Default configuration for password generation
 */
export const DEFAULT_CONFIG: PasswordConfig = {
  length: 16,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
};

