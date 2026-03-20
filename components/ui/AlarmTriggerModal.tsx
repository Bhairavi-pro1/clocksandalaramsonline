'use client'
import { Bell, X, Hourglass } from 'lucide-react'

interface AlarmTriggerModalProps {
  isOpen: boolean
  onClose: () => void
  label?: string
  type?: 'alarm' | 'timer'
  timeText?: string
}

export default function AlarmTriggerModal({ 
  isOpen, 
  onClose, 
  label = 'Time Up!', 
  type = 'timer',
  timeText 
}: AlarmTriggerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#1a0b36] border border-primary/30 rounded-[3rem] shadow-[0_0_100px_rgba(124,58,237,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 ring-2 ring-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="p-10 relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/30 animate-bounce shadow-2xl shadow-primary/40">
            {type === 'alarm' ? (
              <Bell size={48} className="text-white fill-white" />
            ) : (
              <Hourglass size={48} className="text-white fill-white" />
            )}
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-8">
              {label}
            </h2>
            {timeText && (
              <p className="text-2xl font-mono font-bold text-primary/80 tracking-widest tabular-nums">
                {timeText}
              </p>
            )}
            <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em]">
              Action Required
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-white text-primary font-black py-6 rounded-[1.5rem] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            DISMISS ALERT
          </button>
        </div>
      </div>
    </div>
  )
}
