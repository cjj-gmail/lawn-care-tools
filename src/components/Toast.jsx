import React from 'react'
import styles from './Toast.module.css'

export function Toast({ msg, type, visible }) {
  return (
    <div className={[styles.toast, visible ? styles.show : '', type ? styles[type] : ''].filter(Boolean).join(' ')}>
      {msg}
    </div>
  )
}
