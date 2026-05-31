import React from 'react'
import { ZONES } from '../../config.js'
import styles from './TaskCard.module.css'

export function ZoneChip({ zoneId, qty, unit, solo }) {
  const info = ZONES[zoneId]
  if (!info) return null
  return (
    <div className={[styles.zoneQty, solo ? styles.soloZone : ''].filter(Boolean).join(' ')}>
      <div className={styles.zoneQtyLabel}>{info.name}</div>
      <div className={styles.zoneQtyGrass}>{info.grass} &ndash; {info.area}m&sup2;</div>
      <div className={styles.zoneQtyAmount}>{qty}{unit}</div>
    </div>
  )
}

export function ZoneCombinedChip({ zones, quantities, unit }) {
  // Only show if 2+ of front/strip1/strip2 are present
  const frontZones = ['front', 'strip1', 'strip2'].filter(z => zones.includes(z) && quantities[z] != null)
  if (frontZones.length < 2) return null
  const totalQty  = frontZones.reduce((s, z) => s + (quantities[z] || 0), 0)
  const totalArea = frontZones.reduce((s, z) => s + (ZONES[z]?.area || 0), 0)
  const fmt = v => { const r = Math.round(v * 10) / 10; return r % 1 === 0 ? String(r) : r.toFixed(1) }
  return (
    <>
      <div className={styles.zoneQtyDivider} />
      <div className={[styles.zoneQty, styles.combined].join(' ')}>
        <div className={styles.zoneQtyLabel}>Front+Strips</div>
        <div className={styles.zoneQtyGrass}>Combined &ndash; {fmt(totalArea)}m&sup2;</div>
        <div className={styles.zoneQtyAmount}>{fmt(totalQty)}{unit}</div>
      </div>
    </>
  )
}
