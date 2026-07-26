import type {BoardStats} from '../lib/stats'

export function StatsBar({ stats }: { stats: BoardStats }) {
  return (
    <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Tasks: </span>
          <span className="stat-value">{stats.totalTasks}</span>
        </div>
      <div className="stat-item">
        <span className="stat-label">Completed Tasks: </span>
        <span className="stat-value">{stats.completedTasks}</span>
      </div>
        <div className="stat-item">
          <span className="stat-label">Overdue Tasks: </span>
          <span className="stat-value">{stats.overdueTasks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Due Today: </span>
          <span className="stat-value">{stats.dueToday}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Due Soon: </span>
          <span className="stat-value">{stats.dueSoon}</span>
        </div>
    </div>
  )
}