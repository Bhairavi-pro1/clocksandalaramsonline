'use client'
import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/hooks/useStore'

interface SmallClockCardProps {
  country: string
  city: string
  timezone: string
  onRemove?: () => void
}

export default function SmallClockCard({ country, city, timezone, onRemove }: SmallClockCardProps) {
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<DateTime | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setTime(DateTime.now().setZone(timezone))
    const interval = setInterval(() => {
      setTime(DateTime.now().setZone(timezone))
    }, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  const countrySlug = (country || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const citySlug = (city || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  // Standard SEO optimized nested route: /time/country/city/year/month/day
  // Use a stable fixed date for placeholders to avoid hydration mismatch
  // DateTime.now() changes between server and client.
  const placeholderDate = DateTime.fromISO('2024-01-01T00:00:00Z');
  const currentTime = time || placeholderDate;
  const year = currentTime.toFormat('yyyy')
  const month = currentTime.toFormat('MMMM').toLowerCase()
  const day = currentTime.toFormat('dd')
  const href = `/time/${countrySlug}/${citySlug}/${year}/${month}/${day}?timezone=${encodeURIComponent(timezone)}`

  return (
    <div className="relative p-3.5 sm:p-7 rounded-2xl sm:rounded-[1.8rem] bg-[#1a0b2e]/40 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] group">
      {/* Top Header Row */}
      <div className="flex justify-between items-center w-full mb-2 sm:mb-6 relative z-10">
        <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-primary uppercase drop-shadow-sm truncate max-w-[calc(100%-18px)]">{country}</span>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
          className="text-white/20 hover:text-danger hover:bg-danger/10 rounded-full p-0.5 sm:p-1 transition-all cursor-pointer z-20"
        >
          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Main Content (Centered) wrapped in Link */}
      <Link href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" aria-label={`View time in ${city}, ${country}`} />
      
      <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 relative pointer-events-none w-full">
        <h4 className="text-sm sm:text-xl font-bold text-white tracking-tight truncate w-full text-center">{city}</h4>
        
        <div className="text-xl sm:text-[2.65rem] font-bold tracking-tight text-white leading-none py-1 sm:py-2 font-tabular drop-shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          {time ? time.toFormat(mounted && is24Hour ? 'HH:mm:ss' : 'hh:mm:ss') : '00:00:00'}
          {time && (!mounted || !is24Hour) && (
            <span className="text-[9px] sm:text-sm font-normal text-white/40 ml-0.5 sm:ml-1.5 uppercase tracking-tighter">{time.toFormat('a')}</span>
          )}
        </div>

        <div className="flex flex-col items-center space-y-0.5 sm:space-y-1 w-full">
          <p className="hidden sm:block text-[11px] font-semibold text-white/70 w-full text-center truncate">
            {time ? time.toFormat('cccc, LLLL d, yyyy') : 'Loading...'}
          </p>
          <p className="block sm:hidden text-[9px] font-semibold text-white/70 w-full text-center truncate">
            {time ? time.toFormat('ccc, LLL d, yyyy') : 'Loading...'}
          </p>
          <p className="text-[8px] sm:text-[10px] text-primary font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] drop-shadow-[0_0_8px_rgba(124,58,237,0.4)] w-full text-center truncate">{timezone}</p>
        </div>
      </div>
    </div>
  )
}
