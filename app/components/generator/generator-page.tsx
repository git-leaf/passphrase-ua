"use client"

import Image from "next/image"
import { Card, CardContent } from "@/app/components/ui/card"
import { useToast } from "@/app/hooks/use-toast"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { LanguageToggle } from "@/app/components/language-toggle"
import { OfflineIndicator } from "@/app/components/offline-indicator"
import { useI18n } from "@/app/components/i18n-provider"
import { useGeneratorSession } from "@/app/hooks/use-generator-session"

// Generator components
import { MethodSelector, type GeneratorView } from "@/app/components/generator/method-selector"
import { PasswordOptions } from "@/app/components/generator/password-options"
import { PassphraseOptions } from "@/app/components/generator/passphrase-options"
import { OutputDisplay } from "@/app/components/generator/output-display"

// Learn components
import { LearnContent } from "@/app/components/learn/learn-content"

// Footer components
import { DonationSection } from "@/app/components/footer/donation-section"
import { FooterLinks } from "@/app/components/footer/footer-links"

/**
 * A page of the generator: the Passphrase generator, the Password generator or Learn.
 * The Generator session outlives the page, so each Generation method keeps its
 * options and latest Secret while the visitor moves between them.
 */
export function GeneratorPage({ page }: { page: GeneratorView }) {
  const { toast } = useToast()
  const { t } = useI18n()
  const method = page === "learn" ? null : page
  const { state, session } = useGeneratorSession(method, (code) => {
    toast({
      title: t.toast.error,
      description: t.toast.generatorErrors[code],
      variant: "destructive",
    })
  })

  const secret = method && state[method].secret

  const copyToClipboard = async (secret: string) => {
    try {
      await navigator.clipboard.writeText(secret)
      toast({
        title: t.toast.copied,
        description: t.toast.copiedDescription,
      })
    } catch {
      toast({
        title: t.toast.error,
        description: t.toast.copyFailed,
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-end gap-2">
            <OfflineIndicator />
            <LanguageToggle page={page} />
            <ThemeToggle />
          </div>
          <div className="mb-2 flex items-center justify-center gap-2">
            {/* Decorative: the heading beside it already names the app, in the visitor's language */}
            <Image src="/logo.svg" alt="" width={48} height={48} className="text-primary" priority />
            <h1 className="text-4xl font-bold tracking-tight">{t.header.title}</h1>
          </div>
          <p className="text-muted-foreground">{t.header.subtitle}</p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            <MethodSelector current={page} />

            <div className="space-y-6">
              {page === "passphrase" && (
                <PassphraseOptions
                  options={state.passphrase.options}
                  pending={state.passphrase.pending}
                  onChange={session.updatePassphraseOptions}
                  onLanguageChange={session.setWordlistLanguage}
                  onGenerate={() => session.generate("passphrase")}
                />
              )}

              {page === "password" && (
                <PasswordOptions
                  options={state.password.options}
                  onChange={session.updatePasswordOptions}
                  onGenerate={() => session.generate("password")}
                />
              )}

              {page === "learn" && <LearnContent />}

              {method && secret && (
                <OutputDisplay
                  secret={secret.secret}
                  entropy={secret.entropy}
                  onCopy={() => copyToClipboard(secret.secret)}
                  onRegenerate={() => session.generate(method)}
                  isRegenerating={method === "passphrase" && state.passphrase.pending}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <p className="mt-6 text-center text-xs text-muted-foreground">{t.footer.securityNotice}</p>

        {/* Footer */}
        <footer className="mt-8 border-t pt-6 space-y-6">
          <DonationSection />
          <FooterLinks />
        </footer>
      </div>
    </main>
  )
}
