import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // One 404 page for the whole app, which has a root layout per language (docs/adr/0012)
    // https://nextjs.org/docs/app/api-reference/file-conventions/not-found#global-not-foundjs-experimental
    globalNotFound: true,
  },
  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js's inline scripts need unsafe-inline (docs/adr/0014); only React in development uses eval
              // https://nextjs.org/docs/app/guides/content-security-policy
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline'", // Tailwind/shadcn requires unsafe-inline
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "worker-src 'self'", // the offline service worker, public/sw.js
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Windows of other sites get no handle on this one
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            // Other sites' pages can't embed its files (servers can still fetch them)
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        // Browsers check for a new service worker on every visit; never serve a stale one
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ]
  },
}

export default nextConfig
