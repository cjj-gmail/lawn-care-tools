import React, { useState, useEffect } from 'react'
import s from './DashModal.module.css'

const TYPES = ['rain','heat','frost','drought','storm','observation','other']

export function WeatherModal({ editEntry, token, onSave, onClose }) {
  const isEdit = !!editEntry
  const now = new Date()

  const [date,   setDate]   = useState(now.toISOString().slice(0,10))
  const [type,   setType]   = useState('observation')
  const [note,   setNote]   = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editEntry) {
      setDate(editEntry.dateISO || now.toISOString().slice(0,10))
      setType(editEntry.type || 'observation')
      setNote(editEntry.note || '')
    } else {
      setDate(now.toISOString().slice(0,10))
      setType('observation')
      setNote('')
    }
  }, [editEntry])

  const dateLabel = now.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  async function handleSave() {
    if (!note.trim() || !date) return
    const d = new Date(date)
    const entry = {
      id:      editEntry?.id || ('wx_' + Date.now()),
      date:    d.toLocaleDateString('en-AU', { day:'2-digit', month:'2-digit', year:'numeric' }),
      dateISO: date,
      type,
      note:    note.trim(),
    }
    setSaving(true)
    await onSave(entry)
    setSaving(false)
    onClose()
  }

  return (
    <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={s.modal} style={{ maxWidth:440 }}>
        <div className={s.header}>
          <div><div className={s.title}>{isEdit ? 'Edit observation' : 'Log observation'}</div><div className={s.subtitle}>{dateLabel}</div></div>
          <button className={s.close} onClick={onClose}>&times;</button>
        </div>
        <div className={s.body}>
          {!token && <div className={s.authNotice}>Connect GitHub to save permanently.</div>}
          <div className={s.form}>
            <div>
              <div className={s.fieldLabel}>Date</div>
              <input className={s.input} style={{ width:'100%' }} type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <div className={s.fieldLabel}>Type</div>
              <select className={s.input} style={{ width:'100%', appearance:'none' }} value={type} onChange={e => setType(e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <div className={s.fieldLabel} style={{ display:'flex', justifyContent:'space-between' }}>
                <span>Note (max 200 chars)</span>
                <span style={{ color:'var(--ink-light)' }}>{note.length}/200</span>
              </div>
              <textarea className={s.input} style={{ width:'100%', minHeight:80, resize:'vertical' }}
                value={note} onChange={e => setNote(e.target.value)} maxLength={200}
                placeholder="e.g. 25mm overnight rain, temps reached 38C..." autoFocus={!isEdit} />
            </div>
          </div>
          {saving && <div className={s.saving}>Saving to GitHub...</div>}
        </div>
        <div className={s.footer}>
          <button className={[s.btn, s.secondary].join(' ')} onClick={onClose}>Cancel</button>
          <button className={[s.btn, s.primary].join(' ')} onClick={handleSave} disabled={saving || !note.trim()}>
            {isEdit ? 'Save changes' : 'Save observation'}
          </button>
        </div>
      </div>
    </div>
  )
}
