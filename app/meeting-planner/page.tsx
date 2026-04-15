import MeetingPlanner from '@/components/tools/MeetingPlanner'
import StructuredData from '@/components/seo/StructuredData'
import { Calendar, MapPin, Clock, Globe, LayoutGrid, CalendarCheck, HelpCircle, GraduationCap, Briefcase, Dumbbell, Utensils, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'
import { Metadata } from 'next'
import ToolSEO from '@/components/seo/ToolSEO'

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
          
          {/* ToolSEO Replacement */}
          <ToolSEO
            toolName="Global Meeting Planner"
            introTag="Strategic Global Coordination"
            introHeading="Optimize Your International Meetings with Our High-Precision Planner"
            introParagraph="In today's infinitely interconnected remote world, synchronizing a team across continents is more than just a logistical convenience—it is an absolute business necessity. Our Global Meeting Planner is meticulously engineered to take the painful guesswork out of international scheduling by automatically identifying the perfect 'Window of Cooperation'. It stops you from accidentally waking up an engineer in Tokyo at 3 AM or interrupting a designer in London during their Sunday dinner."
            howToSteps={[
              { title: "Select the Origin Date", text: "Start by picking the specific date for your proposed global session. This is critical because our engine must calculate the precise Daylight Saving Time rules for that exact day." },
              { title: "Define a Local Window", text: "Select your preferred meeting start time and duration in YOUR local time using the precision slider." },
              { title: "Layer Target Destinations", text: "Search and add an unlimited number of international cities where your team members reside. Watch as the grid automatically populates below." },
              { title: "Export to Google Calendar", text: "Once you find a green 'Working Hours' column for all participants, click the 'Schedule Meeting' button to instantly generate a calendar invite pre-filled in UTC." }
            ]}
            proTips={[
              "Don't just use this for tomorrow! If you are planning a massive global rollout 6 months from now, select that exact future date to ensure you aren't caught off guard by off-season clock changes.",
              "If you simply cannot find a time where everyone is in green 'Working Hours', aim for the light blue 'Normal Hours' for your most senior team members.",
              "Never manually calculate UTC yourself. Use the Export button to let the Google Calendar API handle the backend timezone geometry."
            ]}
            useCases={[
              { icon: Briefcase, title: "For Distributed Startups", text: "A startup founder in San Francisco uses the planner to find the single 1-hour window per week where their developers in Ukraine and their marketing team in Australia are all awake simultaneously." },
              { icon: Globe, title: "For International Sales", text: "Enterprise sales executives use the planner to respect their high-value clients' local business hours, ensuring a pitch meeting isn't accidentally scheduled during a European bank holiday." },
              { icon: GraduationCap, title: "For Global Education", text: "Universities offering massive open online courses (MOOCs) use the tool to schedule live Q&A sessions that overlap with the waking hours of the majority of their international student body." },
              { icon: Timer, title: "For Esports Tournaments", text: "Tournament organizers rely on the visual grid to schedule international matches at times that are reasonable for both the competing players and the global broadcast audience." },
              { icon: CalendarCheck, title: "For Family Reunions", text: "Coordinating a massive Zoom call for the holidays with family spread across five different timezones? The planner makes finding that golden hour effortless." }
            ]}
            whyChooseUs={`Generic calendar apps often require you to manually \"overlay\" calendars one by one, and they rarely offer a top-down, color-coded visual matrix of exactly who is sleeping and who is working.

            Clocks and Alarms Online uses a custom-built React engine to instantly render a visual heatmap of global availability. The Emerald Green indicates prime working hours, Indigo signifies normal waking hours, and Crimson Red clearly marks when someone is likely asleep. Combined with our deep integration with the IANA timezone database to automatically calculate future DST shifts, there is no faster way to schedule a truly global event.`}
            troubleshooting={`Finding errors or conflicting times?
            
            1. DST Traps: If a future meeting appears to be exactly 1 hour "off" from your usual weekly sync, you have likely crossed a Daylight Saving Time boundary for one of the target countries. Our planner correctly calculated the shift; your usual time is actually broken.
            2. Origin Sync: Ensure your web browser is allowed to access your system's timezone. If your computer thinks it is in UTC instead of EST, your origin slider will be severely offset.
            3. The "Impossible" Meeting: If you are trying to sync California, Central Europe, and Japan, the entire grid may be red. This is not a bug—there is simply no mathematical hour where all three regions are in standard 9-5 working hours simultaneously.`}
            faqs={[
              { q: "How does the meeting planner handle daylight saving time?", a: "Our meeting planner dynamically accounts for daylight saving time (DST) transitions based on the exact calendar date selected. It uses the IANA database to ensure the time offset is flawless for that specific upcoming day." },
              { q: "Can I add more than two timezones?", a: "Yes, you can add an unlimited number of target timezones to the matrix grid. This is explicitly designed for massive global organizations spread across several continents." },
              { q: "What do the colors on the grid mean?", a: "The planner uses highly intuitive color-coding: Emerald Green represents standard working hours (9 AM - 5 PM), Indigo represents standard waking hours, and Crimson Red represents night/sleep hours." },
              { q: "Is there an export feature?", a: "Absolutely. Once you highlight the perfect timeslot, click the 'Schedule Meeting' button to instantly open a Google Calendar event page with the correct UTC time conversions completely pre-configured." },
              { q: "Does the tool work for calculating past events?", a: "Yes. Our timezone database contains deep historical records. If you need to verify what time an event occurred globally three years ago, simply select that past date." },
              { q: "Does this require an account to use?", a: "No! Unlike corporate scheduling tools, our Global Meeting Planner is completely free, does not require an account, and instantly saves your selected cities to your local browser storage." },
              { q: "What if local working hours are not 9-to-5?", a: "Currently, our algorithm uses the global standard 9-5 to render the green blocks, but you can visually scan the specific hours in the grid to manually account for a team member working a night shift." },
              { q: "Does the meeting planner update in real-time?", a: "The grid is a static planning canvas based on the origin time you input. However, the 'Current Local Time' display above each city updates every millisecond to give you instant real-world context." }
            ]}
          />
        </div>
        <div className="mt-20">
          <AdBanner />
        </div>
      </div>

    </div>
  )
}
