'use client'
import { useState, useEffect } from 'react'
import { Calendar, Clock, ArrowRight, Timer, PartyPopper, Zap } from 'lucide-react'
import { getHolidays, Holiday } from '@/lib/holidays'
import { useStore } from '@/hooks/useStore'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import * as cityTimezones from 'city-timezones'
import countriesData from '@/data/countries.json'
import { getCountryFromTimezone } from '@/lib/timezoneToCountry'

export default function CountdownScenarios() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [countryCode, setCountryCode] = useState<string>('us')
  const [countryName, setCountryName] = useState<string>('Global')
  const { addCountdown } = useStore()
  const router = useRouter()

  useEffect(() => {
    async function loadCountryHolidays() {
      let code = 'US'
      let name = 'United States'
      
      try {
        const detectedCode = getCountryFromTimezone();
        const matchCountry = countriesData.find(c => c.code.toUpperCase() === detectedCode.toUpperCase());
        if (matchCountry) {
          code = matchCountry.code;
          name = matchCountry.name;
        }
      } catch (err) {
        console.error('Failed to resolve country from timezone using getCountryFromTimezone helper:', err);
      }

      setCountryCode(code.toLowerCase())
      setCountryName(name)

      try {
        const year = new Date().getFullYear()
        const res = await fetch(`/api/holidays?country=${code}&year=${year}`)
        if (res.ok) {
          const data = await res.json()
          if (data.holidays && Array.isArray(data.holidays)) {
            const now = new Date()
            const upcoming = data.holidays
              .map((h: any) => {
                const parts = h.date.split('-')
                const parsedDate = parts.length === 3
                  ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
                  : new Date(h.date)
                const diffDays = Math.ceil((parsedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                return {
                  name: h.name,
                  date: parsedDate,
                  daysRemaining: diffDays
                }
              })
              .filter((h: any) => h.daysRemaining >= 0)
              .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
              .slice(0, 10)

            if (upcoming.length > 0) {
              setHolidays(upcoming)
              return
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch country holidays from Firestore/Calendarific:', err)
      }

      // Fallback to static global holidays
      setHolidays(getHolidays())
    }

    loadCountryHolidays()
  }, [])

  const handleAddTimer = (label: string, seconds: number) => {
    addCountdown({
      label,
      seconds,
      sound: 'vibe' 
    })
    document.getElementById('timers-list-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddHolidayCountdown = (holiday: Holiday) => {
    const now = new Date()
    const diffSeconds = Math.floor((holiday.date.getTime() - now.getTime()) / 1000)
    addCountdown({
      label: holiday.name,
      seconds: diffSeconds,
      sound: 'vibe'
    })
    document.getElementById('timers-list-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const timerPresets = [
    { label: '10 Second Timer', seconds: 10 },
    { label: '20 Second Timer', seconds: 20 },
    { label: '30 Second Timer', seconds: 30 },
    { label: '45 Second Timer', seconds: 45 },
    { label: '60 Second Timer', seconds: 60 },
    { label: '90 Second Timer', seconds: 90 },
    { label: '1 Minute Timer', seconds: 60 },
    { label: '2 Minute Timer', seconds: 120 },
    { label: '3 Minute Timer', seconds: 180 },
    { label: '4 Minute Timer', seconds: 240 },
    { label: '5 Minute Timer', seconds: 300 },
    { label: '10 Minute Timer', seconds: 600 },
    { label: '15 Minute Timer', seconds: 900 },
    { label: '20 Minute Timer', seconds: 1200 },
    { label: '25 Minute Timer', seconds: 1500 },
    { label: '30 Minute Timer', seconds: 1800 },
    { label: '45 Minute Timer', seconds: 2700 },
    { label: '50 Minute Timer', seconds: 3000 },
    { label: '1 Hour Timer', seconds: 3600 },
    { label: '2 Hour Timer', seconds: 7200 },
    { label: '4 Hour Timer', seconds: 14400 },
    { label: '8 Hour Timer', seconds: 28800 },
    { label: '10 Hour Timer', seconds: 36000 },
    { label: '12 Hour Timer', seconds: 43200 },
    { label: '24 Hour Timer', seconds: 86400 },
  ]

  return (
    <div className="space-y-10 py-6 animate-in fade-in duration-1000">
      {/* Timer Presets Section */}
      <section className="bg-card border border-card-border/30 rounded-[1.5rem] p-5 md:p-6 overflow-hidden relative">
        <div className="absolute -top-12 -right-12 p-24 opacity-[0.015] rotate-12 pointer-events-none hover:opacity-[0.03] transition-opacity duration-700">
          <Clock size={240} />
        </div>
        
        <header className="mb-5 relative z-10 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="text-primary" size={18} />
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-none">Set the timer for the specified time</h3>
          </div>
          <p className="text-[12px] text-muted/60 font-medium ml-6.5">Quick start any of these high-precision timer presets</p>
        </header>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 sm:gap-2 relative z-10">
          {timerPresets.map((preset) => {
            const shortLabel = preset.label
              .replace(' Second Timer', ' Sec Timer')
              .replace(' Minute Timer', ' Min Timer')
              .replace(' Hour Timer', ' Hr Timer');
            return (
              <button
                key={preset.label}
                onClick={() => handleAddTimer(preset.label, preset.seconds)}
                className="group flex items-center justify-center sm:justify-between p-2 sm:p-2.5 px-1.5 sm:px-3.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-1 sm:gap-2.5">
                  <div className="hidden sm:flex w-5 h-5 rounded-full bg-primary/10 items-center justify-center opacity-30 group-hover:opacity-100 group-hover:bg-primary/20 transition-all">
                    <Zap size={10} className="text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-[13px] font-bold text-primary/95 dark:text-sky-400 group-hover:text-primary transition-colors whitespace-nowrap">
                    <span className="hidden sm:inline">{preset.label}</span>
                    <span className="sm:hidden">{shortLabel}</span>
                  </span>
                </div>
                <ArrowRight size={12} className="hidden sm:block text-white/10 group-hover:text-primary transition-all" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Holiday Countdown Section */}
      <section className="bg-card border border-card-border/30 rounded-[1.5rem] p-5 md:p-6 overflow-hidden relative">
        <div className="absolute -top-12 -right-12 p-24 opacity-[0.015] -rotate-12 pointer-events-none hover:opacity-[0.03] transition-opacity duration-700">
          <PartyPopper size={240} />
        </div>

        <header className="mb-5 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="text-primary" size={18} />
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-none">Important Dates & Holidays</h3>
          </div>
          <p className="text-[12px] text-muted/60 font-medium ml-6.5">Automatically updated countdowns for holidays in {countryName}</p>
        </header>

        <div className="overflow-hidden bg-white/[0.02] sm:rounded-xl border-y border-x-0 sm:border border-white/5 -mx-5 sm:mx-0 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 shadow-sm">
                <th className="px-3 py-2.5 md:px-5 md:py-3 font-black text-white/40 uppercase text-[8px] tracking-[0.2em]">Scenario</th>
                <th className="px-3 py-2.5 md:px-5 md:py-3 font-black text-white/40 uppercase text-[8px] tracking-[0.2em] hidden sm:table-cell">Date</th>
                <th className="px-3 py-2.5 md:px-5 md:py-3 font-black text-white/40 uppercase text-[8px] tracking-[0.2em] text-right">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {holidays.map((holiday) => (
                <tr 
                  key={holiday.name} 
                  className="group hover:bg-primary/5 transition-all cursor-pointer"
                  onClick={() => {
                    const slug = holiday.name.toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^\w-]/g, '')
                    router.push(`/countdown/${countryCode}/${slug}`)
                  }}
                >
                  <td className="px-3 py-2.5 md:px-5 md:py-3 pr-3 md:pr-5">
                    <span className="text-[13px] text-primary/95 dark:text-sky-400 font-bold group-hover:text-primary transition-all decoration-1 underline-offset-[3px] decoration-primary/30 group-hover:underline">{holiday.name}</span>
                    <div className="sm:hidden text-[10px] text-white/40 mt-0.5 font-medium">
                      {holiday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 md:px-5 md:py-3 text-[13px] font-medium text-white/50 tabular-nums hidden sm:table-cell">
                    {holiday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-3 py-2.5 md:px-5 md:py-3 text-right text-[13px] font-black text-white/70 tabular-nums">
                    {holiday.daysRemaining} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
