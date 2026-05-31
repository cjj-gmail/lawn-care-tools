import React, { useState } from 'react'
import { ZONES } from '../../config.js'
import { A } from '../../store/actions.js'
import { saveJson } from '../../services/github.js'
import { CONFIG } from '../../config.js'
import styles from './Modals.module.css'

const WATER_METHODS = [
  { value: 'sprinkler', label: 'Sprinkler' },
  { value: 'hose',      label: 'Hose' },
  { value: 'drip',      label: 'Drip irrigation' },
  { value: 'manual',    label: 'Manual (watering can)' },
]

export function WaterModal({ open, token, waterLog, waterLogSha, dispatch, onClose, showToast }) {
  const [checkedZones, setCheckedZones] = useState([])
  const [method,       setMethod]       = useState('sprinkler')
  const [duration,     setDuration]     = useState('')
  const [amount,       setAmount]       = useState('')
  const [notes,        setNotes]        = useState('')
  const [saving,       setSaving]       = useState(false)

  if (!open) return null

  const now = new Date()
  const dateLabel = now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  function toggleZone(id) {
    setCheckedZones(z => z.includes(id) ? z.filter(x => x !== id) : [...z, id])
  }

  async function handleSave() {
    if (checkedZones.length === 0) { showToast('Please select at least one zone', 'error'); return }
    const dur = parseInt(duration, 10)
    if (!duration || dur <= 0) { showToast('Please enter a duration in minutes', 'error'); return }
    const zoneNames = checkedZones.map(z => ZONES[z]?.name || z).join(', ')
    const entry = {
      id: 'water_' + now.getTime(),
      date: now.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dateISO: now.toISOString().slice(0, 10),
      zones: checkedZones, zoneNames, method,
      durationMin: dur,
      amountL: amount ? parseFloat(amount) : null,
      notes,
    }
    const updated = { entries: [entry, ...(waterLog?.entries || [])] }
    if (!token) { onClose(); showToast('Watering logged (session only)', 'error'); return }
    setSaving(true)
    try {
      const newSha = await saveJson(CONFIG.paths.waterLog, updated, waterLogSha, 'Log watering: ' + zoneNames, token)
      dispatch({ type: A.SET_WATER_LOG, waterLog: updated, sha: newSha })
      onClose(); showToast('Watering logged', 'success')
    } catch (e) {
      showToast('Save failed: ' + e.message, 'error')
    } finally { setSaving(false) }
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} style={{ maxWidth: 440 }}>
        <div className={styles.header}>
          <div><div className={styles.title}>Log irrigation</div><div className={styles.subtitle}>{dateLabel}</div></div>
          <button className={styles.close} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          {!token && <div className={styles.authNotice}>Connect GitHub to save watering records permanently.</div>}
          <div className={styles.logForm}>
            <div>
              <div className={styles.lfLabel}>Zones watered</div>
              <div className={styles.zoneChecks}>
                {Object.entries(ZONES).map(([id, z]) => (
                  <label key={id} className={styles.zoneCheckLabel}>
                    <input type="checkbox" checked={checkedZones.includes(id)} onChange={() => toggleZone(id)} style={{ accentColor: 'var(--grass)' }} />
                    {z.name} &ndash; {z.grass}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.lfLabel}>Method</div>
              <select className={styles.lfSelect} value={method} onChange={e => setMethod(e.target.value)}>
                {WATER_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <div className={styles.lfLabel}>Duration (minutes)</div>
              <input className={styles.lfInput} type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" max="999" placeholder="e.g. 20" />
            </div>
            <div>
              <div className={styles.lfLabel}>Amount (litres, optional)</div>
              <input className={styles.lfInput} type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.5" placeholder="e.g. 40" />
            </div>
            <div>
              <div className={styles.lfLabel}>Notes (optional)</div>
              <input className={styles.lfInput} type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. after fertiliser" maxLength={120} />
            </div>
          </div>
          {saving && <div className={styles.saving}>Saving...</div>}
        </div>
        <div className={styles.footer}>
          <button className={[styles.btn, styles.secondary].join(' ')} onClick={onClose}>Cancel</button>
          <button className={[styles.btn, styles.primary].join(' ')} onClick={handleSave} disabled={saving}>Save watering</button>
        </div>
      </div>
    </div>
  )
}
