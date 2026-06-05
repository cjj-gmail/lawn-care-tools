import React, { useState } from 'react'
import { ZONES } from '../../config.js'
import { ZoneChip, ZoneCombinedChip } from './ZoneChip'
import { CautionChip } from './CautionChip'
import styles from './TaskCard.module.css'

// ─── ProductsTitle ────────────────────────────────────────────────────────────
function ProductsTitle({ task }: { task: any }) {
  const allFour = ['back', 'front', 'strip1', 'strip2']
  const zones   = task.zones || []
  const isAll   = allFour.every((z: string) => zones.includes(z))
  const label   = isAll
    ? 'Product quantities by zone'
    : 'Product quantities -- ' + zones.map((z: string) => (ZONES as any)[z]?.name || z).join(', ')
  return <div className={styles.productsTitle}>{label}</div>
}

// ─── ProductRow ───────────────────────────────────────────────────────────────
function ProductRow({ prod }: { prod: any }) {
  const zones  = Object.keys(prod.quantities || {})
  const isSolo = zones.length === 1
  return (
    <div className={styles.productRow}>
      <div className={styles.productName}>
        {prod.name} &ndash; {prod.ratePer100sqm}{prod.rateUnit}/100m&sup2;
      </div>
      {prod.note && <div className={styles.productNote}>{prod.note}</div>}
      <div className={styles.productZones}>
        {zones.map(zid => (
          <ZoneChip
            key={zid}
            zoneId={zid}
            qty={prod.quantities[zid]}
            unit={prod.rateUnit}
            solo={isSolo}
          />
        ))}
        <ZoneCombinedChip zones={zones} quantities={prod.quantities} unit={prod.rateUnit} />
      </div>
    </div>
  )
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────
interface TaskCardProps {
  task: any
  isCompleted: boolean
  completedAt?: string
  cautions: Record<string, string>
  onToggle: (task: any, isCompleted: boolean) => Promise<void>
}

export function TaskCard({ task, isCompleted, completedAt, cautions, onToggle }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [saving,   setSaving]   = useState(false)

  async function handleCheck() {
    setSaving(true)
    await onToggle(task, isCompleted)
    setSaving(false)
  }

  const typeLabel = task.taskType === 'soilwetter' ? 'soil wetter' : task.taskType
  const waterHint = task.waterIn
    ? ' - water in'
    : task.foliarOrIrrigate === 'Foliar' ? ' - foliar, allow to dry' : ''

  return (
    <div className={[
      styles.taskCard,
      isCompleted      ? styles.completed   : '',
      task.conditional ? styles.conditional : '',
    ].filter(Boolean).join(' ')}>

      {/* Header row + right-edge chevron */}
      <div className={styles.taskHeader} onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer' }}>
        <div
          className={[
            styles.taskCheck,
            isCompleted ? styles.checked : '',
            saving      ? styles.saving  : '',
          ].filter(Boolean).join(' ')}
          onClick={e => { e.stopPropagation(); handleCheck() }}
          role="checkbox"
          aria-checked={isCompleted}
          tabIndex={0}
          onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.stopPropagation(); handleCheck() } }}
        />
        <div className={styles.taskBody}>
          <div className={styles.taskTop}>
            <span className={styles.taskLabel}>{task.label}</span>
            <span className={[styles.typeTag, styles[task.taskType]].filter(Boolean).join(' ')}>
              {typeLabel}
            </span>
            {task.conditional && (
              <span className={styles.conditionalFlag}>if required</span>
            )}
          </div>
          <div className={styles.taskMethod}>{task.applicationMethod}{waterHint}</div>
          {!expanded && <div style={{ fontSize: 12, color: 'var(--grass)', marginTop: 4 }}>Tap card for rates &amp; details</div>}
        </div>
        <button
          className={styles.chevronBtn}
          onClick={e => { e.stopPropagation(); setExpanded(ex => !ex) }}
          aria-label={expanded ? 'Collapse details' : 'Expand rates and details'}
          title={expanded ? 'Collapse' : 'Rates & details'}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Condition banner */}
      {task.conditional && task.condition && (
        <div className={styles.conditionBanner}>Note: {task.condition}</div>
      )}

      {/* Expandable detail */}
      <div className={[styles.taskDetail, expanded ? styles.open : ''].filter(Boolean).join(' ')}>
        {task.products && task.products.length > 0 && (
          <>
            <ProductsTitle task={task} />
            {task.products.map((prod: any, i: number) => <ProductRow key={i} prod={prod} />)}
          </>
        )}
        {task.notes && (
          <div className={styles.notesSection}>
            <div className={styles.taskNotesText}>{task.notes}</div>
            {task.cautions && task.cautions.length > 0 && (
              <div className={styles.cautionsWrap}>
                {task.cautions.map((key: string) => (
                  <CautionChip key={key} cautionKey={key} description={cautions?.[key] || key} />
                ))}
              </div>
            )}
          </div>
        )}
        {completedAt && (
          <div className={styles.completionInfo}>Completed {completedAt}</div>
        )}
      </div>
    </div>
  )
}
