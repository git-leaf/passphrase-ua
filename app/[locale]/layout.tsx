import type { Metadata } from "next"
import { RootDocument } from "@/app/components/root-document"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "@/app/components/ui/toaster"
import { OfflineSupport } from "@/app/components/offline-support"
import { I18nProvider } from "@/app/components/i18n-provider"
import { locales, SITE_URL } from "@/lib/i18n"
import { localeParam } from "./locale-param"

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  keywords: ["password generator", "passphrase", "diceware", "Ukrainian", "security", "privacy"],
}

// Every language is pre-rendered at build time; any other first segment is a 404
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const locale = await localeParam(params)

  return (
    <RootDocument lang={locale}>
      <I18nProvider locale={locale}>
        <ThemeProvider>
          {children}
          <Toaster />
          <OfflineSupport />
        </ThemeProvider>
      </I18nProvider>
    </RootDocument>
  )
}
