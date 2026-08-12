'use client'
import { Bell, Zap, ArrowRight } from 'lucide-react'
import { useStore } from '@/hooks/useStore'
import { cn } from '@/lib/utils'

export default function AlarmScenarios() {
  const { addAlarm } = useStore()

  const handleCreateAlarm = (time12h: string) => {
    // Convert 12h (e.g., "4:00 AM") to 24h (e.g., "04:00")
    const [time, period] = time12h.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    
    if (period === 'PM' && hours < 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    
    const time24 = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    
    addAlarm({
      label: `Alarm ${time12h}`,
      time: time24,
      sound: 'vibe',
      isActive: true,
      days: []
    })
    
    // Scroll to the alarms list instead of top
    setTimeout(() => {
      document.getElementById('alarms-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const alarmPresets = [
    '4:00 AM', '4:30 AM',
    '5:00 AM', '5:15 AM', '5:30 AM', '5:45 AM',
    '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM',
    '7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM',
    '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM',
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'
  ]

  return (
    <section className="bg-[#1a0b36]/60 border border-violet-500/20 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 overflow-hidden relative animate-in fade-in duration-700">
      <div className="absolute -top-12 -right-12 p-24 opacity-[0.015] rotate-12 pointer-events-none transition-opacity duration-700">
        <Bell size={240} />
      </div>
      
      <header className="mb-5 relative z-10 border-b border-white/5 pb-4 flex items-start gap-3 w-full">
        <Bell className="text-primary w-6 h-6 md:w-8 md:h-8 mt-1 flex-shrink-0" />
        <div className="flex flex-col text-left">
          <h3 className="text-base md:text-2xl font-black text-white tracking-tight leading-tight">Set the alarm for the specified time</h3>
          <p className="text-[10px] md:text-sm text-muted font-medium mt-1">One-click setup for common wake-up times and reminders</p>
        </div>
      </header>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 relative z-10 w-full">
        {alarmPresets.map((time) => (
          <button
            key={time}
            onClick={() => handleCreateAlarm(time)}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-[#1a0b36]/40 border border-violet-500/20 hover:border-primary/50 hover:bg-primary/5 text-sky-400 font-bold text-[11px] sm:text-xs md:text-sm transition-all duration-300"
          >
            {time}
          </button>
        ))}
      </div>
    </section>
  )
}
