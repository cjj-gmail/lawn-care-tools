import React, { useState } from 'react'
import { CAUTION_ICONS } from '../../config.js'
import styles from './TaskCard.module.css'

export function CautionChip({ cautionKey, description }) {
  const [open, setOpen] = useState(false)
  const icon = CAUTION_ICONS[cautionKey] || '!'
  const label = cautionKey.replace(/-/g, ' ')
  return (
    <div
      className={[styles.cautionChip, styles['caution_' + cautionKey.replace(/-/g, '_')]].filter(Boolean).join(' ')}
      data-caution={cautionKey}
      onClick={() => setOpen(o => !o)}
      title={description}
    >
      <span>{icon}</span>
      {' '}{label}
      {open && (
        <span className={styles.cautionTooltip}>{description}</span>
      )}
    </div>
  )
}
