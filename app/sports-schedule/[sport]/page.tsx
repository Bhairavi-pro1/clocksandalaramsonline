import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SportsScheduleClient from '@/components/pages/SportsScheduleClient'
import StructuredData from '@/components/seo/StructuredData'
import ToolSEO from '@/components/seo/ToolSEO'
import AdBanner from '@/components/ui/AdBanner'
import { Trophy, HelpCircle, Briefcase, GraduationCap, Bell } from 'lucide-react'
import { getSportsMatches, generateSportsScheduleSchema, getSportFromSlug, SportMatch } from '@/lib/sports'

interface Props {
  params: Promise<{ sport: string }>
}

const SPORT_META = {
  'fifa-worldcup-2026': {
    title: 'FIFA World Cup 2026 Schedule & Kickoff Time Converter',
    description: 'Track the complete FIFA World Cup 2026 match schedule and convert kickoff times dynamically to your local timezone. Set match alerts and reminders.',
    keywords: ['FIFA World Cup 2026', 'World Cup schedule', 'World Cup kickoff times', 'match timezone converter', 'FIFA World Cup timezone conversion']
  },
  'football': {
    title: 'Club Football Schedule & Kickoff Time Converter',
    description: 'Convert Premier League, La Liga, Bundesliga, and Champions League football match kickoff times to any timezone instantly.',
    keywords: ['football schedule', 'soccer kickoff times', 'Premier League converter', 'Champions League schedule', 'local football times']
  },
  'basketball': {
    title: 'Basketball Match Schedule & Timezone Converter',
    description: 'Track NBA and international basketball game timetables in your local timezone. Never miss a game with precise timezone offsets.',
    keywords: ['NBA schedule', 'basketball kickoff times', 'Lakers vs Celtics local time', 'basketball timezone converter', 'game time conversion']
  },
  'cricket': {
    title: 'Cricket Match Timetable & Local Time Converter',
    description: 'Convert IPL and international cricket match start times to any country timezone. Active DST tracking for all fixtures.',
    keywords: ['cricket schedule', 'IPL start times', 'cricket timezone converter', 'India vs Australia local time', 'cricket match converter']
  },
  'tennis': {
    title: 'Tennis Tournament Schedule & Match Time Converter',
    description: 'Convert Wimbledon, US Open, and ATP finals tennis match schedules to your local timezone dynamically.',
    keywords: ['tennis schedule', 'Wimbledon kickoff times', 'tennis timezone converter', 'Alcaraz vs Sinner local time']
  },
  'formula1': {
    title: 'Formula 1 Grand Prix Schedule & Race Time Converter',
    description: 'Track Monaco Grand Prix, Monza, and other Formula 1 race times in any local timezone. Includes practice, qualifying, and race schedules.',
    keywords: ['F1 schedule', 'Formula 1 start times', 'Grand Prix timezone converter', 'Monaco Grand Prix local time', 'F1 race converter']
  }
}

const SPORT_NAMES: Record<Exclude<SportMatch['sport'], 'sports'>, string> = {
  'football-fifa': 'FIFA World Cup 2026',
  football: 'Club Football',
  basketball: 'Basketball',
  cricket: 'Cricket',
  tennis: 'Tennis',
  formula1: 'Formula 1'
}

export async function generateStaticParams() {
  return [
    { sport: 'fifa-worldcup-2026' },
    { sport: 'football' },
    { sport: 'basketball' },
    { sport: 'cricket' },
    { sport: 'tennis' },
    { sport: 'formula1' }
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport } = await params
  const meta = SPORT_META[sport as keyof typeof SPORT_META]
  if (!meta) return {}

  const title = `${meta.title} – Global Match Times in Local Time`
  const description = meta.description
  const canonical = `https://clocksandalarmsonline.com/sports-schedule/${sport}`

  return {
    title,
    description,
    keywords: meta.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    }
  }
}

