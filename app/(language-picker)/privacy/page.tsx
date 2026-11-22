import type { Metadata } from "next"
import { LanguageRedirect } from "@/app/components/language-redirect"
import { languageAlternates } from "@/lib/i18n"

// The privacy page's URL before each language had its own; links to it still work
export const metadata: Metadata = {
  alternates: { languages: languageAlternates("privacy") },
}

export default function OldPrivacyPage() {
  return <LanguageRedirect page="privacy" />
}
