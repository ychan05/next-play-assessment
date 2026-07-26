import { useState, type SyntheticEvent } from 'react'
import type { TeamMember } from '../types'
import { Avatar } from './Avatar'

const COLORS = ['#5B5BD6', '#3D9A6A', '#C98A2E', '#D6455B', '#4A8FD6', '#8952C4', '#D65BA8']

interface Props {
  open: boolean
  onClose: () => void
  members: TeamMember[]
  onAdd: (name: string, color: string) => Promise<{ error?: string | null }>
  onRemove: (id: string) => Promise<{ error: string | null }>
}

export function TeamPanel({ open, onClose, members, onAdd, onRemove }: Props) {
    const [name, setName] = useState('')
    const [color, setColor] = useState(COLORS[0])
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    if (!open) {
        return null
    }

    async function handleAddMember(e: SyntheticEvent) {
        e.preventDefault()
        if (!name.trim()) {
            setError('Name is required')
            return
        }

        setSubmitting(true)
        setError(null)

        const { error } = await onAdd(name.trim(), color)

        setSubmitting(false)

        if (error) { 
            setError(error)
            return
        }
        setName('')
        setColor(COLORS[(members.length + 1) % COLORS.length])
    }
    return (
        <div className="panel-overlay" onClick={onClose}>
        <div className="panel" onClick={e => e.stopPropagation()}>
            <header className="panel-header">
            <h2>Team</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
            </header>

            <form onSubmit={handleAddMember} className="team-add">
            <label className="field">
                <span>Name</span>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Teammate name" />
            </label>
            <label className="field">
                <span>Color</span>
                <div className="color-row">
                {COLORS.map(c => (
                    <button
                    key={c}
                    type="button"
                    className={`color-swatch ${c === color ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Select color ${c}`}
                    />
                ))}
                </div>
            </label>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add member'}
            </button>
            </form>

            <div className="team-list">
            {members.length === 0 ? (
                <div className="empty-state">No team members yet</div>
            ) : (
                members.map(m => (
                <div key={m.id} className="team-row">
                    <Avatar member={m} size={28} />
                    <span className="team-name">{m.name}</span>
                    <button className="icon-btn" onClick={() => onRemove(m.id)} aria-label={`Remove ${m.name}`}>✕</button>
                </div>
                ))
            )}
            </div>
        </div>
        </div>
    )
}