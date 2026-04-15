'use client'
import { useState, useEffect, useRef } from 'react'
import { DateTime } from 'luxon'
import MainClockCard from '@/components/ui/MainClockCard'
import TimezoneSearch from '@/components/ui/TimezoneSearch'
import SmallClockCard from '@/components/ui/SmallClockCard'
import AdBanner from '@/components/ui/AdBanner'
import * as cityTimezones from 'city-timezones'

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
            country: 'CURRENT LOCATION',
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
      <div ref={globalSectionRef} className="max-w-7xl mx-auto w-full px-4 md:px-0 mt-12 pt-8">
        <h2 className="text-3xl md:text-4xl font-medium font-display text-white opacity-95 text-center mb-6">Global Time Zones</h2>
        
        <p className="text-muted/80 text-sm md:text-base font-medium mb-8 max-w-4xl mx-auto text-center">
          Click any world clock card for detailed <span className="text-white/90 font-bold">global timezone information</span>, live weather, and <span className="text-white/90 font-bold">local time differences</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-x-6 gap-y-10 pb-20">
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
      </div>
    </div>
  )
}
