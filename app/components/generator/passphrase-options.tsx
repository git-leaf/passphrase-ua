"use client"

import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Slider } from "@/app/components/ui/slider"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
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
  return (
    <div className="space-y-6">
      {/* Primary Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Number of Words</Label>
            <span className="text-sm font-medium">{wordCount[0]}</span>
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
            <Label>Source Language</Label>
            <Select 
              value={sourceLanguage} 
              onValueChange={onSourceLanguageChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="uk">Ukrainian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Wordlist</Label>
            <Select value={wordlist} onValueChange={onWordlistChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sourceLanguage === "en" && (
                  <>
                    <SelectItem value="eff-large">{AVAILABLE_WORDLISTS.en["eff-large"].description}</SelectItem>
                    <SelectItem value="eff-short">{AVAILABLE_WORDLISTS.en["eff-short"].description}</SelectItem>
                    <SelectItem value="eff-short-2">{AVAILABLE_WORDLISTS.en["eff-short-2"].description}</SelectItem>
                    <SelectItem value="original">{AVAILABLE_WORDLISTS.en.original.description}</SelectItem>
                    <SelectItem value="beale">{AVAILABLE_WORDLISTS.en.beale.description}</SelectItem>
                  </>
                )}
                {sourceLanguage === "uk" && (
                  <>
                    <SelectItem value="wordlist">{AVAILABLE_WORDLISTS.uk.wordlist.description}</SelectItem>
                    <SelectItem value="small">{AVAILABLE_WORDLISTS.uk.small.description}</SelectItem>
                    <SelectItem value="normal">{AVAILABLE_WORDLISTS.uk.normal.description}</SelectItem>
                    <SelectItem value="large">{AVAILABLE_WORDLISTS.uk.large.description}</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {sourceLanguage === "uk" && (
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="transliteration">Transliteration</Label>
              <Switch
                id="transliteration"
                checked={showTransliteration}
                onCheckedChange={onShowTransliterationChange}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Word Separator</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "-", label: "Dash", symbol: "-" },
              { value: "_", label: "Underscore", symbol: "_" },
              { value: " ", label: "Space", symbol: "␣" },
              { value: ".", label: "Period", symbol: "." },
              { value: "", label: "None", symbol: "∅" },
              { value: "custom", label: "Custom", symbol: "..." },
            ].map((sep) => (
              <Button
                key={sep.value}
                variant={separator === sep.value ? "default" : "outline"}
                size="sm"
                onClick={() => onSeparatorChange(sep.value)}
                className="w-full"
              >
                {sep.label} <span className="ml-1">{sep.symbol}</span>
              </Button>
            ))}
          </div>
          {separator === "custom" && (
            <Input
              placeholder="Enter separator (e.g., *, |)"
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
            Advanced Options
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Capitalization</Label>
              <Select value={capitalization} onValueChange={onCapitalizationChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (lowercase)</SelectItem>
                  <SelectItem value="first">First Letter</SelectItem>
                  <SelectItem value="random">Random Letter</SelectItem>
                  <SelectItem value="all">All Uppercase</SelectItem>
                  <SelectItem value="random-word">Random Word Uppercase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="numbers2">Add Numbers</Label>
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
        {isGenerating ? "Generating..." : "Generate Passphrase"}
      </Button>
    </div>
  )
}

