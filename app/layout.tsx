import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/app/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Passphrase UA - Secure Password & Passphrase Generator",
  description: "Generate secure passwords and memorable passphrases with Ukrainian language support. Client-side generation ensures complete privacy.",
  keywords: ["password generator", "passphrase", "diceware", "Ukrainian", "security", "privacy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider defaultLocale="en">
          <ThemeProvider defaultTheme="system">
            {children}
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
