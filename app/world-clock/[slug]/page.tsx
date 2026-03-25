import CityClockDisplay from '@/components/tools/CityClockDisplay'
import DstTrackerClient from '@/components/pages/DstTrackerClient'
import StructuredData from '@/components/seo/StructuredData'
import InternalLinks from '@/components/ui/InternalLinks'
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <StructuredData data={schema} />
      <h1 className="text-4xl md:text-5xl font-black text-center mb-16 text-white tracking-tighter">
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
           <h2 className="text-2xl font-black text-white uppercase tracking-widest">Global DST Schedule</h2>
           <p className="text-muted/60 font-bold mt-2">Upcoming clock changes for {city.name} and beyond</p>
        </div>
        <DstTrackerClient initialChanges={initialDstChanges} />
      </div>
      
      <div className="mt-20 prose prose-invert max-w-none bg-[#1a0b36]/40 p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-8">About Time in {city.name}</h2>
        <div className="text-lg text-muted/80 font-medium leading-relaxed">
          {city.content}
        </div>
      </div>

      <div className="pt-20">
        <InternalLinks />
      </div>
    </div>
  )
}
