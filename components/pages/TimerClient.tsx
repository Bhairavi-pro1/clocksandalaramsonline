'use client'
import { useState } from 'react'
import CountdownTimer from '@/components/tools/CountdownTimer'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
import AddCountdownModal from '@/components/tools/AddCountdownModal'
import { useStore } from '@/hooks/useStore'
import AdBanner from '@/components/ui/AdBanner'
import { Plus } from 'lucide-react'
import CountdownScenarios from '@/components/tools/CountdownScenarios'

export default function TimerClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { countdowns, addCountdown, removeCountdown } = useStore()

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-2 sm:pt-4 pb-12 sm:pb-20">
      <div className="flex flex-col gap-4 sm:gap-12">
        {/* Row 1: Local Time Box Fully Occupied */}
        <div className="w-full">
          <LocalTimeBox />
        </div>

        {/* Row 2: Control Bar */}
        <div className="flex items-center justify-between gap-3 w-full pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${
              countdowns.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-white/20"
            }`} />
            <h2 className="text-sm sm:text-xl font-black text-white tracking-wider uppercase">
              {countdowns.length === 0 ? "No Active Timers" : "Created Timers"}
            </h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-2 sm:px-6 sm:py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20 text-xs sm:text-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add Timer
          </button>
        </div>

        {/* Row 3: Countdown Cards Grid (only when active) */}
        {countdowns.length > 0 && (
          <div id="timers-list-section" className="scroll-mt-8 w-full">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 animate-in fade-in duration-500">
              {countdowns.map((c) => (
                <CountdownTimer 
                  key={c.id}
                  id={c.id}
                  label={c.label}
                  initialSeconds={c.seconds}
                  sound={c.sound}
                  onRemove={removeCountdown}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AddCountdownModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addCountdown}
      />
      
      <div className="mt-16 sm:mt-32">
        <CountdownScenarios />
      </div>
    </div>
  )
}
