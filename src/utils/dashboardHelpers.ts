import { ZONES, ZONE_ORDER } from '../config.js'
import type {
  Program, Completions, MowLog, WaterLog, AppLog,
  Inventory, InvStatusResult, MowLogEntry, WaterLogEntry,
  AppLogEntry, ZoneId, Season,
} from '../types.js'

// ── Date helpers ──────────────────────────────────────────────────────────────
export function daysSince(dateISO: string): number {
  const d = new Date(dateISO + 'T00:00:00')
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

export function currentMonthNum(): number { return new Date().getMonth() + 1 }

export function mowThreshold(): number {
  const mn = currentMonthNum()
  return [12, 1, 2, 3, 4, 5].includes(mn) ? 14 : 21
}

export function waterThreshold(): number {
  return [12, 1, 2].includes(currentMonthNum()) ? 3 : 5
}

export function currentSeasonLabel(): Season {
  const mn = currentMonthNum()
  if ([12, 1, 2].includes(mn)) return 'summer'
  if ([3, 4, 5].includes(mn))  return 'autumn'
  if ([6, 7, 8].includes(mn))  return 'winter'
  return 'spring'
}

// ── Program helpers ───────────────────────────────────────────────────────────
export function getMonthData(program: Program | null, monthNum: number) {
  return program?.months?.find(m => m.monthNum === monthNum) ?? null
}

export function countDone(program: Program | null, completions: Completions, monthNum: number) {
  const m = getMonthData(program, monthNum)
  if (!m) return { total: 0, done: 0 }
  let total = 0, done = 0
  m.weeks.forEach(w => {
    ;(w.tasks || []).forEach(t => { total++; if (completions[t.id]) done++ })
  })
  return { total, done }
}

export function allTasksForMonth(program: Program | null, monthNum: number) {
  const m = getMonthData(program, monthNum)
  if (!m) return []
  return m.weeks.flatMap(w => (w.tasks || []).map(t => ({ task: t, week: w.week })))
}

export function totalTaskCount(program: Program | null): number {
  return program?.months?.reduce(
    (s, m) => s + m.weeks.reduce((ws, w) => ws + (w.tasks?.length || 0), 0), 0
  ) ?? 0
}

export function totalDoneCount(completions: Completions): number {
  return Object.keys(completions).length
}

// ── Log helpers ───────────────────────────────────────────────────────────────
export function lastMowForZone(mowLog: MowLog | null, zoneId: ZoneId): MowLogEntry | null {
  return (mowLog?.entries || [])
    .filter(e => e.zone === zoneId || e.zone === 'all')
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0] ?? null
}

export function lastWaterForZone(waterLog: WaterLog | null, zoneId: ZoneId): WaterLogEntry | null {
  return (waterLog?.entries || [])
    .filter(e => (e.zones || []).includes(zoneId))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0] ?? null
}

export function lastAppEntry(appLog: AppLog | null): AppLogEntry | null {
  return appLog?.entries?.[0] ?? null
}

// ── Alerts builder ────────────────────────────────────────────────────────────
interface AlertsInput {
  mowLog:         MowLog | null
  waterLog:       WaterLog | null
  inventory:      Inventory | null
  invStatusCache: Record<string, InvStatusResult>
  completions:    Completions
  program:        Program | null
}

interface Alert {
  type:  'info' | 'warn' | 'critical'
  title: string
  text:  string
}

export function buildAlerts({ mowLog, waterLog, inventory, invStatusCache, completions, program }: AlertsInput): Alert[] {
  const alerts: Alert[] = []
  const mn         = currentMonthNum()
  const mThreshold = mowThreshold()
  const wThreshold = waterThreshold()
  const season     = currentSeasonLabel()

  ZONE_ORDER.forEach(zid => {
    const last = lastMowForZone(mowLog, zid)
    const name = ZONES[zid]?.name || zid
    if (!last) {
      alerts.push({ type: 'info', title: name + ' - no mowing record', text: 'No mowing sessions logged yet.' })
    } else {
      const days = daysSince(last.dateISO)
      if (days >= mThreshold)
        alerts.push({ type: 'warn', title: name + ' - mowing overdue', text: days + 'd since last mow (' + last.date + ' - ' + last.heightMm + 'mm). Threshold ' + mThreshold + 'd in ' + season + '.' })
    }
  })

  ZONE_ORDER.forEach(zid => {
    const last = lastWaterForZone(waterLog, zid)
    const name = ZONES[zid]?.name || zid
    if (!last) {
      alerts.push({ type: 'info', title: name + ' - no watering record', text: 'No watering logged.' })
    } else {
      const days = daysSince(last.dateISO)
      if (days >= wThreshold)
        alerts.push({ type: 'warn', title: name + ' - watering overdue', text: days + 'd since last water (' + last.date + '). Threshold ' + wThreshold + 'd in ' + season + '.' })
    }
  })

  ;(inventory?.products || []).forEach(p => {
    const s = invStatusCache[p.name]
    if (!s) return
    const appsText = s.appsPerYear > 0
      ? s.appsRemaining + ' application' + (s.appsRemaining !== 1 ? 's' : '') + ' remaining'
      : p.qtyRemaining + p.unit + ' remaining'
    const schedText = s.appsPerYear > 0 ? ' (' + s.appsPerYear + ' scheduled/year)' : ''
    if (s.status === 'critical')
      alerts.push({ type: 'critical', title: p.name + ' - critically low', text: appsText + schedText + '. Reorder now.' })
    else if (s.status === 'low')
      alerts.push({ type: 'warn', title: p.name + ' - running low', text: appsText + schedText + '. Consider restocking.' })
  })

  ;(inventory?.compatibility || []).forEach(rule => {
    if (rule.severity === 'critical')
      alerts.push({ type: 'critical', title: 'Compatibility rule', text: rule.rule })
  })

  const { total, done } = countDone(program, completions, mn)
  if (total > 0 && done === 0) {
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
    alerts.push({ type: 'info', title: MONTHS[mn - 1] + ' program not started', text: total + ' tasks scheduled this month, none completed yet.' })
  }

  return alerts
}

// ── Shopping list ─────────────────────────────────────────────────────────────
interface ShopItem { product: Inventory['products'][number]; status: InvStatusResult }
interface ShopGroup { url: string; items: ShopItem[] }

export function buildShoppingList(
  inventory:      Inventory | null,
  invStatusCache: Record<string, InvStatusResult>,
): Record<string, ShopGroup> {
  const byRetailer: Record<string, ShopGroup> = {}
  ;(inventory?.products || []).forEach(p => {
    const s = invStatusCache[p.name]
    if (!s || s.status === 'ok' || !p.reorder) return
    const r = p.reorder.retailer
    if (!byRetailer[r]) byRetailer[r] = { url: p.reorder.buyUrl, items: [] }
    byRetailer[r].items.push({ product: p, status: s })
  })
  return byRetailer
}

export const WATER_METHOD_LABELS: Record<string, string> = {
  sprinkler: 'Sprinkler',
  hose:      'Hose',
  drip:      'Drip irrigation',
  manual:    'Manual/watering can',
}
