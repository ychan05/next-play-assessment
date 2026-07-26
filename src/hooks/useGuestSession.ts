import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useGuestSession() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
        try {
            // reuses existing session if available
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                if (!cancelled) {
                    setUser(session.user)
                }
                return
            }

            // create new anonymous session if none exists
            const { data, error } = await supabase.auth.signInAnonymously()
            if (error) {
                throw error
            }

            if (!cancelled) {
                setUser(data.user)
            }
        } catch (e) {
            if (!cancelled) {
                setError(e instanceof Error ? e.message : 'Failed to start session')
            }
        } finally {
            if (!cancelled) {
                setIsLoading(false)
            }
        }
    }

    init()
    return () => { cancelled = true }
  }, [])

  return { user, isLoading, error }
}