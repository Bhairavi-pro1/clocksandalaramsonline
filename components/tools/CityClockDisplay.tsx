'use client'
import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import SunCalc from 'suncalc'
import { Sun, Moon, Wind, CloudRain, Thermometer } from 'lucide-react'

interface CityClockProps {
  name: string
  timezone: string
  lat: number
  lon: number
}

export default function CityClockDisplay({ name, timezone, lat, lon }: CityClockProps) {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(DateTime.now().setZone(timezone))
  const [weather, setWeather] = useState<any>(null)
  
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setNow(DateTime.now().setZone(timezone))
    }, 1000)
    
    // Fetch weather once from MET Norway (Commercial Use allowed, Open Data under CC BY 4.0)
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`)
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
      <div className="w-full max-w-5xl xl:max-w-[70rem] mx-auto p-10 xl:p-12 bg-[#1a0b2e]/40 backdrop-blur-xl border border-violet-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(124,58,237,0.1)] overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl xl:max-w-[70rem] mx-auto p-10 xl:p-12 bg-[#1a0b2e]/40 backdrop-blur-xl border border-violet-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(124,58,237,0.1)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 xl:gap-16 items-center">
        {/* Left: Main Clock */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-accent mb-6 uppercase tracking-[0.2em]">{name}</h2>
          <div className="flex items-baseline justify-center lg:justify-start font-mono text-[4.5rem] md:text-8xl xl:text-[6.5rem] font-black font-tabular tracking-tighter tabular-nums mb-6 leading-none drop-shadow-[0_0_20px_rgba(124,58,237,0.3)] text-white">
            <span>{now.toFormat('HH:mm:ss')}</span>
            <span className="text-primary/70 text-2xl md:text-4xl ml-4 font-bold tracking-normal">{now.toFormat('a')}</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white/90">{now.toLocaleString(DateTime.DATE_FULL)}</div>
          <p className="text-white/40 mt-2 font-bold uppercase tracking-widest text-xs">{timezone} (GMT {now.toFormat('ZZ')})</p>
        </div>

        {/* Right: Sun/Weather Details */}
        <div className="grid grid-cols-2 gap-4 xl:gap-5">
          <div className="p-6 bg-[#1a0b2e]/60 rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
            <Sun size={28} className="text-amber-500 mb-3" />
            <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em] mb-1">Sunrise</span>
            <span className="text-xl font-bold text-white">{sunrise.toFormat('HH:mm')}</span>
          </div>
          <div className="p-6 bg-[#1a0b2e]/60 rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
            <Moon size={28} className="text-violet-400 mb-3" />
            <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em] mb-1">Sunset</span>
            <span className="text-xl font-bold text-white">{sunset.toFormat('HH:mm')}</span>
          </div>
          
          {weather && (
            <>
              <div className="p-6 bg-[#1a0b2e]/60 rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
                <Thermometer size={28} className="text-rose-500 mb-3" />
                <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em] mb-1">Temp</span>
                <span className="text-xl font-bold text-white">{weather.temperature}°C</span>
              </div>
              <div className="p-6 bg-[#1a0b2e]/60 rounded-[1.5rem] border border-violet-500/10 flex flex-col items-center justify-center hover:border-violet-500/30 transition-all">
                <Wind size={28} className="text-emerald-400 mb-3" />
                <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em] mb-1">Wind</span>
                <span className="text-xl font-bold text-white">{weather.windspeed} km/h</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
