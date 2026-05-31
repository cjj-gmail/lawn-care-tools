import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  currentMonthNum, countDone, allTasksForMonth, totalTaskCount, totalDoneCount,
  lastAppEntry, daysSince, lastMowForZone, lastWaterForZone,
} from '../../../utils/dashboardHelpers.js'
import { TYPE_COLORS, ZONE_ORDER, ZONES } from '../../../config.js'
import db from '../Dashboard.module.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEATHER_COLORS = { rain:'#2a7aa0', heat:'#c0882a', frost:'#6aaed6', drought:'#c0692a', storm:'#1a3a6a', observation:'#4a7c3f', other:'#8a8a7a' }

export function OverviewTab({ state, onLogObservation, onDeleteWeather, onToggleWeather }) {
  const { program, inventory, completions, invStatusCache, appLog, mowLog, waterLog, weatherLog } = state
  const mn  = currentMonthNum()
  const { total, done } = useMemo(() => countDone(program, completions, mn), [program, completions, mn])
  const td  = totalDoneCount(completions)
  const tt  = totalTaskCount(program)
  const yp  = tt > 0 ? Math.round(td / tt * 100) : 0
  const la  = lastAppEntry(appLog)
  const laVal = la ? daysSince(la.dateISO) + 'd ago' : '--'
  const laSub = la ? 'Last: ' + la.date + ' - ' + (la.taskLabel || la.taskType || '') : 'No applications logged yet'

  const remaining = useMemo(() =>
    allTasksForMonth(program, mn).filter(({ task }) => !completions[task.id])
  , [program, mn, completions])

  const weatherEntries = weatherLog?.entries || []
  const [wxExpanded, setWxExpanded] = useState(false)
  const wxVisible = wxExpanded ? weatherEntries : weatherEntries.slice(0, 5)

  return (
    <div>
      <div className={db.sectionHeading}>
        <div className={db.sectionTitle}>Overview</div>
        <div className={db.sectionSub}>{new Date().toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
      </div>

      {/* Stat tiles */}
      <div className={db.statGrid}>
        {[
          { val: MONTHS[mn-1], label: 'Current month', sub: program?.months?.[mn-1]?.season || '' },
          { val: done + '/' + total, label: 'Tasks done this month', sub: total > 0 ? Math.round(done/total*100) + '% complete' : 'No tasks' },
          { val: yp + '%', label: 'Year completion', sub: td + ' of ' + tt + ' tasks done' },
          { val: laVal, label: 'Last application', sub: laSub },
        ].map(s => (
          <div key={s.label} className="stat-tile">
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Upcoming tasks */}
      <div className={db.panel}>
        <div className={db.panelTitle}>Remaining tasks — {MONTHS[mn-1]}</div>
        {remaining.length === 0
          ? <div style={{ padding:16, textAlign:'center', color:'var(--ink-light)', fontSize:13, fontStyle:'italic' }}>All tasks done for this month</div>
          : <>
              {remaining.slice(0, 8).map(({ task, week }) => (
                <div key={task.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'var(--paper)', border:'1px solid var(--border-light,#ede8de)', borderRadius:5, fontSize:14, marginBottom:8 }}>
                  <span style={{ width:9, height:9, borderRadius:'50%', background: TYPE_COLORS[task.taskType]||'#888', flexShrink:0, display:'inline-block' }} />
                  <span style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.6px', color:'var(--ink-light)', minWidth:55, flexShrink:0 }}>W{week}</span>
                  <span style={{ flex:1 }}>{task.label}</span>
                  {task.conditional && <span style={{ fontSize:11, padding:'1px 6px', borderRadius:8, background:'var(--cream)', border:'1px solid var(--soil-light)', color:'var(--soil)' }}>if req.</span>}
                </div>
              ))}
              {remaining.length > 8 && <div style={{ padding:8, textAlign:'center', color:'var(--ink-light)', fontSize:12 }}>+ {remaining.length - 8} more</div>}
            </>
        }
        <div style={{ marginTop:12, textAlign:'right' }}>
          <Link to={'/tracker?month=' + mn} style={{ fontSize:13, color:'var(--grass)', textDecoration:'none', fontWeight:500 }}>Open Tracker &rarr;</Link>
        </div>
      </div>

      {/* Monthly progress bars */}
      <div className={db.panel}>
        <div className={db.panelTitle}>Year progress</div>
        {program?.months?.map(m => {
          const c = countDone(program, completions, m.monthNum)
          const pct = c.total > 0 ? Math.round(c.done/c.total*100) : 0
          const isCurrent = m.monthNum === mn
          return (
            <div key={m.monthNum} className={db.progressRow}>
              <div className={db.progressRowLabel} style={isCurrent ? { color:'var(--grass)', fontWeight:500 } : {}}>
                {m.month?.slice(0,3)}{isCurrent ? ' ◄' : ''}
              </div>
              <div className={db.progressBarWrap}><div className={db.progressBarFill + ' ' + db.ok} style={{ width: pct + '%' }} /></div>
              <div className={db.progressRowNum}>{c.done}/{c.total}</div>
            </div>
          )
        })}
      </div>

      {/* Inventory summary (critical + low only) */}
      <div className={db.panel}>
        <div className={db.panelTitleRow}>
          <div className={db.panelTitle}>Inventory summary</div>
          <Link to="/dashboard" style={{ fontSize:12, color:'var(--grass)', textDecoration:'none' }} onClick={() => {}}>View all &rarr;</Link>
        </div>
        {(inventory?.products || []).map(p => {
          const s = invStatusCache[p.name]
          if (!s) return null
          const appsText = s.appsPerYear > 0 ? s.appsRemaining + ' apps' : p.qtyRemaining + p.unit
          return (
            <div key={p.name} className={db.progressRow} style={{ marginBottom:7 }}>
              <div className={db.progressRowLabel} style={{ fontSize:13 }}>{p.name}</div>
              <div className={db.progressBarWrap} style={{ height:6 }}>
                <div style={{ height:'100%', borderRadius:4, transition:'width 0.5s', width: Math.min(s.pct,100) + '%', background: s.status==='ok'?'var(--grass)':s.status==='low'?'var(--status-low)':'var(--status-critical)' }} />
              </div>
              <div className={db.progressRowNum} style={{ fontSize:12 }}>{appsText}</div>
            </div>
          )
        })}
      </div>

      {/* Weather journal */}
      <div className={db.panel}>
        <div className={db.panelTitleRow}>
          <div className={db.panelTitle}>Weather &amp; observations</div>
          <button className={db.panelBtn} onClick={onLogObservation}>+ Log observation</button>
        </div>
        {weatherEntries.length === 0
          ? <div style={{ color:'var(--ink-light)', fontSize:13, fontStyle:'italic' }}>No observations logged yet.</div>
          : <>
              {wxVisible.map(e => (
                <div key={e.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border-light,#ede8de)', fontSize:13 }}>
                  <span style={{ color:'var(--ink-light)', minWidth:85, flexShrink:0 }}>{e.date}</span>
                  <span style={{ padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:500, color:'white', background: WEATHER_COLORS[e.type]||'#888', flexShrink:0 }}>{e.type}</span>
                  <span style={{ flex:1, color:'var(--ink-mid)' }}>{e.note}</span>
                  <button onClick={() => onLogObservation(e.id)} style={{ fontSize:11, border:'1px solid var(--border)', background:'white', borderRadius:4, padding:'2px 8px', cursor:'pointer', color:'var(--ink-mid)' }}>Edit</button>
                  <button onClick={() => onDeleteWeather(e.id)} style={{ fontSize:11, border:'1px solid #c04040', background:'white', borderRadius:4, padding:'2px 8px', cursor:'pointer', color:'#c04040' }}>Del</button>
                </div>
              ))}
              {weatherEntries.length > 5 && (
                <button onClick={() => setWxExpanded(x => !x)} style={{ marginTop:10, background:'none', border:'none', color:'var(--grass)', fontSize:13, cursor:'pointer' }}>
                  {wxExpanded ? 'Show less' : 'Show all (' + weatherEntries.length + ')'}
                </button>
              )}
            </>
        }
      </div>
    </div>
  )
}
