import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// The real-browser check of the built app (`pnpm check:browser`); vitest.config.mts leaves it out of `pnpm check`
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["__tests__/browser/**/*.test.ts"],
    // A page load with axe run once per section takes longer than a unit test
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
