import React from 'react'
import styles from './Modals.module.css'

export function DeductModal({ pending, saving, onCancel, onSkip, onConfirm }) {
  if (!pending) return null
  const { task, deductions } = pending
  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{task.label}</div>
            <div className={styles.subtitle}>{task.taskType} — {task.applicationMethod}</div>
          </div>
          <button className={styles.close} onClick={onCancel}>&times;</button>
        </div>
        <div className={styles.body}>
          <div className={styles.intro}>Deduct quantities used from your inventory?</div>
          {task.conditional && (
            <div className={styles.conditionalNote}>
              Conditional task — only deduct if you actually applied these products.
            </div>
          )}
          <div className={styles.deductList}>
            {deductions.map((d, i) => (
              <div key={i} className={[styles.deductRow, !d.invProd ? styles.noMatch : ''].filter(Boolean).join(' ')}>
                <div className={styles.deductProduct}>
                  <div className={styles.deductName}>{d.name}</div>
                  <div className={styles.deductMeta}>
                    {d.invProd ? 'Currently ' + d.invProd.qtyRemaining + d.invProd.unit : 'Not found in inventory'}
                  </div>
                  {d.invProd && d.newLevel !== null && (
                    <div className={[styles.deductNewLevel, d.newStatus !== 'ok' ? styles[d.newStatus] : ''].filter(Boolean).join(' ')}>
                      After: {d.newLevel}{d.invProd.unit} remaining
                      {d.newStatus === 'low' ? ' — running low' : d.newStatus === 'critical' ? ' — critically low' : ''}
                    </div>
                  )}
                </div>
                {d.invProd
                  ? <div className={styles.deductAmount}>-{d.amount}{d.unit}</div>
                  : <div className={styles.noMatchLabel}>skip</div>
                }
              </div>
            ))}
          </div>
          {saving && <div className={styles.saving}>Saving...</div>}
        </div>
        <div className={styles.footer}>
          <button className={[styles.btn, styles.secondary].join(' ')} onClick={onCancel}>
            Cancel — uncheck task
          </button>
          <button className={[styles.btn, styles.secondary].join(' ')} onClick={onSkip}>
            Skip deduction
          </button>
          <button className={[styles.btn, styles.primary].join(' ')} onClick={onConfirm} disabled={saving}>
            Deduct from inventory
          </button>
        </div>
      </div>
    </div>
  )
}
