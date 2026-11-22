"use client"

import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Slider } from "@/app/components/ui/slider"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/app/components/i18n-provider"
import { RefreshCw } from "lucide-react"
import { CAPITALIZATION_STYLES, PASSPHRASE_LIMITS, type CapitalizationStyle } from "@/lib/generators/passphrase"
import { CUSTOM_SEPARATOR, SEPARATOR_PRESETS, type PassphraseSettings } from "@/lib/session/generator-session"
import { wordlistIds, wordlistInfo, type WordlistChoice, type WordlistLanguage } from "@/lib/wordlists/catalogue"

interface PassphraseOptionsProps {
  options: PassphraseSettings
  /** How many words the shown Passphrase was drawn from, once known */
  wordPoolSize: number | null
  pending: boolean
  onChange: (patch: Partial<PassphraseSettings>) => void
  onLanguageChange: (language: WordlistLanguage) => void
  onGenerate: () => void
}

const SEPARATOR_LABELS = {
  "-": { labelKey: "separatorDash", symbol: "-" },
  _: { labelKey: "separatorUnderscore", symbol: "_" },
  " ": { labelKey: "separatorSpace", symbol: "␣" },
  ".": { labelKey: "separatorPeriod", symbol: "." },
  "": { labelKey: "separatorNone", symbol: "∅" },
  [CUSTOM_SEPARATOR]: { labelKey: "separatorCustom", symbol: "..." },
} as const satisfies Record<(typeof SEPARATOR_PRESETS)[number] | typeof CUSTOM_SEPARATOR, unknown>

const CAPITALIZATION_LABELS = {
  none: "capNone",
  first: "capFirst",
  random: "capRandom",
  all: "capAll",
  "random-word": "capRandomWord",
} as const satisfies Record<CapitalizationStyle, string>

const SEPARATOR_BUTTONS = ([...SEPARATOR_PRESETS, CUSTOM_SEPARATOR] as const).map((value) => ({
  value,
  ...SEPARATOR_LABELS[value],
}))

/**
 * Passphrase generation configuration panel with Diceware options
 */
export function PassphraseOptions({
  options,
  wordPoolSize,
  pending,
  onChange,
  onLanguageChange,
  onGenerate,
}: PassphraseOptionsProps) {
  const { t, locale } = useI18n()
  const { language, id: wordlistId } = options.wordlist
  const wordlistNames = t.wordlists[language] as Record<string, string>
  // No Separator is offered only where no word begins another
  const noneUnavailable = !wordlistInfo(options.wordlist).prefixFree

  return (
    <div className="space-y-6">
      {/* Primary Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label id="word-count">{t.passphrase.wordCount}</Label>
            <span className="text-sm font-medium">
              {options.wordCount} {t.passphrase.words}
            </span>
          </div>
          <Slider
            aria-labelledby="word-count"
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
            <Label htmlFor="wordlist-language">{t.passphrase.sourceLanguage}</Label>
            <Select value={language} onValueChange={(value) => onLanguageChange(value as WordlistLanguage)}>
              <SelectTrigger id="wordlist-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="uk">Українська</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wordlist">{t.passphrase.wordlist}</Label>
            <Select
              value={wordlistId}
              onValueChange={(id) => onChange({ wordlist: { language, id } as WordlistChoice })}
            >
              <SelectTrigger id="wordlist">
                {/* Only the chosen Wordlist's count is known: it depends on the options and the loaded words */}
                <SelectValue>
                  {wordPoolSize === null
                    ? wordlistNames[wordlistId]
                    : t.wordlists.withSize
                        .replace("{name}", wordlistNames[wordlistId])
                        .replace("{count}", new Intl.NumberFormat(locale).format(wordPoolSize))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {wordlistIds(language).map((id) => (
                  <SelectItem key={id} value={id}>
                    {wordlistNames[id]}
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
            {SEPARATOR_BUTTONS.map((sep) => (
              <Button
                key={sep.value}
                variant={options.separator === sep.value ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ separator: sep.value })}
                disabled={sep.value === "" && noneUnavailable}
                aria-describedby={sep.value === "" && noneUnavailable ? "separator-none-unavailable" : undefined}
                className="w-full"
              >
                {t.passphrase[sep.labelKey]} <span className="ml-1">{sep.symbol}</span>
              </Button>
            ))}
          </div>
          {noneUnavailable && (
            <p id="separator-none-unavailable" className="text-xs text-muted-foreground">
              {t.passphrase.separatorNoneUnavailable}
            </p>
          )}
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
          <AccordionTrigger level={2} className="text-sm text-muted-foreground hover:no-underline">
            {t.passphrase.advancedOptions}
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="capitalization">{t.passphrase.capitalization}</Label>
              <Select
                value={options.capitalization}
                onValueChange={(value) => onChange({ capitalization: value as CapitalizationStyle })}
              >
                <SelectTrigger id="capitalization">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAPITALIZATION_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {t.passphrase[CAPITALIZATION_LABELS[style]]}
                    </SelectItem>
                  ))}
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
