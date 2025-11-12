/**
 * Shared types for password/passphrase generation
 */

/**
 * Generation method type
 */
export type GenerationMethod = 'password' | 'passphrase';

/**
 * Base generator result interface
 */
export interface GeneratorResult {
  /** Generated password/passphrase */
  password: string;
  /** Entropy in bits */
  entropy: number;
  /** Generation metadata */
  metadata: {
    method: GenerationMethod;
    timestamp: number;
    [key: string]: unknown;
  };
}

/**
 * Configuration validation error
 */
export class GeneratorConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeneratorConfigError';
  }
}

/**
 * Cryptographic operation error
 */
export class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptoError';
  }
}

