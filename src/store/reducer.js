import { A } from './actions.js'
import { calcInvStatus } from '../utils/invStatus.js'

export const initialState = {
  status:  'loading',  // 'loading' | 'ready' | 'error'
  error:   null,

  // Remote data
  program:    null,
  inventory:  null,
  completions: {},
  appLog:      { entries: [] },
  mowLog:      { entries: [] },
  waterLog:    { entries: [] },
  weatherLog:  { entries: [] },

  // GitHub SHAs needed for writes
  sha: {
    inventory:   null,
    completions: null,
    appLog:      null,
    mowLog:      null,
    waterLog:    null,
    weatherLog:  null,
  },

  // Auth
  token:    null,
  readOnly: false,

  // Derived: built once on load, rebuilt after any inventory write
  invStatusCache: {},

  // UI state (persisted through re-renders, reset on page refresh)
  ui: {
    trackerMonth:    null,   // null = use current calendar month
    invFilter:       'All',
    programFilter:   'All',
    logFilter:       'All',
    heightRefOpen:   false,
    weatherExpanded: false,
  },
}

export function reducer(state, action) {
  switch (action.type) {

    case A.LOAD_START:
      return { ...state, status: 'loading', error: null }

    case A.LOAD_SUCCESS: {
      const next = {
        ...state,
        status:     'ready',
        program:    action.program,
        inventory:  action.inventory,
        completions:  action.completions  || {},
        appLog:       action.appLog       || { entries: [] },
        mowLog:       action.mowLog       || { entries: [] },
        waterLog:     action.waterLog     || { entries: [] },
        weatherLog:   action.weatherLog   || { entries: [] },
        sha: { ...state.sha, ...(action.sha || {}) },
        token:      action.token || state.token,
        readOnly:   !action.token && !state.token,
      }
      next.invStatusCache = buildCache(next.inventory, next.program)
      return next
    }

    case A.LOAD_ERROR:
      return { ...state, status: 'error', error: action.error }

    case A.SET_TOKEN:
      return { ...state, token: action.token, readOnly: !action.token }

    case A.SET_COMPLETIONS:
      return {
        ...state,
        completions: action.completions,
        sha: { ...state.sha, completions: action.sha ?? state.sha.completions },
      }

    case A.UPDATE_INVENTORY: {
      const next = {
        ...state,
        inventory: action.inventory,
        sha: { ...state.sha, inventory: action.sha ?? state.sha.inventory },
      }
      next.invStatusCache = buildCache(next.inventory, next.program)
      return next
    }

    case A.APPEND_APP_LOG:
      return {
        ...state,
        appLog: action.appLog,
        sha: { ...state.sha, appLog: action.sha ?? state.sha.appLog },
      }

    case A.SET_MOW_LOG:
      return {
        ...state,
        mowLog: action.mowLog,
        sha: { ...state.sha, mowLog: action.sha ?? state.sha.mowLog },
      }

    case A.SET_WATER_LOG:
      return {
        ...state,
        waterLog: action.waterLog,
        sha: { ...state.sha, waterLog: action.sha ?? state.sha.waterLog },
      }

    case A.UPSERT_WEATHER: {
      const entries = state.weatherLog.entries.filter(e => e.id !== action.entry.id)
      entries.unshift(action.entry)
      entries.sort((a, b) => b.dateISO.localeCompare(a.dateISO))
      return {
        ...state,
        weatherLog: { entries },
        sha: { ...state.sha, weatherLog: action.sha ?? state.sha.weatherLog },
      }
    }

    case A.DELETE_WEATHER: {
      const entries = state.weatherLog.entries.filter(e => e.id !== action.id)
      return {
        ...state,
        weatherLog: { entries },
        sha: { ...state.sha, weatherLog: action.sha ?? state.sha.weatherLog },
      }
    }

    case A.BUILD_INV_CACHE:
      return { ...state, invStatusCache: buildCache(state.inventory, state.program) }

    case A.SET_UI:
      return { ...state, ui: { ...state.ui, ...action.ui } }

    default:
      return state
  }
}

function buildCache(inventory, program) {
  if (!inventory || !program) return {}
  const cache = {}
  for (const p of inventory.products) {
    cache[p.name] = calcInvStatus(p, program)
  }
  return cache
}
