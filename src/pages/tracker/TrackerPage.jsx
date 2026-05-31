import React, { useState, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppState, useAppDispatch } from '../../store/AppContext.jsx'
import { useAppInit } from '../../hooks/useAppInit.js'
import { useTrackerSave } from '../../hooks/useTrackerSave.js'
import { useToast } from '../../hooks/useToast.js'
import { A } from '../../store/actions.js'
import { startLogin } from '../../services/auth.js'
import { WeekBlock } from './WeekBlock.jsx'
import { HeightRefCard } from './HeightRefCard.jsx'
import { DeductModal } from './DeductModal.jsx'
import { UncheckModal } from './UncheckModal.jsx'
import { MowModal } from './MowModal.jsx'
import { WaterModal } from './WaterModal.jsx'
import { Toast } from '../../components/Toast.jsx'
import styles from './TrackerPage.module.css'

// ─── helpers ─────────────────────────────────────────────────────────────────
function calcDeductions(task, inventory) {
  if (!task.products || !inventory) return []
  return task.products
    .map(prod => {
      const total = Math.round(
        Object.values(prod.quantities || {}).reduce((s, q) => s + (parseFloat(q) || 0), 0) * 100
      ) / 100
      if (total <= 0) return null
      const invProd = inventory.products.find(p =>
        p.name.toLowerCase() === prod.name.toLowerCase() ||
        p.name.toLowerCase().includes(prod.name.toLowerCase()) ||
        prod.name.toLowerCase().includes(p.name.toLowerCase())
      )
      const newLevel = invProd ? Math.max(0, Math.round((invProd.qtyRemaining - total) * 100) / 100) : null
      let newStatus = null
      if (invProd && newLevel !== null) {
        const fullSizes = { 'TX10 (5-2-8)': 25, 'Maintain (26-1-9)': 20 }
        const full = fullSizes[invProd.name] || (invProd.unit === 'kg' ? 20 : 5)
        const pct  = Math.min(100, Math.round((newLevel / full) * 100))
        newStatus  = pct > 40 ? 'ok' : pct > 15 ? 'low' : 'critical'
      }
      return { name: prod.name, amount: total, unit: prod.rateUnit || 'mL', invProd, newLevel, newStatus }
    })
    .filter(Boolean)
}

