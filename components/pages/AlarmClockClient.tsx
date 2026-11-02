'use client'
import { useState } from 'react'
import Link from 'next/link'
import AlarmCard from '@/components/tools/AlarmCard'
import AddAlarmModal from '@/components/tools/AddAlarmModal'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
import { useStore } from '@/hooks/useStore'
import { useAlarm } from '@/hooks/useAlarm'
import AdBanner from '@/components/ui/AdBanner'
import { Plus } from 'lucide-react'
import AlarmScenarios from '@/components/tools/AlarmScenarios'
import alarmData from '@/data/seo/alarms.json'

const orderedAlarmSlugs = ['6-am', '7-am', '8-am', '9-am', '10-am', '12-pm', '6-pm', '12-am']
const sortedAlarms = orderedAlarmSlugs
  .map(slug => alarmData.find(a => a.slug === slug))
  .filter((a): a is NonNullable<typeof a> => !!a)

function getAlarmDisplay(slug: string) {
  switch (slug) {
    case '6-am': return { time: '6:00 AM', label: '6 AM', sub: 'Early Riser' }
    case '7-am': return { time: '7:00 AM', label: '7 AM', sub: 'Wake Up Call' }
    case '8-am': return { time: '8:00 AM', label: '8 AM', sub: 'Work & School' }
    case '9-am': return { time: '9:00 AM', label: '9 AM', sub: 'Morning Sync' }
    case '10-am': return { time: '10:00 AM', label: '10 AM', sub: 'Late Morning' }
    case '12-pm': return { time: '12:00 PM', label: '12 PM', sub: 'Midday / Lunch' }
    case '6-pm': return { time: '6:00 PM', label: '6 PM', sub: 'Evening Routine' }
    case '12-am': return { time: '12:00 AM', label: 'Midnight', sub: 'Night Reminder' }
    default: {
      const formatted = slug.toUpperCase().replace('-', ' ')
      return { time: formatted, label: formatted, sub: 'Alarm' }
    }
  }
}

export default function AlarmClockClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { alarms, addAlarm, removeAlarm, toggleAlarm } = useStore()
  const { activeAlarmId, stopAlarm } = useAlarm()
  
  const displayedAlarms = alarms.filter((alarm, index, self) =>
    index === self.findIndex((a) => a.time === alarm.time)
  )

  const activeAlarm = displayedAlarms.find(a => a.id === activeAlarmId)

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-0 sm:pt-6 pb-20">
      <div className="flex flex-col gap-6 md:gap-12">
        {/* Row 1: Local Time Box Fully Occupied */}
        <div className="w-full">
          <LocalTimeBox />
        </div>

        {/* Row 2: Add Alarm Button and Status */}
        <div id="alarms-list" className="flex flex-row justify-between items-center gap-4 bg-transparent md:bg-white/5 p-0 md:p-8 rounded-none md:rounded-[2.5rem] border-none md:border md:border-white/5 pb-4 md:pb-0 border-b md:border-b-none border-white/5 scroll-mt-24 w-full">
          <div className="space-y-0.5 text-left">
            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-tight">Active Alarms</h3>
            <p className="text-[11px] md:text-sm text-muted font-medium">You have {displayedAlarms.length} alarm{displayedAlarms.length !== 1 ? 's' : ''} configured</p>
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
        {displayedAlarms.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-white/[0.03] rounded-[2.5rem] border border-dashed border-slate-300 dark:border-white/10">
            <p className="text-slate-400 dark:text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">No active alarms yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedAlarms.map((alarm) => (
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

        {/* Popular Alarm Times Directory */}
        <div className="mt-8 pt-8 border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Alarm Times
            </h3>
            <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
              One-click pre-configured online alarms for waking up and daily reminders
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
            {sortedAlarms.map((a) => {
              const display = getAlarmDisplay(a.slug)
              return (
                <Link
                  key={a.slug}
                  href={`/alarm-clock/${a.slug}/`}
                  className="group p-2 sm:p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center flex flex-col justify-center items-center shadow-sm hover:shadow-md"
                >
                  <div className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors text-xs sm:text-sm">
                    {display.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-muted mt-0.5 font-medium">
                    {display.sub}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <AddAlarmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addAlarm}
      />
    </div>
  )
}
