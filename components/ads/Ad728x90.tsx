'use client'

import { useState, useEffect, useRef } from 'react'
import { SHOW_ADS } from '@/lib/config'

export default function Ad728x90() {
  if (!SHOW_ADS) return null

  const zoneId = '11789794' // Correct zoneId for this project's 728x90 banner
  const [shouldRender, setShouldRender] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (!shouldRender || !containerRef.current || hasRunRef.current) return

    let timeoutId: NodeJS.Timeout
    const runAd = () => {
      if ((window as any).aclib && typeof (window as any).aclib.runBanner === 'function') {
        try {
          hasRunRef.current = true
          const script = document.createElement('script')
          script.type = 'text/javascript'
          script.text = `aclib.runBanner({ zoneId: '${zoneId}' });`
          if (containerRef.current) {
            containerRef.current.appendChild(script)
          }
        } catch (e) {
          console.error('Adcash runBanner error:', e)
        }
      } else {
        timeoutId = setTimeout(runAd, 200)
      }
    }

    runAd()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [shouldRender, zoneId])

  return (
    <div className="ad-container-728x90" ref={containerRef} />
  )
}
