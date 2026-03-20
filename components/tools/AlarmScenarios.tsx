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
    
    // Scroll to top to see the new alarm card
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <section className="bg-card border border-card-border/30 rounded-[1.5rem] p-5 md:p-6 overflow-hidden relative animate-in fade-in duration-700">
      <div className="absolute -top-12 -right-12 p-24 opacity-[0.015] rotate-12 pointer-events-none transition-opacity duration-700">
        <Bell size={240} />
      </div>
      
      <header className="mb-5 relative z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="text-primary" size={18} />
          <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-none">Set the alarm for the specified time</h3>
        </div>
        <p className="text-[12px] text-muted/60 font-medium ml-6.5">One-click setup for common wake-up times and reminders</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 relative z-10">
        {alarmPresets.map((time) => (
          <button
            key={time}
            onClick={() => handleCreateAlarm(time)}
            className="group flex items-center justify-between p-2.5 px-3.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center opacity-30 group-hover:opacity-100 group-hover:bg-primary/20 transition-all">
                <Zap size={10} className="text-primary" />
              </div>
              <span className="text-[13px] font-bold text-sky-400 group-hover:text-primary transition-colors">{time}</span>
            </div>
            <ArrowRight size={12} className="text-white/10 group-hover:text-primary transition-all" />
          </button>
        ))}
      </div>
    </section>
  )
}
