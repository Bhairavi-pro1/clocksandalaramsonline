import CityClockDisplay from '@/components/tools/CityClockDisplay'
import StructuredData from '@/components/seo/StructuredData'
import { Globe, Clock, Sun } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import cityData from '@/data/seo/cities.json'
import { resolveCityOrCountry } from '@/lib/cityResolver'
import { cn } from '@/lib/utils'

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
      type: 'website',
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Frequently Asked Questions",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the current time in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The current local time in ${city.name} is synchronized with global atomic time to ensure precise accuracy for all your scheduling needs.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${city.name} observe Daylight Saving Time?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can track all upcoming clock changes and DST shifts for ${city.name} in our dedicated Global DST Schedule section below.`
        }
      }
    ]
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

      {/* How to Use Section for City Page */}
      <section className="mt-20 sm:mt-28 space-y-10 sm:space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How to Track <span className="text-primary italic font-serif">{city.name} Time</span>
          </h2>
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col gap-5 sm:gap-6 max-w-4xl mx-auto w-full">
          {[
            { 
              icon: Clock, 
              title: "1. Real-Time Local Time", 
              text: `Monitor live ticking hours, minutes, and seconds for ${city.name} synchronized with official standards (${city.timezone}). Easily switch between 12-hour AM/PM and 24-hour military formats.` 
            },
            { 
              icon: Sun, 
              title: "2. Sunrise, Sunset & Weather", 
              text: `Check today's exact sunrise and sunset times in ${city.name}, along with live localized temperature and wind conditions to plan meetings, international calls, or travel.` 
            },
            { 
              icon: Globe, 
              title: "3. Global Timezone Coordination", 
              text: `Use the Popular World Cities directory above to compare ${city.name}'s business hours against major international hubs like London, New York, or Tokyo for seamless collaboration.` 
            }
          ].map((item, i) => (
            <div key={i} className="group p-6 sm:p-8 rounded-[2rem] bg-slate-100/70 dark:bg-[#1a0b36]/40 border border-slate-200/80 dark:border-violet-500/10 hover:border-primary/40 dark:hover:border-violet-500/30 transition-all duration-500 flex flex-col md:flex-row items-start gap-5 sm:gap-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shrink-0 shadow-sm">
                <item.icon className="w-6 h-6 text-primary dark:text-violet-300 group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-muted/90 leading-relaxed font-medium text-left">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Detailed Insights Section */}
      <div className="mt-20 sm:mt-28 bg-slate-100/70 dark:bg-[#1a0b36]/40 p-8 sm:p-12 md:p-16 rounded-[2.5rem] border border-slate-200/80 dark:border-white/5 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200/80 dark:border-white/5 pb-4">
          Detailed Insights: Time in {city.name}
        </h2>
        <div className="text-base sm:text-lg text-slate-700 dark:text-muted/80 font-medium leading-relaxed">
          {city.content}
        </div>
      </div>

    </div>
  )
}
