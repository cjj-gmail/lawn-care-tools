import { CONFIG } from '../config.js'

interface JsonResult<T> {
  data: T | null
  sha:  string | null
  status: number
}

function apiHeaders(token: string | null): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
  if (token) h['Authorization'] = 'token ' + token
  return h
}

/**
 * Load a JSON file from the GitHub Contents API.
 * Returns { data, sha, status } — data is null on failure.
 *
 * NOTE: Do not use this for files >~100KB — the Contents API may truncate
 * inline base64 content. Use a raw CDN fetch instead (see useAppInit).
 */
export async function loadJson<T = unknown>(
  path: string,
  token: string | null
): Promise<JsonResult<T>> {
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`
  try {
    const r = await fetch(url, { headers: apiHeaders(token) })
    if (!r.ok) return { data: null, sha: null, status: r.status }
    const d = await r.json()
    const data = JSON.parse(atob(d.content.replace(/\n/g, ''))) as T
    return { data, sha: d.sha as string, status: r.status }
  } catch (_) {
    return { data: null, sha: null, status: 0 }
  }
}

/**
 * Save a JSON file via the GitHub Contents API (create or update).
 * Returns the new SHA on success, throws on failure.
 */
export async function saveJson<T = unknown>(
  path:    string,
  obj:     T,
  sha:     string | null,
  message: string,
  token:   string
): Promise<string> {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2))))
  const url     = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`
  const body: Record<string, unknown> = { message, content, branch: CONFIG.branch }
  if (sha) body.sha = sha
  const r = await fetch(url, {
    method:  'PUT',
    headers: { ...apiHeaders(token), 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({})) as { message?: string }
    throw new Error(err.message ?? 'Save failed')
  }
  const d = await r.json()
  return d.content.sha as string
}
