import { A } from './actions.js'
import { calcInvStatus } from '../utils/invStatus.js'
import type {
  AppState, Program, Inventory, Completions,
  AppLog, MowLog, WaterLog, WeatherLog, WeatherEntry,
  InvStatusResult,
} from '../types.js'

export const initialState: AppState = {
  status:  'loading',
  error:   null,
  program:    null,
  inventory:  null,
  completions: {},
  appLog:      { entries: [] },
  mowLog:      { entries: [] },
  waterLog:    { entries: [] },
  weatherLog:  { entries: [] },
  sha: {
    inventory:   null,
    completions: null,
    appLog:      null,
    mowLog:      null,
    waterLog:    null,
    weatherLog:  null,
  },
  token:    null,
  readOnly: false,
  invStatusCache: {},
  ui: {
    trackerMonth:    null,
    invFilter:       'All',
    programFilter:   'All',
    logFilter:       'All',
    heightRefOpen:   false,
    weatherExpanded: false,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reducer(state: AppState, action: any): AppState {
  switch (action.type) {

    case A.LOAD_START:
      return { ...state, status: 'loading', error: null }

    case A.LOAD_SUCCESS: {
      const next: AppState = {
        ...state,
        status:     'ready',
        program:    action.program   as Program,
        inventory:  action.inventory as Inventory,
        completions: (action.completions  as Completions) || {},
        appLog:      (action.appLog       as AppLog)      || { entries: [] },
        mowLog:      (action.mowLog       as MowLog)      || { entries: [] },
        waterLog:    (action.waterLog     as WaterLog)    || { entries: [] },
        weatherLog:  (action.weatherLog   as WeatherLog)  || { entries: [] },
        sha:  { ...state.sha, ...(action.sha ?? {}) },
        token:     action.token ?? state.token,
        readOnly:  !(action.token ?? state.token),
      }
      next.invStatusCache = buildCache(next.inventory, next.program)
      return next
    }

    case A.LOAD_ERROR:
      return { ...state, status: 'error', error: action.error as string }

    case A.SET_TOKEN:
      return { ...state, token: action.token, readOnly: !action.token }

    case A.SET_COMPLETIONS:
      return {
        ...state,
        completions: action.completions as Completions,
        sha: { ...state.sha, completions: action.sha ?? state.sha.completions },
      }

    case A.UPDATE_INVENTORY: {
      const next = {
        ...state,
        inventory: action.inventory as Inventory,
        sha: { ...state.sha, inventory: action.sha ?? state.sha.inventory },
      }
      next.invStatusCache = buildCache(next.inventory, next.program)
      return next
    }

    case A.APPEND_APP_LOG:
      return {
        ...state,
        appLog: action.appLog as AppLog,
        sha: { ...state.sha, appLog: action.sha ?? state.sha.appLog },
      }

    case A.SET_MOW_LOG:
      return {
        ...state,
        mowLog: action.mowLog as MowLog,
        sha: { ...state.sha, mowLog: action.sha ?? state.sha.mowLog },
      }

    case A.SET_WATER_LOG:
      return {
        ...state,
        waterLog: action.waterLog as WaterLog,
        sha: { ...state.sha, waterLog: action.sha ?? state.sha.waterLog },
      }

    case A.UPSERT_WEATHER: {
      const entry = action.entry as WeatherEntry
      const entries = state.weatherLog.entries.filter(e => e.id !== entry.id)
      entries.unshift(entry)
      entries.sort((a, b) => b.dateISO.localeCompare(a.dateISO))
      return {
        ...state,
        weatherLog: { entries },
        sha: { ...state.sha, weatherLog: action.sha ?? state.sha.weatherLog },
      }
    }

    case A.DELETE_WEATHER: {
      const entries = state.weatherLog.entries.filter(e => e.id !== (action.id as string))
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

function buildCache(
  inventory: Inventory | null,
  program:   Program   | null
): Record<string, InvStatusResult> {
  if (!inventory || !program) return {}
  const cache: Record<string, InvStatusResult> = {}
  for (const p of inventory.products) {
    cache[p.name] = calcInvStatus(p, program)
  }
  return cache
}