// ─── TrackerPage ──────────────────────────────────────────────────────────────
export default function TrackerPage() {
  const state    = useAppState()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  useAppInit(dispatch)

  const { toast, showToast } = useToast()
  const { saveCompletions, saveInventory, writeAppLog } = useTrackerSave(state, dispatch, showToast)

  // Month selection — URL param takes precedence, then current calendar month
  const paramMonth = parseInt(searchParams.get('month'), 10)
  const [selectedMonth, setSelectedMonth] = useState(
    paramMonth >= 1 && paramMonth <= 12 ? paramMonth : new Date().getMonth() + 1
  )

  // Modal state
  const [pendingDeduct, setPendingDeduct]   = useState(null)  // { task, deductions }
  const [pendingUncheck, setPendingUncheck] = useState(null)  // { taskId, taskLabel }
  const [deductSaving, setDeductSaving]     = useState(false)
  const [mowOpen,  setMowOpen]              = useState(false)
  const [waterOpen, setWaterOpen]           = useState(false)

  // ── Loading / error screens ────────────────────────────────────────────────
  if (state.status === 'loading') {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:16, color:'var(--ink-light)' }}>
        <div className="spinner" />
        <div style={{ fontSize: 15 }}>Loading program data...</div>
      </div>
    )
  }
  if (state.status === 'error') {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:12, padding:24, textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:24 }}>Could not load program</div>
        <div style={{ fontSize:15, color:'var(--ink-light)', maxWidth:400 }}>{state.error}</div>
        <Link to="/" style={{ marginTop:8, color:'var(--grass)' }}>&larr; Back to home</Link>
      </div>
    )
  }

  const { program, completions, inventory, token, sha } = state
  const currentCalMonth = new Date().getMonth() + 1
  const monthData = program?.months?.find(m => m.monthNum === selectedMonth)

  // Progress for selected month
  const { total, done } = useMemo(() => {
    let total = 0, done = 0
    monthData?.weeks?.forEach(w => {
      ;(w.tasks || []).forEach(t => { total++; if (completions[t.id]) done++ })
    })
    return { total, done }
  }, [monthData, completions])
  const pct = total > 0 ? Math.round(done / total * 100) : 0

  // ── Toggle task ────────────────────────────────────────────────────────────
  const handleToggle = useCallback(async (task, isCompleted) => {
    if (isCompleted) {
      // Already done — confirm uncheck
      setPendingUncheck({ taskId: task.id, taskLabel: task.label })
      return
    }
    // Mark complete optimistically
    const now  = new Date()
    const newCompletions = {
      ...completions,
      [task.id]: {
        completedAt:   now.toLocaleDateString('en-AU', { day:'2-digit', month:'2-digit', year:'numeric' }),
        completedTime: now.toISOString(),
      },
    }
    dispatch({ type: A.SET_COMPLETIONS, completions: newCompletions, sha: sha.completions })
    if (token) {
      const ok = await saveCompletions(newCompletions, sha.completions)
      if (!ok) {
        // Roll back
        const rolled = { ...newCompletions }
        delete rolled[task.id]
        dispatch({ type: A.SET_COMPLETIONS, completions: rolled, sha: sha.completions })
        return
      }
    } else {
      showToast('Not saved — connect GitHub to persist', 'error')
    }
    // Open deduction modal if products exist and authenticated
    if (inventory && task.products?.length > 0 && token) {
      const deductions = calcDeductions(task, inventory)
      if (deductions.length > 0) {
        setPendingDeduct({ task, deductions })
        return
      }
    }
    if (token) writeAppLog(task, [], false)
    showToast('Task completed', 'success')
  }, [completions, sha, token, inventory, dispatch, saveCompletions, writeAppLog, showToast])

  // ── Uncheck confirm ────────────────────────────────────────────────────────
  const handleUncheckConfirm = useCallback(async () => {
    if (!pendingUncheck) return
    const { taskId } = pendingUncheck
    setPendingUncheck(null)
    const newCompletions = { ...completions }
    delete newCompletions[taskId]
    dispatch({ type: A.SET_COMPLETIONS, completions: newCompletions, sha: sha.completions })
    if (token) {
      await saveCompletions(newCompletions, sha.completions)
      showToast('Task unmarked', 'error')
    } else {
      showToast('Not saved — connect GitHub to persist', 'error')
    }
  }, [pendingUncheck, completions, sha, token, dispatch, saveCompletions, showToast])

  // ── Deduction handlers ─────────────────────────────────────────────────────
  const handleDeductCancel = useCallback(async () => {
    if (!pendingDeduct) return
    const { task } = pendingDeduct
    setPendingDeduct(null)
    // Roll back the completion
    const rolled = { ...completions }
    delete rolled[task.id]
    dispatch({ type: A.SET_COMPLETIONS, completions: rolled, sha: sha.completions })
    if (token) await saveCompletions(rolled, sha.completions)
    showToast('Cancelled', 'error')
  }, [pendingDeduct, completions, sha, token, dispatch, saveCompletions, showToast])

  const handleDeductSkip = useCallback(async () => {
    if (!pendingDeduct) return
    const { task, deductions } = pendingDeduct
    setPendingDeduct(null)
    if (token) await writeAppLog(task, deductions, false)
    showToast('Task completed — inventory not updated', 'success')
  }, [pendingDeduct, token, writeAppLog, showToast])

  const handleDeductConfirm = useCallback(async () => {
    if (!pendingDeduct || !inventory) return
    const { task, deductions } = pendingDeduct
    setDeductSaving(true)
    // Apply deductions to a fresh copy of inventory
    const updatedInv = JSON.parse(JSON.stringify(inventory))
    deductions.forEach(d => {
      if (!d.invProd) return
      const prod = updatedInv.products.find(p => p.name === d.invProd.name)
      if (prod) prod.qtyRemaining = Math.max(0, Math.round((prod.qtyRemaining - d.amount) * 100) / 100)
    })
    const ok = await saveInventory(updatedInv, sha.inventory)
    if (ok) await writeAppLog(task, deductions, true)
    setPendingDeduct(null)
    setDeductSaving(false)
    if (ok) {
      const n = deductions.filter(d => d.invProd).length
      showToast('Task done — ' + n + ' product' + (n !== 1 ? 's' : '') + ' deducted', 'success')
    }
  }, [pendingDeduct, inventory, sha, saveInventory, writeAppLog, showToast])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="app-header-title">Lawn Program Tracker</div>
        <div className="app-header-right">
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, opacity:0.8 }}>
            <div className={`auth-dot${token ? ' connected' : ''}`} />
            <span style={{ display: token ? 'none' : undefined }}>
              {state.readOnly ? 'Read-only' : 'Not connected'}
            </span>
          </div>
          {!token && (
            <button className="hdr-btn" onClick={startLogin}>Connect GitHub</button>
          )}
          {token && (
            <>
              <button className="hdr-btn" onClick={() => setWaterOpen(true)}>Log irrigation</button>
              <button className="hdr-btn" onClick={() => setMowOpen(true)}>Log mow</button>
            </>
          )}
          <Link className="hdr-btn" to="/dashboard">Dashboard</Link>
          <Link className="hdr-btn" to="/">&larr; Home</Link>
        </div>
      </header>

      {/* Month navigation */}
      <nav className={styles.monthNav}>
        {program?.months?.map(m => (
          <button
            key={m.monthNum}
            className={[
              styles.monthBtn,
              m.monthNum === selectedMonth ? styles.active : '',
              m.monthNum === currentCalMonth ? styles.current : '',
            ].filter(Boolean).join(' ')}
            onClick={() => setSelectedMonth(m.monthNum)}
          >
            {m.month.slice(0, 3).toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressLabel}>Month progress</div>
        <div className={styles.progressWrap}>
          <div className={styles.progressFill} style={{ width: pct + '%' }} />
        </div>
        <div className={styles.progressCount}>{done} / {total} tasks</div>
      </div>

      {/* Main content */}
      <main className={styles.main}>
        {monthData ? (
          <>
            <div className={styles.monthHeaderRow}>
              <div className={styles.monthTitle}>
                {monthData.month}
                <span className={['season-badge', monthData.season].filter(Boolean).join(' ')}>
                  {monthData.season}
                </span>
              </div>
            </div>
            <HeightRefCard season={monthData.season} />
            {monthData.weeks?.map(week => (
              <WeekBlock
                key={week.week}
                week={week}
                completions={completions}
                cautions={program?.cautions}
                onToggle={handleToggle}
              />
            ))}
          </>
        ) : (
          <div style={{ padding:32, textAlign:'center', color:'var(--ink-light)' }}>
            No data for this month.
          </div>
        )}
      </main>

      {/* Modals */}
      <DeductModal
        pending={pendingDeduct}
        saving={deductSaving}
        onCancel={handleDeductCancel}
        onSkip={handleDeductSkip}
        onConfirm={handleDeductConfirm}
      />
      <UncheckModal
        taskLabel={pendingUncheck?.taskLabel}
        onKeep={() => setPendingUncheck(null)}
        onConfirm={handleUncheckConfirm}
      />
      <MowModal
        open={mowOpen}
        token={token}
        mowLog={state.mowLog}
        mowLogSha={state.sha.mowLog}
        dispatch={dispatch}
        onClose={() => setMowOpen(false)}
        showToast={showToast}
      />
      <WaterModal
        open={waterOpen}
        token={token}
        waterLog={state.waterLog}
        waterLogSha={state.sha.waterLog}
        dispatch={dispatch}
        onClose={() => setWaterOpen(false)}
        showToast={showToast}
      />
      <Toast {...toast} />
    </div>
  )
}
