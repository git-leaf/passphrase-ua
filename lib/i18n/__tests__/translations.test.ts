import { describe, expect, it } from "vitest"
import { translations } from "../translations"

/** Every path to a piece of text, e.g. "learn.faq.a1.2", with list items by position */
function textPaths(value: unknown, path = ""): string[] {
  if (typeof value === "string") return [path]
  return Object.entries(value as object).flatMap(([key, child]) => textPaths(child, path ? `${path}.${key}` : key))
}

function emptyTextPaths(value: unknown, path = ""): string[] {
  if (typeof value === "string") return value.trim() ? [] : [path]
  return Object.entries(value as object).flatMap(([key, child]) => emptyTextPaths(child, path ? `${path}.${key}` : key))
}

describe("translations", () => {
  it("has the same texts in English and Ukrainian, including every list item", () => {
    expect(textPaths(translations.uk).sort()).toEqual(textPaths(translations.en).sort())
  })

  it("has no empty text in either language", () => {
    expect(emptyTextPaths(translations.en)).toEqual([])
    expect(emptyTextPaths(translations.uk)).toEqual([])
  })
})
