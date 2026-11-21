/**
 * Shared types for password/passphrase generation
 */

/**
 * Generation method type
 */
export type GenerationMethod = "password" | "passphrase"

/**
 * A generated Secret and its entropy
 */
export interface GeneratedSecret {
  /** The password or passphrase */
  secret: string
  /** Entropy in bits */
  entropy: number
}
