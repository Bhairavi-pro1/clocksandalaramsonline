'use client'
import { useState, useEffect, useRef } from 'react'
import { DateTime } from 'luxon'
import { Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdScript } from './AdBanner'
import { useStore } from '@/hooks/useStore'



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

  // Remove the null check to prevent CLS
  // if (!time) return null

  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative shadow-2xl backdrop-blur-xl group overflow-hidden transition-all duration-500 flex flex-col",
        isFullscreen 
          ? "fixed inset-0 z-[100] w-full h-screen justify-between rounded-none border-none py-8 px-4 sm:py-12 sm:px-8 md:py-20 md:px-12 bg-background items-center" 
          : "w-[calc(100%+2rem)] md:w-full max-w-7xl mx-auto rounded-none md:rounded-[2.5rem] bg-slate-100/50 dark:bg-[#1a0b36]/40 md:bg-card border border-x-0 md:border border-slate-200/60 dark:border-white/5 md:border-card-border/40 py-2.5 px-4 md:p-10 xl:p-12 -mx-4 md:mx-auto min-h-0 md:min-h-[380px] justify-center items-stretch md:items-center gap-0"
      )}
    >
      {/* Decorative background glow */}
      {!isFullscreen && (
        <>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-all duration-700 pointer-events-none" />
        </>
      )}

      {/* MOBILE LAYOUT (hidden in fullscreen or on desktop) */}
      {!isFullscreen && (
        <div className="w-full flex flex-col gap-2.5 md:hidden">
          {/* First Row: Label (left) & Fullscreen Button (right) */}
          <div className="flex flex-row items-center justify-between w-full relative z-10 pb-1.5 border-b border-slate-200/60 dark:border-white/5">
            {/* Left: Bullet & Country/City */}
            <div className="flex items-center gap-1.5 text-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-black text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/45">
                {country} • {city}
              </span>
            </div>
            {/* Right: Fullscreen Button */}
            <button 
              type="button"
              onClick={toggleFullscreen}
              className="p-1 bg-transparent border-none text-slate-400 dark:text-white/40 hover:text-slate-800 dark:hover:text-white/80 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Second Row: Time & Date/Timezone Details */}
          <div className="flex flex-row items-baseline justify-between gap-4 w-full relative z-10">
            {/* Left: Time display */}
            <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums flex items-baseline gap-0.5 drop-shadow-2xl">
              {time ? (
                <>
                  <span>{time.toFormat(mounted && is24Hour ? 'HH' : 'hh')}</span>
                  <span className="text-primary/80 animate-pulse mx-0.5">:</span>
                  <span>{time.toFormat('mm')}</span>
                  <span className="text-primary/80 animate-pulse mx-0.5">:</span>
                  <span>{time.toFormat('ss')}</span>
                  {(!mounted || !is24Hour) && (
                    <span className="text-[10px] sm:text-xs font-normal text-slate-500 dark:text-white/40 ml-1.5 tracking-tighter uppercase">
                      {time.toFormat('a')}
                    </span>
                  )}
                </>
              ) : (
                <span>00:00:00</span>
              )}
            </div>

            {/* Right: Date & Timezone */}
            <div className="flex flex-col items-end text-right min-w-0">
              <div className="text-slate-800 dark:text-white/85 font-bold text-[9px] sm:text-[10px] tracking-tight leading-tight">
                {time ? time.toFormat('ccc, LLL d, yyyy') : 'Loading Date...'}
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/30 uppercase font-black tracking-wider mt-0.5 truncate max-w-[120px] sm:max-w-none">
                {timezone === 'local' ? 'Local Timezone' : timezone}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP LAYOUT (hidden on mobile, visible on desktop or when fullscreen) */}
      <div className={cn(
        "w-full flex flex-col items-center justify-center relative z-10",
        isFullscreen ? "flex-1" : "hidden md:flex"
      )}>
        {/* Fullscreen Button (only for desktop layout) */}
        <button 
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-0 right-0 p-3 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-xl transition-all border border-slate-200 dark:border-white/10 group-hover:border-primary/40 z-20"
        >
          {isFullscreen ? <Minimize2 className="w-6 h-6 text-slate-700 dark:text-white" /> : <Maximize2 className="w-5 h-5 text-slate-500 dark:text-white group-hover:text-primary transition-colors" />}
        </button>

        {/* Header Info */}
        <div className={cn(
          "text-center relative z-10 transition-all",
          isFullscreen ? "mt-2 md:mt-4" : ""
        )}>
          <p className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm drop-shadow-[0_0_10px_rgba(124,58,237,0.3)] mb-1">{country}</p>
          <h3 className={cn(
            "font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm",
            isFullscreen ? "text-3xl sm:text-4xl md:text-6xl" : "text-2xl md:text-4xl"
          )}>{city}</h3>
        </div>

        {/* Main Time Display - Responsive Scaling */}
        <div className={cn(
          "font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-[0_0_50px_rgba(124,58,237,0.5)] font-display flex items-center justify-center tabular-nums leading-none w-full relative z-10",
          isFullscreen ? "flex-1 text-[13vw] sm:text-[18vw] md:text-[min(16rem,22vw)]" : "text-6xl md:text-[8rem] xl:text-[8.5rem] py-8"
        )}>
          <div className="flex items-baseline">
            {(time?.toFormat(mounted && is24Hour ? 'HH:mm:ss' : 'hh:mm:ss') || '00:00:00').split('').map((char, i) => (
              <span key={i} className={cn(char === ':' ? "mx-1 opacity-60" : "w-[0.6em] md:w-[0.65em] inline-block text-center")}>
                {char}
              </span>
            ))}
            {time && (!mounted || !is24Hour) && (
              <span className="text-sm sm:text-xl md:text-3xl font-black text-primary/80 tracking-tighter uppercase ml-2 md:ml-4">{time.toFormat('a')}</span>
            )}
          </div>
        </div>

        {/* Footer Info & Ad */}
        <div className="text-center space-y-4 relative z-10 w-full">
          <div className={cn("space-y-2", isFullscreen ? "mb-2 md:mb-6" : "mb-6")}>
            <p className={cn(
              "font-bold text-slate-800 dark:text-white/95",
              isFullscreen ? "text-xl sm:text-2xl md:text-4xl" : "text-lg md:text-2xl"
            )}>{time ? time.toFormat('cccc, LLLL d, yyyy') : 'Loading Date...'}</p>
            <p className={cn(
              "text-primary/70 font-bold tracking-[0.2em] uppercase",
              isFullscreen ? "text-xs sm:text-sm md:text-base" : "text-[10px] md:text-xs"
            )}>{timezone === 'local' ? 'Local Timezone' : timezone}</p>
          </div>



          {/* Ad Slot */}
          <div className={cn(
            "w-full flex flex-col items-center justify-center",
            isFullscreen ? "pt-2 md:pt-6" : "mt-8 pt-6 border-t border-card-border/10"
          )}>
            <p className={cn("text-[9px] text-primary/40 tracking-[0.3em] uppercase font-black", isFullscreen ? "mb-2 md:mb-4" : "mb-4")}>ADVERTISEMENT</p>
            <AdScript containerId="ad-mainclock" />
          </div>
        </div>
      </div>
    </div>
  )
}
