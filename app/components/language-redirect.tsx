"use client"

import { useEffect } from "react"
import { locales, pagePath, preferredLocale, type Page } from "@/lib/i18n"

const LANGUAGE_NAMES = { en: "English", uk: "Українська" } as const

/**
 * Sends the visitor to the page in their language: the one they last chose, else their
 * browser's, else English. It runs in the browser because only the browser knows the
 * saved choice, and so it works offline too (docs/adr/0012). Until it runs, or without
 * JavaScript, the visitor picks a language themselves.
 */
export function LanguageRedirect({ page }: { page: Page }) {
  useEffect(() => {
    location.replace(pagePath(page, preferredLocale()))
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
              {LANGUAGE_NAMES[locale]}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
