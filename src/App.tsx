import { useState } from 'react'
import { useGuestSession } from './hooks/useGuestSession'
import { useTasks } from './hooks/useTasks'
import { Board } from './components/Board'
import { NewTaskPanel } from './components/NewTaskPanel'

export default function App() {
  const { user, isLoading: authLoading, error: authError } = useGuestSession()
  const { tasks, loading: tasksLoading, error: tasksError, createTask, moveTask} = useTasks(user?.id)
  const [panelOpen, setPanelOpen] = useState(false)

  if (authLoading || (user && tasksLoading)) {
    return <div className="screen-state">Loading your board…</div>
  }
  if (authError || tasksError) {
    return <div className="screen-state">Couldn't load the board: {authError ?? tasksError}</div>
  }

  return (
    <>
      <header className="app-header">
        <h1>Task Board</h1>
        <h1>User ID: {user?.id}</h1>
        <button className="btn-primary" onClick={() => setPanelOpen(true)}>+ New task</button>
      </header>
      <Board
        tasks={tasks}
        onMove={(taskId, newStatus, newPosition) => moveTask(taskId, newStatus, newPosition)}
      />
      <NewTaskPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onCreate={createTask}
      />
    </>
  )
}