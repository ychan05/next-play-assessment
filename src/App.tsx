import { useState } from 'react'
import { useGuestSession } from './hooks/useGuestSession'
import { useTasks } from './hooks/useTasks'
import { Board } from './components/Board'
import { NewTaskPanel } from './components/NewTaskPanel'
import { StatsBar } from './components/StatsBar'
import { calculateBoardStats } from './lib/stats'
import { useTeam } from './hooks/useTeam'
import { TeamPanel } from './components/TeamPanel'
import { Avatar } from './components/Avatar'


export default function App() {
  const { user, isLoading: authLoading, error: authError } = useGuestSession()
  const { tasks, loading: tasksLoading, error: tasksError, createTask, moveTask, removeTask, assignTask } = useTasks(user?.id)
  const [panelOpen, setPanelOpen] = useState(false)
  const { teamMembers, addTeamMember, removeTeamMember } = useTeam(user?.id)
  const [teamOpen, setTeamOpen] = useState(false)

  if (authLoading || (user && tasksLoading)) {
    return <div className="screen-state">Loading your board…</div>
  }
  if (authError || tasksError) {
    return <div className="screen-state">Couldn't load the board: {authError ?? tasksError}</div>
  }

  async function handleRemoveTask(taskId: string) {
    const result = await removeTask(taskId)
    if (result.error) {
      alert("Error removing task, please try again.")
    }
  }

  async function handleAssign(taskId: string, assigneeId: string | null) {
    const { error } = await assignTask(taskId, assigneeId)
    if (error) alert("Couldn't update the assignee. Please try again.")
  }

  return (
    <>
      <header className="app-header-wrapper">
        <div className="app-header">
          <div className="app-header-left">
            <h1>Task Board</h1>
            <span className="user-id">Guest · {user?.id?.slice(0, 8)}</span>
          </div>
          <div className="app-header-actions">
            <button className="team-button" onClick={() => setTeamOpen(true)}>
              {teamMembers.slice(0, 4).map(m => <Avatar key={m.id} member={m} size={24} />)}
              <span className="team-button-label">
                {teamMembers.length === 0 ? 'Add team' : 'Team'}
              </span>
            </button>
            <button className="btn-primary" onClick={() => setPanelOpen(true)}>+ New task</button>
          </div>
        </div>
        <StatsBar stats={calculateBoardStats(tasks)} />
      </header>
      <Board
        tasks={tasks}
        onMove={(taskId, newStatus, newPosition) => moveTask(taskId, newStatus, newPosition)}
        onAssign={handleAssign}
        onDelete={handleRemoveTask}
        members={teamMembers}
      />
      <NewTaskPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onCreate={createTask}
        members={teamMembers}
      />
      <TeamPanel
        open={teamOpen}
        onClose={() => setTeamOpen(false)}
        members={teamMembers}
        onAdd={addTeamMember}
        onRemove={removeTeamMember}
      />
    </>
  )
}