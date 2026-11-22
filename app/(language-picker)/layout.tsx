import type { Metadata } from "next"
import { RootDocument } from "@/app/components/root-document"
import { SITE_URL } from "@/lib/i18n"

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: "Mova Pass",
}

/**
 * The root layout of the URLs without a language, which only send the visitor to one
 */
export default function LanguagePickerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>
}
