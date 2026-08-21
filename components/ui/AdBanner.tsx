'use client'
import Ad728x90 from '@/components/ads/Ad728x90'
import { SHOW_ADS } from '@/lib/config'

export function AdScript({ containerId }: { containerId: string }) {
  if (!SHOW_ADS) return null
  return <Ad728x90 />
}

export default function AdBanner() {
  if (!SHOW_ADS) return null
  return (
    <div className="py-6 flex items-center justify-center w-full mt-8 max-w-5xl mx-auto">
      <Ad728x90 />
    </div>
  )
}
