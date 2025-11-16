"use client"

import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Slider } from "@/app/components/ui/slider"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/lib/i18n"
import { RefreshCw } from "lucide-react"
import { AVAILABLE_WORDLISTS } from "@/lib/wordlists/types"
import type { CapitalizationStyle } from "@/lib/generators/passphrase"

interface PassphraseOptionsProps {
  // Configuration state
  wordCount: number[]
  sourceLanguage: "en" | "uk"
  wordlist: string
  separator: string
  customSeparator: string
  capitalization: CapitalizationStyle
  includeNumbers: boolean
  showTransliteration: boolean
  isGenerating: boolean

  // State setters
  onWordCountChange: (value: number[]) => void
  onSourceLanguageChange: (value: "en" | "uk") => void
  onWordlistChange: (value: string) => void
  onSeparatorChange: (value: string) => void
  onCustomSeparatorChange: (value: string) => void
  onCapitalizationChange: (value: CapitalizationStyle) => void
  onIncludeNumbersChange: (checked: boolean) => void
  onShowTransliterationChange: (checked: boolean) => void

  // Actions
  onGenerate: () => void
}

/**
 * Passphrase generation configuration panel with Diceware options
 */
export function PassphraseOptions({
  wordCount,
  sourceLanguage,
  wordlist,
  separator,
  customSeparator,
  capitalization,
  includeNumbers,
  showTransliteration,
  isGenerating,
  onWordCountChange,
  onSourceLanguageChange,
  onWordlistChange,
  onSeparatorChange,
  onCustomSeparatorChange,
  onCapitalizationChange,
  onIncludeNumbersChange,
  onShowTransliterationChange,
  onGenerate,
}: PassphraseOptionsProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      {/* Primary Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t.passphrase.wordCount}</Label>
            <span className="text-sm font-medium">{wordCount[0]} {t.passphrase.words}</span>
          </div>
          <Slider
            value={wordCount}
            onValueChange={onWordCountChange}
            min={3}
            max={12}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.passphrase.sourceLanguage}</Label>
            <Select 
              value={sourceLanguage} 
              onValueChange={onSourceLanguageChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="uk">Українська</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.passphrase.wordlist}</Label>
            <Select value={wordlist} onValueChange={onWordlistChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sourceLanguage === "en" && (
                  <>
                    <SelectItem value="eff-large">{t.wordlists.en["eff-large"]}</SelectItem>
                    <SelectItem value="eff-short">{t.wordlists.en["eff-short"]}</SelectItem>
                    <SelectItem value="eff-short-2">{t.wordlists.en["eff-short-2"]}</SelectItem>
                    <SelectItem value="original">{t.wordlists.en.original}</SelectItem>
                    <SelectItem value="beale">{t.wordlists.en.beale}</SelectItem>
                  </>
                )}
                {sourceLanguage === "uk" && (
                  <>
                    <SelectItem value="wordlist">{t.wordlists.uk.wordlist}</SelectItem>
                    <SelectItem value="small">{t.wordlists.uk["small-diceware"]}</SelectItem>
                    <SelectItem value="normal">{t.wordlists.uk["normal-diceware"]}</SelectItem>
                    <SelectItem value="large">{t.wordlists.uk["large-diceware"]}</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {sourceLanguage === "uk" && (
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="transliteration">{t.passphrase.useTransliteration}</Label>
              <Switch
                id="transliteration"
                checked={showTransliteration}
                onCheckedChange={onShowTransliterationChange}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t.passphrase.separator}</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "-", labelKey: "separatorDash" as const, symbol: "-" },
              { value: "_", labelKey: "separatorUnderscore" as const, symbol: "_" },
              { value: " ", labelKey: "separatorSpace" as const, symbol: "␣" },
              { value: ".", labelKey: "separatorPeriod" as const, symbol: "." },
              { value: "", labelKey: "separatorNone" as const, symbol: "∅" },
              { value: "custom", labelKey: "separatorCustom" as const, symbol: "..." },
            ].map((sep) => (
              <Button
                key={sep.value}
                variant={separator === sep.value ? "default" : "outline"}
                size="sm"
                onClick={() => onSeparatorChange(sep.value)}
                className="w-full"
              >
                {t.passphrase[sep.labelKey]} <span className="ml-1">{sep.symbol}</span>
              </Button>
            ))}
          </div>
          {separator === "custom" && (
            <Input
              placeholder={t.passphrase.customSeparatorPlaceholder}
              value={customSeparator}
              onChange={(e) => onCustomSeparatorChange(e.target.value)}
              maxLength={3}
              className="mt-2"
            />
          )}
        </div>

      </div>

      {/* Advanced Options */}
      <Accordion type="single" collapsible className="border-t pt-2">
        <AccordionItem value="advanced" className="border-none">
          <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
            {t.passphrase.advancedOptions}
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t.passphrase.capitalization}</Label>
              <Select value={capitalization} onValueChange={onCapitalizationChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t.passphrase.capNone}</SelectItem>
                  <SelectItem value="first">{t.passphrase.capFirst}</SelectItem>
                  <SelectItem value="random">{t.passphrase.capRandom}</SelectItem>
                  <SelectItem value="all">{t.passphrase.capAll}</SelectItem>
                  <SelectItem value="random-word">{t.passphrase.capRandomWord}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="numbers2">{t.passphrase.includeNumber}</Label>
                <Switch id="numbers2" checked={includeNumbers} onCheckedChange={onIncludeNumbersChange} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Generate Button */}
      <Button 
        onClick={onGenerate} 
        size="lg" 
        className="w-full text-lg"
        disabled={isGenerating}
      >
        <RefreshCw className={`mr-2 h-5 w-5 ${isGenerating ? "animate-spin" : ""}`} />
        {isGenerating ? t.passphrase.generating : t.passphrase.generate}
      </Button>
    </div>
  )
}

