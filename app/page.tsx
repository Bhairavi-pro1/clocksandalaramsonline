'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { DateTime } from 'luxon'
import StructuredData from '@/components/seo/StructuredData'
import WorldClockHeader from '@/components/ui/WorldClockHeader'
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

export default function Home() {
  const [globalClocks, setGlobalClocks] = useState<ClockData[]>([])
  const [localClock, setLocalClock] = useState<ClockData>({
    country: 'Detecting Location',
    city: 'Local Time',
    timezone: 'local'
  })
  const [nextTransition, setNextTransition] = useState<{ date: string; type: string; country: string } | null>(null)
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

    // 3. Calculate the absolute next DST Transition globally
    const calculateTransition = () => {
      const now = DateTime.now()
      let earliest: { timestamp: number; date: string; type: string; country: string } | null = null

      // Get unique timezones only. Iterating over all 7000+ cities is too heavy.
      const uniqueZones = new Set<string>();
      cityTimezones.cityMapping.forEach(c => uniqueZones.add(c.timezone));

      // Check each unique zone for its next transition
      for (const zone of uniqueZones) {
        try {
          const dt = now.setZone(zone)
          if (!dt.isValid) continue
          const currentOffset = dt.offset

          // Optimization: Check months first to find the month of transition
          for (let m = 1; m <= 12; m++) {
            const monthCheck = dt.plus({ months: m })
            if (monthCheck.offset !== currentOffset) {
              // Found the month, now find the day
              for (let d = (m > 1 ? (m - 1) * 28 : 1); d <= m * 31; d++) {
                const dayCheck = dt.plus({ days: d }).endOf('day')
                if (dayCheck.offset !== currentOffset) {
                  const timestamp = dayCheck.toMillis()
                  if (!earliest || timestamp < earliest.timestamp) {
                    const cityEntry = cityTimezones.cityMapping.find(c => c.timezone === zone);
                    earliest = {
                      timestamp,
                      date: dayCheck.toFormat('cccc, LLLL d'),
                      type: dayCheck.offset > currentOffset ? "Spring Forward +1 Hour" : "Fall Back -1 Hour",
                      country: cityEntry?.country || zone
                    }
                  }
                  break
                }
              }
              break
            }
          }
        } catch (e) {}
      }

      if (earliest) {
        setNextTransition({
          date: earliest.date,
          type: earliest.type,
          country: earliest.country
        })
      }
    }
    calculateTransition()

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
  }

  const removeClock = (index: number) => {
    setGlobalClocks(prev => prev.filter((_, i) => i !== index))
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Clocks and Alarms Online",
    "operatingSystem": "Any",
    "applicationCategory": "UtilitiesApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  return (
    <div className="flex flex-col space-y-12 pb-4 w-full overflow-hidden">
      <StructuredData data={schema} />
      
      {/* 1. Header Text */}
      <WorldClockHeader />

      {/* 2. Main Large Clock Card */}
      <div className="w-full">
        <MainClockCard 
          country={localClock.country}
          city={localClock.city}
          timezone={localClock.timezone}
        />
      </div>

      {/* 3. Global Time Zones Section */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-0">
        <TimezoneSearch onAdd={addClock} />
        
        <p className="text-muted/80 text-sm md:text-base font-medium mb-8 max-w-4xl mx-auto text-center">
          Click any world clock card for detailed <span className="text-white/90 font-bold">global timezone information</span>, live weather, and <span className="text-white/90 font-bold">local time differences</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-x-6 gap-y-10">
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

      {/* High-Precision SEO Content & User Guide */}
      <div className="max-w-6xl mx-auto mt-24 px-6 space-y-20">
        
        {/* Excellent SEO Paragraph */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            The Gold Standard in Timekeeping
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            Clocks and Alarms Online - World Clock & High-Precision Global Tracker <br />
            <span className="text-primary/80">for Unmatched Productivity</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Welcome to Clocks and Alarms Online, where precision meets design. Our high-precision world clock is engineered 
            to deliver millisecond-accurate time synchronization across every corner of the globe. 
            Whether you are managing international teams, trading across markets, or simply keeping in touch 
            with loved ones, Clocks and Alarms Online provides a seamless, vibrant interface that feels like the future and 
            is exceptionally easy to track at a glance.
          </p>
        </section>

        {/* Comprehensive "How to Use" Guide */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">1</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">View Local Time</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              The main dashboard card instantly syncs with your device to show you your local time with high accuracy.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">2</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Add Global Zones</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Use the intelligent search bar above the grid to find cities or countries and add them to your persistent dashboard.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">3</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Go Full-Screen</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Click the expand icon in the corner of any clock to enter a dedicated focus mode, perfect for clocks or public displays.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">4</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Auto-Save Dashboard</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Your selected timezones are automatically saved to your browser and will load every time you return to the site.
            </p>
          </div>
        </section>
        
        {/* NEW: DST Tracker Teaser */}
        <section className="bg-gradient-to-br from-accent/20 via-primary/5 to-transparent border border-accent/20 p-12 rounded-[3rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar size={180} />
           </div>
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                    Never Miss a Beat
                 </div>
                 <h3 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
                    World Class <br />
                    <span className="text-accent italic">DST Tracking</span>
                 </h3>
                 <p className="text-lg text-muted/80 leading-relaxed font-medium">
                    Global Daylight Saving Time changes can be confusing. Our new tracker 
                    provides millisecond-accurate countdowns and schedules for every 
                    major timezone in the world.
                 </p>
                 <Link 
                    href="/dst-tracker" 
                    className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-accent/30"
                 >
                    Try DST Tracker <ArrowRight size={16} />
                 </Link>
              </div>
              <div className="hidden md:block">
                 <div className="bg-[#1a0b2e]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-4 shadow-2xl skew-y-3 hover:skew-y-0 transition-all duration-700">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                       <span className="text-xs font-bold text-white/40">Upcoming Transition</span>
                       <span className="text-[10px] font-black text-accent uppercase bg-accent/10 px-2 py-1 rounded">{nextTransition?.country || 'United Kingdom'}</span>
                    </div>
                    {nextTransition ? (
                      <div className="py-2 animate-in fade-in duration-500">
                        <p className="text-2xl font-black text-white">{nextTransition.date}</p>
                        <p className="text-sm font-bold text-accent">{nextTransition.type}</p>
                      </div>
                    ) : (
                      <div className="py-2 opacity-20">
                        <p className="text-2xl font-black text-white">Calculating...</p>
                        <p className="text-sm font-bold text-accent">Next time shift</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </section>

        {/* Horizontal Ad Banner Slot */}
        <AdBanner />
      </div>
    </div>
  );
}

