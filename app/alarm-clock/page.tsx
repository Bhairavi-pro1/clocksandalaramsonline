import type { Metadata } from 'next'
import AlarmClockClient from '@/components/pages/AlarmClockClient'

export const metadata: Metadata = {
  title: 'Online Alarm Clock – Professional High-Precision Alert System',
  description: 'A sophisticated yet simple-to-use online alarm clock. Manage multiple alarms with custom labels, high-fidelity sounds, and persistent browser notifications.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/alarm-clock',
  },
  openGraph: {
    title: 'Online Alarm Clock – Professional High-Precision Alert System',
    description: 'Never miss a beat with our persistent, high-fidelity online alarm system. Custom sounds and labels included.',
    type: 'website',
  }
}

export default function AlarmPage() {
  return (
    <div className="w-full">
      <AlarmClockClient />
    </div>
  )
}
