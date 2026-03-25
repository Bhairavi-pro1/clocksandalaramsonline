import DstTrackerClient from '@/components/pages/DstTrackerClient'
import { Metadata } from 'next'
import { List, Search, Clock, Zap, CalendarDays, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'
import { getUpcomingDSTChanges } from '@/lib/dst'
import StructuredData from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Global Daylight Saving Time (DST) Tracker — Live Clock Changes',
  description: 'Track upcoming daylight saving time changes worldwide. Definitive chronological timeline of every scheduled clock change for the next 12 months with high precision.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/dst-tracker',
  },
  openGraph: {
    title: 'Global Daylight Saving Time (DST) Tracker — Live Clock Changes',
    description: 'Never get confused by clock changes again. Our real-time tracker monitors over 150 timezones globally.',
    type: 'website',
  }
}

export default function DSTTrackerPage() {
  const initialChanges = getUpcomingDSTChanges()

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global DST Tracker",
    "description": "Real-time tracking of daylight saving time transitions and clock changes worldwide.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How accurate is the global DST transition data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tracker uses the IANA Time Zone Database, which is the world standard for timezone and DST information. We monitor over 7,000 cities twice daily to ensure every transition is correctly accounted for."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between 'Spring Forward' and 'Fall Back'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Spring Forward refers to the start of Daylight Saving Time where clocks move ahead by one hour (+1h), typically in the spring. Fall Back refers to the end of DST where clocks move back by one hour (-1h), usually in autumn."
        }
      }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-1000">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />

      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter decoration-primary decoration-8 underline-offset-8">
          Daylight Saving <span className="text-primary italic">Time</span> Tracker
        </h1>
        <p className="text-white/40 font-medium max-w-2xl mx-auto text-lg leading-relaxed pt-2">
          Stay ahead of the curve. Monitor upcoming clock changes 
          and daylight saving transitions for any city or country in the world.
        </p>
      </div>

      <DstTrackerClient initialChanges={initialChanges} />
      
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>

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
              Navigating the complexities of Daylight Saving Time (DST) can be a challenge, especially when coordinating across multiple continents. Some countries spring forward, others fall back, and many don&apos;t change at all. Our Global DST Tracker is designed to provide you with a definitive, chronological timeline of every upcoming clock change worldwide.
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
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-base text-white/40 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </section>

          {/* Detailed FAQ Section for SEO */}
          <section className="space-y-16">
            <div className="text-center space-y-4">
               <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Daylight Saving <span className="text-primary italic">Insights</span></h2>
               <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { 
                   q: "How accurate is the global DST transition data?", 
                   a: "Our tracker uses the IANA Time Zone Database, which is the world standard for timezone and DST information. We monitor over 7,000 cities to ensure every transition is correctly accounted for."
                 },
                 {
                   q: "Why do some countries change clocks at different times?",
                   a: "Daylight saving time is managed by national or regional governments, meaning transitions aren't synchronized globally. For example, Europe and North America typically transition on different weekends."
                 },
                 {
                   q: "Does the tracker include rare timezone shifts?",
                   a: "Yes. Our engine detects unique cases like 30-minute DST shifts and permanent historical changes (like Mexico's recent move to permanent time) to provide usable, real-world data."
                 },
                 {
                   q: "How can I prepare for a 'Fall Back' change?",
                   a: "During 'Fall Back', you'll gain an hour. We recommend adjusting your clocks before bed and checking our 'Days Remaining' counter to plan your week ahead of time."
                 }
               ].map((faq, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
                    <div className="flex gap-4 mb-4">
                       <HelpCircle className="text-primary group-hover:scale-110 transition-transform" />
                       <h4 className="text-lg font-bold text-white tracking-tight">{faq.q}</h4>
                    </div>
                    <p className="text-sm text-muted/70 leading-relaxed font-medium pl-10">
                       {faq.a}
                    </p>
                 </div>
               ))}
            </div>
          </section>


          {/* Value Prop Section */}
          <section className="bg-gradient-to-r from-primary/10 to-transparent p-8 md:p-12 rounded-[2.5rem] border border-white/5 pb-16">
            <h2 className="text-2xl font-black text-white mb-8 italic tracking-tight uppercase">Why use our DST Tracker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h4 className="text-white font-black uppercase text-xs tracking-widest">Global Coverage</h4>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">We monitor over 150 timezones using the latest IANA database to ensure accurate transition data for every corner of the globe.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h4 className="text-white font-black uppercase text-xs tracking-widest">Rare Anomaly Detection</h4>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Special highlighting for unique 30-minute shifts like Lord Howe Island and permanent historical timezone changes.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h4 className="text-white font-black uppercase text-xs tracking-widest">Precision Timing</h4>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Our tool pinpoints the exact hour and minute of the change, going beyond just the date to provide usable scheduling data.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
