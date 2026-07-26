// component for making avatars
// Color + Initials

import type { TeamMember } from '../types'

export const Avatar = ({ member, size = 24 }: { member: TeamMember; size?: number }) => {
    const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

    return (
        <span className="avatar" title={member.name} style={{ background: member.color, width: size, height: size, fontSize: size * 0.42 }}>
            {initials}
        </span>
    )
}