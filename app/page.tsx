"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/app/components/ui/card"
import { TabsContent } from "@/app/components/ui/tabs"
import { useToast } from "@/app/hooks/use-toast"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { LanguageToggle } from "@/app/components/language-toggle"
import { OfflineIndicator } from "@/app/components/offline-indicator"
import { useI18n } from "@/lib/i18n"
import { useGeneratorSession } from "@/app/hooks/use-generator-session"
import type { GenerationMethod } from "@/lib/generators/types"

// Generator components
import { MethodSelector } from "@/app/components/generator/method-selector"
import { PasswordOptions } from "@/app/components/generator/password-options"
import { PassphraseOptions } from "@/app/components/generator/passphrase-options"
import { OutputDisplay } from "@/app/components/generator/output-display"

// Learn components
import { LearnContent } from "@/app/components/learn/learn-content"

// Footer components
import { DonationSection } from "@/app/components/footer/donation-section"
import { FooterLinks } from "@/app/components/footer/footer-links"

export default function Home() {
  const { toast } = useToast()
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("password")
  const { state, session } = useGeneratorSession((code) => {
    toast({
      title: t.toast.error,
      description: t.toast.generatorErrors[code],
      variant: "destructive",
    })
  })

  const method: GenerationMethod | null = activeTab === "password" || activeTab === "passphrase" ? activeTab : null
  const output = method && state[method].output

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
            <LanguageToggle />
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
            {/* Method Selector with Tab Content */}
            <MethodSelector activeTab={activeTab} onTabChange={setActiveTab}>
              {/* Password Configuration */}
              <TabsContent value="password" className="space-y-6">
                <PasswordOptions
                  options={state.password.options}
                  onChange={session.updatePasswordOptions}
                  onGenerate={() => session.generate("password")}
                />
              </TabsContent>

              {/* Passphrase Configuration */}
              <TabsContent value="passphrase" className="space-y-6">
                <PassphraseOptions
                  options={state.passphrase.options}
                  pending={state.passphrase.pending}
                  onChange={session.updatePassphraseOptions}
                  onLanguageChange={session.setWordlistLanguage}
                  onGenerate={() => session.generate("passphrase")}
                />
              </TabsContent>

              {/* Learn Tab */}
              <TabsContent value="learn" className="space-y-6">
                <LearnContent />
              </TabsContent>

              {/* Output Display */}
              {method && output && (
                <OutputDisplay
                  secret={output.secret}
                  entropy={output.entropy}
                  onCopy={() => copyToClipboard(output.secret)}
                  onRegenerate={() => session.generate(method)}
                  isRegenerating={method === "passphrase" && state.passphrase.pending}
                />
              )}
            </MethodSelector>
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
