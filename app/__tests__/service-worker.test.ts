import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { beforeEach, describe, expect, it } from "vitest"

const ORIGIN = "https://movapass.net"
const SCRIPT = readFileSync("public/sw.js", "utf8")

type Listener = (event: FakeEvent) => void
interface FakeEvent {
  request?: Request
  data?: unknown
  respondWith?: (response: Promise<Response> | Response) => void
  waitUntil: (promise: Promise<unknown>) => void
}

/** Cache Storage as the browser provides it, kept in memory */
function fakeCacheStorage() {
  const stores = new Map<string, Map<string, Response>>()
  const key = (request: RequestInfo | URL) =>
    new URL(request instanceof Request ? request.url : String(request), ORIGIN)
  const cache = (store: Map<string, Response>) => ({
    async match(request: RequestInfo | URL, options?: { ignoreSearch?: boolean }) {
      const url = key(request)
      if (options?.ignoreSearch) url.search = ""
      return store.get(url.href)?.clone()
    },
    async put(request: RequestInfo | URL, response: Response) {
      store.set(key(request).href, response.clone())
    },
    async delete(request: RequestInfo | URL) {
      return store.delete(key(request).href)
    },
    async keys() {
      return [...store.keys()].map((url) => new Request(url))
    },
  })
  return {
    async open(name: string) {
      if (!stores.has(name)) stores.set(name, new Map())
      return cache(stores.get(name)!)
    },
    async keys() {
      return [...stores.keys()]
    },
    async delete(name: string) {
      return stores.delete(name)
    },
  }
}

/** A network that serves fixed files, can go offline and counts requests */
function fakeNetwork() {
  const files = new Map<string, string>()
  const requests: string[] = []
  let online = true
  return {
    files,
    requests,
    goOffline: () => (online = false),
    async fetch(input: RequestInfo | URL) {
      const url = new URL(input instanceof Request ? input.url : String(input), ORIGIN)
      if (!online) throw new TypeError("Failed to fetch")
      requests.push(url.pathname)
      const body = files.get(url.pathname)
      if (body === undefined) return new Response("Not found", { status: 404 })
      // Pages are the paths without a file extension
      return new Response(body, { headers: url.pathname.includes(".") ? {} : { "content-type": "text/html" } })
    },
  }
}

/** Runs public/sw.js the way a browser does, and drives it through its events */
function startServiceWorker() {
  const listeners = new Map<string, Listener>()
  const network = fakeNetwork()
  const self = {
    location: { origin: ORIGIN },
    addEventListener: (type: string, listener: Listener) => listeners.set(type, listener),
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  }
  runInNewContext(SCRIPT, {
    self,
    caches: fakeCacheStorage(),
    fetch: network.fetch,
    Request,
    Response,
    URL,
    Promise,
  })

  async function dispatch(type: string, init: Partial<FakeEvent> = {}) {
    const pending: Promise<unknown>[] = []
    let response: Promise<Response> | Response | undefined
    listeners.get(type)?.({
      ...init,
      waitUntil: (promise) => pending.push(promise),
      respondWith: (r) => (response = r),
    })
    await Promise.all(pending)
    return response
  }

  return {
    network,
    async install() {
      await dispatch("install")
      await dispatch("activate")
    },
    /** What the page sends once the worker is ready */
    async cacheForOffline(urls: string[]) {
      await dispatch("message", { data: { type: "cache-for-offline", urls } })
    },
    /** Fetches through the worker; falls back to the network when it doesn't respond */
    async fetch(path: string, mode: RequestMode = "no-cors") {
      const request = new Request(ORIGIN + path, mode === "navigate" ? {} : { mode })
      if (mode === "navigate") Object.defineProperty(request, "mode", { value: "navigate" })
      const response = await dispatch("fetch", { request })
      return response ? await response : network.fetch(request)
    },
  }
}

const PAGE = `<html><script src="/_next/static/chunks/app.js"></script><link rel="stylesheet" href="/_next/static/css/app.css"></html>`

describe("service worker", () => {
  let worker: ReturnType<typeof startServiceWorker>

  beforeEach(() => {
    worker = startServiceWorker()
    worker.network.files.set("/", PAGE)
    worker.network.files.set("/_next/static/chunks/app.js", "app()")
    worker.network.files.set("/_next/static/css/app.css", "body{}")
    worker.network.files.set("/wordlists/uk/wordlist.txt", "абажур abazhur")
  })

  it("serves the page, its scripts and the Wordlists offline after the page hands them over", async () => {
    await worker.install()
    await worker.cacheForOffline(["/", "/wordlists/uk/wordlist.txt"])
    worker.network.goOffline()

    expect(await (await worker.fetch("/", "navigate")).text()).toBe(PAGE)
    expect(await (await worker.fetch("/_next/static/chunks/app.js")).text()).toBe("app()")
    expect(await (await worker.fetch("/_next/static/css/app.css")).text()).toBe("body{}")
    expect(await (await worker.fetch("/wordlists/uk/wordlist.txt")).text()).toBe("абажур abazhur")
  })

  it("serves build files from the cache without asking the network, since their names change with their content", async () => {
    await worker.install()
    await worker.cacheForOffline(["/"])
    worker.network.requests.length = 0

    expect(await (await worker.fetch("/_next/static/chunks/app.js")).text()).toBe("app()")
    expect(worker.network.requests).toEqual([])
  })

  it("doesn't download a Wordlist again when the page hands it over on a later visit", async () => {
    await worker.install()
    await worker.cacheForOffline(["/", "/wordlists/uk/wordlist.txt"])
    worker.network.requests.length = 0

    await worker.cacheForOffline(["/", "/wordlists/uk/wordlist.txt"])

    expect(worker.network.requests).not.toContain("/wordlists/uk/wordlist.txt")
  })

  it("drops an old deploy's build files once the page of a new deploy is handed over", async () => {
    await worker.install()
    await worker.cacheForOffline(["/"])
    worker.network.files.set("/", `<html><script src="/_next/static/chunks/app-2.js"></script></html>`)
    worker.network.files.set("/_next/static/chunks/app-2.js", "app2()")

    await worker.cacheForOffline(["/"])
    worker.network.goOffline()

    expect(await (await worker.fetch("/_next/static/chunks/app-2.js")).text()).toBe("app2()")
    await expect(worker.fetch("/_next/static/chunks/app.js")).rejects.toThrow()
  })

  it("shows the newest deploy to a returning visitor who is online", async () => {
    await worker.install()
    await worker.cacheForOffline(["/"])
    const newPage = `<html><script src="/_next/static/chunks/app-2.js"></script></html>`
    worker.network.files.set("/", newPage)

    expect(await (await worker.fetch("/", "navigate")).text()).toBe(newPage)
  })
})
