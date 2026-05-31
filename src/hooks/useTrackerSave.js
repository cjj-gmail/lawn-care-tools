import { useCallback, useRef } from 'react'
import { A } from '../store/actions.js'
import { CONFIG } from '../config.js'
import { saveJson } from '../services/github.js'

/**
 * Returns save helpers for tracker operations.
 * All saves are fire-and-forget with optimistic UI — state is updated before the network call.
 */
export function useTrackerSave(state, dispatch, showToast) {
  // Prevent double-saves if SHA hasn't updated yet
  const saving = useRef({})

  const saveCompletions = useCallback(async (completions, sha) => {
    if (!state.token) return false
    if (saving.current.completions) return false
    saving.current.completions = true
    try {
      const newSha = await saveJson(
        CONFIG.paths.completions,
        completions,
        sha,
        'Update task completions',
        state.token
      )
      dispatch({ type: A.SET_COMPLETIONS, completions, sha: newSha })
      return true
    } catch (e) {
      showToast('Save failed: ' + e.message, 'error')
      return false
    } finally {
      saving.current.completions = false
    }
  }, [state.token, dispatch, showToast])

  const saveInventory = useCallback(async (inventory, sha) => {
    if (!state.token || !inventory) return false
    try {
      const updated = {
        ...inventory,
        lastUpdated: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      }
      const newSha = await saveJson(
        CONFIG.paths.inventory,
        updated,
        sha,
        'Deduct inventory after task completion',
        state.token
      )
      dispatch({ type: A.UPDATE_INVENTORY, inventory: updated, sha: newSha })
      return true
    } catch (e) {
      showToast('Inventory save failed: ' + e.message, 'error')
      return false
    }
  }, [state.token, dispatch, showToast])

  const writeAppLog = useCallback(async (task, deductions, inventoryDeducted) => {
    if (!state.token) return
    const now = new Date()
    const entry = {
      id: 'app_' + now.getTime(),
      date: now.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dateISO: now.toISOString().slice(0, 10),
      taskId: task.id,
      taskLabel: task.label,
      taskType: task.taskType,
      zones: task.zones || [],
      products: (deductions || [])
        .filter(d => d.amount > 0)
        .map(d => ({ name: d.name, amount: d.amount, unit: d.unit, deducted: !!(inventoryDeducted && d.invProd) })),
      inventoryDeducted: !!inventoryDeducted,
    }
    const appLog = { entries: [entry, ...(state.appLog?.entries || [])] }
    try {
      const newSha = await saveJson(CONFIG.paths.appLog, appLog, state.sha.appLog, 'Log application: ' + task.label, state.token)
      dispatch({ type: A.APPEND_APP_LOG, appLog, sha: newSha })
    } catch (_) {}
  }, [state.token, state.appLog, state.sha.appLog, dispatch])

  return { saveCompletions, saveInventory, writeAppLog }
}
