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
    <div className="max-w-7xl mx-auto px-4 pt-0 sm:pt-6 pb-20">
      <div className="flex flex-col gap-6 md:gap-12">
        {/* Row 1: Local Time Box Fully Occupied */}
        <div className="w-full">
          <LocalTimeBox />
        </div>

        {/* Row 2: Add Alarm Button and Status */}
        <div id="alarms-list" className="flex flex-row justify-between items-center gap-4 bg-transparent md:bg-white/5 p-0 md:p-8 rounded-none md:rounded-[2.5rem] border-none md:border md:border-white/5 pb-4 md:pb-0 border-b md:border-b-none border-white/5 scroll-mt-24 w-full">
          <div className="space-y-0.5 text-left">
            <h3 className="text-lg md:text-2xl font-black text-white leading-tight">Active Alarms</h3>
            <p className="text-[11px] md:text-sm text-muted font-medium">You have {alarms.length} alarm{alarms.length !== 1 ? 's' : ''} configured</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-primary text-white p-3 md:px-8 md:py-4 rounded-full md:rounded-[1.25rem] font-black hover:scale-[1.03] transition-transform shadow-lg md:shadow-2xl shadow-primary/20 md:shadow-primary/30"
          >
            <Plus size={20} className="md:w-5 md:h-5" />
            <span className="hidden md:inline ml-2 text-sm font-black">Add New Alarm</span>
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
    </div>
  )
}
