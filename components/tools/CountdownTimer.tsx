'use client'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Maximize2, Minimize2, Trash2, RotateCcw } from 'lucide-react'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import { useTimer } from '@/hooks/useTimer'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  id: string
  label: string
  initialSeconds: number
  sound: string
  onRemove?: (id: string) => void
}

export default function CountdownTimer({ id, label, initialSeconds, sound, onRemove }: CountdownTimerProps) {
  const { timeLeft, isActive, isPaused, isSoundPlaying, start, pause, resume, reset, formatTime } = useTimer(initialSeconds, sound)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const progress = (timeLeft / initialSeconds) * 100

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

  return (
    <>
      <div 
        ref={cardRef}
        className={cn(
          "w-full bg-[#1a0b36]/60 border border-violet-500/20 rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl transition-all duration-500",
          isFullscreen ? "h-screen fixed inset-0 z-[150] rounded-none border-none bg-[#09090b] flex flex-col items-center justify-center p-12 md:p-24" : "relative"
        )}
      >
        {/* Background Glows for Fullscreen */}
        {isFullscreen && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
          </>
        )}

        <div className={cn(
          "flex justify-between items-center w-full z-10",
          isFullscreen ? "absolute top-12 left-0 right-0 px-12 md:px-24" : "mb-8"
        )}>
          <div className="flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
              Timer
            </div>
            <div className={cn(
              "text-white font-bold leading-none",
              isFullscreen ? "text-3xl md:text-5xl" : "text-lg"
            )}>
              {label}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={toggleFullscreen} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60"
            >
              {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={16} />}
            </button>
            {!isFullscreen && onRemove && (
              <button 
                type="button"
                onClick={() => onRemove(id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500/60"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={cn(
          "flex flex-col items-center w-full",
          isFullscreen ? "flex-1 justify-center" : ""
        )}>
          {/* Timer Display */}
          <div className={cn(
            "font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_50px_rgba(168,85,247,0.5)] tabular-nums",
            isFullscreen ? "text-[max(8rem,15vw)] leading-none mb-12" : "text-7xl md:text-8xl mb-6"
          )}>
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className={cn(
            "bg-white/5 rounded-full overflow-hidden transition-all",
            isFullscreen ? "w-full max-w-4xl h-3 mb-16" : "w-full h-1 mb-8"
          )}>
            <div 
              className="h-full bg-primary transition-all duration-1000 linear shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className={cn(
            "flex items-center gap-4 w-full",
            isFullscreen ? "max-w-2xl mb-12" : ""
          )}>
            {!isActive && !isPaused ? (
              <button 
                type="button"
                onClick={() => start(initialSeconds)}
                className={cn(
                  "w-full bg-primary text-white font-black rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2",
                  isFullscreen ? "py-6 text-xl" : "py-4"
                )}
              >
                <Play size={isFullscreen ? 28 : 20} fill="currentColor" /> START
              </button>
            ) : (
              <div className="flex gap-4 w-full">
                <button 
                  type="button"
                  onClick={isPaused ? resume : pause}
                  className={cn(
                    "flex-1 bg-primary/90 hover:bg-primary text-white rounded-2xl transition-all flex items-center justify-center",
                    isFullscreen ? "py-6" : "py-4"
                  )}
                >
                  {isPaused ? <Play size={isFullscreen ? 36 : 28} fill="currentColor" /> : <Pause size={isFullscreen ? 36 : 28} fill="currentColor" />}
                </button>
                <button 
                  type="button"
                  onClick={reset}
                  className={cn(
                    "bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center justify-center",
                    isFullscreen ? "px-12 py-6" : "px-8 py-4"
                  )}
                >
                  <RotateCcw size={isFullscreen ? 32 : 24} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fullscreen Ad Slot */}
        {isFullscreen && (
          <div className="w-full max-w-4xl flex flex-col items-center justify-center mt-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
            <p className="text-[10px] text-primary/40 tracking-[0.4em] uppercase mb-4 font-black">SPONSORED CONTENT</p>
            <div className="w-full h-32 bg-white/5 rounded-[2rem] flex items-center justify-center border border-dashed border-primary/20 hover:border-primary/40 transition-all cursor-pointer group/ad">
              <div className="flex items-center space-x-8 opacity-60 group-hover/ad:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-primary/30 rounded-full animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
                <div className="text-left">
                  <p className="font-bold text-xl text-white tracking-tight uppercase">Premium Fullscreen Ad</p>
                  <p className="text-sm text-primary/50 font-medium tracking-wide">Boost your focus with our meditation partner</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AlarmTriggerModal 
        isOpen={isSoundPlaying}
        onClose={reset}
        label={label}
        type="timer"
      />
    </>
  )
}
