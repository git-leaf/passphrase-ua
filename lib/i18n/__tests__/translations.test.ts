import { describe, expect, it } from "vitest"
import { translations } from "../translations"

/** Every leaf of a translation table with its path, e.g. ["learn.faq.a1.2", "…"], list items by position */
function leaves(value: unknown, path = ""): [string, unknown][] {
  if (value === null || typeof value !== "object") return [[path, value]]
  return Object.entries(value).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key))
}

describe("translations", () => {
  it("has the same texts in English and Ukrainian, including every list item", () => {
    const paths = (locale: "en" | "uk") => leaves(translations[locale]).map(([path]) => path)

    expect(paths("uk").sort()).toEqual(paths("en").sort())
  })

  it("has a non-empty text at every leaf in both languages", () => {
    for (const locale of ["en", "uk"] as const) {
      const notText = leaves(translations[locale]).filter(([, value]) => typeof value !== "string" || !value.trim())

      expect(notText, locale).toEqual([])
    }
  })
})
