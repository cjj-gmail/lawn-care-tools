import React from 'react'
import styles from './Modals.module.css'

export function UncheckModal({ taskLabel, onKeep, onConfirm }) {
  if (!taskLabel) return null
  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onKeep() }}>
      <div className={styles.modal} style={{ maxWidth: 420 }}>
        <div className={[styles.header, styles.danger].join(' ')}>
          <div className={styles.title}>Uncheck: {taskLabel}</div>
          <button className={styles.close} onClick={onKeep}>&times;</button>
        </div>
        <div className={styles.body}>
          <div className={styles.warnBox}>
            <strong>This task is already marked complete.</strong>
            Unchecking will remove the completion record. This does <em>not</em> reverse
            inventory deductions.
            <br /><br />
            Only uncheck if this was marked done by mistake.
          </div>
        </div>
        <div className={styles.footer}>
          <button className={[styles.btn, styles.secondary].join(' ')} onClick={onKeep}>
            Keep as complete
          </button>
          <button className={[styles.btn, styles.danger].join(' ')} onClick={onConfirm}>
            Yes, uncheck it
          </button>
        </div>
      </div>
    </div>
  )
}
