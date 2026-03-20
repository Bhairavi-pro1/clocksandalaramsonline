'use client'
import { useClock } from '@/hooks/useClock'
import { Clock } from 'lucide-react'
import { AdScript } from './AdBanner'

export default function LocalTimeBox() {
  const clock = useClock(false) // 12-hour by default

  return (
    <div className="bg-[#1a0b36]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center w-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Clock size={80} />
      </div>
      
      <div className="flex items-center gap-2 text-primary mb-6 self-start relative z-10">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-white/50">Current Local Time</span>
      </div>

      <div className="font-mono text-6xl font-bold text-white tabular-nums flex items-baseline gap-1 relative z-10 drop-shadow-2xl">
        <span>{clock.hours}</span>
        <span className="text-primary/80 animate-pulse">:</span>
        <span>{clock.minutes}</span>
        <span className="text-xl font-normal text-white/40 ml-2 tracking-tighter uppercase">{clock.period}</span>
      </div>

      <div className="mt-6 flex flex-col items-center relative z-10">
        <div className="text-white/80 font-bold text-base tracking-tight">
          {clock.date}
        </div>
        <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] mt-1">
          {clock.timezone}
        </div>
      </div>

      {/* Ad Slot */}
      <div className="mt-8 pt-6 border-t border-white/5 w-full flex flex-col items-center justify-center relative z-10">
        <p className="text-[8px] text-primary/30 tracking-[0.3em] uppercase mb-3 font-black">ADVERTISEMENT</p>
        <AdScript containerId="ad-localtimebox" />
      </div>
    </div>
  )
}