export default async function SportSchedulePage({ params }: Props) {
  const { sport } = await params
  const category = getSportFromSlug(sport)
  const meta = SPORT_META[sport as keyof typeof SPORT_META]
  
  if (!category || !meta) {
    notFound()
  }

  const matches = await getSportsMatches()
  const filteredMatches = matches.filter(m => m.sport === category)
  const listSchema = generateSportsScheduleSchema(filteredMatches)

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `Global ${SPORT_NAMES[category]} Timezone Converter`,
    "description": meta.description,
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
        "name": `How does the ${SPORT_NAMES[category]} Schedule Converter work?`,
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
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      <StructuredData data={listSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-10 text-white tracking-tighter animate-in fade-in duration-1000">
          {sport === 'fifa-worldcup-2026' ? 'FIFA World Cup 2026' : SPORT_NAMES[category]} <span className="text-primary italic">Schedule</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <SportsScheduleClient initialMatches={matches} initialCategory={category} />
      </div>

      {/* SEO content guide block */}
      <ToolSEO
        toolName={`${SPORT_NAMES[category]} Schedule Converter`}
        introTag="Global Match Time Tracker"
        introHeading={`High-Precision Converted Timetables for ${SPORT_NAMES[category]} Events`}
        introParagraph={`Welcome to Clocks and Alarms Online, your premier destination for high-precision timekeeping tools. Our ${SPORT_NAMES[category]} Schedule page is custom built to bridge the gap between global sport fixtures and your local schedule. Never miss another match. By default, matches are displayed in your home timezone. Simply search for a country and select it, and the entire schedule translates to that country's local time instantly. Perfect for international fans, coordinators, and sports bettors.`}
        howToSteps={[
          { title: "Review Upcoming Matches", text: "Look through the schedule board. Events are organized chronologically with default system times." },
          { title: "Search and Select Country", text: "Use the search dropdown to find any country. Our database maps the search query to its respective primary IANA timezone." },
          { title: "View Converted Times", text: "Watch all timetable cards convert start times dynamically. Review the target country's active offset and current clock." },
          { title: "Set Alerts and Reminders", text: "Click the alarm icon on any match card to trigger a reminder, keeping you synced with the action." }
        ]}
        proTips={[
          "Toggle the 'My Local Time' chip to quickly reset all card timestamps back to your current system timezone.",
          "Our system runs background revalidation. If matches are updated on the server, the client updates dynamically and caches it to localStorage for immediate offline loading.",
          "Pin this schedule tab during busy match-weeks to track multiple kickoff times seamlessly."
        ]}
        useCases={[
          { icon: GraduationCap, title: "For Global Sports Supporters", text: "Follow your favorite team from abroad. Keep track of early morning or late night kickoff times adjusted for your exact timezone." },
          { icon: Briefcase, title: "For Publishers & Broadcasters", text: "Verify event starting times across several regions. Create localized announcements for international channels with zero-drift accuracy." },
          { icon: Bell, title: "For Fantasy Managers & Bettors", text: "Confirm lineup deadlines and odds locking intervals. Ensure your roster changes are submitted before match lock times, in any time zone." }
        ]}
        whyChooseUs={`Our ${SPORT_NAMES[category]} Schedule Converter is engineered using Luxon, the industry standard for precise timezone computation. Rather than hardcoding fixed time offsets (which fail during daylight saving transitions), our tool dynamically maps countries to active IANA records. This ensures absolute precision year-round. Additionally, the caching system limits API calls, delivering a high-speed, glassmorphic layout that is visually stunning and friendly to data usage.`}
        troubleshooting="If you notice discrepancies or formatting errors:
        
        1. Device Synchronization: Verify that your computer or smartphone's clock is synced with atomic network time.
        2. JavaScript Settings: Ensure JavaScript is enabled, as calculations are computed client-side for privacy and speed.
        3. Clear Cache: If schedule lists look outdated, hard refresh the browser to fetch the latest server-side database snapshot."
        faqs={[
          { q: `How does the ${SPORT_NAMES[category]} Schedule Converter work?`, a: "Our tool fetches upcoming sports events in UTC from official databases like TheSportsDB. It then uses your browser's local timezone (or any country you search and select) to dynamically convert the kickoff times, automatically adjusting for local offsets and Daylight Saving Time (DST)." },
          { q: "Which sports leagues are included in the schedule?", a: "We cover major global sporting events, including the FIFA World Cup 2026 (all 104 matches), English Premier League, NBA Basketball, Formula 1 Grand Prix, and Indian Premier League (IPL) Cricket." },
          { q: "Does the timetable display live scores?", a: "No, the timetable displays the precise scheduled kickoff times and the match status (upcoming, live, or finished), but it does not display live real-time scores." },
          { q: "How does this tool handle Daylight Saving Time (DST) changes?", a: "DST changes are handled automatically. The tool dynamically maps countries to their active IANA timezone databases (using Luxon), which means the converted match times are always 100% accurate for the specific date of the match, even if the country transitions in or out of DST." },
          { q: "Can I view the sports schedule offline?", a: "Yes. Once loaded, the schedule is saved in your browser's localStorage. You can access, filter, and convert timezones for the matches even if your device is offline." },
          { q: "Is the FIFA World Cup 2026 schedule included?", a: "Yes, the complete schedule of all 104 matches for the FIFA World Cup 2026 (from the opening group matches to the final) is built into the converter." }
        ]}
      />

      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
