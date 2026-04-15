import { Metadata } from 'next'
import CityClockDisplay from '@/components/tools/CityClockDisplay'
import StructuredData from '@/components/seo/StructuredData'
import TimeInfoPanel from '@/components/tools/TimeInfoPanel'
import AdBanner from '@/components/ui/AdBanner'
import { MapPin, Clock, Globe, Bell, Compass, HelpCircle, Briefcase, GraduationCap, Timer, Utensils, Zap } from 'lucide-react'
import ToolSEO from '@/components/seo/ToolSEO'
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
      <div className="mt-32 w-full max-w-6xl mx-auto">
        <ToolSEO
          toolName={`Time in ${cityName}`}
          introTag="High-Precision Local Coordinates"
          introHeading={`Accurate Local Time for ${cityName}, ${countryName}`}
          introParagraph={
            <>
              Whether you are coordinating international business meetings, planning a trip, or staying in touch with family abroad, having the exact local time in {cityName} is essential. Our dynamic local time tracker delivers millisecond-accurate sync across the {timezone} timezone by utilizing Luxon for high-precision timekeeping. Combine this perfectly with our live weather conditions directly from the open data API provided by the <a href="https://api.met.no/" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-primary hover:transition-colors">Norwegian Meteorological Institute</a> (MET Norway), making this the definitive dashboard for {cityName}.
            </>
          }
          howToSteps={[
            { title: "Check the Live Clock", text: `The primary clock face immediately locks onto the ${timezone} timezone and updates locally every single millisecond. It never drifts or falls behind.` },
            { title: "Review Weather Data", text: `Look at the environmental panel to see live temperatures and wind speeds for ${cityName}, crucial information if you are planning travel.` },
            { title: "Track the Sun Cycle", text: "We use advanced solar calculations via SunCalc to provide precise sunrise and sunset forecasting based on your selected global coordinates." },
            { title: "Use the Meeting Planner", text: `Jump over to our Meeting planner tool to effortlessly cross-reference ${cityName} against your local hometown standard time.` }
          ]}
          proTips={[
            `If you are traveling to ${cityName}, keep this exact tab open on your phone's browser. It works flawlessly as a persistent clock widget in your hotel room.`,
            `The timezone offset (e.g. UTC+2) shown under the clock automatically adjusts if ${cityName} enters or exits Daylight Saving Time.`,
            "Want to know when it gets dark? The dynamic background behind the main clock mimics the actual sun position in the city you are viewing."
          ]}
          useCases={[
            { icon: Briefcase, title: "For Client Meetings", text: `Ensure you never disrespect a client in ${cityName} by calling them at 10 PM. Check this local clock right before you hit dial.` },
            { icon: Globe, title: "For Vacation Planning", text: `When booking flights to ${countryName}, refer to the exact timezone offset to calculate jetlag and adjust your sleep schedule.` },
            { icon: Timer, title: "For Forex Traders", text: `Institutional traders keep individual city clocks open to perfectly monitor when specific local financial markets open for the daily trading session.` },
            { icon: GraduationCap, title: "For Geography Students", text: `Students use the precise latitude (${lat}) and longitude (${lon}) metrics combined with our solar tracking feature for advanced environmental homework.` },
            { icon: Utensils, title: "For Remote Work Events", text: `Ordering pizza for your remote team in ${cityName}? Make sure you order it at exactly 12:00 PM their time, not yours.` }
          ]}
          whyChooseUs={`When you search for the time in a standard search engine, you mostly get a tiny, static text box that doesn't tick. 
          
          We built this dedicated tracker for ${cityName} to serve as a massive, beautiful command center. We don't just give you the time; we combine high-fidelity atomic time polling with real-time MET Norway weather data and gorgeous fluid animations. We calculate absolute elapsed milliseconds to guarantee that whether you are in Tokyo or New York, the time displayed for ${cityName} is mathematically flawless.`}
          troubleshooting={`Clock looks wrong or weather data missing?
          
          1. Daylight Saving Time: If the time looks exactly one hour off your expectations, ${cityName} may have recently crossed a Daylight Saving boundary. Our system is fully IANA-compliant and reflects the legal time, which often surprises users.
          2. API Rate Limiting: If the weather panel says "Loading...", our upstream meteorological provider may be temporarily throttling requests due to high global traffic.
          3. Computer Desync: The high-precision clock uses your local device oscillator as a reference point. If your laptop's internal clock is manually set 5 minutes fast, the visual display will be skewed.`}
          faqs={[
            { q: `Does the time shown automatically adjust for DST in ${countryName}?`, a: `Yes. Our time engine seamlessly integrates with the IANA database. If ${cityName} legally observes Daylight Saving Time, the clock adjusts instantaneously without any manual intervention.` },
            { q: "Where does the weather data come from?", a: "To guarantee peak accuracy, we source our live weather metrics directly from the acclaimed Norwegian Meteorological Institute (MET Norway)." },
            { q: `What exact timezone is ${cityName} located in?`, a: `The official overarching timezone is ${timezone}. You can see the explicit UTC offset directly below the main clock face.` },
            { q: "Can I set an alarm based on this city's time?", a: "Currently, our standard Alarm Clock tool is based on your specific local computer time. We are developing a feature to let you set an alarm explicitly triggered by a remote timezone in a future update." },
            { q: "Why do the seconds move so smoothly?", a: "Unlike cheap digital clocks that rely on clunky interval scraping, we utilize optimized RequestAnimationFrame browser hooks. This provides a buttery-smooth 60 frames-per-second visual rendering string." },
            { q: "Is the sunrise/sunset data highly accurate?", a: "Extremely. We calculate the exact solar angles mathematically based on the exact latitude and longitude coordinates of the city." },
            { q: `If I travel to ${cityName}, will this page update to my location?`, a: "This static URL is dedicated specifically to this city. If you travel here, the time displayed will mathematically match the local time on your phone's lock screen!" },
            { q: "Is the application free to use?", a: "Absolutely. We pride ourselves on providing premium, professional-grade timing instruments to the world with no subscriptions or paywalls." }
          ]}
        />
      </div>

      <AdBanner />
    </div>
  )
}
