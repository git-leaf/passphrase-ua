import type { Metadata } from "next"
import { RootDocument } from "@/app/components/root-document"
import { languageNames, locales, pagePath } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "404 - Mova Pass",
}

/**
 * The page for any URL the app doesn't have, e.g. an unknown language. It has no
 * language of its own, so it offers the home page in each.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <ul className="flex gap-6">
          {locales.map((locale) => (
            <li key={locale}>
              <a
                href={pagePath("passphrase", locale)}
                hrefLang={locale}
                lang={locale}
                className="text-primary underline underline-offset-4"
              >
                Mova Pass · {languageNames[locale].name}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </RootDocument>
  )
}
