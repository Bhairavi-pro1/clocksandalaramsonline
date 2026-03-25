import type { Metadata } from 'next'
import WorldClockClient from '@/components/pages/WorldClockClient'

export const metadata: Metadata = {
  title: 'World Clock — Current Local Time Worldwide',
  description: 'Track local time in any city worldwide with high precision. Our world clock supports all major timezones and adjusts automatically for daylight savings time.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/world-clock',
  },
  openGraph: {
    title: 'World Clock — Current Local Time Worldwide',
    description: 'Track local time in any city worldwide with high precision. Sync with global atomic time.',
    type: 'website',
  }
}

export default function WorldClockPage() {
  return (
    <div className="w-full">
      <WorldClockClient />
    </div>
  )
}
