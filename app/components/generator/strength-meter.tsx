"use client"

import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/app/components/i18n-provider"
import { LEVEL_COLORS } from "@/app/components/strength-level-colors"
import { analyzeStrength, ATTACKER_PRESETS, type StrengthLevel } from "@/lib/strength/strength-analysis"
import {
  attackerModelOf,
  choosesDefaultAttacker,
  CUSTOM_ATTACKER_VALUE,
  type AttackerSettings,
} from "@/lib/strength/attacker-settings"

interface StrengthMeterProps {
  entropy: number
  attacker: AttackerSettings
  onAttackerChange: (patch: Partial<AttackerSettings>) => void
}

/**
 * Displays password strength metrics including entropy, combinations, time to crack, and cost
 */
export function StrengthMeter({ entropy, attacker, onAttackerChange }: StrengthMeterProps) {
  const { t, locale } = useI18n()
  const analysis = analyzeStrength(entropy, attackerModelOf(attacker), locale)

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

      {/* Configurable Metrics, open from the start when they aren't the defaults so the figures never rest on hidden values */}
      <Accordion
        type="single"
        collapsible
        defaultValue={choosesDefaultAttacker(attacker) ? undefined : "metrics-config"}
        className="border-t pt-2"
      >
        <AccordionItem value="metrics-config" className="border-none">
          <AccordionTrigger level={2} className="text-sm text-muted-foreground hover:no-underline">
            {t.output.configureMetrics}
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guess-rate">{t.output.guessRate}</Label>
                <Select value={attacker.guessRate} onValueChange={(guessRate) => onAttackerChange({ guessRate })}>
                  <SelectTrigger id="guess-rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ATTACKER_PRESETS.guessesPerSecond.map((rate, i) => (
                      <SelectItem key={rate} value={String(rate)}>
                        {guessRateLabels[i]}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_ATTACKER_VALUE}>{t.output.guessRateCustom}</SelectItem>
                  </SelectContent>
                </Select>
                {attacker.guessRate === CUSTOM_ATTACKER_VALUE && (
                  <Input
                    type="number"
                    placeholder={t.output.enterGuessRate}
                    value={attacker.customGuessRate}
                    onChange={(e) => onAttackerChange({ customGuessRate: e.target.value })}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost-per-32">{t.output.costPer32}</Label>
                <Select
                  value={attacker.costPer2pow32}
                  onValueChange={(costPer2pow32) => onAttackerChange({ costPer2pow32 })}
                >
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
                    <SelectItem value={CUSTOM_ATTACKER_VALUE}>{t.output.guessRateCustom}</SelectItem>
                  </SelectContent>
                </Select>
                {attacker.costPer2pow32 === CUSTOM_ATTACKER_VALUE && (
                  <Input
                    type="number"
                    step="0.001"
                    placeholder={t.output.enterCost}
                    value={attacker.customCostPer2pow32}
                    onChange={(e) => onAttackerChange({ customCostPer2pow32: e.target.value })}
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
