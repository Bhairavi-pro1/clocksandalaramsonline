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
import { Plus, Info, Bell, Clock, Zap, Dumbbell, BookOpen, Sun, Briefcase, Utensils, Moon } from 'lucide-react'
import AlarmScenarios from '@/components/tools/AlarmScenarios'
import alarmData from '@/data/seo/alarms.json'
import { cn } from '@/lib/utils'
import ToolSEO from '@/components/seo/ToolSEO'

interface Props {
  params: { slug: string }
  seoItem?: {
    slug: string
    title: string
    description: string
    content?: string
    introTag?: string
    introHeading?: string
    introParagraph?: string
    howToSteps?: Array<{ title: string; text: string }>
    proTips?: string[]
    useCases?: Array<{ title: string; text: string; icon?: string }>
    whyChooseUs?: string
    troubleshooting?: string
    faqs?: Array<{ q: string; a: string }>
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
        unsub()
      })
    } else {
      ensureAlarm()
    }
  }, [slug, addAlarm])

  const iconMap: Record<string, any> = {
    Dumbbell,
    BookOpen,
    Sun,
    Briefcase,
    Clock,
    Zap,
    Utensils,
    Moon,
    Bell
  }

  const defaultUseCases = [
    { title: "Morning Routine & Wake-Up", text: `Start your morning punctually and build momentum with a reliable ${timeInfo?.display || 'scheduled'} alert.`, icon: Sun },
    { title: "Work & Productivity Focus", text: `Transition between daily priorities, meetings, and deep work blocks with atomic precision.`, icon: Briefcase },
    { title: "Fitness & Personal Habits", text: `Protect time for workouts, hydration, and mindful rest throughout your day.`, icon: Dumbbell }
  ]

  const mappedUseCases = (seoItem?.useCases && seoItem.useCases.length > 0)
    ? seoItem.useCases.map(u => ({
        title: u.title,
        text: u.text,
        icon: typeof u.icon === 'string' ? (iconMap[u.icon] || Clock) : (u.icon || Clock)
      }))
    : defaultUseCases

  if (!timeInfo) {
    return <div className="min-h-screen bg-background" />
  }

  // Find the matching alarm from store
  const targetAlarm = alarms.find(a => a.time === timeInfo.time24)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      <AlarmTriggerModal
        isOpen={!!activeAlarmId}
        onClose={stopAlarm}
        label={alarms.find(a => a.id === activeAlarmId)?.label || 'Alarm Ringing!'}
        timeText={alarms.find(a => a.id === activeAlarmId)?.time}
        type="alarm"
      />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li className="opacity-40">/</li>
            <li>
              <Link href="/alarm-clock/" className="hover:text-primary transition-colors">Alarm Clock</Link>
            </li>
            <li className="opacity-40">/</li>
            <li className="text-slate-900 dark:text-white font-bold" aria-current="page">Set Alarm for {timeInfo.display}</li>
          </ol>
        </nav>

        {/* Minimal Title Block */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Set Alarm for <span className="text-primary italic font-serif">{timeInfo.display}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-muted/80 max-w-lg mx-auto font-medium">
            High-precision online alarm clock with customizable sound alerts, full-screen display, and snooze.
          </p>
        </div>

        {/* Local Time Helper Box */}
        <div className="flex justify-center">
          <LocalTimeBox />
        </div>

        {/* Hero Dedicated Alarm Box */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            {targetAlarm ? (
              <AlarmCard 
                key={targetAlarm.id} 
                id={targetAlarm.id}
                label={targetAlarm.label}
                time={targetAlarm.time}
                isActive={targetAlarm.isActive}
                onToggle={toggleAlarm} 
                onRemove={removeAlarm} 
              />
            ) : (
              <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center flex flex-col items-center justify-center min-h-[220px]">
                <Clock className="w-10 h-10 text-primary animate-pulse mb-3" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Alarm set for {timeInfo.display}
                </h3>
                <p className="text-xs text-slate-500 dark:text-muted">
                  Initializing your scheduled alert...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions (Add Alternative Alarms) */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white font-bold text-xs sm:text-sm transition-all border border-slate-200/80 dark:border-white/10 shadow-sm"
          >
            <Plus size={16} className="text-primary" />
            Set Another Alarm Time
          </button>
        </div>

        {/* Other Active Alarms Panel (if user has multiple) */}
        {alarms.length > 1 && (
          <div className="pt-6 border-t border-slate-200/80 dark:border-white/10">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 text-center">
              Your Other Configured Alarms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alarms
                .filter(a => a.time !== timeInfo.time24)
                .map(alarm => (
                  <AlarmCard 
                    key={alarm.id} 
                    id={alarm.id}
                    label={alarm.label}
                    time={alarm.time}
                    isActive={alarm.isActive}
                    onToggle={toggleAlarm} 
                    onRemove={removeAlarm} 
                  />
                ))}
            </div>
          </div>
        )}

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

        {/* Comprehensive High-Word-Count ToolSEO Component (Solves Thin Content) */}
        <div className="mt-14 sm:mt-20">
          <ToolSEO
            toolName={`Online Alarm for ${timeInfo.display}`}
            introTag={seoItem?.introTag || "Reliable Online Wake-Up Call"}
            introHeading={seoItem?.introHeading || `Set an Alarm for ${timeInfo.display}: Wake Up On Time with Atomic Precision`}
            introParagraph={seoItem?.introParagraph || seoItem?.content || `Setting an online alarm for ${timeInfo.display} ensures you start your day or transition tasks with maximum precision.`}
            howToSteps={seoItem?.howToSteps || [
              { title: "Verify Your Alarm Setting", text: `This page automatically arms your ${timeInfo.display} alarm in the active list.` },
              { title: "Choose Sound & Adjust Volume", text: "Select your preferred audio alert and ensure master system volume is unmuted at 70–80%." },
              { title: "Keep Browser Tab Open", text: "Leave this browser tab active and ensure your device remains connected to power." },
              { title: "Wake Up & Conquer the Day", text: "When the scheduled time arrives, our loud chime and full-screen display alert you immediately." }
            ]}
            proTips={seoItem?.proTips || [
              `To wake up refreshed at ${timeInfo.display}, aim to complete 5 full 90-minute sleep cycles (7.5 hours of sleep).`,
              "Prevent computer sleep by keeping your laptop plugged in and setting your system power timer to display-off only.",
              "Place your device across the bedroom so you must physically stand up to dismiss the alert.",
              "Expose your eyes to natural daylight within 15 minutes of waking to stop melatonin production."
            ]}
            useCases={mappedUseCases}
            whyChooseUs={seoItem?.whyChooseUs || "Our online alarm engine connects directly with atomic time protocols, eliminating device clock drift. Features high-frequency audio tones engineered for deep sleepers, full-screen visual rings, and works 100% free with no sign-ups."}
            troubleshooting={seoItem?.troubleshooting || "1. System Sleep Mode: Keep your computer plugged into power so the browser does not enter hibernation.\n2. Audio Permissions: Click 'Test Sound' on the alarm card to confirm browser autoplay permissions.\n3. Output Device: Verify audio is not routing to disconnected Bluetooth earbuds.\n4. Screen Dimming: Dim your monitor brightness instead of closing the laptop lid to keep audio timers active."}
            faqs={seoItem?.faqs || [
              { q: `Will this alarm ring if my computer is locked?`, a: `As long as your computer is connected to power and does not enter deep sleep or hibernation, the alarm will ring on time.` },
              { q: `Can I snooze the alarm?`, a: `Yes, clicking the Snooze button gives you an additional 5 minutes of rest before the chime repeats.` }
            ]}
          />
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
