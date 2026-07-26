import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Priority, Task } from '../types'

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
    
    const { data, error } = await supabase.from('tasks').select('*').order('position', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setTasks(data as Task[])
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // create a new task
  const createTask = useCallback(async (input: {
    title: string
    description?: string
    priority?: Priority
    due_date?: string
  }) => {
    if (!userId) {
        return { error: 'No session available' }
    }

    const tempId = `temp_${Date.now()}`

    // create a temporary task to serve to frontend immediately while the actual task is being created
    const newTask: Task = {
      id: tempId,
      title: input.title,
      description: input.description ?? null,
      status: 'todo',
      priority: input.priority ?? 'normal',
      due_date: input.due_date ?? null,
      position: Date.now(),
      assignee_id: null,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    // add the temporary task to the UI immediately
    setTasks(prev => [newTask, ...prev])

    // insert the actual task into the database
    const { data, error } = await supabase.from('tasks').insert({
        title: input.title,
        description: input.description ?? null,
        priority: input.priority ?? 'normal',
        due_date: input.due_date ?? null,
        position: newTask.position,
    }).select().single()

    // if the insertion fails, remove the temporary task and return the error
    if (error) {
        setTasks(prev => prev.filter(task => task.id !== tempId))
        return { error: error.message }
    }

    // if the insertion succeeds, replace the temporary task with the actual task
    setTasks(prev => prev.map(task => (task.id === tempId ? (data as Task) : task)))
    return { error: null }

  }, [userId])

  return { tasks, setTasks, loading, error, refetch: fetchTasks, createTask }
}