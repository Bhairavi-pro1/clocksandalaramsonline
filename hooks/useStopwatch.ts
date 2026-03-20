'use client'
import { useState, useRef, useCallback } from 'react'

export function useStopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    startTimeRef.current = Date.now() - pausedTimeRef.current
    timerRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current)
    }, 10)
  }, [isRunning])

  const pause = useCallback(() => {
    if (!isRunning) return
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    pausedTimeRef.current = Date.now() - startTimeRef.current
  }, [isRunning])

  const reset = useCallback(() => {
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    setTime(0)
    setLaps([])
    startTimeRef.current = 0
    pausedTimeRef.current = 0
  }, [])

  const lap = useCallback(() => {
    setLaps((prev) => [time, ...prev])
  }, [time])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
  }

  return { time, setTime, isRunning, laps, setLaps, start, pause, reset, lap, formatTime }
}
