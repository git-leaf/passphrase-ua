import type { StrengthLevel } from "@/lib/strength/strength-analysis"

/** The background colour of each Strength level, shared by the strength meter and Learn */
export const LEVEL_COLORS: Record<StrengthLevel, string> = {
  weak: "bg-destructive",
  moderate: "bg-amber-500",
  strong: "bg-emerald-500",
  "very-strong": "bg-emerald-600",
  excessive: "bg-blue-500",
}
