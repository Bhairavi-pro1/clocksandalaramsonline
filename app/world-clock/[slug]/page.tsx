import CityClockDisplay from '@/components/tools/CityClockDisplay'
import DstTrackerClient from '@/components/pages/DstTrackerClient'
import StructuredData from '@/components/seo/StructuredData'
import { Globe, Clock } from 'lucide-react'
import { Metadata } from 'next'
import cityData from '@/data/seo/cities.json'
import { getUpcomingDSTChanges } from '@/lib/dst'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cityData.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = cityData.find(c => c.slug === slug)
  
  return {
    title: city?.title || `Local Time in ${slug.replace(/-/g, ' ')}`,
    description: city?.description || `What time is it in ${slug}? Get local time, weather and sun data.`,
    alternates: {
      canonical: `https://clocksandalarmsonline.com/world-clock/${slug}`,
    }
  }
}

export default async function DynamicCityPage({ params }: Props) {
  const { slug } = await params
  const city = cityData.find(c => c.slug === slug)
  const initialDstChanges = getUpcomingDSTChanges()
  
  if (!city) return <div className="min-h-screen flex items-center justify-center font-black text-2xl">City Not Found</div>

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
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <StructuredData data={schema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <h1 className="text-4xl md:text-5xl font-black text-center mb-16 text-white tracking-tighter animate-in fade-in duration-1000">
        Current Local Time in <span className="text-primary">{city.name}</span>
      </h1>
      
      <CityClockDisplay 
        name={city.name} 
        timezone={city.timezone} 
        lat={city.lat} 
        lon={city.lon} 
      />
      
      <div className="mt-24">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-black text-white uppercase tracking-widest text-primary">Global DST Schedule</h2>
           <p className="text-muted/60 font-bold mt-2 italic">Upcoming clock changes for {city.name} and beyond</p>
        </div>
        <DstTrackerClient initialChanges={initialDstChanges} />
      </div>

      {/* 📖 New How to Use Section for City Page */}
      <section className="mt-32 space-y-16">
        <div className="text-center space-y-4">
           <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary not-italic">Track {city.name} Time</span></h2>
           <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Globe, 
              title: "1. Monitor Seconds", 
              text: `Watch the high-precision digital clock above for real-time local time in ${city.name}, accurate to the millisecond.` 
            },
            { 
              icon: Clock, 
              title: "2. Check DST Info", 
              text: "Scroll to our schedule to see exactly when the next time shift occurs and how it will affect your local time." 
            },
            { 
              icon: Globe, 
              title: "3. Compare Zones", 
              text: "Use the detailed astronomical data to understand sunrise, sunset, and day length relative to your current location." 
            }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-[#1a0b36]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
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
      
      <div className="mt-32 prose prose-invert max-w-none bg-[#1a0b36]/40 p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-8 border-b border-white/5 pb-4">Detailed Insights: Time in {city.name}</h2>
        <div className="text-lg text-muted/80 font-medium leading-relaxed">
          {city.content}
        </div>
      </div>

    </div>
  )
}
