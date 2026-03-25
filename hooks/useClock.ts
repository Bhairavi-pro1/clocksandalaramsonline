'use client'
import { useState, useEffect } from 'react'

interface ClockState {
  hours: string
  minutes: string
  seconds: string
  period: string
  date: string
  timezone: string
}

export function useClock(is24Hour = false): ClockState {
  const getTime = (): ClockState => {
    const now = new Date()
    const h = now.getHours()
    return {
      hours: is24Hour ? String(h).padStart(2, '0') : String(h % 12 || 12).padStart(2, '0'),
      minutes: String(now.getMinutes()).padStart(2, '0'),
      seconds: String(now.getSeconds()).padStart(2, '0'),
      period: h < 12 ? 'AM' : 'PM',
      date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }
  
  const [clock, setClock] = useState<ClockState>({
    hours: '--',
    minutes: '--',
    seconds: '--',
    period: '--',
    date: 'Syncing...',
    timezone: 'UTC',
  })
  
  useEffect(() => {
    // Initial sync
    setClock(getTime())
    
    // Align to next second boundary — prevents drift
    const now = Date.now()
    const msToNextSecond = 1000 - (now % 1000)
    
    let interval: NodeJS.Timeout
    
    const timeout = setTimeout(() => {
      setClock(getTime())
      // After first aligned tick, use setInterval
      interval = setInterval(() => setClock(getTime()), 1000)
    }, msToNextSecond)
    
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [is24Hour])
  
  return clock
}
