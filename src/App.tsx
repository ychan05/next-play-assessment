import { useGuestSession } from './hooks/useGuestSession'

export default function App() {
  const { user, loading, error } = useGuestSession()

  if (loading) return <p>Loading…</p>
  if (error) return <p>Something went wrong: {error}</p>

  return <p>Guest session active: {user?.id}</p>
}