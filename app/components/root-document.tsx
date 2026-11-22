import type { ReactNode } from "react"
import type { Locale } from "@/lib/i18n"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"

// Every subset is self-hosted; `subsets` picks the ones each page preloads
// (https://nextjs.org/docs/app/api-reference/components/font#subsets). Cyrillic shows on most
// pages (the default Ukrainian Passphrase, the language toggle), and preloading also names the
// files in the page's HTML, which is where the service worker finds them
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
})

/**
 * The <html> and <body> every root layout renders, in the page's language
 */
export function RootDocument({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    // The theme script sets a class on <html> before React hydrates, so React mustn't warn about it.
    // The font variables sit on <html> because Tailwind's default fonts are resolved there.
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Blocking on purpose: the theme must be applied before the first paint */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme.js" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
