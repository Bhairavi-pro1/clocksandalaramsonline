'use client'
import Ad728x90 from '@/components/ads/Ad728x90'
import Ad320x50 from '@/components/ads/Ad320x50'
import { SHOW_ADS } from '@/lib/adsConfig'
import { cn } from '@/lib/utils'

export function AdScript({ containerId }: { containerId: string }) {
  if (!SHOW_ADS) return null
  return (
    <>
      <div className="hidden sm:flex items-center justify-center w-full">
        <Ad728x90 />
      </div>
      <div className="flex sm:hidden items-center justify-center w-full">
        <Ad320x50 />
      </div>
    </>
  )
}

export default function AdBanner({ className }: { className?: string } = {}) {
  if (!SHOW_ADS) return null
  return (
    <div className={cn("py-2 sm:py-3 flex items-center justify-center w-full mt-3 sm:mt-4 max-w-5xl mx-auto overflow-hidden", className)}>
      <div className="hidden sm:flex items-center justify-center w-full">
        <Ad728x90 />
      </div>
      <div className="flex sm:hidden items-center justify-center w-full">
        <Ad320x50 />
      </div>
    </div>
  )
}


