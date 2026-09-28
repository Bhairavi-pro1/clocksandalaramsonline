'use client'

import { useState } from 'react'
import { User, Mail, Linkedin } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  title: string
  bio: string
  email: string
  linkedin: string
  imageSrc: string
  initials: string
  objectPosition: string
  scale?: number
}

const teamMembers: TeamMember[] = [
  {
    id: 'ceo',
    name: 'Raghavan Dandapani',
    role: 'CEO & Founder',
    title: 'Executive Leadership & Product Vision',
    bio: 'Oversees product strategy, platform growth, and global vision to deliver accurate and accessible timing tools to millions of daily users.',
    email: 'bhairavi.co@gmail.com',
    linkedin: 'https://www.linkedin.com/in/raghavan-dan/', // <-- CEO LinkedIn URL here
    imageSrc: '/assets/team-ceo.png',
    initials: 'CEO',
    objectPosition: '50% 28%',
    scale: 1.35
  },
  {
    id: 'cto',
    name: 'Sarvesh',
    role: 'CTO & Co-Founder',
    title: 'Architecture & Technical Engineering',
    bio: 'Leads technical architecture, hardware clock synchronization, real-time audio systems, and high-performance web infrastructure.',
    email: 'ssvvb2004@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sarvesh8939/', // <-- CTO LinkedIn URL here
    imageSrc: '/assets/team-cto.png',
    initials: 'CTO',
    objectPosition: '50% 28%',
    scale: 1.35
  }
]

function MemberAvatar({ member }: { member: TeamMember }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10 dark:ring-primary/20 shadow-lg bg-secondary/50 flex items-center justify-center">
      {!imageError ? (
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src={member.imageSrc}
            alt={member.name}
            className="w-full h-full object-cover"
            style={{
              objectPosition: member.objectPosition,
              transform: member.scale ? `scale(${member.scale})` : undefined,
              transformOrigin: 'center center'
            }}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-primary/10 text-primary">
          <User className="w-12 h-12 text-primary mb-1 opacity-80" />
          <span className="text-xs font-black tracking-wider text-primary uppercase">
            {member.initials}
          </span>
        </div>
      )}
    </div>
  )
}

export default function TeamSection() {
  return (
    <section className="bg-card border border-card-border p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-[3rem]">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14">
        {/* Circular Icon matching reference */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
          <User className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight uppercase italic">
          Our <span className="text-primary italic">Team</span>
        </h2>

        <p className="text-sm sm:text-base text-muted leading-relaxed font-medium">
          Meet the dedicated minds behind Clocks and Alarms Online, committed to engineering precise, reliable, and distraction-free timekeeping utilities for individuals and teams worldwide.
        </p>
      </div>

      {/* Team Grid (Seamless layout without individual outer boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 max-w-4xl mx-auto">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center text-center justify-between"
          >
            {/* Content */}
            <div className="w-full flex flex-col items-center">
              <MemberAvatar member={member} />

              {/* Role */}
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-1.5">
                {member.role}
              </p>

              {/* Name */}
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-3">
                {member.name}
              </h3>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-muted font-medium leading-relaxed max-w-sm mx-auto mb-6">
                {member.bio}
              </p>
            </div>

            {/* Circular Social Actions (Mail & LinkedIn) */}
            <div className="w-full pt-2 flex items-center justify-center gap-3">
              {/* Email Circle */}
              <a
                href={`mailto:${member.email}?subject=Inquiry for ${member.name} (${member.role}) - Clocks and Alarms Online`}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 text-primary border border-primary/25 flex items-center justify-center shadow-sm hover:bg-primary/20 transition-colors"
                aria-label={`Send direct email to ${member.name} (${member.role})`}
                title={`Email ${member.name}`}
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              </a>

              {/* LinkedIn Circle */}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 text-primary border border-primary/25 flex items-center justify-center shadow-sm hover:bg-primary/20 transition-colors"
                  aria-label={`View LinkedIn profile of ${member.name}`}
                  title={`LinkedIn - ${member.name}`}
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
