import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Task } from '../types'

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks from the database
  const fetchTasks = useCallback(async () => {
    if (!userId) {
        return
    }

    setError(null)
    
    const { data, error } = await supabase.from('tasks').select('*').order('position', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setTasks(data as Task[])
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  return { tasks, setTasks, loading, error, refetch: fetchTasks }
}