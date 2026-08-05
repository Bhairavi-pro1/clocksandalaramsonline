'use client'
import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import SunCalc from 'suncalc'
import { Sun, Moon, Wind, CloudRain, Thermometer } from 'lucide-react'
import { useStore } from '@/hooks/useStore'

interface CityClockProps {
  name: string
  timezone: string
  lat: number
  lon: number
}

export default function CityClockDisplay({ name, timezone, lat, lon }: CityClockProps) {
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(DateTime.now().setZone(timezone))
  const [weather, setWeather] = useState<any>(null)
  
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setNow(DateTime.now().setZone(timezone))
    }, 1000)
    
    // Fetch weather once from MET Norway via our server proxy to avoid CORS and User-Agent blocks
    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/weather/?lat=${lat}&lon=${lon}`)
        if (!res.ok) return // Silently fail if rate-limited or invalid
        const data = await res.json()
        const currentDetails = data.properties?.timeseries?.[0]?.data?.instant?.details
        
        if (currentDetails) {
          setWeather({
            temperature: Math.round(currentDetails.air_temperature),
            windspeed: Math.round(currentDetails.wind_speed * 3.6) // Converts m/s to km/h
          })
        }
      } catch (err) {
        console.error('Weather fetch error:', err)
      }
    }
    fetchWeather()
    
    return () => clearInterval(timer)
  }, [timezone, lat, lon])

  const sunTimes = SunCalc.getTimes(now.toJSDate(), lat, lon)
  const sunrise = DateTime.fromJSDate(sunTimes.sunrise).setZone(timezone)
  const sunset = DateTime.fromJSDate(sunTimes.sunset).setZone(timezone)

  if (!mounted) {
    return (
      <div className="w-full max-w-5xl xl:max-w-[70rem] mx-auto p-4 sm:p-10 xl:p-12 bg-[#1a0b2e]/40 backdrop-blur-xl border border-violet-500/20 rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(124,58,237,0.1)] overflow-hidden min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl xl:max-w-[70rem] mx-auto p-6 sm:p-10 xl:p-12 bg-[#1a0b2e]/40 backdrop-blur-xl border border-violet-500/20 rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(124,58,237,0.1)] overflow-hidden">
      {/* Top: Main Ticking Clock */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-accent mb-2 sm:mb-4 uppercase tracking-[0.15em] sm:tracking-[0.2em]">{name}</h2>
        
        <div className="flex items-baseline justify-center font-mono text-5xl sm:text-7xl md:text-8xl xl:text-[7rem] font-black font-tabular tracking-tighter tabular-nums mb-3 sm:mb-6 leading-none drop-shadow-[0_0_20px_rgba(124,58,237,0.3)] text-white">
          <span>{now.toFormat(is24Hour ? 'HH:mm:ss' : 'hh:mm:ss')}</span>
          {!is24Hour && (
            <span className="text-primary/70 text-lg sm:text-3xl md:text-4xl ml-2 sm:ml-4 font-bold tracking-normal">{now.toFormat('a')}</span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-lg font-bold text-white/90">
          <span>{now.toLocaleString(DateTime.DATE_FULL)}</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="text-white/40 uppercase tracking-widest text-[10px] sm:text-xs">{timezone} (GMT {now.toFormat('ZZ')})</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-8 sm:mb-10" />

      {/* Bottom: Sun/Weather Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-5 max-w-4xl mx-auto w-full">
        {/* Sunrise Card */}
        <div className="p-4 sm:p-6 bg-[#1a0b2e]/60 rounded-2xl sm:rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
          <Sun className="text-amber-500 mb-2 sm:mb-3 w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-[9px] sm:text-[10px] text-white/50 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] mb-1">Sunrise</span>
          <span className="text-base sm:text-xl font-bold text-white">{sunrise.toFormat(is24Hour ? 'HH:mm' : 'hh:mm a')}</span>
        </div>

        {/* Sunset Card */}
        <div className="p-4 sm:p-6 bg-[#1a0b2e]/60 rounded-2xl sm:rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
          <Moon className="text-violet-400 mb-2 sm:mb-3 w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-[9px] sm:text-[10px] text-white/50 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] mb-1">Sunset</span>
          <span className="text-base sm:text-xl font-bold text-white">{sunset.toFormat(is24Hour ? 'HH:mm' : 'hh:mm a')}</span>
        </div>
        
        {weather ? (
          <>
            {/* Temp Card */}
            <div className="p-4 sm:p-6 bg-[#1a0b2e]/60 rounded-2xl sm:rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
              <Thermometer className="text-rose-500 mb-2 sm:mb-3 w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] mb-1">Temp</span>
              <span className="text-base sm:text-xl font-bold text-white">{weather.temperature}°C</span>
            </div>

            {/* Wind Card */}
            <div className="p-4 sm:p-6 bg-[#1a0b2e]/60 rounded-2xl sm:rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
              <Wind className="text-emerald-400 mb-2 sm:mb-3 w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] mb-1">Wind</span>
              <span className="text-base sm:text-xl font-bold text-white">{weather.windspeed} km/h</span>
            </div>
          </>
        ) : (
          <>
            {/* Weather Load Placeholders */}
            <div className="p-4 sm:p-6 bg-[#1a0b2e]/60 rounded-2xl sm:rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all opacity-50">
              <Thermometer className="text-rose-500 mb-2 sm:mb-3 w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] mb-1">Temp</span>
              <span className="text-base sm:text-xl font-bold text-white">Loading...</span>
            </div>
            <div className="p-4 sm:p-6 bg-[#1a0b2e]/60 rounded-2xl sm:rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all opacity-50">
              <Wind className="text-emerald-400 mb-2 sm:mb-3 w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] mb-1">Wind</span>
              <span className="text-base sm:text-xl font-bold text-white">Loading...</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
