/**
 * Secure random
 *
 * Uniform random integers from a cryptographically secure byte source.
 * Rejection sampling keeps every value in [0, max) equally likely.
 */

/** Fills the buffer with random bytes. */
export type RandomBytes = (buffer: Uint8Array) => void;

/** The platform CSPRNG (Web Crypto, available in browsers and Node). */
export const cryptoRandomBytes: RandomBytes = (buffer) => {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Web Crypto API not available');
  }
  globalThis.crypto.getRandomValues(buffer);
};

/** Largest supported max: four bytes of randomness. */
const MAX_RANGE = 2 ** 32;

/**
 * Returns `count` independent, uniformly distributed integers in [0, max).
 *
 * @param count - How many integers to return
 * @param max - Exclusive upper bound, an integer from 1 to 2^32
 * @param bytes - Byte source; defaults to the platform CSPRNG
 */
export function randomInts(
  count: number,
  max: number,
  bytes: RandomBytes = cryptoRandomBytes
): number[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(`count must be a non-negative integer, got ${count}`);
  }
  if (!Number.isInteger(max) || max < 1 || max > MAX_RANGE) {
    throw new RangeError(`max must be an integer from 1 to 2^32, got ${max}`);
  }

  const bytesNeeded = Math.ceil(Math.log2(max) / 8);
  const range = 256 ** bytesNeeded;
  // Values at or above this would map onto [0, max) unevenly, so they are rejected
  const limit = range - (range % max);

  const values: number[] = [];
  const buffer = new Uint8Array(bytesNeeded);

  while (values.length < count) {
    bytes(buffer);

    // Big-endian; multiplication instead of << stays exact beyond 2^31
    let value = 0;
    for (const byte of buffer) {
      value = value * 256 + byte;
    }

    if (value < limit) {
      values.push(value % max);
    }
  }

  return values;
}
