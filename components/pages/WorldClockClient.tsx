'use client'
import { useState, useEffect, useRef } from 'react'
import { DateTime } from 'luxon'
import MainClockCard from '@/components/ui/MainClockCard'
import TimezoneSearch from '@/components/ui/TimezoneSearch'
import SmallClockCard from '@/components/ui/SmallClockCard'
import AdBanner from '@/components/ui/AdBanner'
import Link from 'next/link'
import * as cityTimezones from 'city-timezones'
import cityData from '@/data/seo/cities.json'

interface ClockData {
  country: string
  city: string
  timezone: string
}

const DEFAULT_CLOCKS: ClockData[] = [
  { country: 'UNITED KINGDOM', city: 'London', timezone: 'Europe/London' },
  { country: 'USA', city: 'New York', timezone: 'America/New_York' },
  { country: 'JAPAN', city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { country: 'UAE', city: 'Dubai', timezone: 'Asia/Dubai' },
  { country: 'INDIA', city: 'Kolkata', timezone: 'Asia/Kolkata' },
  { country: 'AFGHANISTAN', city: 'Kabul', timezone: 'Asia/Kabul' },
]

export default function WorldClockClient() {
  const globalSectionRef = useRef<HTMLDivElement>(null)
  const [globalClocks, setGlobalClocks] = useState<ClockData[]>([])
  const [localClock, setLocalClock] = useState<ClockData>({
    country: 'Detecting Location',
    city: 'Local Time',
    timezone: 'local'
  })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from LocalStorage & Detect User Location
  useEffect(() => {
    // 1. Load secondary clocks
    const saved = localStorage.getItem('clocksandalarms_clocks')
    if (saved) {
      setGlobalClocks(JSON.parse(saved))
    } else {
      setGlobalClocks(DEFAULT_CLOCKS)
    }

    // 2. Detect User Timezone & Specific Location Info
    try {
      const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (detectedZone) {
        const cityMatches = cityTimezones.cityMapping.filter(c => c.timezone === detectedZone)
        if (cityMatches && cityMatches.length > 0) {
          const prominentCity = [...cityMatches].sort((a, b) => (b.pop || 0) - (a.pop || 0))[0]
          setLocalClock({
            country: prominentCity.country.toUpperCase(),
            city: prominentCity.city,
            timezone: detectedZone
          })
        } else {
          const parts = detectedZone.split('/')
          const cityName = parts[parts.length - 1].replace(/_/g, ' ')
          setLocalClock({
            country: 'CURRENT TIMEZONE',
            city: cityName,
            timezone: detectedZone
          })
        }
      } 
    } catch (err) {
      console.error('Failed to detect location:', err)
    }

    setIsLoaded(true)
  }, [])

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('clocksandalarms_clocks', JSON.stringify(globalClocks))
    }
  }, [globalClocks, isLoaded])

  const addClock = (newClock: ClockData) => {
    if (!globalClocks.find(c => c.timezone === newClock.timezone && c.city === newClock.city)) {
      setGlobalClocks(prev => [...prev, newClock])
    }
    // Smooth scroll to the global timezone grid
    setTimeout(() => {
      globalSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const removeClock = (index: number) => {
    setGlobalClocks(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      {/* 2. Main Large Clock Card */}
      <div className="w-full">
        <MainClockCard 
          country={localClock.country}
          city={localClock.city}
          timezone={localClock.timezone}
          onAdd={addClock}
        />
      </div>

      {/* 3. Global Time Zones Section */}
      <div ref={globalSectionRef} className="max-w-7xl mx-auto w-full px-4 md:px-0 mt-6 sm:mt-8 pt-2 sm:pt-4">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white opacity-95 text-center mb-2 sm:mb-3">Global Time Zones</h2>
        
        <p className="text-muted/80 text-xs sm:text-sm font-medium mb-5 max-w-2xl mx-auto text-center">
          Click any world clock card for detailed <span className="text-white/90 font-bold">global timezone information</span>, live weather, and <span className="text-white/90 font-bold">local time differences</span>.
        </p>

        <div className="max-w-lg mx-auto mb-6 sm:mb-8 w-full px-2 sm:px-0">
          <TimezoneSearch onAdd={addClock} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6 gap-y-4 sm:gap-y-10 pb-12">
          {globalClocks.map((clock, index) => (
            <SmallClockCard 
              key={`${clock.timezone}-${clock.city}-${index}`}
              country={clock.country}
              city={clock.city}
              timezone={clock.timezone}
              onRemove={() => removeClock(index)}
            />
          ))}
        </div>

        {/* Popular World Cities SEO Directory */}
        <div className="pt-8 pb-16 border-t border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">Popular World Cities</h3>
            <p className="text-muted/70 text-xs sm:text-sm mt-1">
              Live clocks, astronomical data, weather, and DST schedules for major global cities
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
            {cityData.map((c) => (
              <Link
                key={c.slug}
                href={`/world-clock/${c.slug}/`}
                className="group py-2.5 px-1.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100/70 dark:bg-[#1a0b36]/40 hover:bg-slate-200/80 dark:hover:bg-[#1a0b36]/80 border border-slate-200/80 dark:border-white/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center shadow-sm"
              >
                <span className="text-slate-900 dark:text-white text-[11px] sm:text-xs md:text-sm font-bold group-hover:text-primary transition-colors truncate max-w-full">
                  {c.name}
                </span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-muted/60 mt-0.5 truncate max-w-full">
                  {c.timezone.split('/')[1]?.replace(/_/g, ' ') || c.timezone}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
