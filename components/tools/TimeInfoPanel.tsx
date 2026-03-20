'use client'
import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import { Clock, Globe, Info, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimeInfoPanelProps {
  timezone: string
  cityName: string
  lat?: number
  lon?: number
}

const getTzAcronym = (tz: string) => {
  // Common manual overrides for consistency
  const overrides: Record<string, string> = {
    'Asia/Kolkata': 'IST',
    'Asia/Calcutta': 'IST',
    'Asia/Dubai': 'GST',
    'Asia/Singapore': 'SGT',
    'Asia/Hong_Kong': 'HKT',
    'Asia/Tokyo': 'JST',
    'Asia/Seoul': 'KST',
    'America/New_York': 'EST', // Will be refined by Intl if possible
    'Europe/London': 'GMT',
    'Europe/Paris': 'CET',
    'Australia/Sydney': 'AEST'
  }

  if (overrides[tz]) return overrides[tz]

  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'long' }).formatToParts(new Date())
    const name = parts.find(p => p.type === 'timeZoneName')?.value
    if (!name) return ''
    
    // If name is a generic offset like "GMT+5:30", it's useless as an acronym
    if (name.includes('+') || name.includes('-') || /^GMT/i.test(name) || /^UTC/i.test(name)) {
      // Try short name
      const shortParts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date())
      const shortName = shortParts.find(p => p.type === 'timeZoneName')?.value
      if (shortName && !shortName.includes('+') && !shortName.includes('-')) {
        return shortName.toUpperCase()
      }
      return ''
    }
    
    // Extract initials: "India Standard Time" -> "IST"
    // Handle cases like "Hawaii-Aleutian Standard Time" by keeping the hyphen or splitting it
    const acronym = name.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).map(word => word[0] || '').join('').toUpperCase()
    
    // Final check to avoid GMT/UTC patterns appearing in ANY acronym logic result
    if (acronym === 'GMT' || acronym === 'UTC' || acronym.length < 2) return ''
    return acronym
  } catch (e) {
    return ''
  }
}

export default function TimeInfoPanel({ timezone, cityName, lat, lon }: TimeInfoPanelProps) {
  const [mounted, setMounted] = useState(false)
  const [timeDiffMinutes, setTimeDiffMinutes] = useState<number | null>(null)
  const [utcOffset, setUtcOffset] = useState('')
  const [localTzShort, setLocalTzShort] = useState('')
  const [targetTzShort, setTargetTzShort] = useState('')
  const [weatherDetails, setWeatherDetails] = useState<{humidity?: number, pressure?: number} | null>(null)

  useEffect(() => {
    setMounted(true)
    
    const targetTime = DateTime.now().setZone(timezone)
    const localTime = DateTime.now()
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Calculate time difference in minutes
    const diffMinutes = targetTime.offset - localTime.offset
    setTimeDiffMinutes(diffMinutes)

    setUtcOffset(targetTime.toFormat('ZZ'))
    
    const localAcronym = getTzAcronym(localTz)
    const targetAcronym = getTzAcronym(timezone)
    
    // Final defensive check to ensure no GMT-like strings leak into the acronym card
    const stripGmt = (label: string, fallback: string) => {
      if (label.includes('+') || label.includes('-') || /GMT/i.test(label) || /UTC/i.test(label)) return fallback;
      return label;
    }

    setLocalTzShort(localAcronym || stripGmt(localTime.offsetNameShort || '', 'Local'))
    setTargetTzShort(targetAcronym || stripGmt(targetTime.offsetNameShort || '', 'Selected'))
    
    // Fetch extra weather details if lat/lon provided
    if (lat !== undefined && lon !== undefined) {
      const fetchWeather = async () => {
        try {
          const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`)
          if (!res.ok) return
          const data = await res.json()
          const currentDetails = data.properties?.timeseries?.[0]?.data?.instant?.details
          
          if (currentDetails) {
            setWeatherDetails({
              humidity: currentDetails.relative_humidity ? Math.round(currentDetails.relative_humidity) : undefined,
              pressure: currentDetails.air_pressure_at_sea_level ? Math.round(currentDetails.air_pressure_at_sea_level) : undefined
            })
          }
        } catch (err) {
          console.error('Weather Details fetch error:', err)
        }
      }
      fetchWeather()
    }

  }, [timezone, lat, lon])

  if (!mounted) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-20 animate-pulse bg-white/5 rounded-3xl h-48 border border-white/10" />
    )
  }

  const formatDiff = (diffMins: number | null) => {
    if (diffMins === null) return 'Calculating...'
    if (diffMins === 0) return 'Same as local time'
    
    const isAhead = diffMins > 0
    const absMins = Math.abs(diffMins)
    const hours = Math.floor(absMins / 60)
    const mins = absMins % 60
    
    let timeString = ""
    if (hours > 0) timeString += `${hours} hr${hours !== 1 ? 's' : ''}`
    if (mins > 0) timeString += ` ${mins} min${mins !== 1 ? 's' : ''}`
    
    timeString = timeString.trim()
    return isAhead ? `${timeString} ahead` : `${timeString} behind`
  }

  const getDiffColor = (diffMins: number | null) => {
    if (diffMins === null || diffMins === 0) return { text: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-500/20' }
    return diffMins > 0 
      ? { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/20' }
      : { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-500/20' }
  }

  const diffStyles = getDiffColor(timeDiffMinutes)

  return (
    <div className="w-full max-w-5xl mx-auto mt-20 px-4 md:px-0">
      <div className="flex items-center space-x-3 mb-8 justify-center lg:justify-start">
        <Info className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-black font-display text-white tracking-tight">
          Timezone Details <span className="text-white/40 font-bold ml-1">for {cityName}</span>
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn("p-8 rounded-[2.5rem] bg-[#1a0b2e]/60 border backdrop-blur-xl transition-all hover:-translate-y-1 duration-500", diffStyles.border)}>
          <div className="flex flex-col gap-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", diffStyles.bg)}>
              <Clock className={cn("w-7 h-7", diffStyles.text)} />
            </div>
            <div>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Time Difference</p>
              <p className="text-3xl font-black text-white tracking-tight mb-2">{formatDiff(timeDiffMinutes)}</p>
              <p className="text-sm text-muted/80 font-medium">Compared to your local browser</p>
              <p className="text-xs font-bold text-white/40 mt-1 uppercase tracking-widest">{localTzShort} → {targetTzShort}</p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-[#1a0b2e]/60 border border-violet-500/20 backdrop-blur-xl transition-all hover:-translate-y-1 duration-500">
          <div className="flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-violet-400/10">
              <Globe className="w-7 h-7 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Timezone Shift</p>
              <p className="text-3xl font-black text-white tracking-tight mb-2">UTC {utcOffset}</p>
              <p className="text-sm text-muted/80 font-medium">Standard coordinated time</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "p-8 rounded-[2.5rem] bg-[#1a0b2e]/60 border border-cyan-500/20 backdrop-blur-xl transition-all hover:-translate-y-1 duration-500"
        )}>
          <div className="flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-cyan-400/10">
              <Droplets className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Humidity & Pressure</p>
              <p className="text-2xl font-black text-white tracking-tight mb-2">
                {weatherDetails?.humidity !== undefined ? `${weatherDetails.humidity}% Humidity` : 'Loading...'}
              </p>
              <p className="text-sm text-muted/80 font-medium leading-relaxed">
                {weatherDetails?.pressure !== undefined ? `With ${weatherDetails.pressure} hPa of atmospheric pressure at sea level.` : 'Fetching real-time environmental data...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
