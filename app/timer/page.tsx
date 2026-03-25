import type { Metadata } from 'next'
import TimerClient from '@/components/pages/TimerClient'

export const metadata: Metadata = {
  title: 'Online Countdown Timer – High-Precision Productivity Tool',
  description: 'A high-precision online countdown timer for students, professionals, and chefs. Features Pomodoro support, fitness intervals, and immersive full-screen focus mode.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/timer',
  },
  openGraph: {
    title: 'Online Countdown Timer – High-Precision Productivity Tool',
    description: 'Boost your focus with our millisecond-accurate countdown timer. Perfect for Pomodoro and heavy-duty productivity.',
    type: 'website',
  }
}

export default function TimerPage() {
  return (
    <div className="w-full">
      <TimerClient />
    </div>
  )
}
