import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { createServer } from "node:net"

export interface BuiltAppServer {
  /** e.g. http://127.0.0.1:41234 */
  origin: string
  /** Stops the server and waits until it has exited; safe to call twice */
  stop(): Promise<void>
}

/** A free port on the loopback interface */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once("error", reject)
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address()
      probe.close(() => (typeof address === "object" && address ? resolve(address.port) : reject(new Error("No port"))))
    })
  })
}

/**
 * Serves the production build in .next with `next start`, as Vercel would.
 * The address is an IP, so the Strict-Transport-Security header doesn't apply to it (RFC 6797, section 8.1).
 */
export async function startBuiltApp(): Promise<BuiltAppServer> {
  const port = await freePort()
  const origin = `http://127.0.0.1:${port}`
  const next = createRequire(import.meta.url).resolve("next/dist/bin/next")
  const server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    stdio: ["ignore", "ignore", "pipe"],
  })
  let errors = ""
  server.stderr.on("data", (chunk: Buffer) => (errors += chunk.toString()))
  const exited = new Promise<void>((resolve) => server.once("exit", () => resolve()))
  // If the test runner dies first, the server mustn't outlive it
  const killServer = () => server.kill()
  process.once("exit", killServer)

  const stop = async () => {
    process.off("exit", killServer)
    server.kill()
    await exited
  }

  const deadline = Date.now() + 30_000
  for (;;) {
    if (server.exitCode !== null) throw new Error(`next start exited with code ${server.exitCode}:\n${errors}`)
    try {
      await fetch(origin, { redirect: "manual" })
      return { origin, stop }
    } catch {
      if (Date.now() > deadline) {
        await stop()
        throw new Error(`next start did not answer at ${origin} within 30 s:\n${errors}`)
      }
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
}
