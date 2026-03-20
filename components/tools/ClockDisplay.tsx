'use client'
import { useState } from 'react'
import { useClock } from '@/hooks/useClock'
import { useWakeLock } from '@/hooks/useWakeLock'
import { useFullscreen } from '@/hooks/useFullscreen'
import { Maximize2, Minimize2 } from 'lucide-react'

export default function ClockDisplay() {
  const [is24Hour, setIs24Hour] = useState(false)
  const clock = useClock(is24Hour)
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  
  // Prevent dimming when clock is visible
  useWakeLock(true)

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-[#1a0b2e]/60 rounded-3xl border border-violet-500/20 shadow-2xl transition-all hover:border-accent/40 group relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      
      {/* Time Display with Centered fixed-width chars */}
      <div className="font-mono text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter text-white font-tabular flex items-baseline drop-shadow-[0_0_40px_rgba(124,58,237,0.3)] select-none">
        <span className="w-[1ch] inline-block text-center">{clock.hours[0]}</span>
        <span className="w-[1ch] inline-block text-center">{clock.hours[1]}</span>
        <span className="text-primary animate-pulse opacity-100 mx-1">:</span>
        <span className="w-[1ch] inline-block text-center">{clock.minutes[0]}</span>
        <span className="w-[1ch] inline-block text-center">{clock.minutes[1]}</span>
        <div className="flex flex-col items-start ml-4">
          <div className="flex items-baseline translate-y-[-0.2em]">
            <span className="text-primary/70 text-2xl md:text-4xl">:</span>
            <span className="text-primary/70 text-2xl md:text-4xl w-[1ch] inline-block text-center">{clock.seconds[0]}</span>
            <span className="text-primary/70 text-2xl md:text-4xl w-[1ch] inline-block text-center">{clock.seconds[1]}</span>
          </div>
          {!is24Hour && (
            <span className="text-xl md:text-3xl font-black text-primary/80 tracking-tighter leading-none mt-1">{clock.period}</span>
          )}
        </div>
      </div>

      <div className="mt-10 text-center relative z-1">
        <div className="text-2xl md:text-3xl font-bold text-white/95">{clock.date}</div>
        <div className="text-primary/60 mt-2 uppercase font-black tracking-[0.2em] text-[10px] md:text-xs">{clock.timezone}</div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-12 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIs24Hour(!is24Hour)}
          className="px-6 py-2 rounded-full bg-secondary hover:bg-primary transition-colors text-sm font-bold border border-white/5"
        >
          {is24Hour ? '12-Hour' : '24-Hour'}
        </button>
        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-accent text-background hover:scale-110 transition-transform"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
    </div>
  )
}
