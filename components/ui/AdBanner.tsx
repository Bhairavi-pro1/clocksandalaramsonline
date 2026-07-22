'use client'
import Ad728x90 from '@/components/ads/Ad728x90'

export function AdScript({ containerId }: { containerId: string }) {
  // Wrapper for compatibility with components referencing AdScript
  return <Ad728x90 />
}

export default function AdBanner() {
  return (
    <div className="py-6 flex items-center justify-center w-full mt-8 max-w-5xl mx-auto">
      <Ad728x90 />
    </div>
  )
}
