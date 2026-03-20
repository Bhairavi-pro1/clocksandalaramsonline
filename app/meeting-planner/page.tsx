import MeetingPlanner from '@/components/tools/MeetingPlanner'
import InternalLinks from '@/components/ui/InternalLinks'
import { Calendar, MapPin, Clock, Globe, LayoutGrid, CalendarCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'

export default function MeetingPlannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-black text-center mb-16">Global Meeting Planner</h1>
      
      <MeetingPlanner />

      {/* Content Outside the Main Card */}
      <div className="w-full max-w-6xl mx-auto space-y-32 mt-32">
        {/* Premium SEO Content & User Guide */}
        <div className="space-y-32">
          <AdBanner />
          
          {/* SEO Optimized Paragraph */}
          <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
              Strategic Global Coordination
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.1]">
              Optimize Your International Meetings with <br />
              <span className="text-primary/80">Our High-Precision Planner</span>
            </h2>
            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
              In today's interconnected world, synchronizing a team across continents is more than just a convenience—it's a necessity. Our Global Meeting Planner is engineered to take the guesswork out of international scheduling by automatically identifying the perfect window of cooperation.
            </p>
          </section>

          {/* Comprehensive "How to Use" Guide */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { step: "01", icon: MapPin, title: "Select Origin", text: "Choose your home city or current location and set the date for your global session." },
              { step: "02", icon: Clock, title: "Input Time", text: "Enter your preferred meeting window in your local time using our precision time picker." },
              { step: "03", icon: Globe, title: "Add Zones", text: "Add an unlimited number of target time zones from our global location database." },
              { step: "04", icon: LayoutGrid, title: "Compare", text: "Instantly visualize how your chosen time maps across everyone's local business hours." },
              { step: "05", icon: CalendarCheck, title: "Schedule", text: "Export your results directly to Google Calendar with one click for seamless coordination." }
            ].map((item, i) => (
              <div key={i} className={cn(
                "group p-10 rounded-[3rem] bg-[#1a0b2e]/40 border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl",
                i >= 3 && "lg:col-span-1"
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
            <h2 className="text-2xl font-black text-white mb-8 italic tracking-tight">Why use Clocks & Alarms Online?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h5 className="text-white font-black uppercase text-xs tracking-widest">Visual Feedback</h5>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Color-coded status indicators show working hours, night cycles, and day changes across every selected city instantly.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h5 className="text-white font-black uppercase text-xs tracking-widest">Precision Sync</h5>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Automatic day-boundary detection ensures you never schedule a meeting on the wrong calendar day in a target timezone.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h5 className="text-white font-black uppercase text-xs tracking-widest">One-Click Export</h5>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Seamless Google Calendar integration pre-fills your event with the correct UTC conversion, saving you time and avoiding errors.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <InternalLinks />
    </div>
  )
}
