import { useEffect } from 'react'
import type { Dispatch } from 'react'
import { A } from '../store/actions.js'
import { CONFIG } from '../config.js'
import { loadJson } from '../services/github.js'
import { getToken, setToken, handleOAuthCallback } from '../services/auth.js'

/**
 * Runs once on mount. Handles OAuth callback, then loads all data files.
 *
 * program.json  -> raw CDN (avoids GitHub Contents API ~100KB inline limit)
 * inventory.json -> Contents API (need SHA for stock updates)
 * all logs       -> Contents API (need SHA for writes)
 */
export function useAppInit(dispatch: Dispatch<any>) {
  useEffect(() => {
    async function init() {
      dispatch({ type: A.LOAD_START })

      let token = getToken()
      const params = new URLSearchParams(window.location.search)
      const code   = params.get('code')
      if (code) {
        const t = await handleOAuthCallback(code)
        if (t) { token = t; setToken(t) }
        const clean = window.location.pathname + window.location.hash
        window.history.replaceState({}, '', clean)
      }

      // program.json: raw CDN (avoids ~100KB Contents API limit)
      let programData = null
      try {
        const rawUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/main/${CONFIG.paths.program}?t=${Date.now()}`
        const r = await fetch(rawUrl)
        if (!r.ok) throw new Error('HTTP ' + r.status)
        programData = await r.json()
      } catch (e: any) {
        dispatch({ type: A.LOAD_ERROR, error: 'Could not load program.json: ' + e.message })
        return
      }

      const invResult = await loadJson(CONFIG.paths.inventory, token)
      if (!invResult.data) {
        dispatch({ type: A.LOAD_ERROR, error: 'Could not load inventory.json (HTTP ' + invResult.status + ')' })
        return
      }

      const safe = <T>(promise: Promise<{ data: T; sha: string | null }>, fallback: T) =>
        promise.catch(() => ({ data: fallback, sha: null }))

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
