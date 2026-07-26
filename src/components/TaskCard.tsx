// TaskCard component to display a single task

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
    >
        <div className="card">
            <div className="card-title">{task.title}</div>
            {task.description && <div className="card-description">{task.description}</div>}
            <div className="card-meta">
                <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                {task.due_date && (<span className="due-date"> 📅 {new Date(task.due_date).toLocaleDateString()}</span>)}
            </div>
        </div>
    </div>
  )
}