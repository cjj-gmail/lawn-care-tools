import React, { useState } from 'react'
import s from './DashModal.module.css'

export function ResupplyModal({ product, token, onSave, onClose }) {
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)

  if (!product) return null

  async function handleSave() {
    const n = parseFloat(amount)
    if (isNaN(n) || n <= 0) return
    setSaving(true)
    const newQty = Math.round((product.qtyRemaining + n) * 100) / 100
    await onSave(product, newQty)
    setSaving(false)
    onClose()
  }

  return (
    <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={s.modal}>
        <div className={s.header}>
          <div><div className={s.title}>+ Resupply — {product.name}</div><div className={s.subtitle}>Add received stock to current quantity</div></div>
          <button className={s.close} onClick={onClose}>&times;</button>
        </div>
        <div className={s.body}>
          {!token && <div className={s.authNotice}>Connect GitHub to save changes permanently.</div>}
          <div className={s.currentRow}>
            <span className={s.currentLabel}>Current stock</span>
            <span className={s.currentVal}>{product.qtyRemaining}{product.unit}</span>
          </div>
          <div className={s.fieldLabel}>Amount received</div>
          <div className={s.inputRow}>
            <input className={s.input} type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step="0.01" placeholder="0.00" autoFocus />
            <span className={s.unit}>{product.unit}</span>
          </div>
          {amount && !isNaN(parseFloat(amount)) && (
            <div style={{ fontSize:13, color:'var(--ink-light)', marginBottom:16 }}>
              New total: {Math.round((product.qtyRemaining + parseFloat(amount))*100)/100}{product.unit}
            </div>
          )}
          {saving && <div className={s.saving}>Saving to GitHub...</div>}
        </div>
        <div className={s.footer}>
          <button className={[s.btn, s.secondary].join(' ')} onClick={onClose}>Cancel</button>
          <button className={[s.btn, s.primary].join(' ')} onClick={handleSave} disabled={saving}>Add stock</button>
        </div>
      </div>
    </div>
  )
}
