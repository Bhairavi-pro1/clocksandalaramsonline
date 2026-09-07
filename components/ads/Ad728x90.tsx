'use client'

import { useEffect, useRef } from 'react'
import { ADS_CONFIG, areAdsEnabled } from '@/lib/adsConfig'

export default function Ad728x90({ delay = 0 }: { delay?: number } = {}) {
  const isEnabled = areAdsEnabled()
  const adKey = ADS_CONFIG.highRevenueFormat?.bannerKey
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isEnabled || !adKey || !containerRef.current) return

    const timer = setTimeout(() => {
      if (!containerRef.current) return
      containerRef.current.innerHTML = ''

      const iframe = document.createElement('iframe')
      iframe.width = '728'
      iframe.height = '90'
      iframe.title = 'Advertisement 728x90'
      iframe.style.width = '728px'
      iframe.style.height = '90px'
      iframe.style.border = 'none'
      iframe.style.overflow = 'hidden'
      iframe.scrolling = 'no'
      iframe.setAttribute('frameborder', '0')

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
                  width: 728px;
                  height: 90px;
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
                  'height' : 90,
                  'width' : 728,
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
  }, [isEnabled, adKey, delay])

  if (!isEnabled || !adKey) {
    return null
  }

  return (
    <div className="ad-container-728x90 min-h-[90px] flex items-center justify-center">
      <div ref={containerRef} style={{ width: '728px', height: '90px', overflow: 'hidden' }} />
    </div>
  )
}


