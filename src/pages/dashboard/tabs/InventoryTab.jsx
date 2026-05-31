import React, { useState, useMemo } from 'react'
import db from '../Dashboard.module.css'

export function InventoryTab({ state, onOpenStock, onOpenResupply }) {
  const { inventory, invStatusCache } = state
  const products = inventory?.products || []
  const [filter, setFilter] = useState('All')

  const categories = useMemo(() => {
    const cats = ['All']
    products.forEach(p => { if (!cats.includes(p.category)) cats.push(p.category) })
    return cats
  }, [products])

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter)

  const summary = useMemo(() => {
    let ok = 0, low = 0, crit = 0
    products.forEach(p => {
      const s = invStatusCache[p.name]?.status
      if (s === 'ok') ok++; else if (s === 'low') low++; else crit++
    })
    return { ok, low, crit }
  }, [products, invStatusCache])

  return (
    <div>
      <div className={db.sectionHeading}>
        <div className={db.sectionTitle}>Inventory</div>
        <div className={db.sectionSub}>{products.length} products &middot; updated {inventory?.lastUpdated} &middot; click a card to update stock</div>
      </div>

      {/* Summary stats */}
      <div className={db.statGrid} style={{ marginBottom: 24 }}>
        {[
          { val: products.length, label: 'Products', sub: 'in inventory', color: undefined },
          { val: summary.ok,   label: 'Well stocked', sub: '7+ applications remaining', color: undefined },
          { val: summary.low,  label: 'Running low',  sub: '4-6 applications remaining', color: summary.low  > 0 ? 'var(--status-low)'      : undefined },
          { val: summary.crit, label: 'Critical',     sub: '3 or fewer applications left', color: summary.crit > 0 ? 'var(--status-critical)' : undefined },
        ].map(s => (
          <div key={s.label} className="stat-tile">
            <div className="stat-value" style={s.color ? { color: s.color } : {}}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:18 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ fontSize:12, padding:'4px 12px', borderRadius:12, border:'1px solid '+(c===filter?'var(--grass)':'var(--border)'), background:c===filter?'var(--grass)':'white', color:c===filter?'white':'var(--ink-mid)', cursor:'pointer', fontFamily:'var(--font-mono)', transition:'all 0.12s' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Product cards grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
        {filtered.map(p => {
          const s = invStatusCache[p.name]
          if (!s) return null
          const CAT_COLORS = { Fertiliser:'#4a7c3f', Biostimulant:'#7b5ea7', 'Soil Wetter':'#3a7a8a', Fungicide:'#c0882a', Herbicide:'#c0692a', Insecticide:'#2a7aa0' }
          const leftColor = CAT_COLORS[p.category] || 'var(--border)'
          const barColor  = s.status==='ok'?'var(--grass)':s.status==='low'?'var(--status-low)':'var(--status-critical)'
          const badgeStyle = {
            ok:       { background:'var(--grass-pale)', color:'var(--grass)' },
            low:      { background:'#fff5e0', color:'#8a5a00' },
            critical: { background:'#fff0f0', color:'var(--status-critical)' },
          }[s.status]
          const appsText = s.appsPerYear > 0
            ? s.appsRemaining + ' apps (~' + (Math.round((s.appsRemaining/s.appsPerYear)*12*10)/10) + 'mo)'
            : p.qtyRemaining + p.unit + ' remaining'

          return (
            <div key={p.name} onClick={() => onOpenStock(p)}
              style={{ background:'white', border:'1px solid var(--border)', borderLeft:'3px solid '+leftColor, borderRadius:6, padding:'14px 16px', cursor:'pointer', transition:'box-shadow 0.15s', position:'relative' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', lineHeight:1.3 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'var(--ink-light)', marginTop:2 }}>{p.brand} &middot; {p.category}</div>
                </div>
                <span style={{ fontSize:11, padding:'2px 7px', borderRadius:10, fontWeight:500, flexShrink:0, alignSelf:'flex-start', ...badgeStyle }}>
                  {s.status === 'ok' ? 'OK' : s.status === 'low' ? 'LOW' : '! CRITICAL'}
                </span>
              </div>
              <div style={{ height:5, background:'var(--border-light,#ede8de)', borderRadius:3, overflow:'hidden', marginBottom:6 }}>
                <div style={{ height:'100%', borderRadius:3, width:Math.min(s.pct,100)+'%', background:barColor, transition:'width 0.5s' }} />
              </div>
              <div style={{ fontSize:12, color:'var(--ink-light)', display:'flex', justifyContent:'space-between' }}>
                <span>{p.qtyRemaining}{p.unit} remaining</span>
                <span>{appsText}</span>
              </div>
              {/* Reorder row */}
              {(s.status === 'critical' || s.status === 'low') && p.reorder && (
                <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid var(--border-light,#ede8de)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                  <span style={{ fontSize:11, color:barColor, textTransform:'uppercase', letterSpacing:'0.6px' }}>Reorder</span>
                  <span style={{ fontSize:12, color:'var(--ink-mid)', flex:1 }}>{p.reorder.replacementName}</span>
                  <a href={p.reorder.buyUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    style={{ fontSize:11, padding:'2px 10px', borderRadius:10, border:'1px solid var(--grass)', background:'white', color:'var(--grass)', textDecoration:'none', whiteSpace:'nowrap' }}>
                    Buy
                  </a>
                </div>
              )}
              {/* Hover: resupply button */}
              <div style={{ marginTop:6, display:'flex', justifyContent:'flex-end' }}>
                <button onClick={e => { e.stopPropagation(); onOpenResupply(p) }}
                  style={{ fontSize:11, padding:'2px 8px', borderRadius:8, border:'1px solid var(--grass)', background:'white', color:'var(--grass)', cursor:'pointer', fontFamily:'var(--font-mono)' }}>
                  + Resupply
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
