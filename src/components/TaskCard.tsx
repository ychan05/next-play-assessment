// TaskCard component to display a single task

import type { Task } from '../types'

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="card">
        <div className="card-title">{task.title}</div>
        {task.description && <div className="card-description">{task.description}</div>}
        <div className="card-meta">
            <span className={`priority priority-${task.priority}`}>{task.priority}</span>
        </div>
    </div>
  )
}