import type { Metadata } from 'next'
import WorldClockClient from '@/components/pages/WorldClockClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Search, Globe, Maximize2, Save, GraduationCap, Briefcase, Dumbbell, Utensils, Timer } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'
import ToolSEO from '@/components/seo/ToolSEO'
export const metadata: Metadata = {
  title: 'World Clock — Current Local Time Worldwide',
  description: 'Track local time in any city worldwide with high precision. Our world clock supports all major timezones and adjusts automatically for daylight savings time.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/world-clock',
  },
  openGraph: {
    title: 'World Clock — Current Local Time Worldwide',
    description: 'Track local time in any city worldwide with high precision. Sync with global atomic time.',
    type: 'website',
  }
}

export default function WorldClockPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global World Clock Dashboard",
    "description": "High-precision world clock synchronized with global atomic time, featuring persistent city tracking and live weather data.",
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
        "name": "How accurate is this world clock?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our world clock is synchronized with global atomic time servers and utilizes high-resolution system performance counters to ensure millisecond accuracy across all timezones."
        }
      },
      {
        "@type": "Question",
        "name": "Does it automatically adjust for Daylight Saving Time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our system uses the latest IANA Time Zone Database to automatically adjust the local time for every city as soon as a DST transition occurs."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my favorite cities?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Any city you add to your dashboard is automatically saved to your browser's local storage and will be ready for you every time you return to the site."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="text-center space-y-4 animate-in fade-in duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            Global Time Synchronization
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-4">
            World <span className="text-primary italic font-serif">Clock</span> Dashboard
          </h1>
          {/* <p className="text-lg text-muted/60 max-w-3xl mx-auto font-medium">
            Monitor real-time clocks across over 7,000 cities with high-precision atomic sync and persistent tracking.
          </p> */}
        </div>
      </div>

      <WorldClockClient />

      <ToolSEO
        toolName="World Clock"
        introTag="Global Time Synchronization"
        introHeading="High-Precision World Clock & Global Tracker for Unmatched Productivity"
        introParagraph="Welcome to the World Clock dashboard on Clocks and Alarms Online. Our high-precision world clock is engineered to deliver millisecond-accurate time synchronization across every corner of the globe. Whether you are managing international teams, trading across markets, or simply keeping in touch with loved ones, our vibrant interface ensures you stay in sync with the world. With support for over 7,000 global cities and automatic Daylight Saving Time (DST) adjustments, you never have to manually calculate a timezone difference again."
        howToSteps={[
          { title: "Search and Add Cities", text: "Use the intelligent search bar above the grid. Type any major city, country, or timezone code (e.g., 'EST') to add it to your persistent dashboard." },
          { title: "Rearrange Your Grid", text: "Though currently auto-sorted by timezone, you can easily view all your active cities at a glance. Remove cities by clicking the trash icon." },
          { title: "Go Full-Screen", text: "Click the expand icon in the corner of any specific clock card. This isolates that specific city's time into a giant, cinematic display mode." },
          { title: "Trust the Auto-Save", text: "Once you build your perfect global dashboard, you are done. Your selected timezones are automatically saved to your local browser storage forever." }
        ]}
        proTips={[
          "Are you a Forex trader? Add the 'New York', 'London', 'Tokyo', and 'Sydney' clocks to your dashboard to perfectly track when global financial markets open and close.",
          "Check the small icons beneath the city name—they give you an instant visual of whether it is currently daytime or nighttime in that specific region.",
          "Keep the dashboard open on a secondary monitor. It serves as an incredibly useful 'Command Center' for remote workers dealing with decentralized teams."
        ]}
        useCases={[
          { icon: Briefcase, title: "For International Business", text: "When scheduling a Zoom call with engineers in India, sales in New York, and management in London, checking the world clock prevents scheduling meetings at 3 AM for a colleague." },
          { icon: GraduationCap, title: "For Student Travelers", text: "Students studying abroad use the dashboard to know exactly when it's safe to call their parents back home without waking them up in the middle of the night." },
          { icon: Timer, title: "For Forex & Day Traders", text: "Financial markets operate on strict localized hours. Traders rely on our perfectly synced clocks to know exactly when the London or Tokyo session is opening." },
          { icon: Globe, title: "For Remote Teams (Asynchronous Work)", text: "Managing an asynchronous team means respecting local hours. Check the dashboard before pinging a coworker to ensure you aren't interrupting their off-hours." },
          { icon: Utensils, title: "For Coordinating Virtual Events", text: "Planning a global webinar or gaming event? Ensure everyone logs in at the exact same moment by referring to a single source of truth based on Coordinated Universal Time (UTC)." }
        ]}
        whyChooseUs={`When checking global timezones, the number one point of failure is Daylight Saving Time (DST). Generic clocks often fail to account for local DST laws, which differ drastically between the US, Europe, and Asia.
        
        Our World Clock architecture pulls from the official overarching IANA Time Zone Database. This means the second a country changes its DST policy or shifts its clocks forward, our platform accounts for it instantly without you having to lift a finger. Furthermore, we don't demand you create an account to save your dashboard. Everything is stored instantly right in your local browser profile.`}
        troubleshooting={`If a clock displays the wrong time or layout breaks:
        
        1. VPN Interference: If you are using a corporate VPN, your browser's underlying "local timezone" might be overridden, causing the primary clock to display the VPN server's location instead of yours.
        2. OS Clock De-sync: Our system calculates global time relative to your computer's internal clock. If your Windows or Mac clock is set incorrectly, ALL world clocks will shift. Turn on "Set Time Automatically" in your OS settings.
        3. Cache Issues: If a city disappears, your browser may have cleared its LocalStorage. Unfortunately, you must re-add the cities if you clear your browsing data.`}
        faqs={[
          { q: "What is UTC and why is it important?", a: "Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks. Our system uses UTC under the hood to ensure perfect mathematical synchronization between different regions." },
          { q: "Does it automatically adjust for Daylight Saving Time?", a: "Yes. Our system uses the latest IANA Time Zone Database to automatically adjust the local time for every city as soon as a local DST transition occurs legally." },
          { q: "Can I save my favorite cities?", a: "Absolutely. Any city you add to your dashboard is automatically saved to your browser's local storage and will be retained indefinitely unless you manually delete your cache." },
          { q: "Is there a limit to how many clocks I can add?", a: "There is no hard limit! You can add 50 cities if you like. The CSS grid will dynamically expand to house as many timezones as you require for large-scale coordination." },
          { q: "How accurately does it pull weather data?", a: "Currently, our primary focus is millisecond time precision. We are integrating live weather conditions soon to display temperatures next to the localized times!" },
          { q: "Can I use the world clock for meeting planning?", a: "Yes, though this dashboard is best for real-time tracking. We also offer a dedicated 'Meeting Planner' tool explicitly tailored for finding overlapping business hours." },
          { q: "How do I delete a clock I no longer need?", a: "Hover over the clock card (or tap it on mobile) and a small 'X' or Trash icon will appear. Clicking it instantly removes the zone from your dashboard." },
          { q: "Does the World Clock drain my battery?", a: "No. Unlike some complex animated tools, our world clock utilizes optimized React renders that update text nodes without heavy graphical repaints, preserving laptop battery life." }
        ]}
      />
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
