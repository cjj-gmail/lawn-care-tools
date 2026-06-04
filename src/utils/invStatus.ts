import type { Product, Program, InvStatusResult } from '../types.js'

// Full bag/bottle sizes assumed when a product has no scheduled applications
const FULL_SIZES: Record<string, number> = {
  'TX10 (5-2-8)':     25,
  'Maintain (26-1-9)': 20,
}

/**
 * Pure function — calculate inventory status for one product against the program.
 * Called once per product in the reducer's BUILD_INV_CACHE action; results cached.
 *
 * UNIT NOTE: program.json quantities are always in mL (for liquids) or g (for solids).
 * Product.qtyRemaining is stored in the product's native unit (L or kg).
 * We convert L → mL before comparing against program quantities.
 */
export function calcInvStatus(product: Product, program: Program): InvStatusResult {
  let appsPerYear = 0
  let qtyPerApp   = 0   // running average in native program units (mL or g)

  if (program?.months) {
    for (const month of program.months) {
      for (const week of month.weeks) {
        for (const task of (week.tasks ?? [])) {
          for (const tp of (task.products ?? [])) {
            if (tp.name !== product.name) continue
            appsPerYear++
            let total = 0
            for (const q of Object.values(tp.quantities ?? {})) {
              total += (q as number)
            }
            if (total > 0) {
              qtyPerApp = ((qtyPerApp * (appsPerYear - 1)) + total) / appsPerYear
            }
          }
        }
      }
    }
  }

  // Fallback: product not scheduled — use % of a nominal full container
  if (appsPerYear === 0 || qtyPerApp === 0) {
    const full = FULL_SIZES[product.name] ?? (product.unit === 'kg' ? 20 : 5)
    const pct  = Math.min(100, Math.round((product.qtyRemaining / full) * 100))
    return {
      pct,
      appsRemaining: Math.round(pct / 10),
      appsPerYear:   0,
      status: pct > 40 ? 'ok' : pct > 15 ? 'low' : 'critical',
    }
  }

  // Convert storage unit to program unit for comparison
  // Program quantities are in mL; inventory stores in L → multiply by 1000
  const remaining = product.unit === 'L'
    ? product.qtyRemaining * 1000
    : product.qtyRemaining   // kg stays as-is (program uses g, but scale is consistent)

  const appsRemaining = Math.floor(remaining / qtyPerApp)
  const pct           = Math.min(100, Math.round((appsRemaining / Math.max(appsPerYear, 1)) * 100))
  const status: InvStatusResult['status'] =
    appsRemaining <= 3 ? 'critical' : appsRemaining <= 6 ? 'low' : 'ok'

  return { pct, appsRemaining, appsPerYear, status }
}
