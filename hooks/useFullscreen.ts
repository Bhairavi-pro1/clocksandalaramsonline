'use client'
import { useState, useEffect, useCallback } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      if (document.documentElement && typeof document.documentElement.requestFullscreen === 'function') {
        try {
          const promise = document.documentElement.requestFullscreen()
          if (promise && typeof promise.catch === 'function') {
            promise.catch((err) => {
              console.error(`Error attempting to enable full-screen mode: ${err.message}`)
            })
          }
        } catch (err: any) {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        }
      }
      setIsFullscreen(true)
    } else {
      if (typeof document.exitFullscreen === 'function') {
        try {
          const promise = document.exitFullscreen()
          if (promise && typeof promise.catch === 'function') {
            promise.catch((err) => {
              console.error(`Error exiting full-screen mode: ${err.message}`)
            })
          }
        } catch (err: any) {
          console.error(`Error exiting full-screen mode: ${err.message}`)
        }
      }
      setIsFullscreen(false)
    }
  }, [isFullscreen])
  
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFSChange)
    
    // F-key shortcut
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          toggleFullscreen()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    
    return () => {
      document.removeEventListener('fullscreenchange', onFSChange)
      window.removeEventListener('keydown', onKey)
    }
  }, [toggleFullscreen])
  
  return { isFullscreen, toggleFullscreen }
}
