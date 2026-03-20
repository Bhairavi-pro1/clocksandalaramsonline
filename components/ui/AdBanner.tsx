'use client'
import { useEffect, useRef } from 'react'

export function AdScript({ containerId }: { containerId: string }) {
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adContainerRef.current) {
      // Clear existing content
      adContainerRef.current.innerHTML = ''
      
      const iframe = document.createElement('iframe')
      iframe.width = "728"
      iframe.height = "90"
      iframe.frameBorder = "0"
      iframe.scrolling = "no"
      
      adContainerRef.current.appendChild(iframe)
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(`
          <style>body { margin: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; }</style>
          <script type="text/javascript">
            atOptions = {
              'key' : '7b0edde2aafeac99008a4ced5d67b3c5',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="https://www.highperformanceformat.com/7b0edde2aafeac99008a4ced5d67b3c5/invoke.js"></scr' + 'ipt>');
          </script>
        `)
        iframeDoc.close()
      }
    }
  }, [containerId])

  return (
    <div 
      ref={adContainerRef}
      className="w-full flex items-center justify-center overflow-hidden min-h-[90px]"
    />
  )
}

export default function AdBanner() {
  const idSuffix = useRef(Math.random().toString(36).substring(7)).current
  return (
    <div className="pt-10 pb-2 flex flex-col items-center justify-center relative w-full border-t border-card-border/10 mt-16 max-w-5xl mx-auto">
      <p className="text-[9px] text-primary/40 tracking-[0.3em] uppercase mb-4 font-black">ADVERTISEMENT</p>
      <AdScript containerId={`ad-banner-${idSuffix}`} />
    </div>
  )
}


