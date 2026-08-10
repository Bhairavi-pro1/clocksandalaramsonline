'use client'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Maximize2, Minimize2, Trash2, RotateCcw } from 'lucide-react'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import { useTimer } from '@/hooks/useTimer'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'

interface CountdownTimerProps {
  id: string
  label: string
  initialSeconds: number
  sound: string
  onRemove?: (id: string) => void
}

export default function CountdownTimer({ id, label, initialSeconds, sound, onRemove }: CountdownTimerProps) {
  const { timeLeft, isActive, isPaused, isSoundPlaying, start, pause, resume, reset, formatTime } = useTimer(id, initialSeconds, sound)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const progress = (timeLeft / initialSeconds) * 100

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

  return (
    <>
      <div 
        ref={cardRef}
        className={cn(
          "w-full bg-[#1a0b36]/60 border border-violet-500/20 rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden group shadow-2xl transition-all duration-500",
          isFullscreen ? "h-screen fixed inset-0 z-[150] rounded-none border-none bg-background flex flex-col items-center justify-center p-12 md:p-24" : "relative"
        )}
      >
        {/* Background Glows for Fullscreen */}
        {isFullscreen && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
          </>
        )}

        <div className={cn(
          "flex justify-between items-center w-full z-50",
          isFullscreen ? "absolute top-12 left-0 right-0 px-12 md:px-24" : "mb-3 sm:mb-6"
        )}>
          <div className="flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
              Timer
            </div>
            <div className={cn(
              "text-white font-bold leading-none",
              isFullscreen ? "text-3xl md:text-5xl" : "text-sm sm:text-base md:text-lg"
            )}>
              {label}
            </div>
          </div>
          <div className="flex gap-1.5">
            <button 
              type="button"
              onClick={toggleFullscreen} 
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={14} />}
            </button>
            {!isFullscreen && onRemove && (
              <button 
                type="button"
                onClick={() => onRemove(id)}
                className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500/60 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className={cn(
          "flex flex-col items-center w-full relative z-20",
          isFullscreen ? "flex-1 justify-center space-y-8 md:space-y-16" : ""
        )}>
          {/* Timer Display */}
          <div className={cn(
            "font-mono font-bold tracking-tighter text-white dark:drop-shadow-[0_0_50px_rgba(168,85,247,0.5)] tabular-nums transition-all",
            isFullscreen ? "text-[max(6rem,12vw)] leading-none" : "text-3xl sm:text-5xl md:text-6xl mb-3 sm:mb-5"
          )}>
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className={cn(
            "bg-white/5 rounded-full overflow-hidden transition-all",
            isFullscreen ? "w-full max-w-4xl h-3" : "w-full h-1 mb-3 sm:mb-5"
          )}>
            <div 
              className="h-full bg-primary transition-all duration-1000 linear dark:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className={cn(
            "flex items-center gap-3 w-full justify-center relative z-30",
            isFullscreen ? "max-w-xl" : ""
          )}>
            {!isActive && !isPaused ? (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); start(initialSeconds); }}
                className={cn(
                  "w-full bg-primary text-white font-black rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base cursor-pointer",
                  isFullscreen ? "py-4 text-lg max-w-xs" : "py-2 sm:py-3.5"
                )}
              >
                <Play size={14} fill="currentColor" className="sm:w-4 sm:h-4" /> START
              </button>
            ) : (
              <div className="flex gap-2 sm:gap-3 w-full justify-center">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); isPaused ? resume() : pause(); }}
                  className={cn(
                    "bg-primary/90 hover:bg-primary text-white rounded-xl transition-all flex items-center justify-center shadow-xl shadow-primary/20 text-xs sm:text-base cursor-pointer",
                    isFullscreen ? "w-16 h-16" : "flex-1 py-2 sm:py-3.5"
                  )}
                >
                  {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className={cn(
                    "bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all flex items-center justify-center text-xs sm:text-base cursor-pointer",
                    isFullscreen ? "w-16 h-16" : "px-4 py-2 sm:px-6 sm:py-3.5"
                  )}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fullscreen Ad Slot - Positioning it Absolute so it doesn't push the counter */}
        {isFullscreen && (
          <div className="absolute bottom-8 left-0 right-0 w-full flex flex-col items-center justify-center pointer-events-none z-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
            <div className="max-w-4xl w-full px-12 md:px-24 pointer-events-auto">
              <AdBanner />
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
