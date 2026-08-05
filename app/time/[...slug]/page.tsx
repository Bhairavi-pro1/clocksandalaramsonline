import CityClockDisplay from '@/components/tools/CityClockDisplay'
import ToolSEO from '@/components/seo/ToolSEO'
import StructuredData from '@/components/seo/StructuredData'
import { Briefcase, Users, Zap } from 'lucide-react'
import * as cityTimezones from 'city-timezones'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ timezone?: string }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params
  
  // Extract city slug from the route params (e.g., /time/usa/new-york/... -> new-york)
  const citySlug = resolvedParams.slug.length >= 2 ? resolvedParams.slug[1] : resolvedParams.slug[0]
  const cityName = citySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return {
    title: `Current Local Time in ${cityName}`,
    description: `Exact current time in ${cityName}. Free online world clock with weather and timezone information.`,
  }
}

export default async function DynamicTimePage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const { timezone } = await searchParams
  
  const citySlug = resolvedParams.slug.length >= 2 ? resolvedParams.slug[1] : resolvedParams.slug[0]
  const cityName = citySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  
  const tz = timezone || 'UTC'
  
  // Find lat/lon from city-timezones for the weather and sun calculation
  let lat = 0
  let lon = 0
  
  const cityMatches = cityTimezones.cityMapping.filter(c => 
    c.timezone === tz || c.city.toLowerCase() === cityName.toLowerCase()
  )
  
  if (cityMatches && cityMatches.length > 0) {
    // Prioritize exact city name match within the timezone matches
    const exactMatch = cityMatches.find(c => c.city.toLowerCase() === cityName.toLowerCase() && c.timezone === tz)
    const match = exactMatch || cityMatches[0]
    lat = match.lat
    lon = match.lng
  }
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Current Local Time in ${cityName}`,
    "description": `Exact current time in ${cityName}. Free online world clock with weather and timezone information.`,
    "about": {
      "@type": "Place",
      "name": cityName,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": lat,
        "longitude": lon
      }
    }
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `World Clock - ${cityName} Time`,
    "description": `Real-time local time, weather, and astronomical data for ${cityName}.`,
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
        "name": `What is the current time in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The current local time in ${cityName} is synchronized with global atomic time to ensure precise accuracy for all your scheduling needs.`
        }
      },
      {
        "@type": "Question",
        "name": `Which timezone does ${cityName} use?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cityName} currently operates in the ${tz} timezone. You can check the digital clock above for the exact time.`
        }
      }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 md:py-20">
      <StructuredData data={schema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-center mb-6 sm:mb-12 md:mb-16 text-white tracking-tighter animate-in fade-in duration-1000">
        Current Local Time in <span className="text-primary">{cityName}</span>
      </h1>
      
      <CityClockDisplay 
        name={cityName} 
        timezone={tz} 
        lat={lat} 
        lon={lon} 
      />
      
      <ToolSEO 
        toolName={`${cityName} Time Tracker`}
        introTag="GLOBAL TIMEZONE"
        introHeading={`Stay Synchronized with ${cityName}`}
        introParagraph={`The current local time in ${cityName} is determined by the ${tz} timezone. This page provides real-time, synchronized local time for ${cityName}, ensuring you are always on schedule. Our precise atomic clock synchronization guarantees millisecond accuracy for the local time in ${cityName}. \n\nIn addition to the exact time, we also provide the current weather conditions and astronomical data. Weather and astronomical data is provided courtesy of the Meteorological Institute of Norway (MET Norway) and NRK.`}
        howToSteps={[
          { title: "Monitor Seconds", text: `Watch the high-precision digital clock above for real-time local time in ${cityName}, accurate to the millisecond.` },
          { title: "Check Timezone Info", text: `Verify the current timezone (${tz}) and see how it affects your local time scheduling and meetings.` },
          { title: "Compare Zones", text: "Use the detailed astronomical data to understand sunrise, sunset, and day length relative to your current location." },
          { title: "Track Weather", text: "Keep an eye on real-time temperature and windspeed data alongside the time." }
        ]}
        proTips={[
          `Bookmark this page to instantly check the time in ${cityName} before calling clients or family.`,
          `Use the sunrise and sunset times to plan optimal outdoor activities or understand daylight availability in ${cityName}.`
        ]}
        useCases={[
          { title: "International Meetings", text: `Schedule meetings with colleagues in ${cityName} without any timezone confusion.`, icon: Briefcase },
          { title: "Travel Planning", text: `Adapt to the ${cityName} timezone before you travel to help mitigate jet lag.`, icon: Users },
          { title: "Global Coordination", text: `Ensure your global operations run smoothly by tracking ${cityName}'s exact local time.`, icon: Zap }
        ]}
        whyChooseUs={`Our platform uses globally synchronized atomic clocks to ensure that the time displayed for ${cityName} is accurate down to the millisecond. Combined with real-time weather and astronomical data from MET Norway, we provide a complete, reliable dashboard for any location worldwide.`}
        troubleshooting="If the time appears incorrect, ensure your device's system clock is synchronized with a time server. The weather data relies on an external API and may occasionally take a few seconds to load or be temporarily unavailable during high traffic."
        faqs={[
          { q: `What is the current time in ${cityName}?`, a: `The current local time is synchronized with global atomic time to ensure precise accuracy. Please refer to the digital clock at the top of the page for the exact time.` },
          { q: `Which timezone does ${cityName} use?`, a: `${cityName} currently operates in the ${tz} timezone. This timezone dictates the local time and daylight saving adjustments.` },
          { q: `Where does the weather data come from?`, a: `The current weather conditions and astronomical data are provided by the Meteorological Institute of Norway (MET Norway) and NRK via their Weather API.` }
        ]}
      />
    </div>
  )
}
