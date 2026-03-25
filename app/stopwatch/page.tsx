import type { Metadata } from 'next'
import StopwatchClient from '@/components/pages/StopwatchClient'

export const metadata: Metadata = {
  title: 'Online Stopwatch – High-Precision Lap Timer',
  description: 'A professional-grade online stopwatch with millisecond accuracy. Features lap timing, history tracking, and full-screen mode for athletics and productivity.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/stopwatch',
  },
  openGraph: {
    title: 'Online Stopwatch – High-Precision Lap Timer',
    description: 'Professional millisecond-accurate stopwatch for any activity. Lap tracking and full-screen mode included.',
    type: 'website',
  }
}

export default function StopwatchPage() {
  return (
    <div className="w-full">
      <StopwatchClient />
    </div>
  )
}
