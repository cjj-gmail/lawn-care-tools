import React from 'react'
import { ZONES } from '../../config.js'
import styles from './TaskCard.module.css'

interface ZoneChipProps {
  zoneId: string
  qty: number
  unit: string
  solo?: boolean
}

export function ZoneChip({ zoneId, qty, unit, solo }: ZoneChipProps) {
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

interface ZoneCombinedChipProps {
  zones: string[]
  quantities: Record<string, number>
  unit: string
}

export function ZoneCombinedChip({ zones, quantities, unit }: ZoneCombinedChipProps) {
  const frontZones = ['front', 'strip1', 'strip2'].filter(z => zones.includes(z) && quantities[z] != null)
  if (frontZones.length < 2) return null
  const totalQty  = frontZones.reduce((s, z) => s + (quantities[z] || 0), 0)
  const totalArea = frontZones.reduce((s, z) => s + (ZONES[z]?.area || 0), 0)
  const fmt = (v: number) => { const r = Math.round(v * 10) / 10; return r % 1 === 0 ? String(r) : r.toFixed(1) }
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
