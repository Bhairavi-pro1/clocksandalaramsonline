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
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-20">
      <div className="flex flex-col gap-12">
        {/* Row 1: Local Time Box Fully Occupied */}
        <div className="w-full">
          <LocalTimeBox />
        </div>

        {/* Row 2: Add Countdown Button */}
        <div className="flex justify-end">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black hover:scale-105 transition-transform shadow-xl shadow-primary/20"
          >
            <Plus size={24} /> Add Countdown
          </button>
        </div>

        {/* Row 3: Countdown Cards Grid */}
        <div id="timers-list-section" className="scroll-mt-8 w-full">
          {countdowns.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
              <p className="text-white/30 font-bold uppercase tracking-widest">No active countdowns. Click "Add Countdown" to start.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          )}
        </div>
      </div>

      <AddCountdownModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addCountdown}
      />
      
      <div className="mt-32">
        <CountdownScenarios />
      </div>
    </div>
  )
}
