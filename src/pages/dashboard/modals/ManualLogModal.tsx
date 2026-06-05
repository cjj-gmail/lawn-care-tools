import React, { useState } from 'react'
import { ZONES, ZONE_ORDER, TASK_TYPES } from '../../../config.js'
import s from './DashModal.module.css'

const UNITS = ['mL', 'L', 'g', 'kg']

interface ProductEntry {
  name: string
  amount: string
  unit: string
}

interface ManualLogModalProps {
  token: string | null
  inventory: any
  onSave: (entry: any) => Promise<void>
  onClose: () => void
}

export function ManualLogModal({ token, inventory, onSave, onClose }: ManualLogModalProps) {
  const [label,    setLabel]    = useState('')
  const [type,     setType]     = useState('fertilise')
  const [zones,    setZones]    = useState<string[]>([])
  const [products, setProducts] = useState<ProductEntry[]>([{ name: '', amount: '', unit: 'mL' }])
  const [notes,    setNotes]    = useState('')
  const [saving,   setSaving]   = useState(false)

  const now     = new Date()
  const dateStr = now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  function toggleZone(id: string) {
    setZones(z => z.includes(id) ? z.filter(x => x !== id) : [...z, id])
  }
  function updateProduct(i: number, field: keyof ProductEntry, val: string) {
    setProducts(ps => ps.map((p, j) => j === i ? { ...p, [field]: val } : p))
  }
  function addProduct() { setProducts(ps => [...ps, { name: '', amount: '', unit: 'mL' }]) }
  function removeProduct(i: number) { setProducts(ps => ps.filter((_, j) => j !== i)) }

  async function handleSave() {
    if (!label.trim()) return
    const entry = {
      id: 'app_' + now.getTime(),
      date: now.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dateISO: now.toISOString().slice(0, 10),
      taskId: 'manual', taskLabel: label.trim(), taskType: type,
      zones,
      products: products.filter(p => p.name && parseFloat(p.amount) > 0).map(p => ({
        name: p.name, amount: Math.round(parseFloat(p.amount) * 100) / 100, unit: p.unit, deducted: false,
      })),
      inventoryDeducted: false, manual: true, notes: notes.trim() || undefined,
    }
    setSaving(true)
    await onSave(entry)
    setSaving(false)
    onClose()
  }

  const prodNames: string[] = (inventory?.products || []).map((p: any) => p.name)

  return (
    <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={s.modal} style={{ maxWidth: 500 }}>
        <div className={s.header}>
          <div><div className={s.title}>Log a manual application</div><div className={s.subtitle}>{dateStr}</div></div>
          <button className={s.close} onClick={onClose}>&times;</button>
        </div>
        <div className={s.body}>
          {!token && <div className={s.authNotice}>Connect GitHub to save permanently.</div>}
          <div className={s.form}>
            <div>
              <div className={s.fieldLabel}>Label / task description</div>
              <input className={s.input} style={{ width: '100%' }} type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Spot spray weeds..." maxLength={80} autoFocus />
            </div>
            <div>
              <div className={s.fieldLabel}>Type</div>
              <select className={s.input} style={{ width: '100%', appearance: 'none' }} value={type} onChange={e => setType(e.target.value)}>
                {(TASK_TYPES as string[]).map(t => <option key={t} value={t}>{t === 'soilwetter' ? 'Soil Wetter' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <div className={s.fieldLabel}>Zones applied</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(ZONE_ORDER as string[]).map(zid => (
                  <label key={zid} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={zones.includes(zid)} onChange={() => toggleZone(zid)} style={{ accentColor: 'var(--grass)' }} />
                    {(ZONES as any)[zid]?.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className={s.fieldLabel}>Products used</div>
              {products.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                  <input className={s.input} style={{ flex: 2 }} type="text" value={p.name} onChange={e => updateProduct(i, 'name', e.target.value)} placeholder="Product name" list="prod-names-list" />
                  <input className={s.input} style={{ flex: 1 }} type="number" value={p.amount} onChange={e => updateProduct(i, 'amount', e.target.value)} placeholder="Amount" min="0" step="0.01" />
                  <select className={s.input} style={{ flex: '0 0 60px', appearance: 'none' } as React.CSSProperties} value={p.unit} onChange={e => updateProduct(i, 'unit', e.target.value)}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                  {products.length > 1 && <button onClick={() => removeProduct(i)} style={{ background: 'none', border: 'none', color: 'var(--ink-light)', cursor: 'pointer', fontSize: 16 }}>&times;</button>}
                </div>
              ))}
              <datalist id="prod-names-list">{prodNames.map(n => <option key={n} value={n} />)}</datalist>
              <button onClick={addProduct} style={{ fontSize: 12, color: 'var(--grass)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add product</button>
            </div>
            <div>
              <div className={s.fieldLabel}>Notes (optional)</div>
              <textarea className={s.input} style={{ width: '100%', minHeight: 60, resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} maxLength={200} placeholder="Conditions, observations..." />
            </div>
          </div>
          {saving && <div className={s.saving}>Saving to GitHub...</div>}
        </div>
        <div className={s.footer}>
          <button className={[s.btn, s.secondary].join(' ')} onClick={onClose}>Cancel</button>
          <button className={[s.btn, s.primary].join(' ')} onClick={handleSave} disabled={saving || !label.trim()}>Save entry</button>
        </div>
      </div>
    </div>
  )
}
