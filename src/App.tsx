import { useState } from 'react'
import { useGuestSession } from './hooks/useGuestSession'
import { useTasks } from './hooks/useTasks'
import { Board } from './components/Board'
import { NewTaskPanel } from './components/NewTaskPanel'
import { StatsBar } from './components/statsBar'
import { calculateBoardStats } from './lib/stats'

export default function App() {
  const { user, isLoading: authLoading, error: authError } = useGuestSession()
  const { tasks, loading: tasksLoading, error: tasksError, createTask, moveTask, removeTask } = useTasks(user?.id)
  const [panelOpen, setPanelOpen] = useState(false)

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


  return (
    <>
      <header className="app-header-wrapper">
        <div className="app-header">  
          <h1>Task Board</h1>
          <h1>User ID: {user?.id}</h1>
          <button className="btn-primary" onClick={() => setPanelOpen(true)}>+ New task</button>
        </div>
        <StatsBar stats={calculateBoardStats(tasks)} />
      </header>
      <Board
        tasks={tasks}
        onMove={(taskId, newStatus, newPosition) => moveTask(taskId, newStatus, newPosition)}
        onDelete={handleRemoveTask}
      />
      <NewTaskPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onCreate={createTask}
      />
    </>
  )
}