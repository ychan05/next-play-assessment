// Component for creating a new task

import { useState } from 'react'
import type { Priority } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (input: { title: string; description?: string; priority?: Priority; due_date?: string }) => Promise<{ error: string | null }>
}

export function NewTaskPanel({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate || undefined,
    })
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    setTitle(''); setDescription(''); setPriority('normal'); setDueDate('')
    onClose()
  }

  return (
    <div className="panel-overlay" onClick={onClose}>
      <form className="panel" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <header className="panel-header">
          <h2>New task</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <label className="field">
          <span>Title</span>
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional details"
            rows={3}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Priority</span>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="field">
            <span>Due date</span>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <footer className="panel-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create task'}
          </button>
        </footer>
      </form>
    </div>
  )
}