import React, { useState, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppState, useAppDispatch } from '../../store/AppContext'
import { useAppInit } from '../../hooks/useAppInit.js'
import { useDashboardSave } from '../../hooks/useDashboardSave.js'
import { useToast } from '../../hooks/useToast.js'
import { startLogin } from '../../services/auth.js'
import { buildAlerts } from '../../utils/dashboardHelpers.js'

import { OverviewTab }   from './tabs/OverviewTab'
import { ProgramTab }    from './tabs/ProgramTab'
import { InventoryTab }  from './tabs/InventoryTab'
import { LogTab }        from './tabs/LogTab'
import { AlertsTab }     from './tabs/AlertsTab'
import { ZonesTab }      from './tabs/ZonesTab'

import { StockModal }     from './modals/StockModal'
import { ResupplyModal }  from './modals/ResupplyModal'
import { ManualLogModal } from './modals/ManualLogModal'
import { WeatherModal }   from './modals/WeatherModal'

import { Toast } from '../../components/Toast'
import db from './Dashboard.module.css'

const TABS = [
  { id:'overview',  label:'Overview' },
  { id:'program',   label:'Program' },
  { id:'inventory', label:'Inventory' },
  { id:'log',       label:'Log' },
  { id:'alerts',    label:'Alerts' },
  { id:'zones',     label:'Zones' },
]

