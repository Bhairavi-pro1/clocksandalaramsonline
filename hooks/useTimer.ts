import { useState, useEffect, useRef, useCallback } from 'react'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

export function useTimer(id: string, initialSeconds: number = 0, soundName: string = 'vibe') {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const endTimeRef = useRef<number | null>(null)

  const [isSoundPlaying, setIsSoundPlaying] = useState(false)

  const storageKey = `timer_state_${id}`

  const saveState = useCallback((active: boolean, paused: boolean, remaining: number, end: number | null) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        isActive: active,
        isPaused: paused,
        remainingTime: remaining,
        endTime: end
      }))
    } catch(e) {}
  }, [storageKey])

  // Hydrate state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.isActive) {
          if (!parsed.isPaused && parsed.endTime) {
            const now = Date.now()
            const remaining = Math.max(0, Math.ceil((parsed.endTime - now) / 1000))
            if (remaining > 0) {
              setTimeLeft(remaining)
              setIsActive(true)
              setIsPaused(false)
              endTimeRef.current = parsed.endTime
            } else {
              // Timer finished while page was closed
              setTimeLeft(0)
              setIsActive(false)
              setIsPaused(false)
              saveState(false, false, 0, null)
            }
          } else {
            // Paused
            setTimeLeft(parsed.remainingTime ?? initialSeconds)
            setIsActive(true)
            setIsPaused(true)
            endTimeRef.current = null
          }
        }
      }
    } catch(e) {}
  }, [storageKey, initialSeconds, saveState])

  const start = useCallback((seconds?: number) => {
    const timeToStart = seconds !== undefined ? seconds : timeLeft;
    const end = Date.now() + timeToStart * 1000
    
    setTimeLeft(timeToStart)
    setIsActive(true)
    setIsPaused(false)
    setIsSoundPlaying(false)
    endTimeRef.current = end
    
    saveState(true, false, timeToStart, end)
  }, [timeLeft, saveState])

  const pause = useCallback(() => {
    setIsPaused(true)
    endTimeRef.current = null
    saveState(true, true, timeLeft, null)
  }, [timeLeft, saveState])

  const resume = useCallback(() => {
    const end = Date.now() + timeLeft * 1000
    setIsPaused(false)
    endTimeRef.current = end
    saveState(true, false, timeLeft, end)
  }, [timeLeft, saveState])

  const stop = useCallback(() => {
    setIsActive(false)
    setIsPaused(false)
    setIsSoundPlaying(false)
    setTimeLeft(initialSeconds)
    endTimeRef.current = null
    
    saveState(false, false, initialSeconds, null)
    
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [initialSeconds, saveState])

  const reset = useCallback(() => {
    stop()
  }, [stop])

  // Cleanup on unmount or removal
  useEffect(() => {
    return () => {
      // If the component unmounts but timer is still running, 
      // the state in localStorage will allow it to resume on next load.
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && !isPaused) {
      // Use 200ms interval for precision
      intervalRef.current = setInterval(() => {
        if (endTimeRef.current) {
          const now = Date.now()
          const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000))
          
          setTimeLeft(remaining)
          
          if (remaining <= 0) {
            setIsActive(false)
            endTimeRef.current = null
            saveState(false, false, 0, null)
            
            if (intervalRef.current) clearInterval(intervalRef.current)
            
            const audio = new Audio(SOUNDS[soundName] || SOUNDS.vibe)
            audio.loop = true
            audio.volume = 0.8
            audio.play().catch(e => console.error('Audio play blocked:', e))
            audioRef.current = audio

            setIsSoundPlaying(true)

            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification('⌛ Time Up!', { body: 'Your timer has finished.' })
            }
          }
        }
      }, 200)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, isPaused, soundName, saveState])

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
