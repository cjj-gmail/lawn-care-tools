import React, { useState, useMemo } from 'react'
import {
  currentMonthNum, daysSince, lastMowForZone, lastWaterForZone,
  mowThreshold, waterThreshold, WATER_METHOD_LABELS,
} from '../../../utils/dashboardHelpers.js'
import { TYPE_COLORS, ZONES, ZONE_ORDER } from '../../../config.js'
import db from '../Dashboard.module.css'

export function LogTab({ state, onOpenManualLog }) {
  const { appLog, mowLog, waterLog } = state
  const entries      = appLog?.entries  || []
  const mowEntries   = mowLog?.entries  || []
  const waterEntries = waterLog?.entries || []
  const [logFilter, setLogFilter] = useState('All')

  const mn          = currentMonthNum()
  const mThreshold  = mowThreshold()
  const wThreshold  = waterThreshold()

  const taskTypes = useMemo(() => {
    const t = ['All']
    entries.forEach(e => { if (e.taskType && !t.includes(e.taskType)) t.push(e.taskType) })
    return t
  }, [entries])

  const filteredLog = logFilter === 'All' ? entries : entries.filter(e => e.taskType === logFilter)

  const monthEntries = entries.filter(e => {
    if (!e.dateISO) return false
    const d = new Date(e.dateISO)
    return d.getMonth()+1 === mn && d.getFullYear() === new Date().getFullYear()
  })

  const lastApplied = useMemo(() => {
    const map = {}
    entries.forEach(e => {
      ;(e.products || []).forEach(p => {
        if (!map[p.name] || e.dateISO > map[p.name]) map[p.name] = e.dateISO
      })
    })
    return map
  }, [entries])

  const waterStats = useMemo(() =>
    Object.fromEntries(ZONE_ORDER.map(zid => {
      const zw = waterEntries.filter(e => (e.zones||[]).includes(zid)).sort((a,b) => a.dateISO < b.dateISO ? -1 : 1)
      const count = zw.length
      let avg = null
      if (count >= 2) {
        const iv = []
        for (let i = 1; i < zw.length; i++) {
          const d = Math.round((new Date(zw[i].dateISO) - new Date(zw[i-1].dateISO)) / 86400000)
          if (d > 0) iv.push(d)
        }
        if (iv.length) avg = Math.round(iv.reduce((a,b) => a+b, 0) / iv.length)
      }
      return [zid, { count, avg }]
    }))
  , [waterEntries])

  const mowStats = useMemo(() =>
    Object.fromEntries(ZONE_ORDER.map(zid => {
      const zm = mowEntries.filter(e => e.zone === zid).sort((a,b) => a.dateISO < b.dateISO ? -1 : 1)
      const count = zm.length
      let avg = null
      if (count >= 2) {
        const iv = []
        for (let i = 1; i < zm.length; i++) {
          const d = Math.round((new Date(zm[i].dateISO) - new Date(zm[i-1].dateISO)) / 86400000)
          if (d > 0) iv.push(d)
        }
        if (iv.length) avg = Math.round(iv.reduce((a,b) => a+b, 0) / iv.length)
      }
      return [zid, { count, avg }]
    }))
  , [mowEntries])

  function exportCSV() {
    const headers = ['Date','Label','Type','Zones','Products','Amounts','Units','Inv. Deducted','Manual','Notes']
    const rows = [headers, ...entries.map(e => [
      e.date||'', e.taskLabel||e.taskType||'', e.taskType||'',
      (e.zones||[]).map(z => ZONES[z]?.name||z).join('; '),
      (e.products||[]).map(p=>p.name).join('; '),
      (e.products||[]).map(p=>p.amount||'').join('; '),
      (e.products||[]).map(p=>p.unit||'').join('; '),
      e.inventoryDeducted?'Yes':'No', e.manual?'Yes':'No', e.notes||'',
    ])]
    const csv = rows.map(r => r.map(c => { const s=String(c); return (s.includes(',')||s.includes('"')||s.includes('\n')) ? '"'+s.replace(/"/g,'""')+'"' : s }).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8;' }))
    const a = Object.assign(document.createElement('a'), { href:url, download:'applications-'+new Date().toISOString().slice(0,10)+'.csv' })
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  const cellStyle = { padding:'9px 12px', borderBottom:'1px solid var(--border-light,#ede8de)', verticalAlign:'middle' }

  return (
    <div>
      <div className={db.sectionHeading}>
        <div className={db.sectionTitle}>Log</div>
        <div className={db.sectionSub}>{entries.length} applications &middot; {mowEntries.length} mows &middot; {waterEntries.length} waterings</div>
      </div>

      {/* Log stats */}
      <div className={db.statGrid}>
        {[
          { val: entries.length,      label: 'Total applications', sub: 'all time' },
          { val: monthEntries.length, label: 'This month',         sub: 'applications logged' },
          { val: entries.filter(e=>e.inventoryDeducted).length, label: 'Inventory deducted', sub: 'of ' + entries.length + ' entries' },
          { val: mowEntries.length,   label: 'Mowing sessions',    sub: 'all time' },
        ].map(s => (
          <div key={s.label} className="stat-tile">
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Watering zone status cards */}
      <div className={db.panel}>
        <div className={db.panelTitle}>Watering — zone status</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10, marginBottom:16 }}>
          {ZONE_ORDER.map(zid => {
            const last = lastWaterForZone(waterLog, zid)
            const overdue = last && daysSince(last.dateISO) >= wThreshold
            return (
              <div key={zid} style={{ background: overdue?'#fff9e8':last?'white':'var(--paper)', border:'1px solid '+(overdue?'#d4a017':'var(--border)'), borderRadius:6, padding:'12px 14px' }}>
                <div style={{ fontWeight:500, fontSize:13 }}>{ZONES[zid]?.name}</div>
                <div style={{ fontSize:12, color:'var(--ink-light)', marginBottom:6 }}>{ZONES[zid]?.grass}</div>
                {last
                  ? <><div style={{ fontSize:20, fontFamily:'var(--font-serif)', color: overdue?'#8a5a00':'var(--grass)', fontWeight:300 }}>{daysSince(last.dateISO)}d ago</div><div style={{ fontSize:11, color:'var(--ink-light)' }}>{last.date} &middot; {WATER_METHOD_LABELS[last.method]||last.method||''}{last.durationMin?' &middot; '+last.durationMin+'min':''}</div></>
                  : <div style={{ fontSize:13, color:'var(--ink-light)', fontStyle:'italic' }}>No record</div>
                }
              </div>
            )
          })}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:8, marginBottom:16 }}>
          {ZONE_ORDER.map(zid => {
            const st = waterStats[zid]
            return (
              <div key={zid} style={{ background:'var(--paper)', border:'1px solid var(--border-light,#ede8de)', borderRadius:4, padding:'8px 12px', fontSize:12 }}>
                <span style={{ color:'var(--ink-light)' }}>{ZONES[zid]?.name}:</span>
                <span style={{ fontWeight:500, marginLeft:6 }}>{st.count} session{st.count !== 1 ? 's' : ''}</span>
                {st.avg && <span style={{ color:'var(--ink-light)', marginLeft:6 }}>&#183; avg every {st.avg}d</span>}
                {!st.avg && st.count === 1 && <span style={{ color:'var(--ink-light)', marginLeft:6 }}>&#183; 1 session only</span>}
                {st.count === 0 && <span style={{ color:'var(--ink-light)', marginLeft:6 }}>&#183; no data</span>}
              </div>
            )
          })}
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'var(--cream)' }}>
              {['Date','Zones','Method','Duration','Amount','Notes'].map(h => <th key={h} style={{ textAlign:'left', padding:'8px 12px', borderBottom:'2px solid var(--border)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.6px', color:'var(--ink-light)', whiteSpace:'nowrap' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {waterEntries.length === 0
                ? <tr><td colSpan={6} style={{ ...cellStyle, textAlign:'center', color:'var(--ink-light)', fontStyle:'italic' }}>No watering sessions logged yet.</td></tr>
                : waterEntries.map(e => (
                  <tr key={e.id}>
                    <td style={cellStyle}>{e.date}</td>
                    <td style={{ ...cellStyle, fontSize:12, color:'var(--ink-mid)' }}>{(e.zones||[]).map(z=>ZONES[z]?.name||z).join(', ')||e.zoneNames||'--'}</td>
                    <td style={cellStyle}>{WATER_METHOD_LABELS[e.method]||e.method||'--'}</td>
                    <td style={{ ...cellStyle, fontWeight:500, color:'var(--grass)' }}>{e.durationMin?e.durationMin+'min':'--'}</td>
                    <td style={{ ...cellStyle, color:'var(--ink-mid)' }}>{e.amountL?e.amountL+'L':'--'}</td>
                    <td style={{ ...cellStyle, fontSize:12, color:'var(--ink-light)' }}>{e.notes||'--'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Mowing zone status cards */}
      <div className={db.panel}>
        <div className={db.panelTitle}>Mowing — zone status</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10, marginBottom:16 }}>
          {ZONE_ORDER.map(zid => {
            const last = lastMowForZone(mowLog, zid)
            const overdue = last && daysSince(last.dateISO) >= mThreshold
            return (
              <div key={zid} style={{ background: overdue?'#fff9e8':last?'white':'var(--paper)', border:'1px solid '+(overdue?'#d4a017':'var(--border)'), borderRadius:6, padding:'12px 14px' }}>
                <div style={{ fontWeight:500, fontSize:13 }}>{ZONES[zid]?.name}</div>
                <div style={{ fontSize:12, color:'var(--ink-light)', marginBottom:6 }}>{ZONES[zid]?.grass}</div>
                {last
                  ? <><div style={{ fontSize:20, fontFamily:'var(--font-serif)', color: overdue?'#8a5a00':'var(--grass)', fontWeight:300 }}>{daysSince(last.dateISO)}d ago</div><div style={{ fontSize:11, color:'var(--ink-light)' }}>{last.date} &middot; {last.heightMm}mm{last.notes?' &middot; '+last.notes.slice(0,30):''}</div></>
                  : <div style={{ fontSize:13, color:'var(--ink-light)', fontStyle:'italic' }}>No record</div>
                }
              </div>
            )
          })}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:8, marginBottom:16 }}>
          {ZONE_ORDER.map(zid => {
            const st = mowStats[zid]
            return (
              <div key={zid} style={{ background:'var(--paper)', border:'1px solid var(--border-light,#ede8de)', borderRadius:4, padding:'8px 12px', fontSize:12 }}>
                <span style={{ color:'var(--ink-light)' }}>{ZONES[zid]?.name}:</span>
                <span style={{ fontWeight:500, marginLeft:6 }}>{st.count} mow{st.count !== 1 ? 's' : ''}</span>
                {st.avg && <span style={{ color:'var(--ink-light)', marginLeft:6 }}>&#183; avg every {st.avg}d</span>}
                {!st.avg && st.count === 1 && <span style={{ color:'var(--ink-light)', marginLeft:6 }}>&#183; 1 session only</span>}
                {st.count === 0 && <span style={{ color:'var(--ink-light)', marginLeft:6 }}>&#183; no data</span>}
              </div>
            )
          })}
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'var(--cream)' }}>
              {['Date','Zone','Mower','Height','Notes'].map(h => <th key={h} style={{ textAlign:'left', padding:'8px 12px', borderBottom:'2px solid var(--border)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.6px', color:'var(--ink-light)', whiteSpace:'nowrap' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {mowEntries.length === 0
                ? <tr><td colSpan={5} style={{ ...cellStyle, textAlign:'center', color:'var(--ink-light)', fontStyle:'italic' }}>No mowing sessions logged yet.</td></tr>
                : mowEntries.map(e => (
                  <tr key={e.id}>
                    <td style={cellStyle}>{e.date}</td>
                    <td style={cellStyle}><div style={{ fontWeight:500, fontSize:13 }}>{e.zoneName||e.zone}</div><div style={{ fontSize:12, color:'var(--ink-light)' }}>{e.grass}</div></td>
                    <td style={{ ...cellStyle, color:'var(--ink-mid)' }}>{e.mower||'--'}</td>
                    <td style={{ ...cellStyle, fontWeight:500, color:'var(--grass)' }}>{e.heightMm}mm</td>
                    <td style={{ ...cellStyle, fontSize:12, color:'var(--ink-light)' }}>{e.notes||'--'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications log */}
      <div className={db.panel}>
        <div className={db.panelTitleRow}>
          <div className={db.panelTitle}>All applications</div>
          <div className={db.panelBtnRow}>
            <button className={db.panelBtn} onClick={exportCSV}>Export CSV</button>
            <button className={db.panelBtn} onClick={onOpenManualLog}>+ Log manual application</button>
          </div>
        </div>
        <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:18 }}>
          {taskTypes.map(t => (
            <button key={t} onClick={() => setLogFilter(t)}
              style={{ fontSize:12, padding:'4px 12px', borderRadius:12, border:'1px solid '+(t===logFilter?'var(--grass)':'var(--border)'), background:t===logFilter?'var(--grass)':'white', color:t===logFilter?'white':'var(--ink-mid)', cursor:'pointer', fontFamily:'var(--font-mono)', transition:'all 0.12s' }}>
              {t === 'All' ? 'All' : t === 'soilwetter' ? 'soil wetter' : t}
            </button>
          ))}
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'var(--cream)' }}>
              {['Date','Task / Label','Products used','Zones','Inv. deducted'].map(h => <th key={h} style={{ textAlign:'left', padding:'8px 12px', borderBottom:'2px solid var(--border)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.6px', color:'var(--ink-light)', whiteSpace:'nowrap' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filteredLog.length === 0
                ? <tr><td colSpan={5} style={{ ...cellStyle, textAlign:'center', color:'var(--ink-light)', fontStyle:'italic' }}>No applications logged yet.</td></tr>
                : filteredLog.map(e => (
                  <tr key={e.id}>
                    <td style={{ ...cellStyle, whiteSpace:'nowrap' }}>{e.date||''}</td>
                    <td style={cellStyle}>
                      <div style={{ display:'flex', alignItems:'center' }}>
                        <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:TYPE_COLORS[e.taskType]||'#888', marginRight:6, flexShrink:0 }} />
                        {e.taskLabel||e.taskType||''}
                      </div>
                      {e.manual && <span style={{ fontSize:10, padding:'1px 5px', borderRadius:4, background:'#eef5ff', color:'#4a80b0', border:'1px solid #4a80b0', marginLeft:5 }}>manual</span>}
                    </td>
                    <td style={{ ...cellStyle, fontSize:12, lineHeight:1.6 }}>
                      {(e.products||[]).length === 0
                        ? <span style={{ color:'var(--ink-light)', fontStyle:'italic' }}>No products</span>
                        : (e.products||[]).map((p,i) => <div key={i}>{p.name} {p.amount}{p.unit}{p.deducted?' v':''}</div>)
                      }
                    </td>
                    <td style={{ ...cellStyle, fontSize:12, color:'var(--ink-mid)' }}>{(e.zones||[]).map(z=>ZONES[z]?.name||z).join(', ')||'--'}</td>
                    <td style={cellStyle}>
                      <span style={{ fontSize:12, padding:'2px 8px', borderRadius:10, background: e.inventoryDeducted?'var(--grass-pale)':'var(--border-light,#ede8de)', color: e.inventoryDeducted?'var(--grass)':'var(--ink-light)' }}>
                        {e.inventoryDeducted ? 'yes' : 'skipped'}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Last applied grid */}
      <div className={db.panel}>
        <div className={db.panelTitle}>Last applied — by product</div>
        {Object.keys(lastApplied).length === 0
          ? <div style={{ color:'var(--ink-light)', fontSize:13, fontStyle:'italic' }}>No applications logged yet.</div>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
              {Object.entries(lastApplied).sort().map(([name, iso]) => {
                const days = daysSince(iso)
                return (
                  <div key={name} style={{ background:'var(--paper)', border:'1px solid var(--border-light,#ede8de)', borderRadius:6, padding:'10px 12px' }}>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>{name}</div>
                    <div style={{ fontSize:18, fontFamily:'var(--font-serif)', fontWeight:300, color: days>28?'var(--status-low)':'var(--grass)' }}>{days}d ago</div>
                    <div style={{ fontSize:11, color:'var(--ink-light)' }}>{iso.split('-').reverse().join('/')}</div>
                  </div>
                )
              })}
            </div>
        }
      </div>
    </div>
  )
}
