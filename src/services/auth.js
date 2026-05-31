import { CONFIG } from '../config.js'

const TOKEN_KEY = 'gh_token'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || null
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function startLogin() {
  // After OAuth, the worker redirects back to the current URL with ?code=
  // Hash router means we redirect back to the app root, not a sub-path
  const redirect = window.location.origin + window.location.pathname
  window.location.href = `${CONFIG.workerUrl}/login?redirect=${encodeURIComponent(redirect)}`
}

export async function handleOAuthCallback(code) {
  try {
    const r = await fetch(`${CONFIG.workerUrl}/callback?code=${code}`)
    const d = await r.json()
    if (d.access_token) {
      setToken(d.access_token)
      return d.access_token
    }
  } catch (_) {}
  return null
}
