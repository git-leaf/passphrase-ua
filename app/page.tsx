"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/app/components/ui/card"
import { TabsContent } from "@/app/components/ui/tabs"
import { useToast } from "@/app/hooks/use-toast"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { LanguageToggle } from "@/app/components/language-toggle"
import { useI18n } from "@/lib/i18n"
import { 
  generatePassword, 
  type PasswordConfig 
} from "@/lib/generators/password"
import {
  generatePassphraseWithWordlist,
  type CapitalizationStyle
} from "@/lib/generators/passphrase"

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

  // Password options
  const [passwordLength, setPasswordLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  // Passphrase options
  const [wordCount, setWordCount] = useState([6])
  const [separator, setSeparator] = useState("-")
  const [customSeparator, setCustomSeparator] = useState("")
  const [capitalization, setCapitalization] = useState<CapitalizationStyle>("none")
  const [includeNumbers2, setIncludeNumbers2] = useState(false)
  const [sourceLanguage, setSourceLanguage] = useState<"en" | "uk">("uk")
  const [wordlist, setWordlist] = useState("wordlist")
  const [showTransliteration, setShowTransliteration] = useState(false)
  const [isGeneratingPassphrase, setIsGeneratingPassphrase] = useState(false)

  // Generated output
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [entropy, setEntropy] = useState(0)

  const handleGeneratePassword = () => {
    try {
      // Build configuration from UI state
      const config: PasswordConfig = {
        length: passwordLength[0],
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSymbols,
        excludeAmbiguous,
      }

      // Generate password using secure generator
      const result = generatePassword(config)

      // Update UI state
      setGeneratedPassword(result.password)
      setEntropy(result.entropy)
    } catch (error) {
      // Handle errors (e.g., invalid configuration)
      toast({
        title: t.toast.error,
        description: error instanceof Error ? error.message : t.toast.errorPassword,
        variant: "destructive",
      })
    }
  }

  const handleGeneratePassphrase = async () => {
    setIsGeneratingPassphrase(true)
    
    try {
      // Determine separator
      const actualSeparator = separator === "custom" ? customSeparator : separator

      // Generate passphrase using the secure generator
      const result = await generatePassphraseWithWordlist(
        sourceLanguage,
        wordlist,
        {
          wordCount: wordCount[0],
          separator: actualSeparator,
          capitalization,
          includeNumber: includeNumbers2,
          useTransliteration: showTransliteration,
        }
      )

      // Update UI state
      setGeneratedPassword(result.passphrase)
      setEntropy(result.entropy)
    } catch (error) {
      // Handle errors (e.g., wordlist loading failure)
      toast({
        title: t.toast.error,
        description: error instanceof Error ? error.message : t.toast.errorPassphrase,
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPassphrase(false)
    }
  }

  const handleSourceLanguageChange = (value: "en" | "uk") => {
    setSourceLanguage(value)
    // Reset to first available wordlist when language changes
    if (value === "en") {
      setWordlist("eff-large")
    } else {
      setWordlist("wordlist")
    }
  }

  const copyToClipboard = async () => {
    if (!generatedPassword) return
    
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available')
      }
      
      await navigator.clipboard.writeText(generatedPassword)
      toast({
        title: t.toast.copied,
        description: t.toast.copiedDescription,
      })
    } catch (error) {
      // Handle clipboard errors gracefully
      toast({
        title: t.toast.error,
        description: error instanceof Error ? error.message : 'Failed to copy to clipboard',
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
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="mb-2 flex items-center justify-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              width={64} 
              height={64}
              className="text-primary"
              priority
            />
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
                  length={passwordLength}
                  includeUppercase={includeUppercase}
                  includeLowercase={includeLowercase}
                  includeNumbers={includeNumbers}
                  includeSymbols={includeSymbols}
                  excludeAmbiguous={excludeAmbiguous}
                  onLengthChange={setPasswordLength}
                  onUppercaseChange={setIncludeUppercase}
                  onLowercaseChange={setIncludeLowercase}
                  onNumbersChange={setIncludeNumbers}
                  onSymbolsChange={setIncludeSymbols}
                  onAmbiguousChange={setExcludeAmbiguous}
                  onGenerate={handleGeneratePassword}
                />
              </TabsContent>

              {/* Passphrase Configuration */}
              <TabsContent value="passphrase" className="space-y-6">
                <PassphraseOptions
                  wordCount={wordCount}
                  sourceLanguage={sourceLanguage}
                  wordlist={wordlist}
                  separator={separator}
                  customSeparator={customSeparator}
                  capitalization={capitalization}
                  includeNumbers={includeNumbers2}
                  showTransliteration={showTransliteration}
                  isGenerating={isGeneratingPassphrase}
                  onWordCountChange={setWordCount}
                  onSourceLanguageChange={handleSourceLanguageChange}
                  onWordlistChange={setWordlist}
                  onSeparatorChange={setSeparator}
                  onCustomSeparatorChange={setCustomSeparator}
                  onCapitalizationChange={setCapitalization}
                  onIncludeNumbersChange={setIncludeNumbers2}
                  onShowTransliterationChange={setShowTransliteration}
                  onGenerate={handleGeneratePassphrase}
                />
              </TabsContent>

              {/* Learn Tab */}
              <TabsContent value="learn" className="space-y-6">
                <LearnContent />
              </TabsContent>

              {/* Output Display */}
              {generatedPassword && activeTab !== "learn" && (
                <OutputDisplay
                  password={generatedPassword}
                  entropy={entropy}
                  onCopy={copyToClipboard}
                  onRegenerate={activeTab === "password" ? handleGeneratePassword : handleGeneratePassphrase}
                  isRegenerating={activeTab === "passphrase" && isGeneratingPassphrase}
                />
              )}
            </MethodSelector>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t.footer.securityNotice}
        </p>

        {/* Footer */}
        <footer className="mt-8 border-t pt-6 space-y-6">
          <DonationSection />
          <FooterLinks />
        </footer>
      </div>
    </main>
  )
}