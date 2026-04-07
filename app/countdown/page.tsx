import { getHolidays } from '@/lib/holidays'
import Link from 'next/link'
import { Calendar, Clock, Globe, Zap, Maximize2, Info, ArrowRight, HelpCircle } from 'lucide-react'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Holiday Countdown — Track Universal Holidays with Precision',
  description: 'Stay ahead of the celebrations. Precise, millisecond-accurate countdowns for all major global holidays. Synchronized with atomic time for unmatched reliability.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/countdown',
  },
  openGraph: {
    title: 'Holiday Countdown — Track Universal Holidays with Precision',
    description: 'Track the seconds until the next big celebration with our suite of high-precision holiday countdowns.',
    type: 'website',
  }
}

export default function HolidayCountdownIndexPage() {
  const holidays = getHolidays()

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global Holiday Countdown Suite",
    "description": "A collection of high-precision countdown timers for major international holidays and events.",
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
        "name": "How accurate are these holiday countdowns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All our countdowns are synchronized with global atomic time servers and utilize high-resolution system performance counters to provide millisecond accuracy."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use these countdowns for event displays?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Each holiday has a dedicated full-screen mode that is ideal for projectors, public displays, and cinematic office screens."
        }
      }
    ]
  }

  return (
    <div className="w-full min-h-screen">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 pt-16 text-center space-y-6 animate-in fade-in duration-1000">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
          Universal Celebration Trackers
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
          Global Holiday <span className="text-primary italic font-serif">Countdowns</span>
        </h1>
        <p className="text-lg text-muted/60 max-w-3xl mx-auto font-medium">
          Whether it&apos;s New Year&apos;s Eve or an international independence day, track Every second with millisecond-accurate precision.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {holidays.map((holiday, i) => {
          const slug = holiday.name.toLowerCase().replace(/\s+/g, '-')
          const isUpcoming = holiday.date.getTime() > new Date().getTime()
          
          return (
            <Link 
              key={slug} 
              href={`/countdown/${slug}`}
              className="group relative bg-[#1a0b2e]/40 border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/40 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calendar size={120} />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${isUpcoming ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                    {isUpcoming ? 'Upcoming' : 'Passed'}
                  </span>
                  <ArrowRight className="text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all" size={20} />
                </div>
                
                <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors">
                  {holiday.name}
                </h2>
                
                <p className="text-sm text-muted/60 font-medium">
                  {holiday.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span className="text-xs font-bold text-white/40">High-Precision Sync Active</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-32 pb-24 mt-20">
        <AdBanner />

        {/* SEO Content Section */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            Stay in Sync with Global Celebrations <br />
            <span className="text-primary/80">with Millisecond Precision</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Our holiday countdown engine is designed for high-precision timekeeping. We utilize sub-millisecond 
            system performance counters to ensure that the time you see is perfectly synchronized with the true 
            movement of the earth. From office celebrations to personal milestones, Clocks and Alarms Online 
            provides the most reliable trackers on the web. Experience it beautifully with our countdown timer full screen feature.
          </p>
        </section>

        {/* "How to Use" Guide */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary">Use</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Globe, 
                title: "Select holiday", 
                text: "Choose from our curated list of major global holidays to view a dedicated high-precision countdown." 
              },
              { 
                icon: Zap, 
                title: "Live Tracking", 
                text: "The countdown begins automatically, showing days, hours, minutes, and seconds with zero latency." 
              },
              { 
                icon: Maximize2, 
                title: "Cinema Mode", 
                text: "Use the expansion icon on any countdown page to enter a cinematic full-screen view for event displays." 
              },
              { 
                icon: Info, 
                title: "Expert Insights", 
                text: "Read detailed holiday information and expert timing insights specifically curated for each event." 
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-muted/80 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed FAQ Section for SEO */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Celebration <span className="text-primary italic">Expert Insights</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                q: "What happens when the countdown reaching zero?", 
                a: "Once a holiday begins in its primary region, the countdown will reset to zero and display a celebratory message before calculating the next occurrence of the event."
              },
              {
                q: "Can I use the countdown on my phone?",
                a: "Yes. Our countdown timers are fully responsive and optimized for mobile devices, allowing you to track the holiday buildup on the go."
              },
              {
                q: "Do you support local or regional holidays?",
                a: "Currently, we focus on major global holidays with high search intent. We are constantly expanding our list to include more cultural and regional events."
              },
              {
                q: "How often is the date data updated?",
                a: "Our holiday dates are verified annually to ensure accuracy across leap years and changing cultural calendars."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
                <div className="flex gap-4 mb-4">
                  <HelpCircle className="text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white tracking-tight">{faq.q}</h3>
                </div>
                <p className="text-sm text-muted/70 leading-relaxed font-medium pl-10">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        <div className="mt-20">
          <AdBanner />
        </div>
      </div>
    </div>
  )
}
