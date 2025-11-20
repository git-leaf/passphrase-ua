"use client"

import { Github, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

/**
 * Footer links for GitHub, contact information, and privacy policy
 */
export function FooterLinks() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground border-t pt-6">
      <a
        href="https://github.com/git-leaf/passphrase-ua"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-foreground transition-colors"
      >
        <Github className="h-4 w-4" />
        {t.footer.sourceCode}
      </a>
      <span className="hidden sm:inline">•</span>
      <Link
        href="/privacy"
        className="flex items-center gap-2 hover:text-foreground transition-colors"
      >
        <Shield className="h-4 w-4" />
        {t.footer.privacy}
      </Link>
      <span className="hidden sm:inline">•</span>
      <a
        href="mailto:contact@movapass.net"
        className="flex items-center gap-2 hover:text-foreground transition-colors"
      >
        <Mail className="h-4 w-4" />
        {t.footer.contact}
      </a>
    </div>
  )
}

