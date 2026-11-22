import type { ReactNode } from "react"
import type { Locale } from "@/lib/i18n"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
