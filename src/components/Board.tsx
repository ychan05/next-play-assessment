// Board component to display all columns and their tasks

import { COLUMNS, type Task } from '../types'
import { Column } from './Column'

export function Board({ tasks }: { tasks: Task[] }) {
  return (
    <div className="board">
      {COLUMNS.map(col => (
        <Column
          key={col.id}
          id={col.id}
          label={col.label}
          tasks={tasks.filter(t => t.status === col.id)}
        />
      ))}
    </div>
  )
}