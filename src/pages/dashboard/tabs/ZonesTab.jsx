import React from 'react'
import { currentMonthNum, getMonthData } from '../../../utils/dashboardHelpers.js'
import { ZONES, ZONE_ORDER } from '../../../config.js'
import db from '../Dashboard.module.css'

const GRASS_COLORS = { Kikuyu:'#4a7c3f', Zoysia:'#7b5ea7', Couch:'#3a7a8a' }

export function ZonesTab({ state }) {
  const { program, inventory } = state
  const mn = currentMonthNum()
  const monthData = getMonthData(program, mn)

  function tasksThisMonth(zoneId) {
    if (!monthData) return 0
    return monthData.weeks.reduce((s, w) =>
      s + (w.tasks || []).filter(t => (t.zones||[]).includes(zoneId)).length
    , 0)
  }

  return (
    <div>
      <div className={db.sectionHeading}>
        <div className={db.sectionTitle}>Lawn Zones</div>
        <div className={db.sectionSub}>4 zones &middot; 140.15 m&sup2;</div>
      </div>

      {/* Zone cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
        {ZONE_ORDER.map(zid => {
          const z = ZONES[zid]
          if (!z) return null
          const tc = tasksThisMonth(zid)
          return (
            <div key={zid} style={{ background:'white', border:'1px solid var(--border)', borderRadius:8, padding:'20px', textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:200, color:'var(--grass)', letterSpacing:'-1px', lineHeight:1, marginBottom:6 }}>{z.area}m&sup2;</div>
              <div style={{ fontWeight:500, fontSize:15, color:'var(--ink)', marginBottom:4 }}>{z.name}</div>
              <div style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.8px', color: GRASS_COLORS[z.grass]||'var(--ink-light)', marginBottom:12 }}>{z.grass}</div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid var(--border-light,#ede8de)', fontSize:12 }}>
                <span style={{ color:'var(--ink-light)' }}>Tasks this month</span>
                <span style={{ fontWeight:500, color:'var(--ink)' }}>{tc}</span>
              </div>
            </div>
          )
        })}

        {/* Total card */}
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:8, padding:'20px', textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:200, color:'var(--grass)', letterSpacing:'-1px', lineHeight:1, marginBottom:6 }}>140.15m&sup2;</div>
          <div style={{ fontWeight:500, fontSize:15, color:'var(--ink)', marginBottom:4 }}>Total lawn area</div>
          <div style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--ink-light)', marginBottom:12 }}>All zones</div>
          <div style={{ paddingTop:10, borderTop:'1px solid var(--border-light,#ede8de)', fontSize:12 }}>
            {[['Kikuyu','68.2m²'],['Zoysia','35.0m²'],['Couch','36.95m²']].map(([grass, area]) => (
              <div key={grass} style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ color:'var(--ink-light)' }}>{grass}</span>
                <span style={{ fontWeight:500 }}>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compatibility rules */}
      <div className={db.panel}>
        <div className={db.panelTitle}>Compatibility rules</div>
        {(inventory?.compatibility || []).map((rule, i) => (
          <div key={i} className={['alert-item', rule.severity==='critical'?'critical':'warn'].join(' ')} style={{ marginBottom:8 }}>
            <div className="alert-icon">{rule.severity==='critical'?'!':'o'}</div>
            <div className="alert-body">
              <div className="alert-title">{rule.products?.join(', ')}</div>
              <div className="alert-text">{rule.rule}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
