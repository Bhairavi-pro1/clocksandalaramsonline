'use client'

import { useEffect, useRef } from 'react'
import { ADS_CONFIG, areAdsEnabled } from '@/lib/adsConfig'

export default function Ad160x600({ side = 'right', delay = 0 }: { side?: string; delay?: number }) {
  const isEnabled = areAdsEnabled()
  const adKey = ADS_CONFIG.highRevenueFormat?.skyscraperKey
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isEnabled || !adKey || !containerRef.current) return

    const timer = setTimeout(() => {
      if (!containerRef.current) return
      containerRef.current.innerHTML = ''

      const iframe = document.createElement('iframe')
      iframe.width = '160'
      iframe.height = '600'
      iframe.title = `Advertisement ${side}`
      iframe.style.width = '160px'
      iframe.style.height = '600px'
      iframe.style.border = 'none'
      iframe.style.overflow = 'hidden'

      containerRef.current.appendChild(iframe)

      const doc = iframe.contentWindow?.document || iframe.contentDocument
      if (doc) {
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 160px;
                  height: 600px;
                  overflow: hidden;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: transparent;
                }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '${adKey}',
                  'format' : 'iframe',
                  'height' : 600,
                  'width' : 160,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
            </body>
          </html>
        `)
        doc.close()
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [isEnabled, adKey, delay, side])

  if (!isEnabled || !adKey) {
    return null
  }

  return (
    <aside className="ad-column self-stretch" aria-label="Advertisement">
      <div className="sticky top-8">
        <div className="ad-script-container-160x600 relative">
          <span className="sr-only">Advertisement</span>
          <div ref={containerRef} style={{ width: '160px', height: '600px', overflow: 'hidden' }} />
        </div>
      </div>
    </aside>
  )
}


