// TaskCard component to display a single task

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task, TeamMember } from '../types'
import { getDueUrgency, formatDueDate } from '../lib/dueDate'
import { Avatar } from './Avatar'
import { useRef, useState, useEffect } from 'react'

interface Props {
  task: Task
  onDelete: (taskId: string) => void
  members: TeamMember[]
  onAssign: (taskId: string, assignee_id: string | null) => void
}

export function TaskCard({ task, onDelete, members, onAssign }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { task } })
  
  const [assigneePickerOpen, setAssigneePickerOpen] = useState(false)
  const assigneePickerRef = useRef<HTMLDivElement>(null)

  // close the assignee picker when clicking outside
  useEffect(() => {
    if (!assigneePickerOpen) return

    function onClick(e: PointerEvent) {
      if (assigneePickerRef.current && !assigneePickerRef.current.contains(e.target as Node)) {
        setAssigneePickerOpen(false)
      }
    }
    document.addEventListener('pointerdown', onClick)
    return () => document.removeEventListener('pointerdown', onClick)
  }, [assigneePickerOpen])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const dueUrgency = getDueUrgency(task.due_date, task.status) 

  const assignee = task.assignee_id ? members.find(m => m.id === task.assignee_id) : undefined
  
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
                <div className="card-assignee" ref={assigneePickerRef}>
                    <button
                        type="button"
                        className="assignee-trigger"
                        aria-label={assignee ? `Assigned to ${assignee.name}` : 'Assign task'}
                        onPointerDown={e => e.stopPropagation()}
                        onClick={e => { e.stopPropagation(); setAssigneePickerOpen(o => !o) }}
                    >
                        {assignee ? <Avatar member={assignee} size={22} /> : <span className="assignee-empty">+</span>}
                    </button>

                    {assigneePickerOpen && (
                        <div className="assignee-picker" onPointerDown={e => e.stopPropagation()}>
                            {members.length === 0 && (
                                <div className="assignee-picker-empty">No team members yet</div>
                            )}
                            {members.map(m => (
                                <button
                                    key={m.id}
                                    type="button"
                                    className={`assignee-option ${m.id === task.assignee_id ? 'selected' : ''}`}
                                    onClick={() => { onAssign(task.id, m.id); setAssigneePickerOpen(false) }}
                                >
                                    <Avatar member={m} size={20} />
                                    <span>{m.name}</span>
                                </button>
                            ))}
                            {assignee && (
                                <button
                                    type="button"
                                    className="assignee-option assignee-unassign"
                                    onClick={() => { onAssign(task.id, null); setAssigneePickerOpen(false) }}
                                >
                                    Unassign
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
    </div>
  )
}