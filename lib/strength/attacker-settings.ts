/**
 * Attacker settings
 *
 * The Attacker model as the visitor chooses it: a preset or custom text for
 * each value, read into the numbers Strength analysis takes.
 */

import { DEFAULT_ATTACKER, type AttackerModel } from "@/lib/strength/strength-analysis"

/** Chooses the custom value instead of a preset */
export const CUSTOM_ATTACKER_VALUE = "custom"

export interface AttackerSettings {
  /** A preset Guess rate, or CUSTOM_ATTACKER_VALUE to use customGuessRate */
  guessRate: string
  customGuessRate: string
  /** A preset Cost per 2^32 guesses, or CUSTOM_ATTACKER_VALUE to use customCostPer2pow32 */
  costPer2pow32: string
  customCostPer2pow32: string
}

export const DEFAULT_ATTACKER_SETTINGS: AttackerSettings = {
  guessRate: String(DEFAULT_ATTACKER.guessesPerSecond),
  customGuessRate: "",
  costPer2pow32: String(DEFAULT_ATTACKER.costPer2pow32),
  customCostPer2pow32: "",
}

/**
 * The Attacker model the settings describe. An empty custom value falls back
 * to the default; one that isn't a number reads as NaN, which Strength
 * analysis shows as invalid.
 */
export function attackerModelOf(settings: AttackerSettings): AttackerModel {
  return {
    guessesPerSecond: chosenValue(settings.guessRate, settings.customGuessRate, DEFAULT_ATTACKER.guessesPerSecond),
    costPer2pow32: chosenValue(settings.costPer2pow32, settings.customCostPer2pow32, DEFAULT_ATTACKER.costPer2pow32),
  }
}

/** Whether both values are the default presets; custom text left behind doesn't count */
export function choosesDefaultAttacker(settings: AttackerSettings): boolean {
  return (
    settings.guessRate === DEFAULT_ATTACKER_SETTINGS.guessRate &&
    settings.costPer2pow32 === DEFAULT_ATTACKER_SETTINGS.costPer2pow32
  )
}

/** A preset value, or the custom text unless it's empty */
function chosenValue(selected: string, custom: string, fallback: number): number {
  if (selected !== CUSTOM_ATTACKER_VALUE) return Number(selected)
  return custom.trim() === "" ? fallback : Number(custom)
}
