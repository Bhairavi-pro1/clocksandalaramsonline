import type { Metadata } from 'next'
import SportsScheduleClient from '@/components/pages/SportsScheduleClient'
import StructuredData from '@/components/seo/StructuredData'
import ToolSEO from '@/components/seo/ToolSEO'
import AdBanner from '@/components/ui/AdBanner'
import { Trophy, HelpCircle, Briefcase, GraduationCap, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sports Schedule Converter – Global Match Times in Local Time',
  description: 'Track sports match timetables (Football, NBA, Cricket, F1) in any local timezone. Search and select a country to convert start times instantly.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/sports-schedule',
  },
  openGraph: {
    title: 'Sports Schedule Converter – Global Match Times in Local Time',
    description: 'Track sports timetables in any local timezone. Select a country to dynamically shift match times and coordinate viewing schedules.',
    type: 'website',
  }
}

export default function SportsSchedulePage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global Sports Schedule Timezone Converter",
    "description": "Convert upcoming match timetables for Football, NBA, Cricket, and Formula 1 to any country's timezone dynamically with active offset detection.",
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
    "name": "Frequently Asked Questions",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the Sports Schedule Converter work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool fetches upcoming sports events in UTC from official databases like TheSportsDB. It then uses your browser's local timezone (or any country you search and select) to dynamically convert the kickoff times, automatically adjusting for local offsets and Daylight Saving Time (DST)."
        }
      },
      {
        "@type": "Question",
        "name": "Which sports leagues are included in the schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We cover major global sporting events, including the FIFA World Cup 2026 (all 104 matches), English Premier League, NBA Basketball, Formula 1 Grand Prix, and Indian Premier League (IPL) Cricket."
        }
      },
      {
        "@type": "Question",
        "name": "Does the timetable display live scores?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, the timetable displays the precise scheduled kickoff times and the match status (upcoming, live, or finished), but it does not display live real-time scores."
        }
      },
      {
        "@type": "Question",
        "name": "How does this tool handle Daylight Saving Time (DST) changes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DST changes are handled automatically. The tool dynamically maps countries to their active IANA timezone databases (using Luxon), which means the converted match times are always 100% accurate for the specific date of the match, even if the country transitions in or out of DST."
        }
      },
      {
        "@type": "Question",
        "name": "Can I view the sports schedule offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Once loaded, the schedule is saved in your browser's localStorage. You can access, filter, and convert timezones for the matches even if your device is offline."
        }
      },
      {
        "@type": "Question",
        "name": "Is the FIFA World Cup 2026 schedule included?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the complete schedule of all 104 matches for the FIFA World Cup 2026 (from the opening group matches to the final) is built into the converter."
        }
      },
      {
        "@type": "Question",
        "name": "Why is the schedule shown in my local timezone by default?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The tool detects your browser's system timezone automatically when the page loads. This immediately translates all kickoff times to your current local time without requiring any search."
        }
      },
      {
        "@type": "Question",
        "name": "How often is the sports schedule updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The server fetches fresh fixture data from external APIs once a day and updates our Firebase database cache. The client app then pulls these updates in the background on load, updating your local browser storage instantly."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-10 text-white tracking-tighter animate-in fade-in duration-1000">
          Sports <span className="text-primary italic">Schedule</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <SportsScheduleClient />
      </div>

      {/* SEO content guide block */}
      <ToolSEO
        toolName="Sports Schedule Converter"
        introTag="Global Match Time Tracker"
        introHeading="High-Precision Converted Timetables for Football, Basketball, Cricket & Motorsports"
        introParagraph="Welcome to Clocks and Alarms Online, your premier destination for high-precision timekeeping tools. Our Sports Schedule page is custom built to bridge the gap between global sport fixtures and your local schedule. Never miss another match of the Premier League, NBA Finals, Indian Premier League, or Formula 1 Grand Prix. By default, matches are displayed in your home timezone. Simply search for a country and select it, and the entire schedule translates to that country's local time instantly. Perfect for international fans, coordinators, and sports bettors."
        howToSteps={[
          { title: "Review Upcoming Matches", text: "Look through the schedule board. Football, Basketball, Cricket, and F1 events are organized chronologically with default system times." },
          { title: "Search and Select Country", text: "Use the search dropdown to find any country. Our database maps the search query to its respective primary IANA timezone." },
          { title: "View Converted Times", text: "Watch all timetable cards convert start times dynamically. Review the target country's active offset and current clock." },
          { title: "Set Alerts and Reminders", text: "Click the alarm icon on any match card to trigger a reminder, keeping you synced with the action." }
        ]}
        proTips={[
          "Toggle the 'My Local Time' chip to quickly reset all card timestamps back to your current system timezone.",
          "Our system runs background revalidation. If matches are updated on the server, the client updates dynamically and caches it to localStorage for immediate offline loading.",
          "Pin the Sports Schedule tab during busy match-weeks (like Champions League or Grand Prix weekends) to track multiple kickoff times seamlessly."
        ]}
        useCases={[
          { icon: GraduationCap, title: "For Global Sports Supporters", text: "Follow your favorite team from abroad. Keep track of early morning or late night kickoff times adjusted for your exact timezone." },
          { icon: Briefcase, title: "For Publishers & Broadcasters", text: "Verify event starting times across several regions. Create localized announcements for international channels with zero-drift accuracy." },
          { icon: Bell, title: "For Fantasy Managers & Bettors", text: "Confirm lineup deadlines and odds locking intervals. Ensure your roster changes are submitted before match lock times, in any time zone." }
        ]}
        whyChooseUs="Our Sports Schedule Converter is engineered using Luxon, the industry standard for precise timezone computation. Rather than hardcoding fixed time offsets (which fail during daylight saving transitions), our tool dynamically maps countries to active IANA records. This ensures absolute precision year-round. Additionally, the caching system limits API calls, delivering a high-speed, glassmorphic layout that is visually stunning and friendly to data usage."
        troubleshooting="If you notice discrepancies or formatting errors:
        
        1. Device Synchronization: Verify that your computer or smartphone's clock is synced with atomic network time.
        2. JavaScript Settings: Ensure JavaScript is enabled, as calculations are computed client-side for privacy and speed.
        3. Clear Cache: If schedule lists look outdated, hard refresh the browser to fetch the latest server-side database snapshot."
        faqs={[
          { q: "How does the Sports Schedule Converter work?", a: "Our tool fetches upcoming sports events in UTC from official databases like TheSportsDB. It then uses your browser's local timezone (or any country you search and select) to dynamically convert the kickoff times, automatically adjusting for local offsets and Daylight Saving Time (DST)." },
          { q: "Which sports leagues are included in the schedule?", a: "We cover major global sporting events, including the FIFA World Cup 2026 (all 104 matches), English Premier League, NBA Basketball, Formula 1 Grand Prix, and Indian Premier League (IPL) Cricket." },
          { q: "Does the timetable display live scores?", a: "No, the timetable displays the precise scheduled kickoff times and the match status (upcoming, live, or finished), but it does not display live real-time scores." },
          { q: "How does this tool handle Daylight Saving Time (DST) changes?", a: "DST changes are handled automatically. The tool dynamically maps countries to their active IANA timezone databases (using Luxon), which means the converted match times are always 100% accurate for the specific date of the match, even if the country transitions in or out of DST." },
          { q: "Can I view the sports schedule offline?", a: "Yes. Once loaded, the schedule is saved in your browser's localStorage. You can access, filter, and convert timezones for the matches even if your device is offline." },
          { q: "Is the FIFA World Cup 2026 schedule included?", a: "Yes, the complete schedule of all 104 matches for the FIFA World Cup 2026 (from the opening group matches to the final) is built into the converter." },
          { q: "Why is the schedule shown in my local timezone by default?", a: "The tool detects your browser's system timezone automatically when the page loads. This immediately translates all kickoff times to your current local time without requiring any search." },
          { q: "How often is the sports schedule updated?", a: "The server fetches fresh fixture data from external APIs once a day and updates our Firebase database cache. The client app then pulls these updates in the background on load, updating your local browser storage instantly." }
        ]}
      />

      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
