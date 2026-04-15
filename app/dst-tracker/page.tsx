import DstTrackerClient from '@/components/pages/DstTrackerClient'
import { Metadata } from 'next'
import { List, Search, Clock, Zap, CalendarDays, HelpCircle, GraduationCap, Briefcase, Dumbbell, Utensils, Timer, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'
import { getUpcomingDSTChanges } from '@/lib/dst'
import StructuredData from '@/components/seo/StructuredData'
import ToolSEO from '@/components/seo/ToolSEO'

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

      {/* Content Outside the Main Card via ToolSEO */}
      <div className="mt-32">
        <ToolSEO
          toolName="Global DST Tracker"
          introTag="Master Time Transitions"
          introHeading="Master Daylight Saving Transitions with Our Real-Time Global Tracker"
          introParagraph="Navigating the complexities of Daylight Saving Time (DST) can be an absolute logistical nightmare, especially when coordinating across multiple continents. Some countries spring forward, others fall back, and many don't change at all. Our Global DST Tracker is designed to cut through the confusion, providing you with a definitive, chronological timeline of every upcoming clock change worldwide with unparalleled precision."
          howToSteps={[
            { title: "Browse the Chronological Grid", text: "Scroll through the master list of upcoming transitions. We automatically sort them by proximity so the most urgent changes are always at the top." },
            { title: "Search Specific Regions", text: "Don't care about Europe? Use our intelligent filter bar to instantly locate specific countries like 'Australia' or 'United States'." },
            { title: "Verify the Shift Direction", text: "Look closely at the transition tags. A 'Spring Forward' (+1h) means you lose an hour of sleep, while 'Fall Back' (-1h) means you gain one." },
            { title: "Check the Countdowns", text: "Use the 'Days Remaining' countdown embedded in every card to prepare your personal or professional schedule ahead of the actual transition night." }
          ]}
          proTips={[
            "During 'Fall Back' weekends, double-check that your analog wall clocks are manually adjusted before going to bed on Saturday night.",
            "If you work internationally, bookmark this page in late October/early November, as this is the period of highest global transition volatility.",
            "Look out for rare anomalies highlighted in our list, such as Lord Howe Island's highly unusual 30-minute DST shift."
          ]}
          useCases={[
            { icon: Briefcase, title: "For Multinational Corporations", text: "HR and operations managers use the DST tracker to inform global teams when the scheduling offset between the New York and London office shifts from 5 hours to 4 hours." },
            { icon: Timer, title: "For Software Engineers", text: "Developers checking cron jobs and server maintenance windows rely on exact transition times to prevent database duplication errors during the 'Fall Back' overlapping hour." },
            { icon: Globe, title: "For Airlines & Logistics", text: "Flight schedules are heavily disrupted by changing timezone offsets. Logistics coordinators use our tracker to ensure flight arrival times are accurately quoted." },
            { icon: GraduationCap, title: "For International Students", text: "Students calling home use the tracker to avoid dialing their parents' house at 4 AM due to a sudden localized clock shift they weren't aware of." },
            { icon: Zap, title: "For Broadcast Media", text: "Live television planners and Twitch streamers use our timeline to guarantee their advertised 'Global Start Time' remains accurate across all viewing regions." }
          ]}
          whyChooseUs={`Generic timezone converters typically fail to provide proactive warnings about impending DST shifts. You only realize the time has changed after you've missed your meeting.
          
          Clocks and Alarms Online operates differently. We continually parse the official IANA Time Zone Database specifically scanning for future transition events. We then format these complex geopolitical algorithms into a beautiful, easy-to-read chronological UI. There is no guessing. You are given the exact date, the exact minute, and the exact mathematical offset of the shift weeks before it happens.`}
          troubleshooting={`Data seems incorrect or missing countries?
          
          1. Changing Legislation: Governments frequently alter DST rules with little warning (e.g., Mexico abolishing DST). Rest assured, our database updates continuously to reflect these geopolitical changes as soon as they are signed into law.
          2. No Shift Displayed: If you search for 'Japan' or 'India' and see no results, it is not a bug! Those countries do not observe Daylight Saving Time, so they logically have zero upcoming transitions.
          3. Browser Caching: If you suspect you are viewing stale transition data from last year, try clearing your browser cache or performing a hard refresh (Ctrl+F5).`}
          faqs={[
            { q: "How accurate is the global DST transition data?", a: "Our tracker uses the IANA Time Zone Database, which is the gold standard for global timezone and DST information. We mathematically calculate every transition to the exact minute." },
            { q: "Why do some countries change clocks at different times?", a: "Daylight saving time is managed by individual national or regional governments, meaning it is not globally synchronized. For example, Europe and North America consistently transition on different weekends." },
            { q: "Does the tracker include rare timezone shifts?", a: "Yes. Our engine detects unique cases like 30-minute DST shifts (e.g., Lord Howe Island) and permanent historical changes to provide real-world, usable data." },
            { q: "How can I prepare for a 'Fall Back' change?", a: "During 'Fall Back', you'll gain an hour. We recommend adjusting any manual clocks before bed and checking our 'Days Remaining' counter to plan your week ahead of time." },
            { q: "Why did my country suddenly disappear from the list?", a: "If your government recently passed legislation to abolish DST (such as adopting permanent standard time), our system immediately stops generating future transition events for your locale." },
            { q: "Does the time of the change (e.g., 2:00 AM) refer to my local time?", a: "No. The transition time listed on the card (e.g., 02:00 -> 03:00) is the exact localized time in that specific country when the shift occurs." },
            { q: "Do the Southern and Northern Hemispheres sync?", a: "Actually, they are inversed! When the Northern Hemisphere 'Springs Forward' into summer, the Southern Hemisphere is typically 'Falling Back' into winter." },
            { q: "Is the DST Tracker free to use?", a: "Yes, our real-time global transition tracker is 100% free with no login or subscription required." }
          ]}
        />
      </div>
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
