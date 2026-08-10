'use client'
import { useState, useEffect } from 'react'
import { useClock } from '@/hooks/useClock'
import { Clock } from 'lucide-react'
import { AdScript } from './AdBanner'
import { useStore } from '@/hooks/useStore'

export default function LocalTimeBox() {
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const clock = useClock(mounted ? is24Hour : false) // respects global state post-mount

  return (
    <div className="bg-[#1a0b36]/40 backdrop-blur-xl border border-x-0 sm:border border-white/5 p-4 sm:p-6 -mx-4 sm:mx-0 rounded-none sm:rounded-2xl shadow-2xl flex flex-col w-auto sm:w-full relative overflow-hidden group gap-4">
      {/* Info Row: Left (Clock) & Right (Date/Timezone) */}
      <div className="flex flex-row items-center justify-between gap-4 w-full relative z-10 px-4 sm:px-0">
        {/* Left Side: Label & Time */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-black text-[9px] uppercase tracking-wider text-white/40">Local Time</span>
          </div>
          <div className="font-mono text-2xl sm:text-4xl font-bold text-white tabular-nums flex items-baseline gap-0.5 drop-shadow-2xl">
            <span>{clock.hours}</span>
            <span className="text-primary/80 animate-pulse">:</span>
            <span>{clock.minutes}</span>
            {(!mounted || !is24Hour) && (
              <span className="text-xs sm:text-sm font-normal text-white/40 ml-1 tracking-tighter uppercase">{clock.period}</span>
            )}
          </div>
        </div>

        {/* Right Side: Date & Timezone */}
        <div className="flex flex-col items-end text-right">
          <div className="text-white/80 font-bold text-[11px] sm:text-sm tracking-tight">
            {clock.date}
          </div>
          <div className="text-[9px] text-white/30 uppercase font-black tracking-wider mt-0.5">
            {clock.timezone}
          </div>
        </div>
      </div>

      {/* Ad Slot */}
      <div className="pt-3 border-t border-white/5 w-full flex flex-col items-center justify-center relative z-10">
        <p className="text-[7px] text-primary/30 tracking-[0.2em] uppercase mb-1.5 font-black">ADVERTISEMENT</p>
        <AdScript containerId="ad-localtimebox" />
      </div>
    </div>
  )
}