export default function DashboardPage() {
  const state    = useAppState()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  useAppInit(dispatch)

  const { toast, showToast } = useToast()
  const { saveInventory, saveAppLog, saveWeather, deleteWeather } = useDashboardSave(state, dispatch, showToast)

  const paramTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(
    TABS.find(t => t.id === paramTab) ? paramTab : 'overview'
  )
  const [rendered, setRendered] = useState(() => new Set([paramTab || 'overview']))

  const [stockProduct,     setStockProduct]     = useState(null)
  const [resupplyProduct,  setResupplyProduct]  = useState(null)
  const [manualLogOpen,    setManualLogOpen]    = useState(false)
  const [weatherEditId,    setWeatherEditId]    = useState(null)
  const [weatherModalOpen, setWeatherModalOpen] = useState(false)

  // ── ALL hooks before early returns ────────────────────────────────────────
  const alertCount = useMemo(() => {
    if (state.status !== 'ready') return 0
    return buildAlerts({
      mowLog: state.mowLog, waterLog: state.waterLog,
      inventory: state.inventory, invStatusCache: state.invStatusCache,
      completions: state.completions, program: state.program,
    }).length
  }, [state])

  const critAlerts = useMemo(() => {
    if (state.status !== 'ready') return 0
    return buildAlerts({
      mowLog: state.mowLog, waterLog: state.waterLog,
      inventory: state.inventory, invStatusCache: state.invStatusCache,
      completions: state.completions, program: state.program,
    }).filter(a => a.type === 'critical').length
  }, [state])

  // ALL useCallback hooks before early returns
  function activateTab(id) {
    setActiveTab(id)
    setRendered(r => { const n = new Set(r); n.add(id); return n })
  }

  const handleStockSave = useCallback(async (product, newQty) => {
    const updated = JSON.parse(JSON.stringify(state.inventory))
    const p = updated.products.find(x => x.name === product.name)
    if (p) p.qtyRemaining = newQty
    const ok = await saveInventory(updated, 'Update stock: ' + product.name + ' to ' + newQty + product.unit)
    if (ok) showToast(product.name + ' updated to ' + newQty + product.unit, 'success')
  }, [state.inventory, saveInventory, showToast])

  const handleResupplySave = useCallback(async (product, newQty) => {
    const added = Math.round((newQty - product.qtyRemaining) * 100) / 100
    const updated = JSON.parse(JSON.stringify(state.inventory))
    const p = updated.products.find(x => x.name === product.name)
    if (p) p.qtyRemaining = newQty
    const ok = await saveInventory(updated, 'Resupply: ' + product.name + ' +' + added + product.unit)
    if (ok) showToast(product.name + ' restocked to ' + newQty + product.unit, 'success')
  }, [state.inventory, saveInventory, showToast])

  const handleManualLogSave = useCallback(async (entry) => {
    if (!state.token) { showToast('Connect GitHub to save', 'error'); return }
    const ok = await saveAppLog(entry)
    if (ok) showToast('Manual application logged', 'success')
    else showToast('Entry added (session only)', 'error')
  }, [state.token, saveAppLog, showToast])

  const handleWeatherSave = useCallback(async (entry) => {
    const entries = (state.weatherLog?.entries || []).filter(e => e.id !== entry.id)
    entries.unshift(entry)
    entries.sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    const wl = { entries }
    const ok = await saveWeather(wl, 'Weather log: ' + entry.type + ' -- ' + entry.date)
    if (ok) showToast('Observation saved', 'success')
    else showToast('Saved (session only)', 'error')
  }, [state.weatherLog, saveWeather, showToast])

  const handleWeatherDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this observation?')) return
    const ok = await deleteWeather(id)
    if (ok) showToast('Observation deleted', 'success')
  }, [deleteWeather, showToast])

  function openWeatherModal(editId) {
    setWeatherEditId(editId || null)
    setWeatherModalOpen(true)
  }

  // ── Loading / error — AFTER all hooks ────────────────────────────────────
  if (state.status === 'loading') {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:16, color:'var(--ink-light)' }}>
        <div className="spinner" /><div style={{ fontSize:15 }}>Loading dashboard...</div>
      </div>
    )
  }
  if (state.status === 'error') {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:12, padding:24, textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:24 }}>Could not load data</div>
        <div style={{ fontSize:15, color:'var(--ink-light)', maxWidth:400 }}>{state.error}</div>
        <Link to="/" style={{ marginTop:8, color:'var(--grass)' }}>&larr; Home</Link>
      </div>
    )
  }

  const weatherEditEntry = weatherEditId
    ? (state.weatherLog?.entries || []).find(e => e.id === weatherEditId)
    : null

  return (
    <div>
      <header className="app-header">
        <div className="app-header-title">Lawn Care Dashboard</div>
        <div className="app-header-right">
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, opacity:0.8 }}>
            <div className={`auth-dot${state.token ? ' connected' : ''}`} />
            <span>{state.token ? 'GitHub connected' : 'Not connected'}</span>
          </div>
          {!state.token && <button className="hdr-btn" onClick={startLogin}>Connect GitHub</button>}
          <Link className="hdr-btn" to="/tracker">Tracker</Link>
          <Link className="hdr-btn" to="/">&larr; Home</Link>
        </div>
      </header>

      <nav className={db.dashNav}>
        {TABS.map(t => (
          <button key={t.id}
            className={[db.navTab, activeTab===t.id ? db.active : ''].filter(Boolean).join(' ')}
            onClick={() => activateTab(t.id)}>
            {t.label}
            {t.id==='alerts' && alertCount>0 && (
              <span style={{ marginLeft:6, fontSize:11, padding:'1px 6px', borderRadius:8, background:critAlerts>0?'var(--status-critical)':'var(--status-low)', color:'white', fontWeight:500 }}>
                {alertCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className={db.dashBody}>
        {rendered.has('overview')  && <div style={{ display:activeTab==='overview'  ? 'block':'none' }}><OverviewTab  state={state} onLogObservation={openWeatherModal} onDeleteWeather={handleWeatherDelete} onNavigateTab={activateTab} /></div>}
        {rendered.has('program')   && <div style={{ display:activeTab==='program'   ? 'block':'none' }}><ProgramTab   state={state} /></div>}
        {rendered.has('inventory') && <div style={{ display:activeTab==='inventory' ? 'block':'none' }}><InventoryTab state={state} onOpenStock={setStockProduct} onOpenResupply={setResupplyProduct} /></div>}
        {rendered.has('log')       && <div style={{ display:activeTab==='log'       ? 'block':'none' }}><LogTab       state={state} onOpenManualLog={() => setManualLogOpen(true)} /></div>}
        {rendered.has('alerts')    && <div style={{ display:activeTab==='alerts'    ? 'block':'none' }}><AlertsTab    state={state} /></div>}
        {rendered.has('zones')     && <div style={{ display:activeTab==='zones'     ? 'block':'none' }}><ZonesTab     state={state} /></div>}
      </div>

      <StockModal    product={stockProduct}    token={state.token} onSave={handleStockSave}    onClose={() => setStockProduct(null)} />
      <ResupplyModal product={resupplyProduct} token={state.token} onSave={handleResupplySave} onClose={() => setResupplyProduct(null)} />
      {manualLogOpen && <ManualLogModal token={state.token} inventory={state.inventory} onSave={handleManualLogSave} onClose={() => setManualLogOpen(false)} />}
      {weatherModalOpen && <WeatherModal editEntry={weatherEditEntry} token={state.token} onSave={handleWeatherSave} onClose={() => { setWeatherModalOpen(false); setWeatherEditId(null) }} />}
      <Toast {...toast} />
    </div>
  )
}
