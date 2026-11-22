// Keeps Mova Pass working offline after the first visit (docs/adr/0011).
// Plain JavaScript with no build step, so what the browser runs is what you read here.
// Tests: app/__tests__/service-worker.test.ts

// Change the version when the caching rules change, so the old cache is cleared
const CACHE = "mova-pass-v1"

// Hashed build files referenced by a page, also inside escaped JSON
const BUILD_FILE = /\/_next\/static\/[^"'\s)\\]+/g

function isBuildFile(url) {
  return new URL(url, self.location.origin).pathname.startsWith("/_next/static/")
}

// Next.js makes a fresh query string for each navigation or prefetch; keeping those would only grow the cache
function isWorthKeeping(url) {
  return isBuildFile(url) || !new URL(url, self.location.origin).search
}

function isPage(response) {
  return response.headers.get("content-type")?.startsWith("text/html") ?? false
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name !== CACHE) await caches.delete(name)
      await self.clients.claim()
    })(),
  )
})

// The page sends what it needs offline: its pages, every Wordlist and the files it loaded.
// The message type is shared with app/components/offline-support.tsx.
self.addEventListener("message", (event) => {
  if (event.data?.type === "cache-for-offline") {
    event.waitUntil(cacheForOffline(event.data.urls))
  }
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return
  event.respondWith(isBuildFile(request.url) ? cacheFirst(request) : networkFirst(request))
})

async function cacheForOffline(urls) {
  const cache = await caches.open(CACHE)
  const pending = new Set(urls.filter(isWorthKeeping))
  let complete = true
  for (const url of pending) {
    // A build file never changes; anything else is checked with the server, which
    // answers "not modified" without a download when the browser's copy is current
    if (isBuildFile(url) && (await cache.match(url))) continue
    try {
      const response = await fetch(url, { cache: "no-cache" })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (isPage(response)) {
        for (const file of (await response.clone().text()).match(BUILD_FILE) ?? []) pending.add(file)
      }
      await cache.put(url, response)
    } catch {
      // One failed download mustn't stop the rest; the next visit tries again
      complete = false
    }
  }

  // Build files the current pages don't use belong to an older deploy. If a page couldn't
  // be refreshed, its older copy may still need them, so nothing is dropped this time.
  if (!complete) return
  const current = new Set([...pending].map((url) => new URL(url, self.location.origin).pathname))
  for (const request of await cache.keys()) {
    if (isBuildFile(request.url) && !current.has(new URL(request.url).pathname)) await cache.delete(request)
  }
}

async function fetchAndKeep(cache, request) {
  const response = await fetch(request)
  if (response.ok && isWorthKeeping(request.url)) await cache.put(request, response.clone())
  return response
}

// Build file names change with their content, so a cached copy is never stale
async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  return (await cache.match(request)) ?? fetchAndKeep(cache, request)
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    return await fetchAndKeep(cache, request)
  } catch (error) {
    const navigating = request.mode === "navigate"
    const cached =
      (await cache.match(request, { ignoreSearch: navigating })) ?? (navigating && (await cache.match("/")))
    if (cached) return cached
    throw error
  }
}
