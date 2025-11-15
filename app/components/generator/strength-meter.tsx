"use client"

import { useState } from "react"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
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

  return (
    <div className="space-y-4 border-t pt-4">
      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Strength</span>
          <span className="font-medium">{strengthAssessment.label}</span>
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
          <p className="text-muted-foreground">Entropy</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{entropy.toFixed(2)} bits</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Combinations</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{getCombinationsFormatted()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Time to Crack (avg)</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{getTimeToCrackFormatted()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Cost to Crack (avg)</p>
          <p className="font-mono font-medium text-xs sm:text-sm">{getCostToCrackFormatted()}</p>
        </div>
      </div>

      {/* Configurable Metrics */}
      <Accordion type="single" collapsible className="border-t pt-2">
        <AccordionItem value="metrics-config" className="border-none">
          <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
            Configure Metrics
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Guess Rate (guesses/sec)</Label>
                <Select value={guessRate} onValueChange={setGuessRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1e6">1 Million (10^6)</SelectItem>
                    <SelectItem value="1e9">1 Billion (10^9)</SelectItem>
                    <SelectItem value="1e12">1 Trillion (10^12)</SelectItem>
                    <SelectItem value="1e15">1 Quadrillion (10^15)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {guessRate === "custom" && (
                  <Input
                    type="number"
                    placeholder="Enter guesses per second"
                    value={customGuessRate}
                    onChange={(e) => setCustomGuessRate(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Cost per 2^32 Guesses ($)</Label>
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
                    placeholder="Enter cost per 2^32 guesses"
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

