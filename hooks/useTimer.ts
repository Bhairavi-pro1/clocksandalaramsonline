'use client'
import { useCallback } from 'react'
import { useStore } from './useStore'

export function useTimer(
  id: string, 
  initialSeconds: number = 0, 
  soundName: string = 'vibe',
  label?: string
) {
  const countdown = useStore((state) => state.countdowns.find((c) => c.id === id))
  const updateCountdown = useStore((state) => state.updateCountdown)
  const removeCountdown = useStore((state) => state.removeCountdown)

  const timeLeft = countdown?.timeLeft ?? initialSeconds
  const isActive = countdown?.isActive ?? false
  const isPaused = countdown?.isPaused ?? false
  const isSoundPlaying = countdown?.isRinging ?? false

  const start = useCallback((seconds?: number) => {
    const timeToStart = seconds !== undefined ? seconds : (timeLeft > 0 ? timeLeft : initialSeconds)
    const end = Date.now() + timeToStart * 1000
    
    updateCountdown(id, {
      label: label || countdown?.label || 'Timer',
      seconds: initialSeconds || timeToStart,
      sound: soundName || countdown?.sound || 'vibe',
      timeLeft: timeToStart,
      isActive: true,
      isPaused: false,
      isRinging: false,
      endTime: end
    })
  }, [id, timeLeft, initialSeconds, label, soundName, countdown?.label, countdown?.sound, updateCountdown])

  const pause = useCallback(() => {
    updateCountdown(id, {
      isPaused: true,
      endTime: null
    })
  }, [id, updateCountdown])

  const resume = useCallback(() => {
    const currentSeconds = timeLeft > 0 ? timeLeft : initialSeconds
    const end = Date.now() + currentSeconds * 1000
    updateCountdown(id, {
      isPaused: false,
      isActive: true,
      timeLeft: currentSeconds,
      endTime: end
    })
  }, [id, timeLeft, initialSeconds, updateCountdown])

  const stop = useCallback(() => {
    if (id.startsWith('preset-')) {
      removeCountdown(id)
    } else {
      updateCountdown(id, {
        isActive: false,
        isPaused: false,
        isRinging: false,
        timeLeft: initialSeconds,
        endTime: null
      })
    }
  }, [id, initialSeconds, removeCountdown, updateCountdown])

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
      return `${h > 0 ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }
  }
}
