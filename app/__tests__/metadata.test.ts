import { describe, expect, it } from "vitest"
import { generateMetadata as passphraseMetadata } from "@/app/[locale]/page"
import { generateMetadata as passwordMetadata } from "@/app/[locale]/password/page"
import { generateMetadata as learnMetadata } from "@/app/[locale]/learn/page"
import { generateMetadata as privacyMetadata } from "@/app/[locale]/privacy/page"
import sitemap from "@/app/sitemap"
import { translations } from "@/lib/i18n/translations"

const metadataOf = {
  passphrase: passphraseMetadata,
  password: passwordMetadata,
  learn: learnMetadata,
  privacy: privacyMetadata,
}

const params = (locale: string) => ({ params: Promise.resolve({ locale }) })

describe("page metadata", () => {
  it("gives each page a title and description in its language", async () => {
    for (const locale of ["en", "uk"] as const) {
      for (const [page, generateMetadata] of Object.entries(metadataOf)) {
        const { title, description } = await generateMetadata(params(locale))
        const expected = translations[locale].meta[page as keyof typeof metadataOf]

        expect({ title, description }).toEqual(expected)
      }
    }
    expect((await passwordMetadata(params("uk"))).title).toBe("Генератор паролів - Mova Pass")
  })

  it("links each page's version in the other language, with English for any other", async () => {
    const { alternates } = await learnMetadata(params("uk"))

    expect(alternates).toEqual({
      canonical: "/uk/learn",
      languages: { en: "/en/learn", uk: "/uk/learn", "x-default": "/en/learn" },
    })
  })

  it("sends any other language to the root, which picks one, from the home page", async () => {
    const { alternates } = await passphraseMetadata(params("en"))

    expect(alternates?.languages).toEqual({ en: "/en", uk: "/uk", "x-default": "/" })
  })
})

describe("sitemap", () => {
  it("lists every page in every language at its full URL", () => {
    expect(
      sitemap()
        .map(({ url }) => url)
        .sort(),
    ).toEqual(
      [
        "https://movapass.net/en",
        "https://movapass.net/en/learn",
        "https://movapass.net/en/password",
        "https://movapass.net/en/privacy",
        "https://movapass.net/uk",
        "https://movapass.net/uk/learn",
        "https://movapass.net/uk/password",
        "https://movapass.net/uk/privacy",
      ].sort(),
    )
  })

  it("names each page's version in the other language", () => {
    const privacy = sitemap().find(({ url }) => url === "https://movapass.net/uk/privacy")

    expect(privacy?.alternates?.languages).toEqual({
      en: "https://movapass.net/en/privacy",
      uk: "https://movapass.net/uk/privacy",
      "x-default": "https://movapass.net/en/privacy",
    })
  })
})
