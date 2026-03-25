'use client'
import { useState } from 'react'
import AlarmCard from '@/components/tools/AlarmCard'
import AddAlarmModal from '@/components/tools/AddAlarmModal'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
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
      <div className="flex flex-col gap-12">
        {/* Row 1: Local Time Box Fully Occupied */}
        <div className="w-full">
          <LocalTimeBox />
        </div>

        {/* Row 2: Add Alarm Button and Status */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-white">Active Alarms</h3>
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
    </div>
  )
}
