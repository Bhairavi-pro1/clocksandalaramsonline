'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Globe, Plus, Trash2, Clock } from 'lucide-react'
import cityData from '@/data/seo/cities.json'

interface TimezoneClock {
  id: string
  name: string
  timezone: string
  slug: string
}

export default function WorldClock() {
  const [clocks, setClocks] = useState<TimezoneClock[]>(
    cityData.slice(0, 3).map(c => ({ id: c.slug, name: c.name, timezone: c.timezone, slug: c.slug }))
  )
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (tz: string) => {
    return now.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (tz: string) => {
    return now.toLocaleDateString('en-US', {
      timeZone: tz,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-card border border-card-border rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Globe className="text-accent" />
          World Clock
        </h2>
        <button className="p-2 rounded-lg bg-secondary hover:bg-primary transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clocks.map((clock) => (
          <Link 
            key={clock.id} 
            href={`/world-clock/${clock.slug}`}
            className="p-6 bg-secondary/20 rounded-2xl border border-card-border hover:border-accent/80 hover:bg-secondary/40 transition-all group relative block cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{clock.name}</h3>
                <p className="text-xs text-muted font-medium uppercase tracking-tighter">{clock.timezone}</p>
              </div>
              <Clock size={16} className="text-accent/50" />
            </div>
            
            <div className="font-mono text-3xl font-black mb-1 tabular-nums">
              {formatTime(clock.timezone)}
            </div>
            <div className="text-sm text-muted font-bold">
              {formatDate(clock.timezone)}
            </div>

            <button 
              onClick={(e) => {
                e.preventDefault()
                setClocks(clocks.filter(c => c.id !== clock.id))
              }}
              className="absolute top-2 right-2 p-1 text-danger opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}
