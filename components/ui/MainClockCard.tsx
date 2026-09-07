'use client'
import { useState, useEffect, useRef } from 'react'
import { DateTime } from 'luxon'
import { Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdScript } from './AdBanner'
import { useStore } from '@/hooks/useStore'
import { SHOW_ADS } from '@/lib/adsConfig'

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
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<DateTime | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const tz = timezone === 'local' ? DateTime.local().zoneName : timezone
    setTime(DateTime.now().setZone(tz))
    const interval = setInterval(() => {
      setTime(DateTime.now().setZone(tz))
    }, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (cardRef.current && typeof cardRef.current.requestFullscreen === 'function') {
        try {
          const promise = cardRef.current.requestFullscreen()
          if (promise && typeof promise.catch === 'function') {
            promise.catch((err) => {
              console.error(`Error attempting to enable full-screen mode: ${err.message}`)
            })
          }
        } catch (err: any) {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        }
      }
      setIsFullscreen(true)
    } else {
      if (typeof document.exitFullscreen === 'function') {
        try {
          const promise = document.exitFullscreen()
          if (promise && typeof promise.catch === 'function') {
            promise.catch((err) => {
              console.error(`Error exiting full-screen mode: ${err.message}`)
            })
          }
        } catch (err: any) {
          console.error(`Error exiting full-screen mode: ${err.message}`)
        }
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const formattedTime = time ? time.setZone(timezone === 'local' ? DateTime.local().zoneName : timezone) : null
  const hours = formattedTime ? formattedTime.toFormat(mounted && is24Hour ? 'HH' : 'hh') : '00'
  const minutes = formattedTime ? formattedTime.toFormat('mm') : '00'
  const seconds = formattedTime ? formattedTime.toFormat('ss') : '00'
  const period = formattedTime ? formattedTime.toFormat('a') : 'AM'
  const dateStr = formattedTime ? formattedTime.toFormat('cccc, LLLL d, yyyy') : 'Loading Date...'
  const tzName = timezone === 'local' ? (DateTime.local().zoneName || 'Local Timezone') : timezone

  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative shadow-2xl backdrop-blur-xl group overflow-hidden transition-all duration-500 flex flex-col",
        isFullscreen 
          ? "fixed inset-0 z-[100] w-full h-screen justify-between rounded-none border-none py-8 px-4 sm:py-12 sm:px-8 md:py-20 md:px-12 bg-background items-center" 
          : "bg-[#1a0b36]/40 border border-white/5 p-4 sm:p-6 rounded-2xl w-full gap-4"
      )}
    >
      {/* Decorative background glow in standard mode */}
      {!isFullscreen && (
        <>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full group-hover:bg-accent/20 transition-all duration-700 pointer-events-none" />
        </>
      )}

      {/* FULLSCREEN VIEW */}
      {isFullscreen ? (
        <div className="w-full flex-1 flex flex-col items-center justify-between relative z-10">
          <button 
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 z-20 text-white"
            title="Exit Fullscreen"
          >
            <Minimize2 className="w-6 h-6" />
          </button>

          {/* Header Info */}
          <div className="text-center mt-4">
            <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-1">{country}</p>
            <h3 className="font-bold text-white tracking-tight text-3xl sm:text-4xl md:text-6xl">{city}</h3>
          </div>

          {/* Main Large Time */}
          <div className="font-bold tracking-tight text-white drop-shadow-[0_0_50px_rgba(124,58,237,0.5)] font-display flex items-center justify-center tabular-nums leading-none w-full text-[13vw] sm:text-[18vw] md:text-[min(16rem,22vw)] select-none">
            <div className="flex items-baseline">
              <span>{hours}</span>
              <span className="mx-1 opacity-60">:</span>
              <span>{minutes}</span>
              <span className="mx-1 opacity-60">:</span>
              <span>{seconds}</span>
              {(!mounted || !is24Hour) && (
                <span className="text-xl sm:text-3xl md:text-5xl font-black text-primary/80 tracking-tighter uppercase ml-4">{period}</span>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center space-y-2 mb-4">
            <p className="font-bold text-white/95 text-xl sm:text-2xl md:text-4xl">{dateStr}</p>
            <p className="text-primary/70 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm md:text-base">{tzName}</p>
          </div>
        </div>
      ) : (
        /* STANDARD VIEW (Matches Uploaded Reference Image) */
        <>
          {/* Info Row: Left (Clock) & Right (Date/Timezone) */}
          <div className="flex flex-row items-center justify-between gap-4 w-full relative z-10 px-2 sm:px-0">
            {/* Left Side: Label & Time */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 text-primary mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-black text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">
                  {country && country !== 'GLOBAL' && country !== 'DETECTING LOCATION' ? `${country} • ${city}` : 'LOCAL TIME'}
                </span>
              </div>
              <div className="font-mono text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tabular-nums flex items-baseline gap-0.5 drop-shadow-2xl">
                <span>{hours}</span>
                <span className="text-primary/80 animate-pulse mx-0.5">:</span>
                <span>{minutes}</span>
                <span className="text-primary/80 animate-pulse mx-0.5">:</span>
                <span className="text-lg sm:text-2xl text-slate-700 dark:text-white/90">{seconds}</span>
                {(!mounted || !is24Hour) && (
                  <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-white/40 ml-1.5 tracking-tighter uppercase">{period}</span>
                )}
              </div>
            </div>

            {/* Right Side: Date, Timezone & Fullscreen Button */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end text-right">
                <div className="text-slate-800 dark:text-white/80 font-bold text-[11px] sm:text-sm tracking-tight">
                  {dateStr}
                </div>
                <div className="text-[9px] text-slate-400 dark:text-white/30 uppercase font-black tracking-wider mt-0.5">
                  {tzName}
                </div>
              </div>

              {/* Fullscreen Button */}
              <button 
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-800 dark:hover:text-white transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 cursor-pointer flex items-center justify-center"
                title="Fullscreen Mode"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Ad Slot */}
          {SHOW_ADS && (
            <div className="pt-3 border-t border-slate-200/50 dark:border-white/5 w-full flex flex-col items-center justify-center relative z-10">
              <p className="text-[7px] text-primary/30 tracking-[0.2em] uppercase mb-1.5 font-black">ADVERTISEMENT</p>
              <AdScript containerId="ad-mainclock" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
