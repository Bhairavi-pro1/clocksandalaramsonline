'use client'
import { useEffect } from 'react'

export function useExitIntent(active: boolean, onExit: () => void) {
  useEffect(() => {
    if (!active) return

    const handleMouseLeave = (e: MouseEvent) => {
      // clientY < 15 triggers exit-intent if they move mouse up (towards tab bar)
      if (e.clientY < 15) {
        onExit()
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      // Trigger if mouse leaves window completely (e.g. from top)
      if (!e.relatedTarget && e.clientY < 10) {
        onExit()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [active, onExit])
}
