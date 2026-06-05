import React from 'react'
import styles from './Toast.module.css'

interface ToastProps {
  msg: string
  type?: string
  visible: boolean
}

export function Toast({ msg, type, visible }: ToastProps) {
  return (
    <div className={[styles.toast, visible ? styles.show : '', type ? styles[type] : ''].filter(Boolean).join(' ')}>
      {msg}
    </div>
  )
}
