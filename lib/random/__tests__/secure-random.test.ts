import { describe, expect, it } from "vitest"
import { randomInts, type RandomBytes } from "../secure-random"

/** A byte source that hands out the given bytes in order. */
function fixedBytes(...values: number[]): RandomBytes {
  const queue = [...values]
  return (buffer) => {
    for (let i = 0; i < buffer.length; i++) {
      const next = queue.shift()
      if (next === undefined) throw new Error("fixedBytes exhausted")
      buffer[i] = next
    }
  }
}

describe("randomInts", () => {
  it("returns the requested number of integers below max using the platform CSPRNG", () => {
    const values = randomInts(1000, 7)

    expect(values).toHaveLength(1000)
    for (const value of values) {
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(7)
    }
  })

  it("maps each byte to a value below max", () => {
    expect(randomInts(2, 10, fixedBytes(3, 17))).toEqual([3, 7])
  })

  it("rejects bytes that would bias the result instead of wrapping them", () => {
    // 250..255 would make 0..5 more likely than 6..9, so they are skipped
    expect(randomInts(1, 10, fixedBytes(250, 255, 4))).toEqual([4])
  })

  it("combines several bytes big-endian when max needs more than one", () => {
    expect(randomInts(1, 1000, fixedBytes(0x01, 0x02))).toEqual([258])
  })

  it("stays non-negative when four bytes are combined", () => {
    const max = 2 ** 31 + 1
    expect(randomInts(1, max, fixedBytes(0x80, 0x00, 0x00, 0x00))).toEqual([2 ** 31])
  })

  it("rejects a max outside 1..2^32", () => {
    expect(() => randomInts(1, 0)).toThrow(RangeError)
    expect(() => randomInts(1, 2 ** 32 + 1)).toThrow(RangeError)
  })
})
