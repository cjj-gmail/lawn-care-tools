import { CONFIG } from '../config.js'

function apiHeaders(token) {
  const h = { Accept: 'application/vnd.github.v3+json' }
  if (token) h['Authorization'] = 'token ' + token
  return h
}

/**
 * Load a JSON file from the GitHub Contents API.
 * Returns { data, sha, status } — data is null on failure.
 */
export async function loadJson(path, token) {
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`
  try {
    const r = await fetch(url, { headers: apiHeaders(token) })
    if (!r.ok) return { data: null, sha: null, status: r.status }
    const d = await r.json()
    const data = JSON.parse(atob(d.content.replace(/\n/g, '')))
    return { data, sha: d.sha, status: r.status }
  } catch (e) {
    return { data: null, sha: null, status: 0 }
  }
}

/**
 * Save a JSON file via the GitHub Contents API (create or update).
 * Returns the new SHA on success, throws on failure.
 */
export async function saveJson(path, obj, sha, message, token) {
  if (!token) throw new Error('Not authenticated')
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2))))
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`
  const body = { message, content, branch: CONFIG.branch }
  if (sha) body.sha = sha
  const r = await fetch(url, {
    method: 'PUT',
    headers: { ...apiHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.message || 'Save failed')
  }
  const d = await r.json()
  return d.content.sha
}
