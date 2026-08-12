'use client'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import InternalLinks from '@/components/ui/InternalLinks'
import BookmarkModal from '@/components/ui/BookmarkModal'
import Ad160x600 from '@/components/ads/Ad160x600'
import { cn } from '@/lib/utils'
import BackgroundTimeService from '@/components/services/BackgroundTimeService'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import { useStore } from '@/hooks/useStore'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isStudio = pathname.startsWith('/studio')

  const {
    activeAlarmId,
    alarms,
    setRingingAlarmId,
    countdowns,
    updateCountdown,
    ringingSharedAlarm,
    setRingingSharedAlarm
  } = useStore()

  const ringingTimer = countdowns.find(c => c.isRinging)

  // Sanity Studio has its own full-page UI — render children only
  if (isStudio) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <BackgroundTimeService />

      {/* Mobile navigation is always Header. Desktop is Header for home, Sidebar for tools. */}
      <div className="lg:hidden w-full">
        <Header />
      </div>
      <div className="hidden lg:block">
        {!isHomePage ? <Sidebar /> : <Header />}
      </div>
      <main className={cn(
        "flex-1 min-w-0 flex flex-col min-h-screen",
        !isHomePage ? "lg:ml-72 p-4 lg:p-10 pt-20 lg:pt-10" : "w-full"
      )}>
        <div className="flex-1 flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {children}
          </div>
          {!isHomePage && <Ad160x600 />}
        </div>
        
        <div className={cn(
          "w-full",
          !isHomePage ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto px-6"
        )}>
          <InternalLinks />
        </div>

        <Footer />
      </main>
      
      {/* Global Ringing Trigger Modals */}
      <AlarmTriggerModal
        isOpen={!!activeAlarmId}
        onClose={() => setRingingAlarmId(null)}
        label={alarms.find(a => a.id === activeAlarmId)?.label || 'Alarm Ringing!'}
        type="alarm"
        timeText={alarms.find(a => a.id === activeAlarmId)?.time}
      />

      <AlarmTriggerModal
        isOpen={!!ringingTimer}
        onClose={() => ringingTimer && updateCountdown(ringingTimer.id, { isRinging: false })}
        label={ringingTimer?.label || 'Timer Finished!'}
        type="timer"
      />

      <AlarmTriggerModal
        isOpen={!!ringingSharedAlarm}
        onClose={() => setRingingSharedAlarm(null)}
        label={ringingSharedAlarm?.title || 'Shared Alarm Ringing!'}
        type="alarm"
        timeText={ringingSharedAlarm ? new Date(ringingSharedAlarm.alarmDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      />

      <BookmarkModal />
    </div>
  );
}
