"use client"

import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Slider } from "@/app/components/ui/slider"
import { Switch } from "@/app/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/lib/i18n"
import { RefreshCw } from "lucide-react"
import { PASSWORD_LIMITS, type PasswordOptions as PasswordGeneratorOptions } from "@/lib/generators/password"

interface PasswordOptionsProps {
  options: PasswordGeneratorOptions
  onChange: (patch: Partial<PasswordGeneratorOptions>) => void
  onGenerate: () => void
}

type CharacterClass = "includeUppercase" | "includeLowercase" | "includeNumbers" | "includeSymbols"

/**
 * Password generation configuration panel with primary and advanced options
 */
export function PasswordOptions({ options, onChange, onGenerate }: PasswordOptionsProps) {
  const { t } = useI18n()

  const classes: { key: CharacterClass; id: string; label: string }[] = [
    { key: "includeUppercase", id: "uppercase", label: t.password.uppercase },
    { key: "includeLowercase", id: "lowercase", label: t.password.lowercase },
    { key: "includeNumbers", id: "numbers", label: t.password.numbers },
    { key: "includeSymbols", id: "symbols", label: t.password.symbols },
  ]
  // The last enabled class can't be switched off
  const enabledCount = classes.filter((c) => options[c.key]).length

  return (
    <div className="space-y-6">
      {/* Primary Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t.password.length}</Label>
            <span className="text-sm font-medium">{options.length}</span>
          </div>
          <Slider
            value={[options.length]}
            onValueChange={([length]) => onChange({ length })}
            min={PASSWORD_LIMITS.minLength}
            max={PASSWORD_LIMITS.maxLength}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {classes.map(({ key, id, label }) => (
            <div key={key} className="flex items-center justify-between space-x-2">
              <Label htmlFor={id}>{label}</Label>
              <Switch
                id={id}
                checked={options[key]}
                disabled={options[key] && enabledCount === 1}
                onCheckedChange={(checked) => onChange({ [key]: checked })}
              />
            </div>
          ))}
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
              <Switch
                id="ambiguous"
                checked={options.excludeAmbiguous}
                onCheckedChange={(excludeAmbiguous) => onChange({ excludeAmbiguous })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Generate Button */}
      <Button onClick={onGenerate} size="lg" className="w-full text-lg">
        <RefreshCw className="mr-2 h-5 w-5" />
        {t.password.generate}
      </Button>
    </div>
  )
}

