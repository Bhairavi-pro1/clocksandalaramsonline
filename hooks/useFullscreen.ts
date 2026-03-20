'use client'
import { useState, useEffect, useCallback } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])
  
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
