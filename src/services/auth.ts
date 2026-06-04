import { CONFIG } from '../config.js'

const TOKEN_KEY = 'gh_token'

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function startLogin(): void {
  const redirect = window.location.origin + window.location.pathname
  window.location.href = `${CONFIG.workerUrl}/login?redirect=${encodeURIComponent(redirect)}`
}

export async function handleOAuthCallback(code: string): Promise<string | null> {
  try {
    const r = await fetch(`${CONFIG.workerUrl}/callback?code=${code}`)
    const d = await r.json() as { access_token?: string }
    if (d.access_token) {
      setToken(d.access_token)
      return d.access_token
    }
  } catch (_) {}
  return null
}
