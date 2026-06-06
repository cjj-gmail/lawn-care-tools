import React from 'react'
import { TaskCard } from './TaskCard.jsx'
import styles from './TrackerPage.module.css'
import type { Task, Completions } from '../../types.js'
import type { Week } from '../../types.js'

interface WeekBlockProps {
  week: Week
  completions: Completions
  cautions: Record<string, string>
  onToggle: (task: Task, isCompleted: boolean) => Promise<void>
}

export function WeekBlock({ week, completions, cautions, onToggle }: WeekBlockProps) {
  return (
    <div className={styles.weekBlock}>
      <div className={styles.weekHeading}>
        <span className={styles.weekNum}>W{week.week}</span>
        <span className={styles.weekLabel}>
          {(week.label || '').replace(/^Week \d+ [--] /, '')}
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
