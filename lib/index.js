// @linxin666/dsh-agent-md - host half.
// GET /api/agent-md?path=<project dir>  -> { exists, content } of <dir>/AGENTS.md
// POST /api/agent-md?path=<project dir> body { content } -> writes <dir>/AGENTS.md

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const inject = ["webServer"]

function isAbs(p) {
  return typeof p === "string" && p.length > 0 && (p.startsWith("/") || /^[A-Za-z]:[\\/]/.test(p))
}

function writeJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "referrer-policy": "no-referrer" })
  res.end(JSON.stringify(body))
}

async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 2097152) return undefined
    chunks.push(chunk)
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"))
    return typeof parsed === "object" && parsed !== null ? parsed : undefined
  } catch {
    return undefined
  }
}

function apply(ctx) {
  ctx.effect(() => {
    const route = {
      kind: "exact",
      path: "/api/agent-md",
      handler: async (req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost")
        const dir = url.searchParams.get("path") ?? ""
        if (!isAbs(dir)) { writeJson(res, 400, { error: "invalid path" }); return }
        const file = join(dir, "AGENTS.md")
        if (req.method === "GET") {
          try {
            if (!existsSync(file)) { writeJson(res, 200, { exists: false, content: "" }); return }
            writeJson(res, 200, { exists: true, content: readFileSync(file, "utf8") })
          } catch (e) {
            writeJson(res, 500, { error: String(e) })
          }
          return
        }
        if (req.method === "POST") {
          const body = await readJsonBody(req)
          if (!body || typeof body.content !== "string") { writeJson(res, 400, { error: "content is required" }); return }
          try {
            mkdirSync(dir, { recursive: true })
            writeFileSync(file, body.content, "utf8")
            writeJson(res, 200, { ok: true })
          } catch (e) {
            writeJson(res, 500, { error: String(e) })
          }
          return
        }
        writeJson(res, 405, { error: "method not allowed" })
      }
    }
    return ctx.webServer.register(route)
  }, "dsh-agent-md: routes")
}

export { apply, inject }


