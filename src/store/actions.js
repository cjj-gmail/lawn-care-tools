export const A = {
  // Init
  LOAD_START:       'LOAD_START',
  LOAD_SUCCESS:     'LOAD_SUCCESS',
  LOAD_ERROR:       'LOAD_ERROR',
  // Auth
  SET_TOKEN:        'SET_TOKEN',
  // Completions
  SET_COMPLETIONS:  'SET_COMPLETIONS',
  // Inventory
  UPDATE_INVENTORY: 'UPDATE_INVENTORY',
  // Logs
  APPEND_APP_LOG:   'APPEND_APP_LOG',
  SET_MOW_LOG:      'SET_MOW_LOG',
  SET_WATER_LOG:    'SET_WATER_LOG',
  UPSERT_WEATHER:   'UPSERT_WEATHER',
  DELETE_WEATHER:   'DELETE_WEATHER',
  // Derived cache
  BUILD_INV_CACHE:  'BUILD_INV_CACHE',
  // UI state
  SET_UI:           'SET_UI',
}
