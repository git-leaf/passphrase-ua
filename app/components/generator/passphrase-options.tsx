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
import { PASSPHRASE_LIMITS, type CapitalizationStyle } from "@/lib/generators/passphrase"
import { CUSTOM_SEPARATOR, type PassphraseSettings } from "@/lib/session/generator-session"
import { wordlistIds, wordlistInfo, type WordlistChoice, type WordlistLanguage } from "@/lib/wordlists/catalogue"

interface PassphraseOptionsProps {
  options: PassphraseSettings
  pending: boolean
  onChange: (patch: Partial<PassphraseSettings>) => void
  onLanguageChange: (language: WordlistLanguage) => void
  onGenerate: () => void
}

const SEPARATOR_PRESETS = [
  { value: "-", labelKey: "separatorDash", symbol: "-" },
  { value: "_", labelKey: "separatorUnderscore", symbol: "_" },
  { value: " ", labelKey: "separatorSpace", symbol: "␣" },
  { value: ".", labelKey: "separatorPeriod", symbol: "." },
  { value: "", labelKey: "separatorNone", symbol: "∅" },
  { value: CUSTOM_SEPARATOR, labelKey: "separatorCustom", symbol: "..." },
] as const

/**
 * Passphrase generation configuration panel with Diceware options
 */
export function PassphraseOptions({
  options,
  pending,
  onChange,
  onLanguageChange,
  onGenerate,
}: PassphraseOptionsProps) {
  const { t, locale } = useI18n()
  const { language, id: wordlistId } = options.wordlist
  const wordlistNames = t.wordlists[language] as Record<string, string>

  return (
    <div className="space-y-6">
      {/* Primary Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t.passphrase.wordCount}</Label>
            <span className="text-sm font-medium">
              {options.wordCount} {t.passphrase.words}
            </span>
          </div>
          <Slider
            value={[options.wordCount]}
            onValueChange={([wordCount]) => onChange({ wordCount })}
            min={PASSPHRASE_LIMITS.minWords}
            max={PASSPHRASE_LIMITS.maxWords}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.passphrase.sourceLanguage}</Label>
            <Select value={language} onValueChange={(value) => onLanguageChange(value as WordlistLanguage)}>
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
            <Select
              value={wordlistId}
              onValueChange={(id) => onChange({ wordlist: { language, id } as WordlistChoice })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {wordlistIds(language).map((id) => (
                  <SelectItem key={id} value={id}>
                    {t.wordlists.withSize
                      .replace("{name}", wordlistNames[id])
                      .replace(
                        "{count}",
                        new Intl.NumberFormat(locale).format(wordlistInfo({ language, id } as WordlistChoice).size),
                      )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {wordlistInfo(options.wordlist).transliteration && (
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="transliteration">{t.passphrase.useTransliteration}</Label>
              <Switch
                id="transliteration"
                checked={options.useTransliteration}
                onCheckedChange={(useTransliteration) => onChange({ useTransliteration })}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t.passphrase.separator}</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SEPARATOR_PRESETS.map((sep) => (
              <Button
                key={sep.value}
                variant={options.separator === sep.value ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ separator: sep.value })}
                className="w-full"
              >
                {t.passphrase[sep.labelKey]} <span className="ml-1">{sep.symbol}</span>
              </Button>
            ))}
          </div>
          {options.separator === CUSTOM_SEPARATOR && (
            <Input
              placeholder={t.passphrase.customSeparatorPlaceholder}
              value={options.customSeparator}
              onChange={(e) => onChange({ customSeparator: e.target.value })}
              maxLength={PASSPHRASE_LIMITS.maxSeparatorLength}
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
              <Select
                value={options.capitalization}
                onValueChange={(value) => onChange({ capitalization: value as CapitalizationStyle })}
              >
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
                <Label htmlFor="passphrase-number">{t.passphrase.includeNumber}</Label>
                <Switch
                  id="passphrase-number"
                  checked={options.includeNumber}
                  onCheckedChange={(includeNumber) => onChange({ includeNumber })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Generate Button */}
      <Button onClick={onGenerate} size="lg" className="w-full text-lg" disabled={pending}>
        <RefreshCw className={`mr-2 h-5 w-5 ${pending ? "animate-spin" : ""}`} />
        {pending ? t.passphrase.generating : t.passphrase.generate}
      </Button>
    </div>
  )
}
