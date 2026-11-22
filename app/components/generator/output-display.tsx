"use client"

import { Button } from "@/app/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { StrengthMeter } from "./strength-meter"

interface OutputDisplayProps {
  secret: string
  entropy: number
  onCopy: () => void
  onRegenerate: () => void
  isRegenerating?: boolean
}

/**
 * Displays generated password/passphrase with copy and regenerate actions, plus strength metrics
 */
export function OutputDisplay({ secret, entropy, onCopy, onRegenerate, isRegenerating = false }: OutputDisplayProps) {
  const { t } = useI18n()

  return (
    <div className="mt-8 space-y-4 rounded-lg border-2 bg-muted/30 p-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <code className="break-all text-lg font-mono leading-relaxed">{secret}</code>
          <div className="flex shrink-0 gap-2">
            <Button size="icon" variant="ghost" onClick={onCopy} className="h-8 w-8" aria-label={t.output.copy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onRegenerate}
              className="h-8 w-8"
              disabled={isRegenerating}
              aria-label={t.output.regenerate}
            >
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Strength Meter with all metrics */}
      <StrengthMeter entropy={entropy} />
    </div>
  )
}
