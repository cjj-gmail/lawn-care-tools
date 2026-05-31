import { useEffect } from 'react'
import { A } from '../store/actions.js'
import { CONFIG } from '../config.js'
import { loadJson } from '../services/github.js'
import { getToken, setToken, handleOAuthCallback } from '../services/auth.js'

/**
 * Runs once on mount. Handles OAuth callback if ?code= is present,
 * then loads all data files in parallel and dispatches LOAD_SUCCESS.
 */
export function useAppInit(dispatch) {
  useEffect(() => {
    async function init() {
      dispatch({ type: A.LOAD_START })

      // Handle OAuth callback (code in query string, outside hash)
      let token = getToken()
      const params = new URLSearchParams(window.location.search)
      const code   = params.get('code')
      if (code) {
        const t = await handleOAuthCallback(code)
        if (t) { token = t; setToken(t) }
        // Clean ?code= from the URL without triggering a reload
        const clean = window.location.pathname + window.location.hash
        window.history.replaceState({}, '', clean)
      }

      // Program and inventory are required — fail loudly if missing
      const [progResult, invResult] = await Promise.all([
        loadJson(CONFIG.paths.program,   null),
        loadJson(CONFIG.paths.inventory, token),
      ])

      if (!progResult.data) {
        dispatch({ type: A.LOAD_ERROR, error: 'Could not load program.json (HTTP ' + progResult.status + ')' })
        return
      }
      if (!invResult.data) {
        dispatch({ type: A.LOAD_ERROR, error: 'Could not load inventory.json (HTTP ' + invResult.status + ')' })
        return
      }

      // Optional logs — failures fall back to empty structures
      const safe = (promise, fallback) => promise.catch(() => ({ data: fallback, sha: null }))

      const [comp, appLog, mowLog, waterLog, weatherLog] = await Promise.all([
        safe(loadJson(CONFIG.paths.completions, token), {}),
        safe(loadJson(CONFIG.paths.appLog,      token), { entries: [] }),
        safe(loadJson(CONFIG.paths.mowLog,      token), { entries: [] }),
        safe(loadJson(CONFIG.paths.waterLog,    token), { entries: [] }),
        safe(loadJson(CONFIG.paths.weatherLog,  token), { entries: [] }),
      ])

      dispatch({
        type:       A.LOAD_SUCCESS,
        token,
        program:    progResult.data,
        inventory:  invResult.data,
        completions: comp.data     || {},
        appLog:      appLog.data   || { entries: [] },
        mowLog:      mowLog.data   || { entries: [] },
        waterLog:    waterLog.data || { entries: [] },
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
