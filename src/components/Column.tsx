// Column component to display a list of tasks for a given status

import type { Status, Task } from '../types'
import { TaskCard } from './TaskCard'

interface Props {
  id: Status
  label: string
  tasks: Task[]
}

export function Column({ id, label, tasks }: Props) {
  return (
    <section className="column">
      <header className="column-header">
        <span className="column-dot" style={{ background: `var(--status-${id})` }} />
        <h2>{label}</h2>
        <span className="column-count">{tasks.length}</span>
      </header>
      <div className="column-body">
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks yet</div>
        ) : (
          tasks.map(t => <TaskCard key={t.id} task={t} />)
        )}
      </div>
    </section>
  )
}