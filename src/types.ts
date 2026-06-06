// ─── Domain types for the lawn-care tool ─────────────────────────────────────
// All data shapes that come from GitHub JSON files are typed here.
// Import from this file instead of using inline `any`.

// ── Primitives ────────────────────────────────────────────────────────────────
export type ZoneId    = 'back' | 'front' | 'strip1' | 'strip2'
export type Season    = 'summer' | 'autumn' | 'winter' | 'spring'
export type InvStatus = 'ok' | 'low' | 'critical'
export type TaskType  =
  | 'fertilise' | 'biostimulant' | 'herbicide'
  | 'fungicide' | 'insecticide'  | 'soilwetter' | 'renovation'

// ── program.json ──────────────────────────────────────────────────────────────
export interface ZoneQuantities extends Partial<Record<ZoneId, number>> {}

export interface TaskProduct {
  name:          string
  ratePer100sqm: number
  rateUnit:      string
  rateLow?:      number
  rateHigh?:     number
  note?:         string
  quantities:    ZoneQuantities
}

export interface Task {
  id:                string
  label:             string
  taskType:          TaskType
  applicationMethod: string
  waterIn?:          boolean
  foliarOrIrrigate?: string
  zones:             ZoneId[]
  products:          TaskProduct[]
  notes?:            string
  cautions?:         string[]
  conditional?:      boolean
  condition?:        string
}

export interface Week {
  week:   number
  label:  string
  tasks:  Task[]
}

export interface ProgramMonth {
  month:    string
  monthNum: number
  season:   Season
  weeks:    Week[]
}

export interface Program {
  version?:  string
  months:    ProgramMonth[]
  cautions?: Record<string, string>
}

// ── inventory.json ────────────────────────────────────────────────────────────
export interface ProductReorder {
  retailer:        string
  replacementName: string
  buyUrl:          string
}

export interface Product {
  id?:                string
  name:               string
  brand:              string
  category:           string
  subCategory?:       string
  form?:              string
  unit:               string
  qtyRemaining:       number
  ratePer100sqm?:     number
  rateLow?:           number
  rateHigh?:          number
  rateUnit?:          string
  frequency?:         string
  applicationMethod?: string
  waterIn?:           boolean
  foliarOrIrrigate?:  string
  staining?:          boolean
  grassSafe?:         string[]
  compatibilityNotes?: string
  warnings?:          string
  notes?:             string
  reorder?:           ProductReorder
}

export interface InventoryZone {
  id:       ZoneId
  name:     string
  grass:    string
  areaSqm:  number
}

export interface CompatibilityRule {
  id?:       string
  products:  string[]
  rule:      string
  severity:  'critical' | 'warn'
}

export interface Inventory {
  lastUpdated:   string
  products:      Product[]
  zones:         InventoryZone[]
  compatibility: CompatibilityRule[]
}

// ── Log files ─────────────────────────────────────────────────────────────────
export interface Completions {
  [taskId: string]: {
    completedAt:   string
    completedTime: string
  }
}

export interface AppLogProduct {
  name:     string
  amount:   number
  unit:     string
  deducted: boolean
}

export interface AppLogEntry {
  id:                 string
  date:               string
  dateISO:            string
  taskId:             string
  taskLabel:          string
  taskType:           TaskType
  zones:              ZoneId[]
  products:           AppLogProduct[]
  inventoryDeducted:  boolean
  manual?:            boolean
  notes?:             string
}

export interface MowLogEntry {
  id:        string
  date:      string
  dateISO:   string
  zone:      ZoneId | 'all'
  zoneName:  string
  grass:     string
  mower:     string
  heightMm:  number
  notes?:    string
}

export interface WaterLogEntry {
  id:          string
  date:        string
  dateISO:     string
  zones:       ZoneId[]
  zoneNames:   string
  method:      string
  durationMin: number
  amountL?:    number | null
  notes?:      string
}

export type WeatherType = 'rain' | 'heat' | 'frost' | 'drought' | 'storm' | 'observation' | 'other'

export interface WeatherEntry {
  id:      string
  date:    string
  dateISO: string
  type:    WeatherType
  note:    string
  rainMm?: number
}

export interface AppLog     { entries: AppLogEntry[]   }
export interface MowLog     { entries: MowLogEntry[]   }
export interface WaterLog   { entries: WaterLogEntry[] }
export interface WeatherLog { entries: WeatherEntry[]  }

// ── Derived / computed ────────────────────────────────────────────────────────
export interface InvStatusResult {
  pct:           number
  appsRemaining: number
  appsPerYear:   number
  status:        InvStatus
}

// ── App state (store/reducer) ─────────────────────────────────────────────────
export interface ShaSummary {
  inventory:   string | null
  completions: string | null
  appLog:      string | null
  mowLog:      string | null
  waterLog:    string | null
  weatherLog:  string | null
}

export interface UiState {
  trackerMonth:    number | null
  invFilter:       string
  programFilter:   string
  logFilter:       string
  heightRefOpen:   boolean
  weatherExpanded: boolean
}

export interface AppState {
  status:          'loading' | 'ready' | 'error'
  error:           string | null
  program:         Program | null
  inventory:       Inventory | null
  completions:     Completions
  appLog:          AppLog
  mowLog:          MowLog
  waterLog:        WaterLog
  weatherLog:      WeatherLog
  sha:             ShaSummary
  token:           string | null
  readOnly:        boolean
  invStatusCache:  Record<string, InvStatusResult>
  ui:              UiState
}
