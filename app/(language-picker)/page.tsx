import type { Metadata } from "next"
import { LanguageRedirect } from "@/app/components/language-redirect"
import { languageAlternates } from "@/lib/i18n"

export const metadata: Metadata = {
  alternates: { languages: languageAlternates("passphrase") },
}

export default function RootPage() {
  return <LanguageRedirect page="passphrase" />
}
