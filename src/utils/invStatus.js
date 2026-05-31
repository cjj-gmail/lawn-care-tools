/**
 * Pure function — calculate inventory status for one product against the program.
 * Called once per product in the reducer's BUILD_INV_CACHE action; results cached in state.
 *
 * Returns { pct, appsRemaining, appsPerYear, status: 'ok'|'low'|'critical' }
 */
export function calcInvStatus(product, program) {
  let appsPerYear = 0
  let qtyPerApp   = 0   // running average, in native units (mL for liquids, g for solids)

  if (program && program.months) {
    for (const month of program.months) {
      for (const week of month.weeks) {
        for (const task of (week.tasks || [])) {
          for (const tp of (task.products || [])) {
            if (tp.name !== product.name) continue
            appsPerYear++
            let total = 0
            for (const q of Object.values(tp.quantities || {})) total += q
            if (total > 0) {
              qtyPerApp = ((qtyPerApp * (appsPerYear - 1)) + total) / appsPerYear
            }
          }
        }
      }
    }
  }

  // Fallback: no program data — use rough % of a nominal full bottle/bag
  if (appsPerYear === 0 || qtyPerApp === 0) {
    const FULL = { 'TX10 (5-2-8)': 25, 'Maintain (26-1-9)': 20 }
    const full = FULL[product.name] || (product.unit === 'kg' ? 20 : 5)
    const pct  = Math.min(100, Math.round((product.qtyRemaining / full) * 100))
    return {
      pct,
      appsRemaining: Math.round(pct / 10),
      appsPerYear:   0,
      status:        pct > 40 ? 'ok' : pct > 15 ? 'low' : 'critical',
    }
  }

  // Convert litres to mL to match program quantities (which are in mL)
  const remaining = product.unit === 'L'
    ? product.qtyRemaining * 1000
    : product.qtyRemaining

  const appsRemaining = Math.floor(remaining / qtyPerApp)
  const pct           = Math.min(100, Math.round((appsRemaining / Math.max(appsPerYear, 1)) * 100))
  const status        = appsRemaining <= 3 ? 'critical' : appsRemaining <= 6 ? 'low' : 'ok'

  return { pct, appsRemaining, appsPerYear, status }
}
