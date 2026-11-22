import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { describe, expect, it } from "vitest"

const SCRIPT = readFileSync("public/theme.js", "utf8")

/**
 * Runs public/theme.js the way the browser does before the first paint, with the
 * stored theme (or storage that throws) and the OS theme given, and returns the
 * classes it leaves on <html>
 */
function runThemeScript({ stored, blocked = false, osDark }: { stored?: string; blocked?: boolean; osDark: boolean }) {
  const classes = new Set<string>()
  // The global object is the window, so reading localStorage throws where storage is blocked
  const window = {
    get window() {
      return window
    },
    get localStorage() {
      if (blocked) throw new DOMException("The operation is insecure.", "SecurityError")
      return { getItem: (key: string) => (key === "theme" ? (stored ?? null) : null) }
    },
    matchMedia: (query: string) => ({ matches: query === "(prefers-color-scheme: dark)" && osDark }),
    document: { documentElement: { classList: { add: (name: string) => classes.add(name) } } },
  }
  runInNewContext(SCRIPT, window)
  return [...classes]
}

describe("theme script", () => {
  it("applies the stored theme over the OS theme", () => {
    expect(runThemeScript({ stored: "dark", osDark: false })).toEqual(["dark"])
    expect(runThemeScript({ stored: "light", osDark: true })).toEqual(["light"])
  })

  it("follows the OS theme when the stored theme is system", () => {
    expect(runThemeScript({ stored: "system", osDark: true })).toEqual(["dark"])
    expect(runThemeScript({ stored: "system", osDark: false })).toEqual(["light"])
  })

  it("follows the OS theme when nothing is stored", () => {
    expect(runThemeScript({ osDark: true })).toEqual(["dark"])
  })

  it("ignores an invalid stored theme", () => {
    expect(runThemeScript({ stored: "purple", osDark: true })).toEqual(["dark"])
  })

  it("follows the OS theme when storage is blocked", () => {
    expect(runThemeScript({ blocked: true, osDark: true })).toEqual(["dark"])
  })
})
