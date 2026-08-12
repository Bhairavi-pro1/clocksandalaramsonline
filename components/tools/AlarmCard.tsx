'use client'
import { useState, useEffect } from 'react'
import { Bell, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'

interface AlarmCardProps {
  id: string
  label: string
  time: string
  isActive: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export default function AlarmCard({ id, label, time, isActive, onToggle, onRemove }: AlarmCardProps) {
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn(
      "w-full bg-[#1a0b36]/60 border border-violet-500/20 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 relative overflow-hidden group shadow-2xl transition-all duration-300",
      isActive ? "border-primary/40" : "opacity-70"
    )}>
      {/* Desktop Layout (hidden md:block) */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
              Alarm
            </div>
            <div className="text-white font-bold text-lg leading-none">
              {label}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => onRemove(id)}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500/60 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mb-10">
          <div className={cn(
            "font-mono text-7xl font-bold tracking-tighter text-white tabular-nums transition-all flex items-baseline gap-2",
            isActive ? "drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" : "text-white/40"
          )}>
            {(() => {
              const [h, m] = time.split(':')
              if (mounted && is24Hour) {
                return <span>{h}:{m}</span>
              }
              const hours = parseInt(h)
              const ampm = hours >= 12 ? 'PM' : 'AM'
              const h12 = hours % 12 || 12
              return (
                <>
                  <span>{String(h12).padStart(2, '0')}:{m}</span>
                  <span className="text-2xl opacity-40 font-black tracking-widest">{ampm}</span>
                </>
              )
            })()}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
           <div className="flex items-center gap-3">
              <div className={cn(
                 "w-3 h-3 rounded-full animate-pulse",
                 isActive ? "bg-primary" : "bg-slate-300 dark:bg-white/20"
              )} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                 {isActive ? 'Active' : 'Disabled'}
              </span>
           </div>
           <button 
              type="button"
              onClick={() => onToggle(id)}
              className={cn(
                 "w-14 h-7 rounded-full transition-all relative",
                 isActive ? "bg-primary" : "bg-slate-200 dark:bg-white/10"
              )}
           >
              <div className={cn(
                 "absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all",
                 isActive ? "left-8 scale-110" : "left-1"
              )} />
           </button>
        </div>
      </div>

      {/* Mobile Layout (flex md:hidden) */}
      <div className="flex md:hidden flex-col gap-3 w-full">
         <div className="flex justify-between items-start">
            <div className="flex flex-col min-w-0">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">
                  Alarm
               </span>
               <h4 className="text-white font-bold text-base leading-tight break-words">
                  {label}
               </h4>
            </div>
            <button 
               type="button"
               onClick={() => onRemove(id)}
               className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500/60 cursor-pointer"
               aria-label="Delete Alarm"
            >
               <Trash2 size={14} />
            </button>
         </div>

         <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5 w-full">
            {/* Time display */}
            <div className={cn(
              "font-mono text-3xl font-bold tracking-tight text-white tabular-nums flex items-baseline gap-1",
              isActive ? "drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "text-white/40"
            )}>
              {(() => {
                const [h, m] = time.split(':')
                if (mounted && is24Hour) {
                  return <span>{h}:{m}</span>
                }
                const hours = parseInt(h)
                const ampm = hours >= 12 ? 'PM' : 'AM'
                const h12 = hours % 12 || 12
                return (
                  <>
                    <span>{String(h12).padStart(2, '0')}:{m}</span>
                    <span className="text-xs opacity-60 font-bold uppercase ml-0.5">{ampm}</span>
                  </>
                )
              })()}
            </div>

            {/* Toggle and Status */}
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                  {isActive ? 'Active' : 'Disabled'}
               </span>
               <button 
                  type="button"
                  onClick={() => onToggle(id)}
                  className={cn(
                     "w-12 h-6 rounded-full transition-all relative",
                     isActive ? "bg-primary" : "bg-slate-200 dark:bg-white/10"
                  )}
               >
                  <div className={cn(
                     "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all",
                     isActive ? "left-6.5 scale-110" : "left-0.5"
                  )} />
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
