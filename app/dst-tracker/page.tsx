import DSTTracker from '@/components/tools/DSTTracker'
import InternalLinks from '@/components/ui/InternalLinks'
import { Metadata } from 'next'
import { List, Search, Clock, Zap, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'

export const metadata: Metadata = {
  title: 'Daylight Saving Time (DST) Tracker - Global Clock Changes',
  description: 'Track upcoming daylight saving time changes worldwide. Find out when clocks change in your city or any location globally with our high-precision DST tracker.',
}

export default function DSTTrackerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter decoration-primary decoration-8 underline-offset-8">
          Daylight Saving <span className="text-primary italic">Time</span> Tracker
        </h1>
        <p className="text-white/40 font-medium max-w-2xl mx-auto text-lg leading-relaxed pt-2">
          Stay ahead of the curve. Monitor upcoming clock changes 
          and daylight saving transitions for any city or country in the world.
        </p>
      </div>

      <DSTTracker />
      
      {/* Content Outside the Main Card */}
      <div className="w-full max-w-6xl mx-auto space-y-32 mt-32">
        {/* Premium SEO Content & User Guide */}
        <div className="space-y-32">
          {/* SEO Optimized Paragraph */}
          <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
              Global Time Synchronization
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.1]">
              Master Daylight Saving Transitions with <br />
              <span className="text-primary/80">Our Real-Time Global Tracker</span>
            </h2>
            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
              Navigating the complexities of Daylight Saving Time (DST) can be a challenge, especially when coordinating across multiple continents. Some countries spring forward, others fall back, and many don't change at all. Our Global DST Tracker is designed to provide you with a definitive, chronological timeline of every upcoming clock change worldwide.
            </p>
          </section>

          {/* Comprehensive "How to Use" Guide */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { step: "01", icon: List, title: "Browse List", text: "View the comprehensive list of upcoming global time changes sorted by date and proximity." },
              { step: "02", icon: Search, title: "Search Country", text: "Use our intelligent filter bar to instantly locate specific countries or cities of interest." },
              { step: "03", icon: Clock, title: "Check Time", text: "Note the exact time of the transition, whether it's 2 AM or Midnight, to stay ahead." },
              { step: "04", icon: Zap, title: "Verify Shift", text: "Identify if the location is 'Springing Forward' (+1h) or 'Falling Back' (-1h) with visual cues." },
              { step: "05", icon: CalendarDays, title: "Plan Ahead", text: "Use the 'Days Remaining' countdown to prepare for upcoming schedule changes and sync." }
            ].map((item, i) => (
              <div key={i} className={cn(
                "group p-10 rounded-[3rem] bg-[#1a0b2e]/40 border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl",
                i >= 3 && "lg:col-span-1" // Just standard grid wrap for 5 items
              )}>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-4xl font-black text-white/5 italic group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h4>
                <p className="text-base text-white/40 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </section>

          <AdBanner />

          {/* Value Prop Section */}
          <section className="bg-gradient-to-r from-primary/10 to-transparent p-8 md:p-12 rounded-[2.5rem] border border-white/5 pb-16">
            <h2 className="text-2xl font-black text-white mb-8 italic tracking-tight uppercase">Why use our DST Tracker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h5 className="text-white font-black uppercase text-xs tracking-widest">Global Coverage</h5>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">We monitor over 150 timezones using the latest IANA database to ensure accurate transition data for every corner of the globe.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h5 className="text-white font-black uppercase text-xs tracking-widest">Rare Anomaly Detection</h5>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Special highlighting for unique 30-minute shifts like Lord Howe Island and permanent historical timezone changes.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h5 className="text-white font-black uppercase text-xs tracking-widest">Precision Timing</h5>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Our tool pinpoints the exact hour and minute of the change, going beyond just the date to provide usable scheduling data.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <InternalLinks />
    </div>
  )
}
