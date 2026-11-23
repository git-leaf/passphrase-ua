"use client"

import { useEffect, useEffectEvent, useSyncExternalStore } from "react"

/** Apple keyboards use ⌘ where others use Ctrl */
const usesCommandKey = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform)
const subscribeNever = () => () => {}

/**
 * Whether a keydown is Ctrl+Enter or Cmd+Enter, accepted on every platform, that the app may take:
 * not one another widget handled, one finishing an IME composition, or one opening a link in a new tab
 */
function isRegenerateShortcut(event: KeyboardEvent) {
  if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return false
  if (event.defaultPrevented || event.isComposing) return false
  return !(event.target instanceof Element && event.target.closest("a[href]"))
}

/**
 * Calls `regenerate` on Ctrl+Enter (⌘+Enter on Apple devices) from anywhere on the page;
 * `null` turns the shortcut off. A held key regenerates once.
 */
export function useRegenerateShortcut(regenerate: (() => void) | null) {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!regenerate || !isRegenerateShortcut(event)) return
    // The shortcut is the app's, so the browser doesn't also act on it, e.g. on a focused button
    event.preventDefault()
    if (!event.repeat) regenerate()
  })
  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event)
    document.addEventListener("keydown", listener)
    return () => document.removeEventListener("keydown", listener)
  }, [])
}

/** The shortcut's keys on this device: as `aria-keyshortcuts` names them, and as shown to the visitor */
export function useRegenerateShortcutKeys() {
  const command = useSyncExternalStore(subscribeNever, usesCommandKey, () => false)
  return command ? { aria: "Meta+Enter", label: "⌘+Enter" } : { aria: "Control+Enter", label: "Ctrl+Enter" }
}
