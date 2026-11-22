"use client"

import { useEffect } from "react"
import { languageNames, locales, pagePath, preferredLocale, type Page } from "@/lib/i18n"

/**
 * Sends the visitor to the page in their language: the one they last chose, else their
 * browser's, else English. It runs in the browser because only the browser knows the
 * saved choice, and so it works offline too (docs/adr/0012). The query and anchor come
 * along. Until it runs, or without JavaScript, the visitor picks a language themselves.
 */
export function LanguageRedirect({ page }: { page: Page }) {
  useEffect(() => {
    location.replace(pagePath(page, preferredLocale()) + location.search + location.hash)
  }, [page])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <h1 className="text-4xl font-bold tracking-tight">Mova Pass</h1>
      <ul className="flex gap-6">
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={pagePath(page, locale)}
              hrefLang={locale}
              lang={locale}
              className="text-primary underline underline-offset-4"
            >
              {languageNames[locale].name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
