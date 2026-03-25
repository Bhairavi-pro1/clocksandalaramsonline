import type { Metadata } from 'next'
import HomeClient from '@/components/pages/HomeClient'

export const metadata: Metadata = {
  title: 'Clocks and Alarms Online — High-Precision World Clock & Global Tracker',
  description: 'The gold standard in online timekeeping. Track world time, set alarms, and use high-precision timers with a vibrant, intuitive interface. Synchronized with world atomic time.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com',
  },
  openGraph: {
    title: 'Clocks and Alarms Online — High-Precision World Clock & Global Tracker',
    description: 'Precision meets design. The ultimate suite of professional-grade timekeeping tools.',
    type: 'website',
  }
}

export default function Home() {
  return (
    <div className="w-full">
      <HomeClient />
    </div>
  )
}
