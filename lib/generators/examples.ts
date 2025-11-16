/**
 * Usage Examples for Password Generators
 * 
 * ⚠️ WARNING: This file is for DOCUMENTATION and DEVELOPMENT ONLY
 * This file MUST NOT be imported in production code as it logs passwords to the console.
 * 
 * This file contains practical examples of how to use the password generation library.
 * These examples can be used for documentation, testing, or as a reference implementation.
 * 
 * Build configuration ensures this file is excluded from production bundles.
 */

// Prevent accidental production use
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  throw new Error(
    'examples.ts is for development and documentation only. ' +
    'It must not be imported in production code as it logs passwords to the console.'
  );
}

import {
  generatePassword,
  DEFAULT_CONFIG,
  CHARSETS,
  assessStrength,
  calculateTimeToCrack,
  calculateCostToCrack,
  GUESS_RATES,
  COST_ESTIMATES,
  type PasswordConfig,
} from './index';

/**
 * Example 1: Generate a password with default settings
 * 
 * Default: 16 characters, all character types, no ambiguous exclusion
 */
export function example1_basicPassword() {
  const result = generatePassword(DEFAULT_CONFIG);

  console.log('Password:', result.password);
  console.log('Entropy:', result.entropy.toFixed(2), 'bits');
  console.log('Charset size:', result.charsetSize);

  // Output example:
  // Password: K9#mP2@xL5qR8vWt
  // Entropy: 105.20 bits
  // Charset size: 94
}

/**
 * Example 2: Generate a strong password for password manager
 * 
 * Long, complex password that you don't need to remember
 */
export function example2_passwordManager() {
  const config: PasswordConfig = {
    length: 32,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  };

  const result = generatePassword(config);
  const strength = assessStrength(result.entropy);

  console.log('Password:', result.password);
  console.log('Strength:', strength.label);
  console.log('Entropy:', result.entropy.toFixed(2), 'bits');

  // Output example:
  // Password: 8vR#mK2@qxL9P5tWnY4@jF7$bH3!cG6%
  // Strength: Very Strong
  // Entropy: 210.40 bits
}

/**
 * Example 3: Generate a password without symbols
 * 
 * Useful for sites that don't allow special characters
 */
export function example3_noSymbols() {
  const config: PasswordConfig = {
    length: 20,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeAmbiguous: false,
  };

  const result = generatePassword(config);

  console.log('Password:', result.password);
  console.log('Entropy:', result.entropy.toFixed(2), 'bits');

  // Output example:
  // Password: K9mP2xL5qR8vWtYjF4bH
  // Entropy: 119.00 bits
}

/**
 * Example 4: Generate a password without ambiguous characters
 * 
 * Useful when you need to type the password manually
 */
export function example4_noAmbiguous() {
  const config: PasswordConfig = {
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: true,
  };

  const result = generatePassword(config);

  console.log('Password:', result.password);
  console.log('Charset size:', result.charsetSize);
  console.log('Note: No i, l, 1, L, o, 0, O characters');

  // Output example:
  // Password: K9#mP2@xR5qT8vWy
  // Charset size: 87
  // Note: No i, l, 1, L, o, 0, O characters
}

/**
 * Example 5: Generate a PIN (numbers only)
 * 
 * Useful for creating PINs or numeric codes
 */
export function example5_numbersOnly() {
  const config: PasswordConfig = {
    length: 6,
    includeLowercase: false,
    includeUppercase: false,
    includeNumbers: true,
    includeSymbols: false,
    excludeAmbiguous: false,
  };

  const result = generatePassword(config);

  console.log('PIN:', result.password);
  console.log('Entropy:', result.entropy.toFixed(2), 'bits');

  // Output example:
  // PIN: 492857
  // Entropy: 19.93 bits
}

/**
 * Example 6: Generate a password with custom symbols
 * 
 * Useful when you want to restrict which symbols are used
 */
export function example6_customSymbols() {
  const config: PasswordConfig = {
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    customSymbols: '@#$%', // Only these symbols
    excludeAmbiguous: false,
  };

  const result = generatePassword(config);

  console.log('Password:', result.password);
  console.log('Note: Only uses @, #, $, % symbols');

  // Output example:
  // Password: K9#mP2@xL5qR8vWt
  // Note: Only uses @, #, $, % symbols
}

/**
 * Example 7: Assess password strength
 * 
 * Evaluates the strength of a generated password
 */
export function example7_assessStrength() {
  const result = generatePassword({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  });

  const strength = assessStrength(result.entropy);

  console.log('Password:', result.password);
  console.log('Entropy:', result.entropy.toFixed(2), 'bits');
  console.log('Strength level:', strength.level);
  console.log('Strength label:', strength.label);
  console.log('UI color:', strength.color);
  console.log('Progress bar:', strength.percentage.toFixed(1), '%');

  // Output example:
  // Password: K9#mP2@xL5qR8vWt
  // Entropy: 105.20 bits
  // Strength level: very-strong
  // Strength label: Very Strong
  // UI color: bg-emerald-600
  // Progress bar: 92.5 %
}

/**
 * Example 8: Calculate time to crack
 * 
 * Estimates how long it would take to crack the password
 */
export function example8_timeToCrack() {
  const result = generatePassword(DEFAULT_CONFIG);

  // Online attack (slow)
  const timeOnline = calculateTimeToCrack(
    result.entropy,
    GUESS_RATES.ONLINE_SLOW
  );

  // Offline attack with GPU cluster (fast)
  const timeOffline = calculateTimeToCrack(
    result.entropy,
    GUESS_RATES.OFFLINE_CLUSTER
  );

  console.log('Password entropy:', result.entropy.toFixed(2), 'bits');
  console.log('Time to crack (online, 1k/s):', timeOnline.formatted);
  console.log('Time to crack (offline, 1T/s):', timeOffline.formatted);

  // Output example:
  // Password entropy: 105.20 bits
  // Time to crack (online, 1k/s): 643 quadrillion years
  // Time to crack (offline, 1T/s): 643 million years
}

