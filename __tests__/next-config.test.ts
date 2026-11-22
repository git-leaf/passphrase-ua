import { afterEach, describe, expect, it, vi } from "vitest"
import nextConfig from "@/next.config"

async function pageHeaders(nodeEnv: "production" | "development") {
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
    expect(scriptSrc(await pageHeaders("production"))).toBe("script-src 'self' 'unsafe-inline'")
    expect(scriptSrc(await pageHeaders("development"))).toBe("script-src 'self' 'unsafe-inline' 'unsafe-eval'")
  })

  it("keeps other sites from holding a reference to the page or embedding its files", async () => {
    const headers = await pageHeaders("production")

    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin")
    expect(headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin")
  })

  it("drops the retired XSS auditor and opts out of Topics instead of FLoC", async () => {
    const headers = await pageHeaders("production")

    expect(headers.has("X-XSS-Protection")).toBe(false)
    expect(headers.get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=(), browsing-topics=()")
  })

  it("asks to be preloaded as HTTPS-only, subdomains included", async () => {
    expect((await pageHeaders("production")).get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains; preload",
    )
  })
})
