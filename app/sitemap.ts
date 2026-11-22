import type { MetadataRoute } from "next"
import { languageAlternates, locales, pagePath, pages, SITE_URL } from "@/lib/i18n"

const absolute = (path: string) => new URL(path, SITE_URL).href

/** Every page in every language, each with its versions in the other languages */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: absolute(pagePath(page, locale)),
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(page)).map(([language, path]) => [language, absolute(path)]),
        ),
      },
    })),
  )
}
