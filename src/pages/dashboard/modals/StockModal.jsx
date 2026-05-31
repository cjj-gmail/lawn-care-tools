import React, { useState, useEffect } from 'react'
import s from './DashModal.module.css'

export function StockModal({ product, token, onSave, onClose }) {
  const [qty,    setQty]    = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product) setQty(String(product.qtyRemaining))
  }, [product])

  if (!product) return null

  const quickSizes = product.unit === 'kg' ? [5,10,20,25] : [0.5,1,2,5]

  async function handleSave() {
    const n = parseFloat(qty)
    if (isNaN(n) || n < 0) return
    setSaving(true)
    await onSave(product, n)
    setSaving(false)
    onClose()
  }

  return (
    <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={s.modal}>
        <div className={s.header}>
          <div><div className={s.title}>{product.name}</div><div className={s.subtitle}>{product.brand} &middot; {product.category}</div></div>
          <button className={s.close} onClick={onClose}>&times;</button>
        </div>
        <div className={s.body}>
          {!token && <div className={s.authNotice}>Connect GitHub to save changes permanently.</div>}
          <div className={s.currentRow}>
            <span className={s.currentLabel}>Current stock</span>
            <span className={s.currentVal}>{product.qtyRemaining}{product.unit}</span>
          </div>
          <div className={s.fieldLabel}>Set new quantity</div>
          <div className={s.inputRow}>
            <input className={s.input} type="number" value={qty} onChange={e => setQty(e.target.value)} min="0" step="0.01" autoFocus />
            <span className={s.unit}>{product.unit}</span>
          </div>
          <div className={s.fieldLabel}>Quick add</div>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:18 }}>
            {quickSizes.map(sz => (
              <button key={sz} onClick={() => setQty(v => String(Math.round((parseFloat(v)||0)+sz)*100/100))}
                style={{ fontSize:12, padding:'4px 12px', borderRadius:12, border:'1px solid var(--border)', background:'white', color:'var(--ink-mid)', cursor:'pointer', fontFamily:'var(--font-mono)' }}>
                + {sz}{product.unit}
              </button>
            ))}
          </div>
          {saving && <div className={s.saving}>Saving to GitHub...</div>}
        </div>
        <div className={s.footer}>
          <button className={[s.btn, s.secondary].join(' ')} onClick={onClose}>Cancel</button>
          <button className={[s.btn, s.primary].join(' ')} onClick={handleSave} disabled={saving}>Save</button>
        </div>
      </div>
    </div>
  )
}
