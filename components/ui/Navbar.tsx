'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-accent">
              ClocksAndAlarmsOnline
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/timer" className="text-sm font-medium hover:text-accent transition-colors">Timer</Link>
            <Link href="/alarm-clock" className="text-sm font-medium hover:text-accent transition-colors">Alarm</Link>
            <Link href="/meeting-planner" className="text-sm font-medium hover:text-accent transition-colors">Meeting Planner</Link>
            <Link href="/stopwatch" className="text-sm font-medium hover:text-accent transition-colors">Stopwatch</Link>
            <Link href="/world-clock" className="text-sm font-medium hover:text-accent transition-colors">World Clock</Link>
            <Link href="/dst-tracker" className="text-sm font-medium hover:text-accent transition-colors">DST Tracker</Link>
            <Link href="/shared-alarm" className="text-sm font-medium hover:text-accent transition-colors">Shared Alarm</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
