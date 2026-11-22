import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

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
    coverage: {
      provider: "v8",
      include: ["lib/**"],
      thresholds: { lines: 90 },
    },
  },
})
