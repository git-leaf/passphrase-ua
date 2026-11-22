"use client"

import { useSyncExternalStore } from "react"
import { WifiOff } from "lucide-react"
import { useI18n } from "@/lib/i18n"

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange)
  window.addEventListener("offline", onChange)
  return () => {
    window.removeEventListener("online", onChange)
    window.removeEventListener("offline", onChange)
  }
}

/** Shows that there's no connection; generating still works */
export function OfflineIndicator() {
  const { t } = useI18n()
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )
  if (online) return null

  return (
    <span role="status" className="mr-auto flex items-center gap-1 text-sm text-muted-foreground">
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      {t.header.offline}
    </span>
  )
}
