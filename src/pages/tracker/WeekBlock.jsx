import React from 'react'
import { TaskCard } from './TaskCard.jsx'
import styles from './TrackerPage.module.css'

export function WeekBlock({ week, completions, cautions, onToggle }) {
  return (
    <div className={styles.weekBlock}>
      <div className={styles.weekHeading}>
        <span className={styles.weekNum}>W{week.week}</span>
        <span className={styles.weekLabel}>
          {/* Strip "Week N — " prefix if present */}
          {(week.label || '').replace(/^Week \d+ [—-] /, '')}
        </span>
      </div>
      {!week.tasks || week.tasks.length === 0 ? (
        <div className={styles.noTasks}>No tasks scheduled.</div>
      ) : (
        week.tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isCompleted={!!completions[task.id]}
            completedAt={completions[task.id]?.completedAt}
            cautions={cautions}
            onToggle={onToggle}
          />
        ))
      )}
    </div>
  )
}
