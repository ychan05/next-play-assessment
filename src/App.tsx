import { useGuestSession } from './hooks/useGuestSession'
import { useTasks } from './hooks/useTasks'
import { Board } from './components/Board'

export default function App() {
  const { user, loading: authLoading, error: authError } = useGuestSession()
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks(user?.id)

  if (authLoading || (user && tasksLoading)) {
    return <div className="screen-state">Loading your board…</div>
  }
  if (authError || tasksError) {
    return <div className="screen-state">Couldn't load the board: {authError ?? tasksError}</div>
  }

  return (
    <>
      <header className="app-header"><h1>Task Board</h1></header>
      <Board tasks={tasks} />
    </>
  )
}