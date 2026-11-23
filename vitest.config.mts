import { fileURLToPath } from "node:url"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    // Component tests opt into jsdom with a @vitest-environment comment
    environment: "node",
    // The built app's real-browser check runs on its own: `pnpm check:browser`, vitest.browser.config.mts
    exclude: [...configDefaults.exclude, "__tests__/browser/**"],
    coverage: {
      provider: "v8",
      include: ["lib/**"],
      thresholds: { lines: 90 },
    },
  },
})
