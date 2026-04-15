'use client'
import { useState, useEffect, useRef } from 'react'
import { DateTime } from 'luxon'
import { Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdScript } from './AdBanner'

import TimezoneSearch from './TimezoneSearch'

interface MainClockCardProps {
  timezone?: string
  city?: string
  country?: string
  onAdd?: (zone: { country: string, city: string, timezone: string }) => void
}

export default function MainClockCard({ 
  timezone = 'local', 
  city = 'Local Time', 
  country = 'Global',
  onAdd
}: MainClockCardProps) {
  const [time, setTime] = useState<DateTime | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tz = timezone === 'local' ? DateTime.local().zoneName : timezone
    setTime(DateTime.now().setZone(tz))
    const interval = setInterval(() => {
      setTime(DateTime.now().setZone(tz))
    }, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cardRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // Remove the null check to prevent CLS
  // if (!time) return null

  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative w-full rounded-[2.5rem] bg-card border border-card-border/40 p-6 md:p-10 xl:p-12 shadow-2xl backdrop-blur-xl group overflow-hidden transition-all duration-500 flex flex-col items-center",
        isFullscreen ? "h-screen justify-between rounded-none border-none py-20 px-12 bg-[#09090b]" : "max-w-7xl mx-auto min-h-[380px] justify-center"
      )}
    >
      {/* Decorative background glow */}
      {!isFullscreen && (
        <>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-all duration-700" />
        </>
      )}

      <button 
        type="button"
        onClick={toggleFullscreen}
        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 group-hover:border-primary/40 z-20"
      >
        {isFullscreen ? <Minimize2 className="w-6 h-6 text-white" /> : <Maximize2 className="w-5 h-5 text-white group-hover:text-primary transition-colors" />}
      </button>

      {/* Header Info */}
      <div className={cn(
        "text-center relative z-10 transition-all",
        isFullscreen ? "mt-4" : ""
      )}>
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm drop-shadow-[0_0_10px_rgba(124,58,237,0.3)] mb-1">{country}</p>
        <h3 className={cn(
          "font-bold text-white tracking-tight drop-shadow-sm",
          isFullscreen ? "text-4xl md:text-6xl" : "text-2xl md:text-4xl"
        )}>{city}</h3>
      </div>

      {/* Main Time Display - Responsive Scaling */}
      <div className={cn(
        "font-bold tracking-tight text-white drop-shadow-[0_0_50px_rgba(124,58,237,0.5)] font-display flex items-center justify-center tabular-nums leading-none w-full relative z-10",
        isFullscreen ? "flex-1 text-[min(16rem,22vw)]" : "text-6xl md:text-[8rem] xl:text-[8.5rem] py-8"
      )}>
        {(time?.toFormat('HH:mm:ss') || '00:00:00').split('').map((char, i) => (
          <span key={i} className={cn(char === ':' ? "mx-1 opacity-60" : "w-[0.6em] md:w-[0.65em] inline-block text-center")}>
            {char}
          </span>
        ))}
      </div>

      {/* Footer Info & Ad */}
      <div className={cn(
        "text-center space-y-4 relative z-10 w-full",
        isFullscreen ? "mb-6" : ""
      )}>
        <div className="space-y-2 mb-6">
          <p className={cn(
            "font-bold text-white/95",
            isFullscreen ? "text-2xl md:text-4xl" : "text-lg md:text-2xl"
          )}>{time ? time.toFormat('cccc, LLLL d, yyyy') : 'Loading Date...'}</p>
          <p className={cn(
            "text-primary/70 font-bold tracking-[0.2em] uppercase",
            isFullscreen ? "text-sm md:text-base" : "text-[10px] md:text-xs"
          )}>{timezone === 'local' ? 'Local Timezone' : timezone}</p>
        </div>

        {/* Global Timezone Search (Middle and Bottom of the box) */}
        {!isFullscreen && onAdd && (
          <div className="w-full flex justify-center pb-2">
            <TimezoneSearch onAdd={onAdd} />
          </div>
        )}

        {/* Ad Slot */}
        <div className={cn(
          "w-full flex flex-col items-center justify-center",
          isFullscreen ? "pt-6" : "mt-8 pt-6 border-t border-card-border/10"
        )}>
          <p className="text-[9px] text-primary/40 tracking-[0.3em] uppercase mb-4 font-black">ADVERTISEMENT</p>
          <AdScript containerId="ad-mainclock" />
        </div>
      </div>
    </div>
  )
}
