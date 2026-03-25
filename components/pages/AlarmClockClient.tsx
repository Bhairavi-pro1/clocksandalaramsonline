'use client'
import { useState } from 'react'
import AlarmCard from '@/components/tools/AlarmCard'
import AddAlarmModal from '@/components/tools/AddAlarmModal'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
import InternalLinks from '@/components/ui/InternalLinks'
import { useStore } from '@/hooks/useStore'
import { useAlarm } from '@/hooks/useAlarm'
import AdBanner from '@/components/ui/AdBanner'
import { Plus } from 'lucide-react'
import AlarmScenarios from '@/components/tools/AlarmScenarios'

export default function AlarmClockClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { alarms, addAlarm, removeAlarm, toggleAlarm } = useStore()
  const { activeAlarmId, stopAlarm } = useAlarm()
  
  const activeAlarm = alarms.find(a => a.id === activeAlarmId)

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-20">
      <h1 className="text-4xl md:text-5xl font-black text-center mb-10 text-white">Online Alarm Clock</h1>
      
      <div className="flex flex-col gap-12">
        {/* Row 1: Local Time Box Fully Occupied */}
        <div className="w-full">
          <LocalTimeBox />
        </div>

        {/* Row 2: Add Alarm Button and Status */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-white">Active Alarms</h2>
            <p className="text-sm text-muted font-medium">You have {alarms.length} alarm{alarms.length !== 1 ? 's' : ''} configured</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black hover:scale-[1.03] transition-transform shadow-2xl shadow-primary/30"
          >
            <Plus size={24} /> Add New Alarm
          </button>
        </div>

        {/* Row 3: Alarm Cards Grid */}
        {alarms.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.03] rounded-[2.5rem] border border-dashed border-white/10">
            <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">No active alarms yet</p>
          </div>
        ) : (
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
        )}

        {/* Alarm Presets Section */}
        <AlarmScenarios />
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
      
      {/* High-Precision SEO Content & User Guide */}
      <div className="max-w-6xl mx-auto mt-32 space-y-24">
        
        {/* Excellent SEO Paragraph */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            The Smartest Way to Wake Up
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            Professional Online Alarm Clock <br />
            <span className="text-primary/80">for a Seamless Daily Routine</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Clocks and Alarms Online offers a sophisticated yet simple-to-use alarm clock that integrates seamlessly 
            into your life. Designed for those who wake up with precision and intent, our tool allows you to manage 
            multiple alarms with customized labels and high-fidelity audio tones. Never miss a critical meeting 
            or early flight again with our persistent, browser-based notification system.
          </p>
        </section>

        {/* Comprehensive "How to Use" Guide */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">1</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Set Your Time</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Quickly toggle through hours and minutes to set your desired wake-up call or reminder.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">2</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Choose Sounds</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Personalize your wake-up with our curated library, from gentle birds to classic radar beeps.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">3</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Label Alarms</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Stay organized by naming alarms like "Gym Time" or "Meeting" to know exactly why you're ringing.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">4</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Always Ready</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Our alarm clock system saves your settings automatically, ensuring it's ready every time you return.
            </p>
          </div>
        </section>

        {/* Horizontal Ad Banner Slot */}
        <AdBanner />
      </div>

      <InternalLinks />
    </div>
  )
}
