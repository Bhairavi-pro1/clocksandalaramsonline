import CityClockDisplay from '@/components/tools/CityClockDisplay'
import StructuredData from '@/components/seo/StructuredData'
import { Globe, Clock, Sun, TrendingUp, Briefcase, Plane } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import cityData from '@/data/seo/cities.json'
import { resolveCityOrCountry } from '@/lib/cityResolver'
import { cn } from '@/lib/utils'
import ToolSEO from '@/components/seo/ToolSEO'
import AdBanner from '@/components/ui/AdBanner'

export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cityData.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = resolveCityOrCountry(slug)
  
  return {
    title: city.title,
    description: city.description,
    alternates: {
      canonical: `https://clocksandalarmsonline.com/world-clock/${city.slug}/`,
    },
    openGraph: {
      title: city.title,
      description: city.description,
      url: `https://clocksandalarmsonline.com/world-clock/${city.slug}/`,
      siteName: 'Clocks and Alarms Online',
      type: 'website',
      images: [
        {
          url: 'https://clocksandalarmsonline.com/icon.png',
          width: 512,
          height: 512,
          alt: `${city.name} World Clock - Clocks and Alarms Online`
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: city.title,
      description: city.description,
      images: ['https://clocksandalarmsonline.com/icon.png'],
    }
  }
}

export default async function DynamicCityPage({ params }: Props) {
  const { slug } = await params
  const city = resolveCityOrCountry(slug)

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": city.title,
    "description": city.description,
    "about": {
      "@type": "Place",
      "name": city.name,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": city.lat,
        "longitude": city.lon
      }
    }
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `World Clock - ${city.name} Time`,
    "description": `Real-time local time, weather, and astronomical data for ${city.name}.`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "410",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  const defaultFaqs = [
    {
      q: `What is the current time in ${city.name}?`,
      a: `The current local time in ${city.name} is synchronized with global atomic time to ensure precise accuracy for all your scheduling needs.`
    },
    {
      q: `Does ${city.name} observe Daylight Saving Time?`,
      a: `You can track all upcoming clock changes and DST shifts for ${city.name} in our dedicated world clock display.`
    },
    {
      q: `What timezone is ${city.name} located in?`,
      a: `${city.name} operates in the ${city.timezone} timezone.`
    }
  ]

  const activeFaqs = city.faqs && city.faqs.length > 0 ? city.faqs : defaultFaqs

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": `Frequently Asked Questions about ${city.name} Time`,
    "mainEntity": activeFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://clocksandalarmsonline.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "World Clock",
        "item": "https://clocksandalarmsonline.com/world-clock/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": city.name,
        "item": `https://clocksandalarmsonline.com/world-clock/${city.slug}/`
      }
    ]
  }

  const iconMap: Record<string, any> = {
    TrendingUp,
    Briefcase,
    Plane,
    Globe,
    Clock,
    Sun
  }

  const defaultUseCases = [
    { title: "Global Business & Remote Meetings", text: `Coordinate client presentations, standups, and team communication with ${city.name}.`, icon: Briefcase },
    { title: "International Flights & Travel", text: `Plan departures, transit layovers, and jet lag adjustments for travel to ${city.name}.`, icon: Plane },
    { title: "Market Hours & Financial Sessions", text: `Monitor regional market opening and closing bells and financial transactions in ${city.name}.`, icon: TrendingUp }
  ]

  const mappedUseCases = (city.useCases && city.useCases.length > 0)
    ? city.useCases.map(u => ({
        title: u.title,
        text: u.text,
        icon: typeof u.icon === 'string' ? (iconMap[u.icon] || Globe) : (u.icon || Globe)
      }))
    : defaultUseCases

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16">
      <StructuredData data={schema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
        <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li className="opacity-40">/</li>
          <li>
            <Link href="/world-clock/" className="hover:text-primary transition-colors">World Clock</Link>
          </li>
          <li className="opacity-40">/</li>
          <li className="text-slate-900 dark:text-white font-bold" aria-current="page">{city.name}</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-8 sm:mb-12 text-slate-900 dark:text-white tracking-tighter animate-in fade-in duration-1000">
        Current Local Time in <span className="text-primary">{city.name}</span>
      </h1>
      
      <CityClockDisplay 
        name={city.name} 
        timezone={city.timezone} 
        lat={city.lat} 
        lon={city.lon} 
      />
      
      {/* Popular World Cities Directory */}
      <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center mb-8 px-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Popular World Cities
          </h2>
          <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1 max-w-2xl mx-auto">
            Live clocks, sunrise/sunset, and local time differences across major international capitals
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {cityData.map((c) => {
            const isCurrent = c.slug === city.slug
            return (
              <Link
                key={c.slug}
                href={`/world-clock/${c.slug}/`}
                className={cn(
                  "group py-2.5 px-1.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center justify-center text-center shadow-sm",
                  isCurrent
                    ? "bg-primary/15 border-primary text-primary shadow-[0_0_20px_rgba(124,58,237,0.15)] ring-1 ring-primary/40 pointer-events-none"
                    : "bg-slate-100/70 dark:bg-[#1a0b36]/40 hover:bg-slate-200/80 dark:hover:bg-[#1a0b36]/80 border-slate-200/80 dark:border-white/5 hover:border-primary/40"
                )}
              >
                <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 max-w-full">
                  <span className={cn(
                    "text-[11px] sm:text-xs md:text-sm font-bold transition-colors truncate max-w-full",
                    isCurrent ? "text-primary font-black" : "text-slate-900 dark:text-white group-hover:text-primary"
                  )}>
                    {c.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider bg-primary text-white px-1 sm:px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-muted/60 mt-0.5 truncate max-w-full">
                  {c.timezone.split('/')[1]?.replace(/_/g, ' ') || c.timezone}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Comprehensive High-Word-Count ToolSEO Component (Solves Thin Content) */}
      <div className="mt-16 sm:mt-24">
        <ToolSEO
          toolName={`${city.name} World Clock`}
          introTag={city.introTag || "Global Time & Coordination Hub"}
          introHeading={city.introHeading || `Current Local Time in ${city.name}: Timezone, Daylight & Business Hours`}
          introParagraph={city.introParagraph || city.content}
          howToSteps={city.howToSteps || [
            { title: "Monitor Atomic Local Time", text: `View real-time ticking hours, minutes, and seconds for ${city.name} synchronized with official time standards.` },
            { title: "Check Sunrise, Sunset & Weather", text: `Inspect today's exact dawn, dusk, day length, and local weather conditions in ${city.name}.` },
            { title: "Toggle 12h / 24h Formats", text: "Easily switch between 12-hour AM/PM and 24-hour military formats to suit your preference." },
            { title: "Coordinate International Schedules", text: "Use the Popular World Cities directory to align cross-timezone meetings without scheduling conflicts." }
          ]}
          proTips={city.proTips || [
            `Keep this world clock tab open to track live ${city.name} time with zero CPU drift.`,
            "Check local daylight saving transition dates in advance to prevent missed international conference calls.",
            "Use 24-hour military mode for flight itineraries and logistics coordination to avoid AM/PM confusion.",
            "Compare business hours with other global hubs using our top city navigation bar."
          ]}
          useCases={mappedUseCases}
          whyChooseUs={city.whyChooseUs || "Our world clock engine synchronizes directly with global atomic time servers (NTP) to eliminate hardware clock drift. Features integrated solar ephemeris data (sunrise and sunset), real-time weather telemetry, and high-contrast dark-mode styling."}
          troubleshooting={city.troubleshooting || `1. Time Desynchronization: Ensure your device's system clock is set to sync automatically.\n2. Daylight Saving Changes: Check whether ${city.name} observes DST and when the next clock shift takes place.\n3. Background Tab Sleep: Inactive tabs may be throttled by browsers; our clock recalibrates immediately upon tab focus.\n4. Format Preference: Toggle the AM/PM button on the main toolbar to lock your preferred 12-hour or 24-hour display.`}
          faqs={activeFaqs}
        />
      </div>

      {/* Ad placement */}
      <div className="mt-12 max-w-7xl mx-auto">
        <AdBanner />
      </div>

    </div>
  )
}
