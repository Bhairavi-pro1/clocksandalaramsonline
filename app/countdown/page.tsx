import { getHolidays } from '@/lib/holidays'
import Link from 'next/link'
import { Calendar, Clock, Globe, Zap, Maximize2, Info, ArrowRight, HelpCircle, GraduationCap, Briefcase, Dumbbell, Utensils, Timer } from 'lucide-react'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import { Metadata } from 'next'
import ToolSEO from '@/components/seo/ToolSEO'

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

        {/* Massive ToolSEO Replacement */}
        <ToolSEO
          toolName="Global Holiday Countdown"
          introTag="Universal Celebration Trackers"
          introHeading="Stay in Sync with Global Celebrations with Millisecond Precision"
          introParagraph="Our holiday countdown engine is designed for high-precision timekeeping. We utilize sub-millisecond system performance counters to ensure that the time you see is perfectly synchronized with the true movement of the earth. From office celebrations to personal milestones, Clocks and Alarms Online provides the most reliable trackers on the web. Experience it beautifully with our countdown timer full-screen feature, capable of fueling the anticipation of thousands of simultaneous viewers."
          howToSteps={[
            { title: "Select a Holiday", text: "Browse our comprehensive list of global holidays above. Click on the specific event, such as New Year's Eve, to launch its dedicated high-precision tracking page." },
            { title: "Monitor the Live Tracking", text: "The moment the page loads, the countdown instantly begins ticking, breaking down the exact months, days, hours, minutes, and seconds remaining." },
            { title: "Utilize Cinema Mode", text: "Are you hosting a party? Click the Maximize icon to hide your browser UI and expand the beautiful countdown to fill your entire TV or projector screen." },
            { title: "Bookmark for Later", text: "Once you find your preferred holiday, bookmark the page! Our dynamic engine recalculates everything server-side, meaning it's always accurate year after year." }
          ]}
          proTips={[
            "During the famous 'New Year's Eve' countdown, test your internet latency by cross-referencing our atomic-time-based clock against a cable television broadcast—you'll often find we are seconds faster.",
            "Use the 'Days Remaining' metric for strict project management if you're trying to launch a product before the Christmas shopping season hits in late November.",
            "Combine a countdown with our Alarm Clock tool so you get an audio alert exactly 10 minutes before the global event fires."
          ]}
          useCases={[
            { icon: Briefcase, title: "For Retail Managers", text: "Retail logistics require intense planning around major holidays like Christmas and Halloween. Put the countdown on the staff room TV to keep employees focused on the upcoming sales targets." },
            { icon: GraduationCap, title: "For Teachers & Educators", text: "Children love anticipation. Keep a permanent tab open on the classroom SmartBoard ticking down towards Summer Vacation or the next major holiday break." },
            { icon: Globe, title: "For Globetrotters", text: "Planning a trip to Ireland for St. Patrick's Day? Our trackers use localized data to ensure you know exactly how long you have left to finish packing your bags." },
            { icon: Timer, title: "For Event Planners", text: "Event coordinators use our precise counters to coordinate the exact drop of fireworks, light shows, or DJ sets when the clock finally strikes zero." },
            { icon: Zap, title: "For E-Commerce Flash Sales", text: "Online business owners monitor massive spending holidays like Black Friday using our clock to perfectly sync the moment their discount codes go live globally." }
          ]}
          whyChooseUs={`Generic countdown scripts fundamentally misunderstand how to calculate long durations across leap years and timezone shifts, often resulting in countdowns that are 'off' by a full 24 hours depending on where the user lives.

          Clocks and Alarms Online solves this by compiling every major holiday against the IANA Time Zone Database combined with Coordinated Universal Time (UTC). We don't just calculate days; we calculate absolute elapsed milliseconds against atomic time servers. This ensures that whether you are in Tokyo waiting for New Year's or in New York waiting for the 4th of July, the countdown is mathematically flawless.`}
          troubleshooting={`Event date seems incorrect or clock stopped?
          
          1. Timezone Skew: Ensure that your device's internal clock is set to "Automatic." If your laptop is 2 minutes fast, the countdown will reflect that error.
          2. Static Page: For absolute precision when the countdown hits the final 10 seconds, do not switch tabs. Tab switching forces browsers to pause javascript, which may cause the seconds to instantly "snap" to zero when you return.
          3. Caching Issues: If the countdown shows last year's event date, simply hard-refresh your browser (Ctrl+F5) to clear aggressive network caches.`}
          faqs={[
            { q: "What happens when the countdown reaching zero?", a: "Once a holiday begins in its primary region, the countdown will smoothly reset to zero, display a celebratory message, and then automatically recalculate the distance to the exact moment the holiday occurs next year." },
            { q: "Can I use the countdown on my phone?", a: "Yes. Our countdown timers are fully responsive and specifically optimized for mobile Safari and Chrome, allowing you to track the holiday buildup on the go without the battery drain of native apps." },
            { q: "Do you support local or regional holidays?", a: "Currently, we focus on universal and major cultural holidays with massive global search intent. However, our database is expanding monthly to include specific localized and religious events." },
            { q: "How often is the date data updated?", a: "Our complex holiday algorithms automatically calculate leap years and shifting lunar calendars mathematically, meaning the dates are perpetually accurate forever without requiring manual updates." },
            { q: "Does the countdown drain my laptop battery?", a: "We utilize optimized requestAnimationFrame hooks rather than heavy DOM manipulations, making our countdown one of the most power-efficient live trackers available on the web." },
            { q: "Can I embed this countdown on my own site?", a: "While we do not offer a direct iFrame embed widget yet, you are free to link directly to any specific holiday page for your users to enjoy the full-screen tracking experience." },
            { q: "Why prioritize millisecond tracking?", a: "For massive events like New Year's Eve, the anticipation in the final 10 seconds is critical. Standard second-by-second timers feel jerky, whereas our high-framerate millisecond display creates a smooth, cinematic tension." },
            { q: "Is Daylight Saving Time calculated into the countdown?", a: "Yes, our universal counting engine automatically factors in any local DST shifts that occur between the current date and the future holiday target date." }
          ]}
        />
        
        <div className="mt-20">
          <AdBanner />
        </div>
      </div>
    </div>
  )
}
