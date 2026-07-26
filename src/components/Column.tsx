// Column component to display a list of tasks for a given status

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import type { Status, Task } from '../types'
import { TaskCard } from './TaskCard'

interface Props {
  id: Status
  label: string
  tasks: Task[]
  onDelete: (taskId: string) => void
}

export function Column({ id, label, tasks, onDelete }: Props) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <section className="column">
      <header className="column-header">
        <span className="column-dot" style={{ background: `var(--status-${id})` }} />
        <h2>{label}</h2>
        <span className="column-count">{tasks.length}</span>
      </header>
      <div className="column-body" ref={setNodeRef}>
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet</div>
            ) : (
            tasks.map(task => <TaskCard key={task.id} task={task} onDelete={onDelete} />)
            )}
        </SortableContext>
      </div>
    </section>
  )
}