// Keeps Mova Pass working offline after the first visit (docs/adr/0006).
// Plain JavaScript with no build step, so what the browser runs is what you read here.
// Tests: app/__tests__/service-worker.test.ts

const CACHE = "mova-pass"

// Hashed build files referenced by a page
const BUILD_FILE = /\/_next\/static\/[^"'\s)\\]+/g

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

// The page sends the URLs it needs offline: its pages, every Wordlist and the files it loaded
self.addEventListener("message", (event) => {
  if (event.data?.type === "cache-for-offline") {
    event.waitUntil(cacheForOffline(event.data.urls))
  }
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return
  const isBuildFile = new URL(request.url).pathname.startsWith("/_next/static/")
  event.respondWith(isBuildFile ? cacheFirst(request) : networkFirst(request))
})

async function cacheForOffline(urls) {
  const cache = await caches.open(CACHE)
  const pending = new Set(urls)
  for (const url of pending) {
    // Pages are fetched every time, so they bring the current build files; anything else already held is kept
    const cached = await cache.match(url)
    if (cached && !isPage(cached)) continue
    const response = await fetch(url)
    if (!response.ok) continue
    if (isPage(response)) {
      for (const file of (await response.clone().text()).match(BUILD_FILE) ?? []) pending.add(file)
    }
    await cache.put(url, response)
  }

  // Build files the current pages don't use belong to an older deploy
  const current = new Set([...pending].map((url) => new URL(url, self.location.origin).pathname))
  for (const request of await cache.keys()) {
    const { pathname } = new URL(request.url)
    if (pathname.startsWith("/_next/static/") && !current.has(pathname)) await cache.delete(request)
  }
}

function isPage(response) {
  return response.headers.get("content-type")?.startsWith("text/html") ?? false
}

// Build file names change with their content, so a cached copy is never stale
async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) await cache.put(request, response.clone())
  return response
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) await cache.put(request, response.clone())
    return response
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: request.mode === "navigate" })
    if (cached) return cached
    throw error
  }
}
