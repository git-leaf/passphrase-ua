/**
 * Headless Chrome driven over the Chrome DevTools Protocol with Node's built-in WebSocket,
 * so the browser check needs no browser-automation dependency.
 * https://chromedevtools.github.io/devtools-protocol/
 */

import { spawn, type ChildProcess } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

/** Where Chrome usually is on Linux (GitHub's Ubuntu runners included) and macOS; CHROME_PATH overrides */
const CHROME_PATHS = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

const TIMEOUT_MS = 15_000

type Params = Record<string, unknown>
type Message = {
  id?: number
  method?: string
  params?: Params
  sessionId?: string
  result?: Params
  error?: { message: string }
}

export interface Chrome {
  /** Opens a tab; an isolated one starts with no storage, caches or service workers, like a first visit */
  newTab(options?: { isolated?: boolean }): Promise<Tab>
  close(): Promise<void>
}

export interface Tab {
  /** Loads the URL and waits until the network has been idle for a moment */
  goto(url: string): Promise<void>
  reload(): Promise<void>
  /** Emulates the operating system's light or dark theme */
  emulateColorScheme(scheme: "light" | "dark"): Promise<void>
  /** Runs a function in the page and returns its JSON-serializable result */
  evaluate<A extends unknown[], R>(fn: (...args: A) => R, ...args: A): Promise<Awaited<R>>
  /** Runs a script in the page, e.g. a library's source */
  addScript(source: string): Promise<void>
  /** Polls the function in the page until it returns a truthy result, and returns that */
  waitFor<A extends unknown[], R>(description: string, fn: (...args: A) => R, ...args: A): Promise<Awaited<R>>
  close(): Promise<void>
}

function chromePath(): string {
  const path = process.env.CHROME_PATH ?? CHROME_PATHS.find((candidate) => existsSync(candidate))
  if (!path) throw new Error(`Chrome not found; set CHROME_PATH. Looked in: ${CHROME_PATHS.join(", ")}`)
  return path
}

