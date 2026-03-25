'use client'
import { useState } from 'react'
import CountdownTimer from '@/components/tools/CountdownTimer'
import LocalTimeBox from '@/components/ui/LocalTimeBox'
import InternalLinks from '@/components/ui/InternalLinks'
import AddCountdownModal from '@/components/tools/AddCountdownModal'
import { useStore } from '@/hooks/useStore'
import AdBanner from '@/components/ui/AdBanner'
import { Plus } from 'lucide-react'
import CountdownScenarios from '@/components/tools/CountdownScenarios'

export default function TimerClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { countdowns, addCountdown, removeCountdown } = useStore()

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-20">
      <h1 className="text-4xl md:text-5xl font-black text-center mb-10">Online Countdown Timer</h1>
      
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

      <AddCountdownModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addCountdown}
      />
      
      {/* High-Precision SEO Content & User Guide */}
      <div className="max-w-6xl mx-auto mt-32 space-y-24">
        <CountdownScenarios />
        
        {/* Excellent SEO Paragraph */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            The Ultimate Productivity Tool
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            High-Precision Online Countdown Timer <br />
            <span className="text-primary/80">for Unstoppable Focus and Results</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Welcome to Clocks and Alarms Online, your premier destination for the most reliable countdown timer on the web. 
            Our high-precision online timer is meticulously designed for students, professionals, and home chefs who 
            demand millisecond accuracy. Whether you are mastering the Pomodoro technique, tracking fitness intervals, 
            or counting down to a high-stakes event, our persistent and visually stunning interface ensures you stay 
            on track and ahead of your schedule.
          </p>
        </section>

        {/* Comprehensive "How to Use" Guide */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">1</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Set Countdown</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Click "Add Countdown" to specify hours, minutes, and seconds. Choose a custom alarm sound to stay alert.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">2</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Monitor Progress</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Our vibrant, high-contrast display makes it effortless to track remaining time at a glance from any device.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">3</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Immersive Focus</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Enter Fullscreen mode to transform your display into a dedicated focus tool with zero distractions.
            </p>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
              <span className="text-xl font-black text-white">4</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Stay Notified</h4>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Our crystal-clear audio alerts and visual popups ensure you never miss a deadline, even in another tab.
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
