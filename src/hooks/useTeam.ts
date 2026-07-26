// hook for managing team members

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { TeamMember } from '../types'

export function useTeam(userId: string | undefined) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchTeamMembers = useCallback(async () => {
        if (!userId) { 
            return
        }

        const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false })

        if (!error) {
            setTeamMembers(data as TeamMember[])
            setIsLoading(false)
        }

        
    }, [userId])
    useEffect(() => { fetchTeamMembers() }, [fetchTeamMembers])
    
    const addTeamMember = useCallback(async (name : string, color : string) => {
        const { data, error } = await supabase.from('team_members').insert({ name, color }).select().single()

        if (error) { return { error : error.message} }

        setTeamMembers(prev => [...prev, data as TeamMember])

        return { error: null }

    }, [])

    const removeTeamMember = useCallback(async (id: string) => {
        const { error } = await supabase.from('team_members').delete().eq('id', id)
        if (error) { 
            return { error: error.message }
        }

        setTeamMembers(prev => prev.filter(m => m.id !== id))
        return { error: null }

    }, [teamMembers])

    return { teamMembers, isLoading, addTeamMember, removeTeamMember }
}