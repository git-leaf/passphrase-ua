import { describe, expect, it } from "vitest"
import { attackerModelOf, CUSTOM_ATTACKER_VALUE, DEFAULT_ATTACKER_SETTINGS } from "../attacker-settings"

describe("attackerModelOf", () => {
  it("starts at a trillion guesses a second for a cent per 2^32 guesses", () => {
    expect(attackerModelOf(DEFAULT_ATTACKER_SETTINGS)).toEqual({ guessesPerSecond: 1e12, costPer2pow32: 0.01 })
  })

  it("reads the chosen presets", () => {
    expect(attackerModelOf({ ...DEFAULT_ATTACKER_SETTINGS, guessRate: "1000000", costPer2pow32: "1" })).toEqual({
      guessesPerSecond: 1e6,
      costPer2pow32: 1,
    })
  })

  it("reads custom values, ignoring the custom text while a preset is chosen", () => {
    const settings = {
      guessRate: CUSTOM_ATTACKER_VALUE,
      customGuessRate: " 2.5e9 ",
      costPer2pow32: "0.1",
      customCostPer2pow32: "7",
    }

    expect(attackerModelOf(settings)).toEqual({ guessesPerSecond: 2.5e9, costPer2pow32: 0.1 })
  })

  it("falls back to the default for an empty custom value", () => {
    const settings = {
      guessRate: CUSTOM_ATTACKER_VALUE,
      customGuessRate: "  ",
      costPer2pow32: CUSTOM_ATTACKER_VALUE,
      customCostPer2pow32: "",
    }

    expect(attackerModelOf(settings)).toEqual({ guessesPerSecond: 1e12, costPer2pow32: 0.01 })
  })

  it("keeps a free attacker at $0", () => {
    const settings = { ...DEFAULT_ATTACKER_SETTINGS, costPer2pow32: CUSTOM_ATTACKER_VALUE, customCostPer2pow32: "0" }

    expect(attackerModelOf(settings).costPer2pow32).toBe(0)
  })

  it("reads a custom value that isn't a number as not a number, for Strength analysis to call invalid", () => {
    const settings = {
      guessRate: CUSTOM_ATTACKER_VALUE,
      customGuessRate: "fast",
      costPer2pow32: CUSTOM_ATTACKER_VALUE,
      customCostPer2pow32: "$1",
    }

    const model = attackerModelOf(settings)
    expect(model.guessesPerSecond).toBeNaN()
    expect(model.costPer2pow32).toBeNaN()
  })
})
