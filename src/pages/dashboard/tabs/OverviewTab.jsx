import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  currentMonthNum, countDone, allTasksForMonth, totalTaskCount, totalDoneCount,
  lastAppEntry, daysSince,
} from '../../../utils/dashboardHelpers.js'
import { TYPE_COLORS } from '../../../config.js'
import db from '../Dashboard.module.css'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const WEATHER_COLORS = {
  rain:'#2a7aa0', heat:'#c0882a', frost:'#6aaed6',
  drought:'#c0692a', storm:'#1a3a6a', observation:'#4a7c3f', other:'#8a8a7a',
}

export function OverviewTab({ state, onLogObservation, onDeleteWeather, onNavigateTab }) {
  const { program, inventory, completions, invStatusCache, appLog, weatherLog } = state
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

  // Next incomplete week block — current month first, then next month
  const nextUp = useMemo(() => {
    for (let offset = 0; offset <= 1; offset++) {
      const targetMn = ((mn - 1 + offset) % 12) + 1
      const monthTasks = allTasksForMonth(program, targetMn)
      for (const weekNum of [1, 3]) {
        const weekTasks = monthTasks
          .filter(({ week }) => week === weekNum)
          .filter(({ task }) => !completions[task.id])
        if (weekTasks.length > 0) {
          return {
            monthNum: targetMn,
            monthName: MONTHS[targetMn - 1],
            week: weekNum,
            tasks: weekTasks.map(({ task }) => task),
            approxDay: weekNum === 1 ? 1 : 15,
          }
        }
      }
    }
    return null
  }, [program, mn, completions])

  const weatherEntries = weatherLog?.entries || []
  const [wxExpanded,  setWxExpanded]  = useState(false)
  const [yearExpanded, setYearExpanded] = useState(false)

  const wxVisible = wxExpanded ? weatherEntries : weatherEntries.slice(0, 5)

  // Only show critical / low products in the summary
  const alertedProducts = useMemo(() =>
    (inventory?.products || []).filter(p => {
      const s = invStatusCache[p.name]?.status
      return s === 'critical' || s === 'low'
    })
  , [inventory, invStatusCache])

  return (
    <div>
      <div className={db.sectionHeading}>
        <div className={db.sectionTitle}>Overview</div>
        <div className={db.sectionSub}>
          {new Date().toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </div>
      </div>

      {/* 1. Stat tiles */}
      <div className={db.statGrid}>
        {[
          { val: MONTHS[mn-1],      label: 'Current month',      sub: program?.months?.[mn-1]?.season || '' },
          { val: done + '/' + total, label: 'Tasks done this month', sub: total > 0 ? Math.round(done/total*100) + '% complete' : 'No tasks' },
          { val: yp + '%',           label: 'Year completion',     sub: td + ' of ' + tt + ' tasks done' },
          { val: laVal,              label: 'Last application',    sub: laSub },
        ].map(s => (
          <div key={s.label} className="stat-tile">
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* 1b. Next up */}
      {nextUp && (
        <div className={db.panel} style={{ borderLeft:'3px solid var(--grass)' }}>
          <div className={db.panelTitleRow}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--grass)' }}>Next up</span>
              <span style={{ fontSize:13, fontWeight:500 }}>Wk{nextUp.week} &middot; {nextUp.monthName} (~{nextUp.approxDay} {nextUp.monthName.slice(0,3)})</span>
            </div>
            <Link to={'/tracker?month=' + nextUp.monthNum} style={{ fontSize:12, color:'var(--grass)', textDecoration:'none' }}>
              Open &rarr;
            </Link>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
            {nextUp.tasks.slice(0, 5).map(task => (
              <span key={task.id} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, padding:'3px 9px', borderRadius:4, background:'var(--cream)', border:'1px solid var(--border-light,#ede8de)' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:TYPE_COLORS[task.taskType]||'#888', display:'inline-block', flexShrink:0 }} />
                {task.label}
                {task.conditional && <span style={{ fontSize:10, color:'var(--ink-light)', marginLeft:2 }}>(if req.)</span>}
              </span>
            ))}
            {nextUp.tasks.length > 5 && (
              <span style={{ fontSize:12, color:'var(--ink-light)', padding:'3px 6px' }}>+{nextUp.tasks.length - 5} more</span>
            )}
          </div>
        </div>
      )}

      {/* 2. Upcoming tasks */}
      <div className={db.panel}>
        <div className={db.panelTitleRow}>
          <div className={db.panelTitle}>Remaining tasks — {MONTHS[mn-1]}</div>
          <Link to={'/tracker?month=' + mn} style={{ fontSize:12, color:'var(--grass)', textDecoration:'none' }}>
            Open Tracker &rarr;
          </Link>
        </div>
        {remaining.length === 0
          ? <div style={{ padding:'16px 0', textAlign:'center', color:'var(--ink-light)', fontSize:13, fontStyle:'italic' }}>
              All tasks done for {MONTHS[mn-1]}
            </div>
          : <>
              {remaining.slice(0, 8).map(({ task, week }) => (
                <div key={task.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'var(--paper)', border:'1px solid var(--border-light,#ede8de)', borderRadius:5, fontSize:14, marginBottom:8 }}>
                  <span style={{ width:9, height:9, borderRadius:'50%', background:TYPE_COLORS[task.taskType]||'#888', flexShrink:0, display:'inline-block' }} />
                  <span style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.6px', color:'var(--ink-light)', minWidth:28, flexShrink:0 }}>W{week}</span>
                  <span style={{ flex:1 }}>{task.label}</span>
                  {task.conditional && <span style={{ fontSize:11, padding:'1px 6px', borderRadius:8, background:'var(--cream)', border:'1px solid var(--soil-light)', color:'var(--soil)' }}>if req.</span>}
                </div>
              ))}
              {remaining.length > 8 && (
                <div style={{ padding:'6px 0', textAlign:'center', color:'var(--ink-light)', fontSize:12 }}>
                  + {remaining.length - 8} more &mdash; <Link to={'/tracker?month='+mn} style={{ color:'var(--grass)' }}>open tracker</Link>
                </div>
              )}
            </>
        }
      </div>

      {/* 3. Weather & observations — moved up */}
      <div className={db.panel}>
        <div className={db.panelTitleRow}>
          <div className={db.panelTitle}>Weather &amp; observations</div>
          <button className={db.panelBtn} onClick={() => onLogObservation(null)}>+ Log observation</button>
        </div>
        {weatherEntries.length === 0
          ? <div style={{ color:'var(--ink-light)', fontSize:13, fontStyle:'italic' }}>
              No observations logged yet.
            </div>
          : <>
              {wxVisible.map(e => (
                <div key={e.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--border-light,#ede8de)', fontSize:13 }}>
                  <span style={{ color:'var(--ink-light)', minWidth:85, flexShrink:0 }}>{e.date}</span>
                  <span style={{ padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:500, color:'white', background:WEATHER_COLORS[e.type]||'#888', flexShrink:0 }}>{e.type}</span>
                  <span style={{ flex:1, color:'var(--ink-mid)' }}>{e.note}</span>
                  <button onClick={() => onLogObservation(e.id)} style={{ fontSize:11, border:'1px solid var(--border)', background:'white', borderRadius:4, padding:'2px 8px', cursor:'pointer', color:'var(--ink-mid)', flexShrink:0 }}>Edit</button>
                  <button onClick={() => onDeleteWeather(e.id)} style={{ fontSize:11, border:'1px solid #c04040', background:'white', borderRadius:4, padding:'2px 8px', cursor:'pointer', color:'#c04040', flexShrink:0 }}>Del</button>
                </div>
              ))}
              {weatherEntries.length > 5 && (
                <button onClick={() => setWxExpanded(x => !x)} style={{ marginTop:10, background:'none', border:'none', color:'var(--grass)', fontSize:13, cursor:'pointer', padding:0 }}>
                  {wxExpanded ? 'Show less' : 'Show all (' + weatherEntries.length + ')'}
                </button>
              )}
            </>
        }
      </div>

      {/* 4. Inventory alerts — critical & low only */}
      <div className={db.panel}>
        <div className={db.panelTitleRow}>
          <div className={db.panelTitle}>Inventory alerts</div>
          <button onClick={() => onNavigateTab?.('inventory')}
            style={{ fontSize:12, color:'var(--grass)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-mono)', padding:0 }}>
            View all &rarr;
          </button>
        </div>
        {alertedProducts.length === 0
          ? <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--grass)', fontSize:13 }}>
              <span style={{ fontSize:16 }}>&#x2713;</span> All products well stocked
            </div>
          : alertedProducts.map(p => {
              const s = invStatusCache[p.name]
              if (!s) return null
              const isCrit = s.status === 'critical'
              const barColor = isCrit ? 'var(--status-critical)' : 'var(--status-low)'
              const appsText = s.appsPerYear > 0 ? s.appsRemaining + ' apps remaining' : p.qtyRemaining + p.unit + ' remaining'
              return (
                <div key={p.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background: isCrit?'#fff0f0':'#fff9e8', border:'1px solid '+(isCrit?'#c04040':'#d4a017'), borderRadius:5, marginBottom:8 }}>
                  <span style={{ fontSize:11, padding:'2px 7px', borderRadius:10, fontWeight:500, background:barColor, color:'white', flexShrink:0 }}>
                    {isCrit ? '! CRITICAL' : 'LOW'}
                  </span>
                  <span style={{ fontWeight:500, fontSize:13, flex:1 }}>{p.name}</span>
                  <span style={{ fontSize:12, color:'var(--ink-light)', flexShrink:0 }}>{appsText}</span>
                </div>
              )
            })
        }
      </div>

      {/* 5. Year progress — collapsible, default closed */}
      <div className={db.panel}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', userSelect:'none' }}
          onClick={() => setYearExpanded(y => !y)}>
          <div className={db.panelTitle} style={{ margin:0 }}>Year progress</div>
          <span style={{ fontSize:12, color:'var(--grass)', fontFamily:'var(--font-mono)' }}>
            {yp}% &nbsp; {yearExpanded ? '▲ hide' : '▼ show'}
          </span>
        </div>
        {yearExpanded && (
          <div style={{ marginTop:16 }}>
            {program?.months?.map(m => {
              const c = countDone(program, completions, m.monthNum)
              const pct = c.total > 0 ? Math.round(c.done/c.total*100) : 0
              const isCurrent = m.monthNum === mn
              return (
                <div key={m.monthNum} className={db.progressRow}>
                  <div className={db.progressRowLabel} style={isCurrent ? { color:'var(--grass)', fontWeight:500 } : {}}>
                    {m.month?.slice(0,3)}{isCurrent ? ' ◄' : ''}
                  </div>
                  <div className={db.progressBarWrap}>
                    <div className={db.progressBarFill + ' ' + db.ok} style={{ width: pct + '%' }} />
                  </div>
                  <div className={db.progressRowNum}>{c.done}/{c.total}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
