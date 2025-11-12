/**
 * Password and Passphrase Generators
 * 
 * This module provides secure, client-side password generation utilities.
 * All generation uses Web Crypto API for cryptographically secure randomness.
 */

// Password Generator
export {
  generatePassword,
  validateConfig,
  buildCharset,
  getSecureRandomValues,
  calculateEntropy,
  DEFAULT_CONFIG,
  CHARSETS,
  type PasswordConfig,
  type PasswordResult,
} from './password';

// Entropy and Strength Utilities
export {
  assessStrength,
  formatTime,
  calculateTimeToCrack,
  formatCost,
  calculateCostToCrack,
  formatLargeNumber,
  calculateCombinations,
  GUESS_RATES,
  COST_ESTIMATES,
  type StrengthLevel,
  type StrengthAssessment,
  type TimeToCrackEstimate,
  type CostToCrackEstimate,
} from './entropy';

// Shared Types
export {
  type GenerationMethod,
  type GeneratorResult,
  GeneratorConfigError,
  CryptoError,
} from './types';

