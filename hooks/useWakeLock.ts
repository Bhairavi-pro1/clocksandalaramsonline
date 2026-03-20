'use client'
import { useEffect, useRef, useCallback } from 'react'

export function useWakeLock(enabled: boolean = true) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const requestWakeLock = useCallback(async () => {
    if ('wakeLock' in navigator && enabled) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
        console.log('Wake Lock is active')
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`)
      }
    }
  }, [enabled])

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release()
      wakeLockRef.current = null
      console.log('Wake Lock released')
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      requestWakeLock()
    } else {
      releaseWakeLock()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      releaseWakeLock()
    }
  }, [enabled, requestWakeLock, releaseWakeLock])

  return { requestWakeLock, releaseWakeLock }
}
