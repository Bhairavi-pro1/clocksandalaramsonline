'use client'
import { Bell, X, Hourglass } from 'lucide-react'

interface AlarmTriggerModalProps {
  isOpen: boolean
  onClose: () => void
  label?: string
  type?: 'alarm' | 'timer'
  timeText?: string
}

import { useEffect, useRef } from 'react'

export default function AlarmTriggerModal({ 
  isOpen, 
  onClose, 
  label = 'Time Up!', 
  type = 'timer',
  timeText 
}: AlarmTriggerModalProps) {
  
  // Tab blinking logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    const originalTitle = document.title
    
    if (isOpen) {
      let isBlinking = false
      interval = setInterval(() => {
        document.title = isBlinking ? (type === 'alarm' ? "⏰ ALARM RINGING!" : "⏳ TIMER UP!") : originalTitle
        isBlinking = !isBlinking
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
      document.title = originalTitle // Reset on close/unmount
    }
  }, [isOpen, type])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md max-h-[92dvh] overflow-y-auto my-auto bg-white dark:bg-[#1a0b36] border border-slate-200 dark:border-primary/30 rounded-[2rem] sm:rounded-[3rem] shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:shadow-[0_0_100px_rgba(124,58,237,0.15)] dark:shadow-[0_0_80px_rgba(124,58,237,0.3)] dark:sm:shadow-[0_0_100px_rgba(124,58,237,0.3)] animate-in zoom-in-95 duration-300 ring-2 ring-slate-100 dark:ring-primary/20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        {/* Mobile-friendly quick dismiss button */}
        <button 
          onClick={onClose}
          aria-label="Close alert"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-20 cursor-pointer"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        <div className="p-6 sm:p-10 relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 sm:mb-8 border border-primary/30 animate-bounce shadow-xl sm:shadow-2xl shadow-primary/40 shrink-0">
            {type === 'alarm' ? (
              <Bell size={32} className="sm:w-12 sm:h-12 text-primary fill-primary" />
            ) : (
              <Hourglass size={32} className="sm:w-12 sm:h-12 text-primary fill-primary" />
            )}
          </div>

          <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-10 w-full">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-4 sm:underline-offset-8 break-words max-w-full px-1">
              {label}
            </h2>
            {timeText && (
              <p className="text-xl sm:text-2xl font-mono font-bold text-primary tracking-widest tabular-nums">
                {timeText}
              </p>
            )}
            <p className="text-slate-400 dark:text-white/40 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]">
              Action Required
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-3.5 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 sm:gap-3 active:scale-95 group cursor-pointer text-sm sm:text-base shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300 text-white" />
            DISMISS ALERT
          </button>
        </div>
      </div>
    </div>
  )
}
