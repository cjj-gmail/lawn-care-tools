import React, { useMemo } from 'react'
import { buildAlerts, buildShoppingList } from '../../../utils/dashboardHelpers.js'
import db from '../Dashboard.module.css'

interface AlertsTabProps {
  state: any
}

export function AlertsTab({ state }: AlertsTabProps) {
  const { program, inventory, completions, invStatusCache, mowLog, waterLog } = state

  const alerts = useMemo(() =>
    buildAlerts({ mowLog, waterLog, inventory, invStatusCache, completions, program })
  , [mowLog, waterLog, inventory, invStatusCache, completions, program])

  const shopList = useMemo(() =>
    buildShoppingList(inventory, invStatusCache)
  , [inventory, invStatusCache])

  const alertCount = alerts.length
  const critCount  = alerts.filter((a: any) => a.type === 'critical').length

  const ICONS: Record<string, string> = { warn: '!', critical: '!', info: 'i' }

  return (
    <div>
      <div className={db.sectionHeading}>
        <div className={db.sectionTitle}>
          Alerts
          {critCount > 0 && (
            <span style={{ fontSize: 14, marginLeft: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--status-critical)', color: 'white', verticalAlign: 'middle' }}>
              {critCount} critical
            </span>
          )}
        </div>
        <div className={db.sectionSub}>Inventory, mowing, watering &amp; program warnings</div>
      </div>

      {/* Shopping list */}
      <div className={db.panel}>
        <div className={db.panelTitle}>Shopping list</div>
        {Object.keys(shopList).length === 0
          ? <div style={{ color: 'var(--grass)', fontSize: 13 }}>All products well stocked -- nothing to order.</div>
          : Object.entries(shopList).sort().map(([retailer, group]: [string, any]) => (
            <div key={retailer} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{retailer}</span>
                <a href={group.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, padding: '3px 12px', borderRadius: 10, border: '1px solid var(--grass)', background: 'white', color: 'var(--grass)', textDecoration: 'none' }}>
                  Shop
                </a>
              </div>
              {group.items.map(({ product: p, status: s }: any) => {
                const appsText = s.appsPerYear > 0 ? s.appsRemaining + ' apps left' : p.qtyRemaining + p.unit + ' left'
                const badgeColor = s.status === 'critical' ? 'var(--status-critical)' : 'var(--status-low)'
                return (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--paper)', border: '1px solid var(--border-light,#ede8de)', borderRadius: 5, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 10, fontWeight: 500, background: s.status === 'critical' ? '#fff0f0' : '#fff5e0', color: badgeColor, border: '1px solid ' + badgeColor }}>
                      {s.status === 'critical' ? 'CRITICAL' : 'LOW'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', flex: 1 }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Replace: {p.reorder?.replacementName}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>{appsText}</span>
                  </div>
                )
              })}
            </div>
          ))
        }
      </div>

      {/* Alert list */}
      {alertCount === 0
        ? <div style={{ padding: 28, textAlign: 'center', color: 'var(--ink-light)', fontSize: 14, fontStyle: 'italic' }}>No alerts -- everything looks good.</div>
        : alerts.map((a: any, i: number) => (
          <div key={i} className={['alert-item', a.type].join(' ')}>
            <div className="alert-icon">{ICONS[a.type] || 'i'}</div>
            <div className="alert-body">
              <div className="alert-title">{a.title}</div>
              <div className="alert-text">{a.text}</div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
