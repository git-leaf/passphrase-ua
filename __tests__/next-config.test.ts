import { afterEach, describe, expect, it, vi } from "vitest"
import nextConfig from "@/next.config"

async function headersOfEveryRoute(nodeEnv: "production" | "development") {
  vi.stubEnv("NODE_ENV", nodeEnv)
  const rules = (await nextConfig.headers?.()) ?? []
  const rule = rules.find(({ source }) => source === "/:path*")
  return new Headers(rule?.headers.map(({ key, value }) => [key, value]))
}

function scriptSrc(headers: Headers) {
  const directives = headers.get("Content-Security-Policy")?.split("; ") ?? []
  return directives.find((directive) => directive.startsWith("script-src "))
}

describe("security headers", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("allows eval only in development, which needs it", async () => {
    expect(scriptSrc(await headersOfEveryRoute("production"))).toBe("script-src 'self' 'unsafe-inline'")
    expect(scriptSrc(await headersOfEveryRoute("development"))).toBe("script-src 'self' 'unsafe-inline' 'unsafe-eval'")
  })

  it("keeps other sites from holding a reference to the page or embedding its files", async () => {
    const headers = await headersOfEveryRoute("production")

    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin")
    expect(headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin")
  })

  it("sends no XSS auditor header and opts out of Topics", async () => {
    const headers = await headersOfEveryRoute("production")

    expect(headers.has("X-XSS-Protection")).toBe(false)
    expect(headers.get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=(), browsing-topics=()")
  })

  it("lets browsers keep the theme script, which blocks the first paint, for a day", async () => {
    const rules = (await nextConfig.headers?.()) ?? []
    const rule = rules.find(({ source }) => source === "/theme.js")

    expect(new Headers(rule?.headers.map(({ key, value }) => [key, value])).get("Cache-Control")).toBe(
      "public, max-age=86400",
    )
  })

  it("asks to be preloaded as HTTPS-only, subdomains included", async () => {
    expect((await headersOfEveryRoute("production")).get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains; preload",
    )
  })
})
