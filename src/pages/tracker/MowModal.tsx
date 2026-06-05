import React, { useState } from 'react'
import { ZONES, MOWER_HEIGHTS } from '../../config.js'
import { A } from '../../store/actions.js'
import { saveJson } from '../../services/github.js'
import { CONFIG } from '../../config.js'
import styles from './Modals.module.css'

const ZONE_OPTIONS = [
  ...Object.entries(ZONES).map(([id, z]: [string, any]) => ({ value: id, label: `${z.name} - ${z.grass} (${z.area}m2)` })),
  { value: 'all', label: 'All zones' },
]
const MOWER_OPTIONS = Object.keys(MOWER_HEIGHTS)

interface MowModalProps {
  open: boolean
  token: string | null
  mowLog: any
  mowLogSha: string | null
  dispatch: (action: any) => void
  onClose: () => void
  showToast: (msg: string, type?: string) => void
}

export function MowModal({ open, token, mowLog, mowLogSha, dispatch, onClose, showToast }: MowModalProps) {
  const [zone,           setZone]          = useState('back')
  const [mower,          setMower]         = useState(MOWER_OPTIONS[0])
  const [selectedHeight, setSelectedHeight] = useState<number | null>(null)
  const [notes,          setNotes]         = useState('')
  const [saving,         setSaving]        = useState(false)

  if (!open) return null

  const heights: number[] = (MOWER_HEIGHTS as any)[mower] || []
  const now = new Date()
  const dateLabel = now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  async function handleSave() {
    if (!selectedHeight) { showToast('Please select a height setting', 'error'); return }
    const zoneInfo = (ZONES as any)[zone]
    const entry = {
      id: 'mow_' + now.getTime(),
      date: now.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dateISO: now.toISOString().slice(0, 10),
      zone,
      zoneName: zoneInfo ? zoneInfo.name : zone === 'all' ? 'All zones' : zone,
      grass: zoneInfo ? zoneInfo.grass : zone === 'all' ? 'Mixed' : '-',
      mower,
      heightMm: selectedHeight,
      notes,
    }
    const updated = { entries: [entry, ...(mowLog?.entries || [])] }
    if (!token) { onClose(); showToast('Mow logged (session only)', 'error'); return }
    setSaving(true)
    try {
      const newSha = await saveJson((CONFIG as any).paths.mowLog, updated, mowLogSha, 'Log mow: ' + entry.zoneName, token)
      dispatch({ type: A.SET_MOW_LOG, mowLog: updated, sha: newSha })
      onClose(); showToast('Mow logged', 'success')
    } catch (e: any) {
      showToast('Save failed: ' + e.message, 'error')
    } finally { setSaving(false) }
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} style={{ maxWidth: 440 }}>
        <div className={styles.header}>
          <div><div className={styles.title}>Log a mow</div><div className={styles.subtitle}>{dateLabel}</div></div>
          <button className={styles.close} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          {!token && <div className={styles.authNotice}>Connect GitHub to save mowing records permanently.</div>}
          <div className={styles.logForm}>
            <div>
              <div className={styles.lfLabel}>Zone</div>
              <select className={styles.lfSelect} value={zone} onChange={e => setZone(e.target.value)}>
                {ZONE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <div className={styles.lfLabel}>Mower</div>
              <select className={styles.lfSelect} value={mower} onChange={e => { setMower(e.target.value); setSelectedHeight(null) }}>
                {MOWER_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <div className={styles.lfLabel}>
                Height &ndash; <span>{selectedHeight ? selectedHeight + 'mm' : 'select below'}</span>
              </div>
              <div className={styles.heightGrid}>
                {heights.map(h => (
                  <button
                    key={h}
                    className={[styles.heightBtn, selectedHeight === h ? styles.heightActive : ''].filter(Boolean).join(' ')}
                    onClick={() => setSelectedHeight(h)}
                  >{h}mm</button>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.lfLabel}>Notes (optional)</div>
              <input className={styles.lfInput} type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. edges done" maxLength={120} />
            </div>
          </div>
          {saving && <div className={styles.saving}>Saving...</div>}
        </div>
        <div className={styles.footer}>
          <button className={[styles.btn, styles.secondary].join(' ')} onClick={onClose}>Cancel</button>
          <button className={[styles.btn, styles.primary].join(' ')} onClick={handleSave} disabled={saving}>Save mow</button>
        </div>
      </div>
    </div>
  )
}
