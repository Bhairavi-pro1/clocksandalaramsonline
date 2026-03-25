'use client'
import { useState, useEffect } from 'react'
import AlarmCard from '@/components/tools/AlarmCard'
import AddAlarmModal from '@/components/tools/AddAlarmModal'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
import { useStore } from '@/hooks/useStore'
import { useAlarm } from '@/hooks/useAlarm'
import AdBanner from '@/components/ui/AdBanner'
import { Plus, Info, Bell, Clock, Zap } from 'lucide-react'
import AlarmScenarios from '@/components/tools/AlarmScenarios'
import { cn } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export default function AlarmTimeClient({ params }: Props) {
  const { slug } = params
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { alarms, addAlarm, removeAlarm, toggleAlarm } = useStore()
  const { activeAlarmId, stopAlarm } = useAlarm()
  
  const [timeInfo, setTimeInfo] = useState<{ label: string; time24: string; display: string } | null>(null)

  useEffect(() => {
    // Standardize slug: remove prefix and convert dashes to spaces
    const cleaned = slug.replace('set-alarm-for-', '').replace(/-/g, ' ').trim()
    const parts = cleaned.split(/\s+/)
    
    let hours = 0
    let minutes = 0
    let period = 'AM'

    // Identify period (AM/PM) if present at the end
    const lastPart = parts[parts.length - 1].toUpperCase()
    if (lastPart === 'AM' || lastPart === 'PM') {
      period = lastPart
      parts.pop() // Remove period from parts to analyze time only
    }

    // Analyze remaining parts for hours and minutes
    const timeData = parts.join(':') // Rejoin if it was "1 35"
    if (timeData.includes(':')) {
      const t = timeData.split(':')
      hours = parseInt(t[0])
      minutes = parseInt(t[1]) || 0
    } else {
      hours = parseInt(timeData)
      minutes = 0
    }
    
    if (isNaN(hours)) return
    if (isNaN(minutes)) minutes = 0

    // Constrain values
    hours = Math.min(Math.max(hours, 0), 23)
    minutes = Math.min(Math.max(minutes, 0), 59)

    const displayTime = `${hours}:${String(minutes).padStart(2, '0')} ${period}`
    
    // Convert to 24h for store
    let h24 = hours
    if (period === 'PM' && h24 < 12) h24 += 12
    if (period === 'AM' && h24 === 12) h24 = 0
    const time24 = `${String(h24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    setTimeInfo({
      label: `Alarm for ${displayTime}`,
      time24,
      display: displayTime
    })

    // Auto-add if it doesn't exist
    const exists = alarms.some(a => a.time === time24)
    if (!exists) {
      addAlarm({
        label: `Alarm for ${displayTime}`,
        time: time24,
        sound: 'vibe',
        isActive: true,
        days: []
      })
    }
  }, [slug])

  const activeAlarm = alarms.find(a => a.id === activeAlarmId)

  if (!timeInfo) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-20 animate-in fade-in duration-1000">
      {/* Dynamic SEO Title Section */}
      <div className="text-center mb-16 space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-1 shadow-inner">
          Free Online Alarm
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none bg-gradient-to-b from-white to-white/60 bg-clip-text">
          Set alarm for {timeInfo.display}
        </h1>
        <p className="text-muted text-lg md:text-xl font-medium max-w-4xl mx-auto leading-relaxed opacity-80">
          In fact, an alarm for minutes past {timeInfo.display.split(' ')[0]} {timeInfo.display.split(' ')[1]} is preset on this page. All you need to do is to enter a custom message (optional) and select the sound you want the alarm to make.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* Row 1: Local Time Box */}
        <LocalTimeBox />

        {/* Highlighted Preset Alert */}
        <div className="bg-primary/5 hover:bg-primary/10 border border-primary/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-1000 pointer-events-none">
            <Bell size={240} />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-[inset_0_0_20px_rgba(124,58,237,0.3)] border border-primary/30">
              <Clock size={40} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-white">Preset Ready: {timeInfo.display}</h2>
              <p className="text-primary/70 font-black uppercase tracking-[0.2em] text-[10px]">Your requested alarm time is active below</p>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none px-10 py-5 bg-primary text-white rounded-[1.25rem] font-black hover:scale-[1.05] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
            >
              <Zap size={20} fill="currentColor" />
              Customize Timer
            </button>
          </div>
        </div>

        {/* Current Alarms Section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Your Alarms</h3>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 group text-primary font-black text-sm uppercase tracking-widest hover:text-white transition-colors"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Add More
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alarms.map((alarm) => (
              <AlarmCard 
                key={alarm.id}
                id={alarm.id}
                label={alarm.label}
                time={alarm.time}
                isActive={alarm.isActive}
                onRemove={removeAlarm}
                onToggle={toggleAlarm}
              />
            ))}
          </div>
        </div>

        {/* Alarm Presets (Scenario Grid) */}
        <AlarmScenarios />

        {/* High-Precision Description & User Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-20">
          <section className="lg:col-span-2 space-y-12">
            <div className="flex items-center gap-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-lg">
              <div className="min-w-[56px] h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                <Info size={28} />
              </div>
              <h2 className="text-2xl font-black text-white">Advanced Guide for the {timeInfo.display} Alarm</h2>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Using the {timeInfo.display} Alarm Clock</h3>
                <p className="text-muted text-lg leading-relaxed font-medium">Setting an online alarm for {timeInfo.display} is the perfect way to manage your schedule with precision. Whether you are aiming for an early start, a mid-day reminder, or a late-night wake-up call, our high-fidelity alarm system is designed to alert you exactly when you need it.</p>
                <p>Our tool is built for reliability. Once you visit this page, the system automatically configures the preset for {timeInfo.display}, which you can then customize with unique labels and premium audio tones to match your specific needs.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Advanced Reliability</h3>
                <p className="text-muted text-lg leading-relaxed font-medium">To ensure the alarm rings perfectly at {timeInfo.display}, please keep this browser tab open. Our system utilizes persistent audio scheduling and hardware-accelerated timing to ensure the alert sounds exactly on the second. We recommend plugging your device into a power source and testing your speaker volume before you sleep.</p>
              </div>

            </div>
          </section>

          <aside className="space-y-10">
            <div className="bg-[#1a0b36]/60 p-10 rounded-[3rem] border border-violet-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <h4 className="text-2xl font-black text-white mb-6 leading-tight">Expert Insight: <br/>The {timeInfo.display} Anchor</h4>
              <p className="text-muted font-medium leading-relaxed italic">
                "Consistently setting an alarm for {timeInfo.display} helps anchor your daily rhythm. This specific time point serves as a critical coordination mark, allowing for better synchronization between your physiological state and your environment."
              </p>
              <div className="h-1 w-12 bg-primary/30 rounded-full mt-8" />
            </div>
            
          </aside>
        </div>

        {/* Ad Space - Full Width like other pages */}
        <div className="mt-16 max-w-7xl mx-auto px-4">
          <AdBanner />
        </div>
      </div>

      <AddAlarmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addAlarm}
      />

      <AlarmTriggerModal 
        isOpen={!!activeAlarmId}
        onClose={stopAlarm}
        label={activeAlarm?.label || 'Alarm Ringing!'}
        type="alarm"
        timeText={activeAlarm?.time}
      />
    </div>
  )
}
