'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

export function useTimer(initialSeconds: number = 0, soundName: string = 'vibe') {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const howlRef = useRef<Howl | null>(null)

  const [isSoundPlaying, setIsSoundPlaying] = useState(false)

  const start = useCallback((seconds?: number) => {
    if (seconds !== undefined) setTimeLeft(seconds)
    setIsActive(true)
    setIsPaused(false)
    setIsSoundPlaying(false)
  }, [])

  const pause = useCallback(() => {
    setIsPaused(true)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
  }, [])

  const stop = useCallback(() => {
    setIsActive(false)
    setIsPaused(false)
    setIsSoundPlaying(false)
    setTimeLeft(initialSeconds)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (howlRef.current) {
      howlRef.current.stop()
      howlRef.current = null
    }
  }, [initialSeconds])

  const reset = useCallback(() => {
    stop()
  }, [stop])

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      
      howlRef.current = new Howl({
        src: [SOUNDS[soundName] || SOUNDS.vibe],
        loop: true,
        volume: 0.8
      })
      howlRef.current.play()
      setIsSoundPlaying(true)

      if (Notification.permission === 'granted') {
        new Notification('⌛ Time Up!', { body: 'Your timer has finished.' })
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, isPaused, timeLeft, soundName])

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
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sec = s % 60
      return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }
  }
}
