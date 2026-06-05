import React, { useState } from 'react'
import { HEIGHT_REF } from '../../config.js'
import styles from './HeightRefCard.module.css'

interface HeightRefCardProps {
  season: string
}

export function HeightRefCard({ season }: HeightRefCardProps) {
  const [open, setOpen] = useState(false)
  const isSummer = season === 'summer' || season === 'autumn'
  const isWinter = season === 'winter' || season === 'spring'

  return (
    <div className={styles.card}>
      <div className={styles.toggle} onClick={() => setOpen(o => !o)}>
        <span className={styles.label}>Mowing height reference</span>
        <span className={[styles.chevron, open ? styles.open : ''].filter(Boolean).join(' ')}>v</span>
      </div>
      {open && (
        <div className={styles.body}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Grass</th><th>Mower</th>
                <th>Summer/Autumn</th><th>Winter/Spring</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {HEIGHT_REF.map((gr: any) =>
                gr.mowers.map((m: any, mi: number) => (
                  <tr key={gr.grass + m.name}>
                    {mi === 0 && (
                      <td rowSpan={gr.mowers.length} style={{ verticalAlign: 'middle' }}>
                        <div className={styles.grassName}>{gr.grass}</div>
                        <div className={styles.grassSub}>{gr.zone}</div>
                      </td>
                    )}
                    <td>
                      <div style={{ fontSize: 13 }}>{m.name}</div>
                      <div style={{ fontSize: 11, textTransform: 'uppercase' }}>{m.type}</div>
                    </td>
                    <td>
                      <span className={[styles.chip, isSummer ? styles.recommended : ''].filter(Boolean).join(' ')}>
                        {m.summer}
                      </span>
                    </td>
                    <td>
                      <span className={[styles.chip, isWinter ? styles.recommended : ''].filter(Boolean).join(' ')}>
                        {m.winter}
                      </span>
                    </td>
                    <td className={styles.note}>{m.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
