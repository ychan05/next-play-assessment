import type { Task } from '../types'

// Computes a position value for a task dropped at index within columnTasks
export function computePosition(columnTasks: Task[], index: number): number {
  if (columnTasks.length === 0) {
    return 1000
  } 

  // If index is at the beginning, return a position before the first task
  if (index <= 0) {
    return columnTasks[0].position - 1000
  }

  // if index is at the end, return a position after the last task
  if (index >= columnTasks.length) {
    return columnTasks[columnTasks.length - 1].position + 1000
  }

  // If index is in the middle, return a position between the two adjacent tasks
  const before = columnTasks[index - 1].position
  const after = columnTasks[index].position

  return (before + after) / 2
}