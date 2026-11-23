"use client"

import { Button } from "@/app/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"
import { useI18n } from "@/app/components/i18n-provider"
import { useRegenerateShortcutKeys } from "@/app/hooks/use-regenerate-shortcut"
import type { AttackerSettings } from "@/lib/strength/attacker-settings"
import { StrengthMeter } from "./strength-meter"

interface SecretDisplayProps {
  secret: string
  entropy: number
  attacker: AttackerSettings
  onAttackerChange: (patch: Partial<AttackerSettings>) => void
  onCopy: () => void
  onRegenerate: () => void
  isRegenerating?: boolean
}

/**
 * Displays the latest Secret with copy and regenerate actions, plus strength metrics.
 * The regenerate action names its keyboard shortcut.
 */
export function SecretDisplay({
  secret,
  entropy,
  attacker,
  onAttackerChange,
  onCopy,
  onRegenerate,
  isRegenerating = false,
}: SecretDisplayProps) {
  const { t } = useI18n()
  const shortcut = useRegenerateShortcutKeys()

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
              aria-keyshortcuts={shortcut.aria}
              title={t.output.regenerateWithShortcut.replace("{keys}", shortcut.label)}
            >
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Strength Meter with all metrics */}
      <StrengthMeter entropy={entropy} attacker={attacker} onAttackerChange={onAttackerChange} />
    </div>
  )
}
