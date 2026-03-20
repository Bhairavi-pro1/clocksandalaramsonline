import { Metadata } from 'next'
import CityClockDisplay from '@/components/tools/CityClockDisplay'
import StructuredData from '@/components/seo/StructuredData'
import TimeInfoPanel from '@/components/tools/TimeInfoPanel'
import InternalLinks from '@/components/ui/InternalLinks'
import AdBanner from '@/components/ui/AdBanner'
import { MapPin, Clock, Globe, Bell, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import cityTimezones from 'city-timezones'

interface PageProps {
  params: Promise<{ slug: string[] }> | { slug: string[] }
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}

function resolveSlug(slug: string[]) {
  const countrySlug = slug[0] || 'global'
  const citySlug = slug[1] || 'time'
  const year = slug[2] || ''
  const month = slug[3] || ''
  const day = slug[4] || ''
  
  const cityName = decodeURIComponent(citySlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '))
  const countryName = decodeURIComponent(countrySlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '))
  
  return { cityName, countryName, year, month, day }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { cityName, countryName, year, month } = resolveSlug(params.slug)

  return {
    title: `Local Time in ${cityName}, ${countryName} | ${month} ${year}`,
    description: `Exact local time, date, and timezone for ${cityName}, ${countryName}. Get high-precision world clock information.`
  }
}

export default async function DynamicTimePage(props: PageProps) {
  const params = await props.params
  const resolvedSearchParams = await props.searchParams || {}
  
  const timezone = (resolvedSearchParams.timezone as string) || "UTC"
  const { cityName, countryName } = resolveSlug(params.slug)

  let lat = 0;
  let lon = 0;

  const cityMatches = cityTimezones.lookupViaCity(cityName);
  let bestMatch = cityMatches.find(c => c.timezone === timezone);
  
  if (!bestMatch) {
    bestMatch = cityTimezones.cityMapping.find(c => c.timezone === timezone);
  }

  if (bestMatch) {
    lat = bestMatch.lat;
    lon = bestMatch.lng;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Time in ${cityName}, ${countryName}`,
    "description": `Current local time in ${cityName}, ${countryName} (${timezone}).`,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-500">
      <StructuredData data={schema} />
      
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black">
          Time in {cityName}, {countryName}
        </h1>
        <p className="text-lg text-primary font-medium tracking-widest uppercase">
          {timezone.replace('_', ' ')}
        </p>
      </div>
      
      <CityClockDisplay 
        name={cityName} 
        timezone={timezone} 
        lat={lat} 
        lon={lon} 
      />
      
      <AdBanner />

      <TimeInfoPanel timezone={timezone} cityName={cityName} lat={lat} lon={lon} />

      {/* Premium SEO Content & User Guide */}
      <div className="space-y-32 mt-32 max-w-6xl mx-auto w-full">
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            High-Precision World Clock
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.1]">
            Accurate Local Time for <br />
            <span className="text-primary/80">{cityName}, {countryName}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Whether you are coordinating international business meetings, planning a trip, or staying in touch with family abroad, having the exact local time in {cityName} is essential. Our dynamic local time tracker delivers millisecond-accurate sync across the {timezone} timezone by utilizing <strong>Luxon</strong> for high-precision timekeeping. For real-time environmental data, we dynamically retrieve live weather conditions directly from the open data API provided by the <strong>Norwegian Meteorological Institute (MET Norway)</strong> and use advanced solar calculations via <strong>SunCalc</strong> to provide precise sunrise and sunset forecasting based on your selected global coordinates.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { step: "01", icon: Clock, title: "Real-Time Tracking", text: "Watch the local time update flawlessly in real-time, synchronized securely with global atomic clocks for maximum accuracy." },
            { step: "02", icon: MapPin, title: "Location Details", text: `Get instant context for ${cityName}, ${countryName} including exact time offsets and GMT conversion data.` },
            { step: "03", icon: Compass, title: "Weather & Sun Focus", text: "Read live environmental data such as temperature and wind, along with precise sunrise/sunset forecasting." },
            { step: "04", icon: Globe, title: "Timezone Awareness", text: `Stay on top of changes and offsets within the ${timezone} timezone so you never miss an appointment.` },
            { step: "05", icon: Bell, title: "Set Alerts", text: "Use our dedicated alarm clock and timer tools built-in directly to plan around this specific local schedule." }
          ].map((item, i) => (
            <div key={i} className={cn(
              "group p-10 rounded-[3rem] bg-[#1a0b2e]/40 border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl",
              i >= 3 && "lg:col-span-1"
            )}>
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="text-4xl font-black text-white/5 italic group-hover:text-primary/10 transition-colors">
                  {item.step}
                </span>
              </div>
              <h4 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h4>
              <p className="text-base text-white/40 leading-relaxed font-medium">
                {item.text}
              </p>
            </div>
          ))}
        </section>
      </div>

      <InternalLinks />
      <AdBanner />
    </div>
  )
}
