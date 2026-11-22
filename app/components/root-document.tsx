import type { ReactNode } from "react"
import type { Locale } from "@/lib/i18n"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"

// Every subset is self-hosted; `subsets` picks the ones each page preloads. Cyrillic shows
// on every page (the default Ukrainian Passphrase, the language switcher), and preloading
// also names the files in the page's HTML, which is where the service worker finds them
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
    // The theme script sets a class on <html> before React hydrates, so React mustn't warn about it
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Blocking on purpose: the theme must be applied before the first paint */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme.js" />
      </head>
      {/* font-sans sets the font here: Tailwind's default on <html> can't see the font variables on <body> */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