function withTimeout<T>(promise: Promise<T>, what: string, ms = TIMEOUT_MS): Promise<T> {
  let timer: NodeJS.Timeout | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ms} ms: ${what}`)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

/** Chrome prints the browser's DevTools WebSocket address on stderr once it listens */
function devToolsUrl(chrome: ChildProcess): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = ""
    chrome.stderr?.on("data", (chunk: Buffer) => {
      output += chunk.toString()
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/)
      if (match) resolve(match[1])
    })
    chrome.on("exit", (code) => reject(new Error(`Chrome exited with code ${code}:\n${output}`)))
    chrome.on("error", reject)
  })
}

/** One WebSocket to the browser; each tab talks through its own session on it */
class Connection {
  private nextId = 1
  private readonly pending = new Map<number, { resolve: (result: Params) => void; reject: (error: Error) => void }>()
  private readonly listeners = new Set<(message: Message) => void>()

  constructor(private readonly socket: WebSocket) {
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data)) as Message
      if (message.id !== undefined) {
        const call = this.pending.get(message.id)
        this.pending.delete(message.id)
        if (message.error) call?.reject(new Error(message.error.message))
        else call?.resolve(message.result ?? {})
      } else {
        for (const listener of this.listeners) listener(message)
      }
    })
  }

  static open(url: string): Promise<Connection> {
    const socket = new WebSocket(url)
    return withTimeout(
      new Promise((resolve, reject) => {
        socket.addEventListener("open", () => resolve(new Connection(socket)))
        socket.addEventListener("error", () => reject(new Error(`Could not connect to ${url}`)))
      }),
      "connecting to Chrome",
    )
  }

  send(method: string, params: Params = {}, sessionId?: string): Promise<Params> {
    const id = this.nextId++
    this.socket.send(JSON.stringify({ id, method, params, sessionId }))
    return withTimeout(
      new Promise((resolve, reject) => this.pending.set(id, { resolve, reject })),
      `${method} ${JSON.stringify(params).slice(0, 80)}`,
    )
  }

  /** Resolves with the first matching event; listen before sending what triggers it */
  once(description: string, method: string, sessionId: string, matches: (params: Params) => boolean): Promise<Params> {
    return withTimeout(
      new Promise((resolve) => {
        const listener = (message: Message) => {
          if (message.method === method && message.sessionId === sessionId && matches(message.params ?? {})) {
            this.listeners.delete(listener)
            resolve(message.params ?? {})
          }
        }
        this.listeners.add(listener)
      }),
      `waiting for ${description}`,
    )
  }

  close() {
    this.socket.close()
  }
}

/** The exception a page function threw, or its JSON result */
async function evaluateIn(connection: Connection, sessionId: string, expression: string): Promise<unknown> {
  const { result, exceptionDetails } = (await connection.send(
    "Runtime.evaluate",
    { expression, awaitPromise: true, returnByValue: true },
    sessionId,
  )) as { result: { value?: unknown }; exceptionDetails?: { exception?: { description?: string }; text: string } }
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
  return result.value
}

function call(fn: (...args: never[]) => unknown, args: unknown[]): string {
  return `(${fn.toString()})(...${JSON.stringify(args)})`
}

async function openTab(connection: Connection, browserContextId?: string): Promise<Tab> {
  const { targetId } = await connection.send("Target.createTarget", { url: "about:blank", browserContextId })
  const { sessionId } = (await connection.send("Target.attachToTarget", { targetId, flatten: true })) as {
    sessionId: string
  }
  const send = (method: string, params?: Params) => connection.send(method, params, sessionId)
  await send("Page.enable")
  await send("Page.setLifecycleEventsEnabled", { enabled: true })

  // Waits until the new document's network has settled, so the page has hydrated and fetched what it needs
  async function load(start: () => Promise<Params>) {
    let loaderId: unknown
    const idle = connection.once("the page to load", "Page.lifecycleEvent", sessionId, (params) => {
      // The main frame's id is the tab's; "init" starts the new document
      if (params.name === "init" && params.frameId === targetId) loaderId = params.loaderId
      return params.name === "networkIdle" && loaderId !== undefined && params.loaderId === loaderId
    })
    // Nobody awaits it if the load fails to start
    idle.catch(() => {})
    const { errorText } = await start()
    if (errorText) throw new Error(`Could not load the page: ${errorText}`)
    await idle
  }

  return {
    goto: (url) => load(() => send("Page.navigate", { url })),
    reload: () => load(() => send("Page.reload")),
    emulateColorScheme: async (scheme) => {
      await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] })
    },
    evaluate: async (fn, ...args) => (await evaluateIn(connection, sessionId, call(fn, args))) as never,
    addScript: async (source) => {
      await evaluateIn(connection, sessionId, `${source}\n;undefined`)
    },
    waitFor: async (description, fn, ...args) => {
      const deadline = Date.now() + TIMEOUT_MS
      for (;;) {
        const result = await evaluateIn(connection, sessionId, call(fn, args))
        if (result) return result as never
        if (Date.now() > deadline) throw new Error(`Timed out after ${TIMEOUT_MS} ms waiting for ${description}`)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    },
    close: async () => {
      await connection.send("Target.closeTarget", { targetId })
    },
  }
}

export async function launchChrome(): Promise<Chrome> {
  const profile = await mkdtemp(join(tmpdir(), "mova-pass-chrome-"))
  const chrome = spawn(
    chromePath(),
    [
      "--headless",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  )
  const exited = new Promise((resolve) => chrome.once("exit", resolve))
  const close = async () => {
    chrome.kill()
    await exited
    await rm(profile, { recursive: true, force: true, maxRetries: 5 })
  }

  try {
    const connection = await Connection.open(await withTimeout(devToolsUrl(chrome), "starting Chrome"))
    return {
      newTab: async ({ isolated = false } = {}) => {
        const context = isolated ? await connection.send("Target.createBrowserContext") : undefined
        return openTab(connection, context?.browserContextId as string | undefined)
      },
      close: async () => {
        connection.close()
        await close()
      },
    }
  } catch (error) {
    await close()
    throw error
  }
}
