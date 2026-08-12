'use client'
import { useCallback } from 'react'
import { useStore } from './useStore'

export function useTimer(id: string, initialSeconds: number = 0, soundName: string = 'vibe') {
  const countdown = useStore((state) => state.countdowns.find((c) => c.id === id))
  const updateCountdown = useStore((state) => state.updateCountdown)

  const timeLeft = countdown?.timeLeft ?? initialSeconds
  const isActive = countdown?.isActive ?? false
  const isPaused = countdown?.isPaused ?? false
  const isSoundPlaying = countdown?.isRinging ?? false

  const start = useCallback((seconds?: number) => {
    const timeToStart = seconds !== undefined ? seconds : timeLeft
    const end = Date.now() + timeToStart * 1000
    
    updateCountdown(id, {
      timeLeft: timeToStart,
      isActive: true,
      isPaused: false,
      isRinging: false,
      endTime: end
    })
  }, [id, timeLeft, updateCountdown])

  const pause = useCallback(() => {
    updateCountdown(id, {
      isPaused: true,
      endTime: null
    })
  }, [id, updateCountdown])

  const resume = useCallback(() => {
    const end = Date.now() + timeLeft * 1000
    updateCountdown(id, {
      isPaused: false,
      endTime: end
    })
  }, [id, timeLeft, updateCountdown])

  const stop = useCallback(() => {
    updateCountdown(id, {
      isActive: false,
      isPaused: false,
      isRinging: false,
      timeLeft: initialSeconds,
      endTime: null
    })
  }, [id, initialSeconds, updateCountdown])

  const reset = useCallback(() => {
    stop()
  }, [stop])

  return { 
    timeLeft, 
    isActive, 
    isPaused, 
    isSoundPlaying,
    start, 
    pause, 
    resume, 
    stop, 
    reset,
    formatTime: (s: number) => {
      if (isNaN(s)) return '00:00'
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sec = s % 60
      return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }
  }
}
