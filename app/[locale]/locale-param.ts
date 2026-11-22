import { notFound } from "next/navigation"
import { isLocale, type Locale } from "@/lib/i18n"

/** The page's language from its URL; dynamicParams already turns away any other first segment */
export async function localeParam(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return locale
}
