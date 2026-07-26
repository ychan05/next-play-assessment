// Board component to display all columns and their tasks

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { COLUMNS, type Task, type Status } from '../types'
import { Column } from './Column'
import { TaskCard } from './TaskCard'
import { computePosition } from '../lib/position'

interface Props {
  tasks: Task[]
  onMove: (taskId: string, newStatus: Status, newPosition: number) => void
}

export function Board({ tasks, onMove }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  // determine the active task when dragging starts
  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(task => task.id === event.active.id)
    setActiveTask(task ?? null)
  }

// determines the new position and status of a task when dragging ends
function handleDragEnd(event: DragEndEvent) {
  setActiveTask(null)
  const { active, over } = event
  if (!over) return

  const activeTask = tasks.find(task => task.id === active.id)
  if (!activeTask) return

  // If the task is dropped over a column, use that column's status
  // Otherwise, use the status of the task we're over
  const overIsColumn = COLUMNS.some(column => column.id === over.id)
  
  // Determine the new status and position of the task
  let newStatus: Status  

  if (overIsColumn) {
      newStatus = over.id as Status
  } else {
      // If the task is dropped over another task, use that task's status

      // find the task we're over
      const overTask = tasks.find(task => task.id === over.id)  

      // if the task is found, use its status
      if (overTask) {
          newStatus = overTask.status
      } else {
          // if not, use the active task's status
          newStatus = activeTask.status
      }
  }  

  // get all tasks in the destination column and sort by position
  const columnTasks = tasks
    .filter(task => task.status === newStatus && task.id !== activeTask.id)
    .sort((a, b) => a.position - b.position)

  let overIndex: number

  if (overIsColumn) {
    // if its dropped onto an empty column or the column container and not a task
    // set the index to the end of the list
    overIndex = columnTasks.length
  } else {

    // get index of the task we're over
    const rawIndex = columnTasks.findIndex(t => t.id === over.id)

    if (rawIndex === -1) {
        overIndex = columnTasks.length
    } else {
        overIndex = rawIndex
    }

    // Determine if the pointer is past the midpoint of the card we're over
    // if it is, insert after it instead of before it.
    const activeRect = active.rect.current.translated
    const overRect = over.rect
    if (activeRect && overRect) {
      const activeCenter = activeRect.top + activeRect.height / 2
      const overCenter = overRect.top + overRect.height / 2
      if (activeCenter > overCenter) {
        overIndex += 1
      }
    }
  }

  const newPosition = computePosition(columnTasks, overIndex)

  if (newStatus === activeTask.status && newPosition === activeTask.position) {
    return
  } 

  onMove(activeTask.id, newStatus, newPosition)
}

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            tasks={tasks.filter(task => task.status === col.id).sort((a, b) => a.position - b.position)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}