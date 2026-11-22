import type { Metadata } from "next"
import { languageAlternates, pagePath, translations, type Page } from "@/lib/i18n"
import { localeParam } from "./locale-param"

/**
 * The generateMetadata of a page: its title and description in the page's language,
 * and its URL in every language for search engines
 */
export function pageMetadata(page: Page) {
  return async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await localeParam(params)
    const { title, description } = translations[locale].meta[page]
    return {
      title,
      description,
      alternates: { canonical: pagePath(page, locale), languages: languageAlternates(page) },
    }
  }
}
