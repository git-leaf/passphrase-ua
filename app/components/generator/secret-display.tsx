"use client"

import { useEffect, useEffectEvent, useSyncExternalStore } from "react"
import { Button } from "@/app/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"
import { useI18n } from "@/app/components/i18n-provider"
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

/** Apple keyboards use ⌘ where others use Ctrl */
const isApplePlatform = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform)
const neverChanges = () => () => {}

/** Whether a keydown is Ctrl+Enter or Cmd+Enter, accepted on every platform */
const isRegenerateShortcut = (event: KeyboardEvent) =>
  event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey

/**
 * Displays the latest Secret with copy and regenerate actions, plus strength metrics.
 * Ctrl+Enter (⌘+Enter on Apple devices) regenerates from anywhere on the page.
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
  const apple = useSyncExternalStore(neverChanges, isApplePlatform, () => false)

  const regenerateOnShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (!isRegenerateShortcut(event)) return
    // The shortcut is the app's, so the browser doesn't also act on it, e.g. on a focused button
    event.preventDefault()
    if (!event.repeat && !isRegenerating) onRegenerate()
  })
  useEffect(() => {
    const listener = (event: KeyboardEvent) => regenerateOnShortcut(event)
    document.addEventListener("keydown", listener)
    return () => document.removeEventListener("keydown", listener)
  }, [])

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
              aria-keyshortcuts={apple ? "Meta+Enter" : "Control+Enter"}
              title={t.output.regenerateWithShortcut.replace("{keys}", apple ? "⌘+Enter" : "Ctrl+Enter")}
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
