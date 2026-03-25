import MeetingPlanner from '@/components/tools/MeetingPlanner'
import StructuredData from '@/components/seo/StructuredData'
import { Calendar, MapPin, Clock, Globe, LayoutGrid, CalendarCheck, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Global Meeting Planner — Coordinate Team Calls Across Timezones',
  description: 'Schedule international meetings with ease. Our global meeting planner helps you find the perfect time for team calls across multiple timezones with visual working hour indicators.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/meeting-planner',
  },
  openGraph: {
    title: 'Global Meeting Planner — Coordinate Team Calls Across Timezones',
    description: 'Find the perfect meeting time for your global team. Visual timezone coordination made simple.',
    type: 'website',
  }
}

export default function MeetingPlannerPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global Meeting Planner",
    "description": "Interactive tool for scheduling and planning meetings across multiple international timezones with visual working hour detection.",
    "applicationCategory": "BusinessApplication",
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
        "name": "How does the meeting planner handle daylight saving time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our meeting planner automatically accounts for daylight saving time (DST) transitions based on the selected date. It uses the IANA database to ensure that the time offset for every city is accurate for the specific day of your meeting."
        }
      },
      {
        "@type": "Question",
        "name": "Can I add more than two timezones to the planner?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can add an unlimited number of target timezones to compare. This is ideal for large global teams spread across several continents."
        }
      },
      {
        "@type": "Question",
        "name": "Does the tool identify working hours for all participants?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the planner uses color-coded indicators (Emerald for working hours, Red for night/sleep, and Indigo for normal hours) to help you visually identify the best 'window of cooperation' where everyone is awake and available."
        }
      }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-1000">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <h1 className="text-4xl md:text-6xl font-black text-center mb-16 text-white tracking-tighter">
        Global Meeting <span className="text-primary italic">Planner</span>
      </h1>
      
      <MeetingPlanner />

      {/* Content Outside the Main Card */}
      <div className="w-full max-w-6xl mx-auto space-y-32 mt-32">
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
            <p className="text-lg md:text-xl text-muted/80 leading-relaxed max-w-4xl mx-auto font-medium opacity-90 italic">
              In today&apos;s interconnected world, synchronizing a team across continents is more than just a convenience—it&apos;s a necessity. Our Global Meeting Planner is engineered to take the guesswork out of international scheduling by automatically identifying the perfect window of cooperation.
            </p>
          </section>

          {/* Comprehensive "How to Use" Guide */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { step: "01", icon: MapPin, title: "Select Origin", text: "Choose your home city or current location and set the date for your global session." },
              { step: "02", icon: Clock, title: "Input Time", text: "Enter your preferred meeting window in your local time using our precision time picker." },
              { step: "03", icon: Globe, title: "Add Zones", text: "Add an unlimited number of target time zones from our global location database." },
              { step: "04", icon: LayoutGrid, title: "Compare", text: "Instantly visualize how your chosen time maps across everyone&apos;s local business hours." },
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
               <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Expert Coordination <span className="text-primary italic">FAQ</span></h2>
               <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { 
                   q: "How does the meeting planner handle daylight saving time?", 
                   a: "Our meeting planner automatically accounts for daylight saving time (DST) transitions based on the selected date. It uses the IANA database to ensure that the time offset for every city is accurate for the specific day of your meeting."
                 },
                 {
                   q: "Can I add more than two timezones to the planner?",
                   a: "Yes, you can add an unlimited number of target timezones to compare. This is ideal for large global teams spread across several continents."
                 },
                 {
                   q: "Does the tool identify working hours for all participants?",
                   a: "Yes, the planner uses color-coded indicators (Emerald for working hours, Red for night/sleep, and Indigo for normal hours) to help you visually identify the best 'window of cooperation'."
                 },
                 {
                   q: "Is there an export feature for the meeting results?",
                   a: "Absolutely. Once you've identified the perfect time, you can use the 'Schedule Meeting' button to instantly generate a Google Calendar invite with the correct UTC time conversions pre-configured."
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
            <h2 className="text-2xl font-black text-white mb-8 italic tracking-tight uppercase">Why use Clocks & Alarms Online?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h4 className="text-white font-black uppercase text-xs tracking-widest">Visual Feedback</h4>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Color-coded status indicators show working hours, night cycles, and day changes across every selected city instantly.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h4 className="text-white font-black uppercase text-xs tracking-widest">Precision Sync</h4>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Automatic day-boundary detection ensures you never schedule a meeting on the wrong calendar day in a target timezone.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <h4 className="text-white font-black uppercase text-xs tracking-widest">One-Click Export</h4>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium">Seamless Google Calendar integration pre-fills your event with the correct UTC conversion, saving you time and avoiding errors.</p>
              </div>
            </div>
          </section>
        </div>
        <div className="mt-20">
          <AdBanner />
        </div>
      </div>

    </div>
  )
}
