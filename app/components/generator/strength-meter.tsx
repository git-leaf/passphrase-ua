"use client"

import { useState } from "react"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/lib/i18n"
import { 
  assessStrength, 
  calculateTimeToCrack, 
  calculateCostToCrack,
  calculateCombinations
} from "@/lib/generators/entropy"

interface StrengthMeterProps {
  entropy: number
}

/**
 * Displays password strength metrics including entropy, combinations, time to crack, and cost
 */
export function StrengthMeter({ entropy }: StrengthMeterProps) {
  const { t } = useI18n()
  const [guessRate, setGuessRate] = useState("1e12") // 1 trillion guesses/sec
  const [customGuessRate, setCustomGuessRate] = useState("")
  const [costPer32, setCostPer32] = useState("0.01") // $0.01 per 2^32 guesses
  const [customCostPer32, setCustomCostPer32] = useState("")

  const strengthAssessment = assessStrength(entropy)

  const getGuessRateValue = () => {
    if (guessRate === "custom") {
      return Number.parseFloat(customGuessRate) || 1e12
    }
    return Number.parseFloat(guessRate)
  }

  const getCostPer32Value = () => {
    if (costPer32 === "custom") {
      return Number.parseFloat(customCostPer32) || 0.01
    }
    return Number.parseFloat(costPer32)
  }

  const getTimeToCrackFormatted = () => {
    const rate = getGuessRateValue()
    const result = calculateTimeToCrack(entropy, rate)
    return result.formatted
  }

  const getCostToCrackFormatted = () => {
    const costPer = getCostPer32Value()
    const result = calculateCostToCrack(entropy, costPer)
    return result.formatted
  }

  const getCombinationsFormatted = () => {
    return calculateCombinations(entropy)
  }

  // Get translated strength label
  const getStrengthLabel = () => {
    if (entropy < 40) return t.output.strength.weak
    if (entropy < 60) return t.output.strength.moderate
    if (entropy < 80) return t.output.strength.strong
    return t.output.strength.veryStrong
  }

  return (
    <div className="space-y-4 border-t pt-4">
      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.output.strengthLabel}</span>
          <span className="font-medium">{getStrengthLabel()}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full transition-all duration-500 ${strengthAssessment.color}`}
            style={{ width: `${strengthAssessment.percentage}%` }}
          />
        </div>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">{t.output.entropy}</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{entropy.toFixed(2)} {t.output.bits}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">{t.output.combinations}</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{getCombinationsFormatted()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">{t.output.timeToCrack} ({t.output.avgTime})</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{getTimeToCrackFormatted()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">{t.output.costToCrack} ({t.output.avgTime})</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{getCostToCrackFormatted()}</p>
        </div>
      </div>

      {/* Configurable Metrics */}
      <Accordion type="single" collapsible className="border-t pt-2">
        <AccordionItem value="metrics-config" className="border-none">
          <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
            {t.output.configureMetrics}
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.output.guessRate}</Label>
                <Select value={guessRate} onValueChange={setGuessRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1e6">{t.output.guessRateMillion}</SelectItem>
                    <SelectItem value="1e9">{t.output.guessRateBillion}</SelectItem>
                    <SelectItem value="1e12">{t.output.guessRateTrillion}</SelectItem>
                    <SelectItem value="1e15">{t.output.guessRateQuadrillion}</SelectItem>
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
                <Label>{t.output.costPer32}</Label>
                <Select value={costPer32} onValueChange={setCostPer32}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.001">$0.001</SelectItem>
                    <SelectItem value="0.01">$0.01</SelectItem>
                    <SelectItem value="0.1">$0.10</SelectItem>
                    <SelectItem value="1">$1.00</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
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

