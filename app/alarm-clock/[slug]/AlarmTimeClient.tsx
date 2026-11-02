'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AlarmCard from '@/components/tools/AlarmCard'
import AddAlarmModal from '@/components/tools/AddAlarmModal'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
import { useStore } from '@/hooks/useStore'
import { useAlarm } from '@/hooks/useAlarm'
import AdBanner from '@/components/ui/AdBanner'
import { Plus, Info, Bell, Clock, Zap } from 'lucide-react'
import AlarmScenarios from '@/components/tools/AlarmScenarios'
import alarmData from '@/data/seo/alarms.json'
import { cn } from '@/lib/utils'

interface Props {
  params: { slug: string }
  seoItem?: {
    slug: string
    title: string
    description: string
    content?: string
  }
}

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

export default function AlarmTimeClient({ params, seoItem }: Props) {
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

    const label = `Alarm for ${displayTime}`
    setTimeInfo({
      label,
      time24,
      display: displayTime
    })

    const ensureAlarm = () => {
      const currentAlarms = useStore.getState().alarms
      const exists = currentAlarms.some(a => a.time === time24)
      if (!exists) {
        addAlarm({
          label,
          time: time24,
          sound: 'vibe',
          isActive: true,
          days: []
        })
      }
    }

    if (useStore.persist?.hasHydrated && !useStore.persist.hasHydrated()) {
      const unsub = useStore.persist.onFinishHydration(() => {
        ensureAlarm()
      })
      return () => unsub()
    } else {
      ensureAlarm()
    }
  }, [slug, addAlarm])

  const displayedAlarms = alarms.filter((alarm, index, self) =>
    index === self.findIndex((a) => a.time === alarm.time)
  )

  const activeAlarm = displayedAlarms.find(a => a.id === activeAlarmId)

  if (!timeInfo) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 md:pt-10 pb-20 animate-in fade-in duration-1000">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted/70 font-medium">
          <li>
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          </li>
          <li className="opacity-40">/</li>
          <li>
            <Link href="/alarm-clock/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Alarm Clock</Link>
          </li>
          <li className="opacity-40">/</li>
          <li className="text-slate-900 dark:text-white font-bold" aria-current="page">
            Set Alarm for {timeInfo.display}
          </li>
        </ol>
      </nav>

      {/* Dynamic SEO Title Section */}
      <div className="text-center mb-8 md:mb-12 space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest shadow-inner">
          Free Online Alarm
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
          {seoItem?.title ? seoItem.title.split('—')[0].trim() : `Set Alarm for ${timeInfo.display}`}
        </h1>
        <p className="text-slate-600 dark:text-muted text-base md:text-lg font-medium max-w-3xl mx-auto leading-relaxed">
          {seoItem?.description || `Set a free online alarm for ${timeInfo.display} with loud sound alerts and customizable reminders.`}
        </p>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        {/* Row 1: Local Time Box */}
        <LocalTimeBox />

        {/* Highlighted Preset Alert */}
        <div className="bg-primary/5 hover:bg-primary/10 border border-primary/20 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-1000 pointer-events-none">
            <Bell size={240} />
          </div>
          <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/5 flex items-center justify-center text-primary shadow-[inset_0_0_20px_rgba(124,58,237,0.3)] border border-primary/30 flex-shrink-0">
              <Clock size={36} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Preset Ready: {timeInfo.display}</h2>
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Your requested alarm time is active below</p>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-[1.25rem] font-black hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Zap size={20} fill="currentColor" />
              Customize Alarm
            </button>
          </div>
        </div>

        {/* Current Alarms Section */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-primary rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Your Alarms</h3>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 group text-primary font-black text-xs sm:text-sm uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              Add More
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
        </div>

        {/* Popular Alarm Times Directory */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Alarm Times
            </h3>
            <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
              Switch wake-up times instantly with pre-configured online alarms
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
            {sortedAlarms.map((a) => {
              const isCurrent = a.slug === slug
              const display = getAlarmDisplay(a.slug)
              return (
                <Link
                  key={a.slug}
                  href={`/alarm-clock/${a.slug}/`}
                  className={cn(
                    "group p-2 sm:p-3 rounded-2xl border transition-all text-center flex flex-col justify-center items-center shadow-sm relative",
                    isCurrent
                      ? "bg-primary/10 border-primary text-primary shadow-primary/20 ring-1 ring-primary"
                      : "bg-slate-50 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/5 hover:border-primary/50 hover:bg-primary/5 text-slate-900 dark:text-white hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "font-black text-xs sm:text-sm transition-colors",
                    isCurrent ? "text-primary font-black" : "text-slate-900 dark:text-white group-hover:text-primary"
                  )}>
                    {display.label}
                  </div>
                  <div className={cn(
                    "text-[10px] sm:text-[11px] mt-0.5 font-medium",
                    isCurrent ? "text-primary/80" : "text-slate-500 dark:text-muted"
                  )}>
                    {display.sub}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Alarm Presets (Scenario Grid) */}
        <AlarmScenarios />

        {/* High-Precision Description & User Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 pt-12 sm:pt-16 border-t border-slate-200/80 dark:border-white/10">
          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 sm:gap-5 bg-slate-50 dark:bg-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 shadow-sm">
              <div className="min-w-[48px] sm:min-w-[56px] h-12 sm:h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                <Info size={26} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Guide for the {timeInfo.display} Alarm
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-muted font-medium mt-0.5">
                  Wake up on time with reliable browser-based audio scheduling
                </p>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-6">
              {seoItem?.content && (
                <div className="p-6 rounded-2xl bg-primary/[0.04] border border-primary/20">
                  <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed font-medium">
                    {seoItem.content}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  How the {timeInfo.display} Alarm Works
                </h3>
                <p className="text-slate-600 dark:text-muted text-base sm:text-lg leading-relaxed font-medium">
                  Setting an online alarm for {timeInfo.display} ensures you start your day or transition tasks with maximum precision. Once you open this page, the system automatically prepares the {timeInfo.display} preset in your active alarm list. You can customize the sound, label, and volume according to your personal preference.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Tips for Maximum Alarm Reliability
                </h3>
                <p className="text-slate-600 dark:text-muted text-base sm:text-lg leading-relaxed font-medium">
                  To ensure the alert triggers flawlessly at {timeInfo.display}, keep this browser tab open. Modern operating systems can throttle inactive tabs, so we recommend keeping your device plugged into power and setting your system volume to at least 70–80%.
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-8">
            <div className="bg-slate-50 dark:bg-[#1a0b36]/60 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-slate-200/80 dark:border-violet-500/20 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Daily Routine Insight: <br/>The {timeInfo.display} Anchor
              </h4>
              <p className="text-slate-600 dark:text-muted font-medium leading-relaxed italic text-sm sm:text-base">
                "Consistently setting an alarm for {timeInfo.display} helps anchor your daily circadian rhythm. A predictable wake-up time builds momentum and enhances overall mental focus throughout the day."
              </p>
              <div className="h-1 w-12 bg-primary/40 rounded-full mt-6" />
            </div>
          </aside>
        </div>

        {/* Ad Space */}
        <div className="mt-8 max-w-7xl mx-auto px-4">
          <AdBanner />
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
