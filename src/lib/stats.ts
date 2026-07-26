import type { Task } from '../types'
import { getDueUrgency } from './dueDate'


export interface BoardStats {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  dueToday: number
  dueSoon: number
}

export function calculateBoardStats(tasks: Task[]): BoardStats {
    let totalTasks = 0
    let overdueTasks = 0
    let completedTasks = 0
    let dueToday = 0
    let dueSoon = 0

    for (const task of tasks) {
        totalTasks++

        if (task.status === 'done') {
            completedTasks++
        }

        if (task.due_date) {
            const urgency = getDueUrgency(task.due_date, task.status)
            switch (urgency) {
                case 'overdue':
                    overdueTasks++
                    break
                case 'today':
                    dueToday++
                    break
                case 'soon':
                    dueSoon++
                    break
            }
        }
    }
    return { totalTasks, completedTasks, overdueTasks, dueToday, dueSoon }
}
