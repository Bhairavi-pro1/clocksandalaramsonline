import CityClockDisplay from '@/components/tools/CityClockDisplay'
import DSTTracker from '@/components/tools/DSTTracker'
import StructuredData from '@/components/seo/StructuredData'
import InternalLinks from '@/components/ui/InternalLinks'
import { Metadata } from 'next'
import cityData from '@/data/seo/cities.json'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return cityData.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = cityData.find(c => c.slug === slug)
  
  return {
    title: city?.title || `Local Time in ${slug.replace(/-/g, ' ')}`,
    description: city?.description || `What time is it in ${slug}? Get local time, weather and sun data.`
  }
}

export default async function DynamicCityPage({ params }: Props) {
  const { slug } = await params
  const city = cityData.find(c => c.slug === slug)
  
  if (!city) return <div>City Not Found</div>

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
      <h1 className="text-4xl md:text-5xl font-black text-center mb-16">
        Current Local Time in {city.name}
      </h1>
      
      <CityClockDisplay 
        name={city.name} 
        timezone={city.timezone} 
        lat={city.lat} 
        lon={city.lon} 
      />
      
      <div className="mt-12">
        <DSTTracker />
      </div>
      
      <div className="mt-20 prose prose-invert max-w-none bg-card/30 p-8 rounded-3xl border border-card-border">
        <h2>About Time in {city.name}</h2>
        <p className="text-lg text-muted">
          {city.content}
        </p>
      </div>

      <InternalLinks />
    </div>
  )
}
