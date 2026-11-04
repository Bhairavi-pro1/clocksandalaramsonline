'use client'
import { useState } from 'react'
import CountdownTimer from '@/components/tools/CountdownTimer'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
import AddCountdownModal from '@/components/tools/AddCountdownModal'
import { useStore } from '@/hooks/useStore'
import AdBanner from '@/components/ui/AdBanner'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import CountdownScenarios from '@/components/tools/CountdownScenarios'
import timerData from '@/data/seo/timers.json'

function getTimerDisplay(slug: string) {
  if (slug === 'pomodoro') return { label: 'Pomodoro', sub: '25 min focus' }
  const m = slug.match(/(\d+)/)
  const mins = m ? parseInt(m[1], 10) : 5
  if (mins >= 60) {
    const hours = mins / 60
    return { label: `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`, sub: `${mins} mins` }
  }
  return { label: `${mins} Min`, sub: `${mins * 60} sec` }
}

const sortedTimers = [...timerData].sort((a, b) => {
  const getMinutes = (slug: string) => {
    if (slug === 'pomodoro') return 25
    const m = slug.match(/(\d+)/)
    return m ? parseInt(m[1], 10) : 0
  }
  return getMinutes(a.slug) - getMinutes(b.slug)
})

export default function TimerClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { countdowns, addCountdown, removeCountdown } = useStore()

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-2 sm:pt-4 pb-12 sm:pb-20">
      <div className="flex flex-col gap-4 sm:gap-12">
        {/* Row 1: Local Time Box Fully Occupied */}
        <div className="w-full">
          <LocalTimeBox />
        </div>

        {/* Row 2: Control Bar */}
        <div id="timers-list-section" className="flex items-center justify-between gap-3 w-full pb-3 border-b border-white/5 scroll-mt-24">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${
              countdowns.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-white/20"
            }`} />
            <h2 className="text-sm sm:text-xl font-black text-slate-900 dark:text-white tracking-wider uppercase">
              {countdowns.length === 0 ? "No Active Timers" : "Created Timers"}
            </h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-2 sm:px-6 sm:py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20 text-xs sm:text-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add Timer
          </button>
        </div>

        {/* Row 3: Countdown Cards Grid (only when active) */}
        {countdowns.length > 0 && (
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 animate-in fade-in duration-500">
              {countdowns.map((c) => (
                <CountdownTimer 
                  key={c.id}
                  id={c.id}
                  label={c.label}
                  initialSeconds={c.seconds}
                  sound={c.sound}
                  onRemove={removeCountdown}
                />
              ))}
            </div>
          </div>
        )}

        {/* Popular Countdown Timers SEO Directory */}
        <div className="pt-6 sm:pt-8 pb-4 border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">Popular Countdown Timers</h3>
            <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
              Pre-configured timers with full-screen focus mode and audio alerts
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
            {sortedTimers.map((t) => {
              const display = getTimerDisplay(t.slug)
              return (
                <Link
                  key={t.slug}
                  href={`/timer/${t.slug}/`}
                  className="group py-2.5 px-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-100/70 dark:bg-[#1a0b36]/40 hover:bg-slate-200/80 dark:hover:bg-[#1a0b36]/80 border border-slate-200/80 dark:border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center shadow-sm"
                >
                  <span className="text-slate-900 dark:text-white text-[11px] sm:text-xs md:text-sm font-bold group-hover:text-primary transition-colors truncate max-w-full">
                    {display.label}
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-muted/60 mt-0.5 truncate max-w-full">
                    {display.sub}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <AddCountdownModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addCountdown}
      />
      
      <div className="mt-16 sm:mt-32">
        <CountdownScenarios />
      </div>
    </div>
  )
}
