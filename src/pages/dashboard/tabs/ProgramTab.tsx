import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { currentMonthNum, countDone } from '../../../utils/dashboardHelpers.js'
import { TYPE_COLORS, TASK_TYPES } from '../../../config.js'
import db from '../Dashboard.module.css'

interface ProgramTabProps {
  state: any
}

export function ProgramTab({ state }: ProgramTabProps) {
  const { program, completions } = state
  const mn = currentMonthNum()
  const [filter, setFilter] = useState('all')

  const allTasks = useMemo(() => {
    if (!program) return []
    return program.months.flatMap((m: any) =>
      m.weeks.flatMap((w: any) =>
        (w.tasks || []).map((t: any) => ({ task: t, month: m, week: w.week }))
      )
    )
  }, [program])

  const filtered = useMemo(() =>
    filter === 'all' ? allTasks : allTasks.filter(({ task }: any) => task.taskType === filter)
  , [allTasks, filter])

  const filters = ['all', ...(TASK_TYPES as string[])]

  return (
    <div>
      <div className={db.sectionHeading}>
        <div className={db.sectionTitle}>Program</div>
        <div className={db.sectionSub}>12-month schedule</div>
      </div>

      {/* Month grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }}>
        {program?.months?.map((m: any) => {
          const c   = countDone(program, completions, m.monthNum)
          const pct = c.total > 0 ? Math.round(c.done / c.total * 100) : 0
          const isCurrent = m.monthNum === mn
          const SEASON_COLORS: Record<string, string> = { summer: '#d4a017', autumn: '#c07030', winter: '#4a80b0', spring: '#5a9448' }
          return (
            <Link
              key={m.monthNum}
              to={'/tracker?month=' + m.monthNum}
              style={{ background: 'white', border: '1px solid ' + (isCurrent ? 'var(--grass)' : 'var(--border)'), borderRadius: 6, padding: '12px 14px', textDecoration: 'none', color: 'inherit', display: 'block', boxShadow: isCurrent ? '0 0 0 2px var(--grass-pale)' : undefined, transition: 'box-shadow 0.15s,border-color 0.15s,transform 0.1s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 300 }}>{m.month?.slice(0, 3)}</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEASON_COLORS[m.season] || '#888' }} />
              </div>
              <div style={{ height: 4, background: 'var(--border-light,#ede8de)', borderRadius: 2, overflow: 'hidden', marginBottom: 5 }}>
                <div style={{ height: '100%', background: 'var(--grass)', borderRadius: 2, width: pct + '%' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                <span style={{ color: 'var(--grass)', fontWeight: 500 }}>{c.done}</span> / {c.total} tasks
              </div>
            </Link>
          )
        })}
      </div>

      {/* Type legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        {Object.entries(TYPE_COLORS as Record<string, string>).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-mid)' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />
            {type === 'soilwetter' ? 'soil wetter' : type}
          </div>
        ))}
      </div>

      {/* Filter chips + task table */}
      <div className={db.panel}>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, border: '1px solid ' + (f === filter ? 'var(--grass)' : 'var(--border)'), background: f === filter ? 'var(--grass)' : 'white', color: f === filter ? 'white' : 'var(--ink-mid)', cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.12s' }}>
              {f === 'all' ? 'All' : f === 'soilwetter' ? 'soil wetter' : f}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--cream)' }}>
                {['Month', 'Week', 'Task', 'Type', 'Method', 'Done'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid var(--border)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--ink-light)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ task, month, week }: any) => {
                const isDone = !!completions[task.id]
                const color  = (TYPE_COLORS as any)[task.taskType] || '#888'
                return (
                  <tr key={task.id} style={{ opacity: isDone ? 0.55 : 1 }}>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-light,#ede8de)' }}>{month.month?.slice(0, 3)}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-light,#ede8de)' }}>W{week}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-light,#ede8de)' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: color, marginRight: 5, flexShrink: 0 }} />
                        <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>{task.label}</span>
                        {task.conditional && <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 8, background: 'var(--cream)', border: '1px solid var(--soil-light)', color: 'var(--soil)', marginLeft: 7, whiteSpace: 'nowrap' }}>if req.</span>}
                      </div>
                    </td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-light,#ede8de)', color: 'var(--ink-light)', fontSize: 12 }}>{task.taskType === 'soilwetter' ? 'soil wetter' : task.taskType}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-light,#ede8de)', fontSize: 12, color: 'var(--ink-light)' }}>{(task.applicationMethod || '').replace('Backpack or handheld sprayer', 'Sprayer').replace('Fertiliser spreader', 'Spreader')}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-light,#ede8de)' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 3, fontSize: 12, background: isDone ? 'var(--grass)' : 'var(--border-light,#ede8de)', color: isDone ? 'white' : 'transparent' }}>{isDone ? 'v' : ''}</div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