/**
 * Example 9: Calculate cost to crack
 * 
 * Estimates the cost to crack the password
 */
export function example9_costToCrack() {
  const result = generatePassword(DEFAULT_CONFIG);

  const cost = calculateCostToCrack(result.entropy, COST_ESTIMATES.MEDIUM);

  console.log('Password entropy:', result.entropy.toFixed(2), 'bits');
  console.log('Cost to crack (avg):', cost.formatted);
  console.log('Note: Based on $0.01 per 2^32 guesses');

  // Output example:
  // Password entropy: 105.20 bits
  // Cost to crack (avg): $472.24M
  // Note: Based on $0.01 per 2^32 guesses
}

/**
 * Example 10: Complete security report
 * 
 * Generates a comprehensive security assessment
 */
export function example10_securityReport() {
  const result = generatePassword({
    length: 20,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  });

  const strength = assessStrength(result.entropy);
  const timeSlow = calculateTimeToCrack(result.entropy, GUESS_RATES.ONLINE_SLOW);
  const timeFast = calculateTimeToCrack(result.entropy, GUESS_RATES.OFFLINE_CLUSTER);
  const cost = calculateCostToCrack(result.entropy, COST_ESTIMATES.MEDIUM);

  console.log('=== Security Report ===');
  console.log('Password:', result.password);
  console.log('Length:', result.metadata.length, 'characters');
  console.log('Charset size:', result.charsetSize);
  console.log('Entropy:', result.entropy.toFixed(2), 'bits');
  console.log('Strength:', strength.label);
  console.log('Time to crack (online):', timeSlow.formatted);
  console.log('Time to crack (offline):', timeFast.formatted);
  console.log('Cost to crack:', cost.formatted);
  console.log('Generated at:', new Date(result.metadata.timestamp).toISOString());

  // Output example:
  // === Security Report ===
  // Password: K9#mP2@xL5qR8vWtYjF4
  // Length: 20 characters
  // Charset size: 94
  // Entropy: 131.50 bits
  // Strength: Very Strong
  // Time to crack (online): 5.44e+22 years
  // Time to crack (offline): 54.4 trillion years
  // Cost to crack: $503.32T
  // Generated at: 2025-11-12T10:30:45.123Z
}

/**
 * Example 11: Error handling
 * 
 * Demonstrates proper error handling
 */
export function example11_errorHandling() {
  try {
    // Invalid: no character types selected
    const result = generatePassword({
      length: 16,
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });
    console.log('This should not print:', result.password);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }

  try {
    // Invalid: length too large
    const result = generatePassword({
      length: 200,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });
    console.log('This should not print:', result.password);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }

  // Output example:
  // Error: At least one character type must be selected
  // Error: Password length must be between 1 and 128 characters
}

/**
 * Example 12: Comparing different configurations
 * 
 * Shows entropy differences between configurations
 */
export function example12_compareConfigurations() {
  const configs = [
    {
      name: 'Lowercase only (8 chars)',
      config: {
        length: 8,
        includeLowercase: true,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,
        excludeAmbiguous: false,
      },
    },
    {
      name: 'Alphanumeric (12 chars)',
      config: {
        length: 12,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeAmbiguous: false,
      },
    },
    {
      name: 'Full charset (16 chars)',
      config: {
        length: 16,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeAmbiguous: false,
      },
    },
  ];

  console.log('=== Configuration Comparison ===');
  configs.forEach(({ name, config }) => {
    const result = generatePassword(config);
    const strength = assessStrength(result.entropy);

    console.log(`\n${name}:`);
    console.log('  Charset size:', result.charsetSize);
    console.log('  Entropy:', result.entropy.toFixed(2), 'bits');
    console.log('  Strength:', strength.label);
  });

  // Output example:
  // === Configuration Comparison ===
  //
  // Lowercase only (8 chars):
  //   Charset size: 26
  //   Entropy: 37.60 bits
  //   Strength: Weak
  //
  // Alphanumeric (12 chars):
  //   Charset size: 62
  //   Entropy: 71.49 bits
  //   Strength: Strong
  //
  // Full charset (16 chars):
  //   Charset size: 94
  //   Entropy: 105.20 bits
  //   Strength: Very Strong
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log('=== Password Generator Examples ===\n');

  console.log('--- Example 1: Basic Password ---');
  example1_basicPassword();

  console.log('\n--- Example 2: Password Manager ---');
  example2_passwordManager();

  console.log('\n--- Example 3: No Symbols ---');
  example3_noSymbols();

  console.log('\n--- Example 4: No Ambiguous ---');
  example4_noAmbiguous();

  console.log('\n--- Example 5: Numbers Only (PIN) ---');
  example5_numbersOnly();

  console.log('\n--- Example 6: Custom Symbols ---');
  example6_customSymbols();

  console.log('\n--- Example 7: Assess Strength ---');
  example7_assessStrength();

  console.log('\n--- Example 8: Time to Crack ---');
  example8_timeToCrack();

  console.log('\n--- Example 9: Cost to Crack ---');
  example9_costToCrack();

  console.log('\n--- Example 10: Security Report ---');
  example10_securityReport();

  console.log('\n--- Example 11: Error Handling ---');
  example11_errorHandling();

  console.log('\n--- Example 12: Compare Configurations ---');
  example12_compareConfigurations();
}

