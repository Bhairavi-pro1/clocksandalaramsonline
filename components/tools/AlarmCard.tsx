'use client'
import { Bell, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlarmCardProps {
  id: string
  label: string
  time: string
  isActive: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export default function AlarmCard({ id, label, time, isActive, onToggle, onRemove }: AlarmCardProps) {
  return (
    <div className={cn(
      "w-full bg-[#1a0b36]/60 border border-violet-500/20 rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl transition-all duration-300",
      isActive ? "border-primary/40" : "opacity-70"
    )}>
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
               isActive ? "bg-primary" : "bg-white/10"
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
               isActive ? "bg-primary" : "bg-white/10"
            )}
         >
            <div className={cn(
               "absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all",
               isActive ? "left-8 scale-110" : "left-1"
            )} />
         </button>
      </div>
    </div>
  )
}
