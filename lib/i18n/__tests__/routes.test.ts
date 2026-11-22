import { describe, expect, it } from "vitest"
import { languageAlternates, localizedPaths, pagePath } from "../routes"

describe("pagePath", () => {
  it("puts every page under its language, with the Passphrase generator as the home page", () => {
    expect(pagePath("passphrase", "uk")).toBe("/uk")
    expect(pagePath("password", "en")).toBe("/en/password")
    expect(pagePath("learn", "uk")).toBe("/uk/learn")
    expect(pagePath("privacy", "en")).toBe("/en/privacy")
  })
})

describe("languageAlternates", () => {
  it("links the home page in each language, and the language-picking root for any other language", () => {
    expect(languageAlternates("passphrase")).toEqual({ en: "/en", uk: "/uk", "x-default": "/" })
  })

  it("sends other languages to the English version of other pages", () => {
    expect(languageAlternates("learn")).toEqual({ en: "/en/learn", uk: "/uk/learn", "x-default": "/en/learn" })
  })
})

describe("localizedPaths", () => {
  it("lists every page in every language", () => {
    expect(localizedPaths().sort()).toEqual(
      ["/en", "/en/learn", "/en/password", "/en/privacy", "/uk", "/uk/learn", "/uk/password", "/uk/privacy"].sort(),
    )
  })
})
