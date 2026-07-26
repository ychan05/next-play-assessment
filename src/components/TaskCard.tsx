// TaskCard component to display a single task

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'
import { getDueUrgency, formatDueDate } from '../lib/dueDate'

interface Props {
  task: Task
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const dueUrgency = getDueUrgency(task.due_date, task.status) 
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
    >
            <div className="card-title">{task.title}</div>
            <button
            type="button"
            className="card-delete"
            aria-label="Delete task"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            >
            ✕
            </button>
            {task.description && <div className="card-description">{task.description}</div>}
            <div className="card-meta">
                <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                {(task.due_date || dueUrgency === 'done') && (
                  <span className={`due-badge due-${dueUrgency}`}>
                    {dueUrgency === 'done' ? 'Done' : task.due_date ? formatDueDate(task.due_date, dueUrgency) : null}
                  </span>
                )}
            </div>
    </div>
  )
}