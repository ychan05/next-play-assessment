export type DueUrgency = 'overdue' | 'today' | 'soon' | 'none' | 'done'

export function getDueUrgency(dueDate: string | null, status: string): DueUrgency {
  if (status === 'done') { return 'done' }
  if (!dueDate) { return 'none' }

  const [year, month, day] = dueDate.split('-').map(Number)
  const dueUTC = Date.UTC(year, month - 1, day)

  const now = new Date()
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())

  const diffDays = Math.round((dueUTC - todayUTC) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {return 'overdue'}
  if (diffDays === 0) {return 'today'}
  if (diffDays <= 2) {return 'soon'}
  return 'none'
}

export function formatDueDate(dueDate: string, urgency: DueUrgency): string {
  const [year, month, day] = dueDate.split('-').map(Number)
  const dueUTC = Date.UTC(year, month - 1, day)
  const now = new Date()
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((dueUTC - todayUTC) / (1000 * 60 * 60 * 24))

  if (urgency === 'today') return 'Due today'
  if (urgency === 'soon') return diffDays === 1 ? 'Due tomorrow' : `Due in ${diffDays} days`
  if (urgency === 'overdue') {
    const daysLate = Math.abs(diffDays)
    return daysLate === 1 ? '1 day overdue' : `${daysLate} days overdue`
  }

  const due = new Date(Date.UTC(year, month - 1, day))
  return due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
