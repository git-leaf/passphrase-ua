import { describe, expect, it } from "vitest"
import { resolvePreferredLocale } from "../preferred-locale"

describe("resolvePreferredLocale", () => {
  it("prefers the locale the user chose over the browser languages", () => {
    expect(resolvePreferredLocale("en", ["uk-UA", "en-US"], "en")).toBe("en")
    expect(resolvePreferredLocale("uk", ["en-US"], "en")).toBe("uk")
  })

  it("ignores a saved value that is not a supported locale", () => {
    expect(resolvePreferredLocale("de", ["uk"], "en")).toBe("uk")
  })

  it("uses the first browser language with a supported primary language", () => {
    expect(resolvePreferredLocale(null, ["de-DE", "uk-UA", "en-GB"], "en")).toBe("uk")
    expect(resolvePreferredLocale(null, ["EN-gb"], "uk")).toBe("en")
  })

  it("falls back to the default when nothing matches", () => {
    expect(resolvePreferredLocale(null, ["de-DE", "fr"], "en")).toBe("en")
    expect(resolvePreferredLocale(null, [], "uk")).toBe("uk")
  })
})
