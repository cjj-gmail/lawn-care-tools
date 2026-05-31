import { useCallback } from 'react'
import { A } from '../store/actions.js'
import { CONFIG } from '../config.js'
import { saveJson } from '../services/github.js'

export function useDashboardSave(state, dispatch, showToast) {

  const saveInventory = useCallback(async (updatedInventory, msg) => {
    if (!state.token) { showToast('Connect GitHub to save', 'error'); return false }
    const inv = { ...updatedInventory, lastUpdated: new Date().toLocaleDateString('en-AU', { day:'2-digit', month:'2-digit', year:'numeric' }) }
    try {
      const sha = await saveJson(CONFIG.paths.inventory, inv, state.sha.inventory, msg || 'Update inventory', state.token)
      dispatch({ type: A.UPDATE_INVENTORY, inventory: inv, sha })
      return true
    } catch (e) { showToast('Save failed: ' + e.message, 'error'); return false }
  }, [state.token, state.sha.inventory, dispatch, showToast])

  const saveAppLog = useCallback(async (entry) => {
    if (!state.token) return false
    const appLog = { entries: [entry, ...(state.appLog?.entries || [])] }
    try {
      const sha = await saveJson(CONFIG.paths.appLog, appLog, state.sha.appLog, 'Manual log: ' + entry.taskLabel, state.token)
      dispatch({ type: A.APPEND_APP_LOG, appLog, sha })
      return true
    } catch (e) { showToast('Save failed: ' + e.message, 'error'); return false }
  }, [state.token, state.sha.appLog, state.appLog, dispatch, showToast])

  const saveWeather = useCallback(async (weatherLog, msg) => {
    if (!state.token) { showToast('Connect GitHub to save', 'error'); return false }
    try {
      const sha = await saveJson(CONFIG.paths.weatherLog, weatherLog, state.sha.weatherLog, msg, state.token)
      dispatch({ type: A.UPSERT_WEATHER, entry: weatherLog.entries[0], sha })
      return true
    } catch (e) { showToast('Save failed: ' + e.message, 'error'); return false }
  }, [state.token, state.sha.weatherLog, dispatch, showToast])

  const deleteWeather = useCallback(async (id) => {
    if (!state.token) { showToast('Connect GitHub to save', 'error'); return false }
    const entries = (state.weatherLog?.entries || []).filter(e => e.id !== id)
    const weatherLog = { entries }
    try {
      const sha = await saveJson(CONFIG.paths.weatherLog, weatherLog, state.sha.weatherLog, 'Delete weather entry', state.token)
      dispatch({ type: A.DELETE_WEATHER, id, sha })
      return true
    } catch (e) { showToast('Save failed: ' + e.message, 'error'); return false }
  }, [state.token, state.sha.weatherLog, state.weatherLog, dispatch, showToast])

  return { saveInventory, saveAppLog, saveWeather, deleteWeather }
}
