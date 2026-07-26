import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Status, Priority, Task } from '../types'

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

  // create a new task
  const createTask = useCallback(async (input: {
    title: string
    description?: string
    priority?: Priority
    due_date?: string
    assignee_id?: string
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
      assignee_id: input.assignee_id ?? null,
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
        assignee_id: input.assignee_id ?? null
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

  // move tasks using drag and drop
  const moveTask = useCallback(async (taskId: string, newStatus: Status, newPosition: number) => {
    setTasks(prev => prev.map(task => task.id === taskId ? {...task, status: newStatus, position: newPosition } : task))

    const { error } = await supabase.from('tasks').update({ status: newStatus, position: newPosition }).eq('id', taskId)

    if (error) {
      setError(error.message)
      fetchTasks()
      return { error: error.message }
    }
    return { error: null }
  }, [fetchTasks])


  // remove a task
  const removeTask = useCallback(async (taskId: string) => {
    // keep the previous state just in case
    const previous = tasks

    setTasks(prev => prev.filter(task => task.id !== taskId))

    const { error } = await supabase.from('tasks').delete().eq('id', taskId)

    if (error) {
      setTasks(previous)
      return { error: error.message }
    }
    return { error: null }
  }, [tasks])

  // assign task to team member
  const assignTask = useCallback (async (taskId: string, assignee_id: string | null) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, assignee_id: assignee_id } : task))

    const { error } = await supabase.from('tasks').update({ assignee_id }).eq('id', taskId)

    if (error) {
      fetchTasks()
      return { error: error.message }
    }
    return { error: null }
  }, [fetchTasks])

  return { tasks, setTasks, loading, error, refetch: fetchTasks, createTask, moveTask, removeTask, assignTask }
}