"use client"

import { useState } from "react"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/lib/i18n"
import {
  analyzeStrength,
  ATTACKER_PRESETS,
  DEFAULT_ATTACKER,
  type StrengthLevel,
} from "@/lib/strength/strength-analysis"

interface StrengthMeterProps {
  entropy: number
}

const LEVEL_COLORS: Record<StrengthLevel, string> = {
  weak: "bg-destructive",
  moderate: "bg-amber-500",
  strong: "bg-emerald-500",
  "very-strong": "bg-emerald-600",
  excessive: "bg-blue-500",
}

/** A preset value, or the custom input; an empty custom input falls back to the default. */
function attackerValue(selected: string, custom: string, fallback: number): number {
  if (selected !== "custom") return Number(selected)
  return custom.trim() === "" ? fallback : Number(custom)
}

/**
 * Displays password strength metrics including entropy, combinations, time to crack, and cost
 */
export function StrengthMeter({ entropy }: StrengthMeterProps) {
  const { t, locale } = useI18n()
  const [guessRate, setGuessRate] = useState(String(DEFAULT_ATTACKER.guessesPerSecond))
  const [customGuessRate, setCustomGuessRate] = useState("")
  const [costPer32, setCostPer32] = useState(String(DEFAULT_ATTACKER.costPer2pow32))
  const [customCostPer32, setCustomCostPer32] = useState("")

  const analysis = analyzeStrength(
    entropy,
    {
      guessesPerSecond: attackerValue(guessRate, customGuessRate, DEFAULT_ATTACKER.guessesPerSecond),
      costPer2pow32: attackerValue(costPer32, customCostPer32, DEFAULT_ATTACKER.costPer2pow32),
    },
    locale,
  )

  const levelLabels: Record<StrengthLevel, string> = {
    weak: t.output.strength.weak,
    moderate: t.output.strength.moderate,
    strong: t.output.strength.strong,
    "very-strong": t.output.strength.veryStrong,
    excessive: t.output.strength.excessive,
  }
  const guessRateLabels = [
    t.output.guessRateMillion,
    t.output.guessRateBillion,
    t.output.guessRateTrillion,
    t.output.guessRateQuadrillion,
  ]

  return (
    <div className="space-y-4 border-t pt-4">
      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.output.strengthLabel}</span>
          <span className="font-medium">{levelLabels[analysis.level]}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full transition-all duration-500 ${LEVEL_COLORS[analysis.level]}`}
            style={{ width: `${analysis.percentage}%` }}
          />
        </div>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">{t.output.entropy}</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{analysis.entropy}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">{t.output.combinations}</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{analysis.combinations}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">
            {t.output.timeToCrack} ({t.output.avgTime})
          </p>
          <p className="font-mono font-medium text-xs sm:text-sm">{analysis.timeToCrack}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">
            {t.output.costToCrack} ({t.output.avgTime})
          </p>
          <p className="font-mono font-medium text-xs sm:text-sm">{analysis.costToCrack}</p>
        </div>
      </div>

      {/* Configurable Metrics */}
      <Accordion type="single" collapsible className="border-t pt-2">
        <AccordionItem value="metrics-config" className="border-none">
          <AccordionTrigger level={2} className="text-sm text-muted-foreground hover:no-underline">
            {t.output.configureMetrics}
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guess-rate">{t.output.guessRate}</Label>
                <Select value={guessRate} onValueChange={setGuessRate}>
                  <SelectTrigger id="guess-rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ATTACKER_PRESETS.guessesPerSecond.map((rate, i) => (
                      <SelectItem key={rate} value={String(rate)}>
                        {guessRateLabels[i]}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">{t.output.guessRateCustom}</SelectItem>
                  </SelectContent>
                </Select>
                {guessRate === "custom" && (
                  <Input
                    type="number"
                    placeholder={t.output.enterGuessRate}
                    value={customGuessRate}
                    onChange={(e) => setCustomGuessRate(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost-per-32">{t.output.costPer32}</Label>
                <Select value={costPer32} onValueChange={setCostPer32}>
                  <SelectTrigger id="cost-per-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ATTACKER_PRESETS.costPer2pow32.map((cost) => (
                      <SelectItem key={cost} value={String(cost)}>
                        $
                        {new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(
                          cost,
                        )}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">{t.output.guessRateCustom}</SelectItem>
                  </SelectContent>
                </Select>
                {costPer32 === "custom" && (
                  <Input
                    type="number"
                    step="0.001"
                    placeholder={t.output.enterCost}
                    value={customCostPer32}
                    onChange={(e) => setCustomCostPer32(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
