"use client"

import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Slider } from "@/app/components/ui/slider"
import { Switch } from "@/app/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/lib/i18n"
import { RefreshCw } from "lucide-react"

interface PasswordOptionsProps {
  // Configuration state
  length: number[]
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean
  isGenerating?: boolean

  // State setters
  onLengthChange: (value: number[]) => void
  onUppercaseChange: (checked: boolean) => void
  onLowercaseChange: (checked: boolean) => void
  onNumbersChange: (checked: boolean) => void
  onSymbolsChange: (checked: boolean) => void
  onAmbiguousChange: (checked: boolean) => void

  // Actions
  onGenerate: () => void
}

/**
 * Password generation configuration panel with primary and advanced options
 */
export function PasswordOptions({
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols,
  excludeAmbiguous,
  isGenerating = false,
  onLengthChange,
  onUppercaseChange,
  onLowercaseChange,
  onNumbersChange,
  onSymbolsChange,
  onAmbiguousChange,
  onGenerate,
}: PasswordOptionsProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      {/* Primary Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t.password.length}</Label>
            <span className="text-sm font-medium">{length[0]}</span>
          </div>
          <Slider
            value={length}
            onValueChange={onLengthChange}
            min={8}
            max={64}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="uppercase">{t.password.uppercase}</Label>
            <Switch id="uppercase" checked={includeUppercase} onCheckedChange={onUppercaseChange} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="lowercase">{t.password.lowercase}</Label>
            <Switch id="lowercase" checked={includeLowercase} onCheckedChange={onLowercaseChange} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="numbers">{t.password.numbers}</Label>
            <Switch id="numbers" checked={includeNumbers} onCheckedChange={onNumbersChange} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="symbols">{t.password.symbols}</Label>
            <Switch id="symbols" checked={includeSymbols} onCheckedChange={onSymbolsChange} />
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <Accordion type="single" collapsible className="border-t pt-2">
        <AccordionItem value="advanced" className="border-none">
          <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
            {t.password.advancedOptions}
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="ambiguous">
                {t.password.excludeAmbiguous} {t.password.excludeAmbiguousDetail}
              </Label>
              <Switch id="ambiguous" checked={excludeAmbiguous} onCheckedChange={onAmbiguousChange} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Generate Button */}
      <Button onClick={onGenerate} size="lg" className="w-full text-lg" disabled={isGenerating}>
        <RefreshCw className={`mr-2 h-5 w-5 ${isGenerating ? "animate-spin" : ""}`} />
        {isGenerating ? t.password.generating : t.password.generate}
      </Button>
    </div>
  )
}

