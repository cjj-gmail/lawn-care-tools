import { useEffect } from 'react'
import { A } from '../store/actions.js'
import { CONFIG } from '../config.js'
import { loadJson } from '../services/github.js'
import { getToken, setToken, handleOAuthCallback } from '../services/auth.js'

/**
 * Runs once on mount. Handles OAuth callback, then loads all data files.
 *
 * program.json  -> raw CDN (avoids GitHub Contents API ~100KB inline limit,
 *                  and we never write to it from the browser anyway)
 * inventory.json -> Contents API (need SHA for stock updates)
 * all logs       -> Contents API (need SHA for writes)
 */
export function useAppInit(dispatch) {
  useEffect(() => {
    async function init() {
      dispatch({ type: A.LOAD_START })

      // Handle OAuth callback (?code= in query string, outside the hash)
      let token = getToken()
      const params = new URLSearchParams(window.location.search)
      const code   = params.get('code')
      if (code) {
        const t = await handleOAuthCallback(code)
        if (t) { token = t; setToken(t) }
        const clean = window.location.pathname + window.location.hash
        window.history.replaceState({}, '', clean)
      }

      // ── program.json: raw CDN fetch (read-only, no SHA needed) ──────────────
      // The GitHub Contents API has a ~100KB soft limit for inline content.
      // program.json is ~116KB so we use the raw CDN exactly as the original tool did.
      let programData = null
      try {
        const rawUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/main/${CONFIG.paths.program}?t=${Date.now()}`
        const r = await fetch(rawUrl)
        if (!r.ok) throw new Error('HTTP ' + r.status)
        programData = await r.json()
      } catch (e) {
        dispatch({ type: A.LOAD_ERROR, error: 'Could not load program.json: ' + e.message })
        return
      }

      // ── inventory.json: Contents API (SHA needed for writes) ─────────────────
      const invResult = await loadJson(CONFIG.paths.inventory, token)
      if (!invResult.data) {
        dispatch({ type: A.LOAD_ERROR, error: 'Could not load inventory.json (HTTP ' + invResult.status + ')' })
        return
      }

      // ── Optional logs: all in parallel, failures default to empty ────────────
      const safe = (promise, fallback) => promise.catch(() => ({ data: fallback, sha: null }))

      const [comp, appLog, mowLog, waterLog, weatherLog] = await Promise.all([
        safe(loadJson(CONFIG.paths.completions, token), {}),
        safe(loadJson(CONFIG.paths.appLog,      token), { entries: [] }),
        safe(loadJson(CONFIG.paths.mowLog,      token), { entries: [] }),
        safe(loadJson(CONFIG.paths.waterLog,    token), { entries: [] }),
        safe(loadJson(CONFIG.paths.weatherLog,  token), { entries: [] }),
      ])

      dispatch({
        type:        A.LOAD_SUCCESS,
        token,
        program:     programData,
        inventory:   invResult.data,
        completions: comp.data      || {},
        appLog:      appLog.data    || { entries: [] },
        mowLog:      mowLog.data    || { entries: [] },
        waterLog:    waterLog.data  || { entries: [] },
        weatherLog:  weatherLog.data || { entries: [] },
        sha: {
          inventory:   invResult.sha,
          completions: comp.sha,
          appLog:      appLog.sha,
          mowLog:      mowLog.sha,
          waterLog:    waterLog.sha,
          weatherLog:  weatherLog.sha,
        },
      })
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
