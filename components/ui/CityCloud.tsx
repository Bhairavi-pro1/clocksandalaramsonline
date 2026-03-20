'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const DESTINATION_LISTS = [
  {
    country: "United States",
    cities: [
      { name: "Albuquerque", timezone: "America/Denver", slug: "united-states/albuquerque", weight: "text-sm font-medium text-white/50" },
      { name: "Atlanta", timezone: "America/New_York", slug: "united-states/atlanta", weight: "text-base font-medium text-white/70" },
      { name: "Austin", timezone: "America/Chicago", slug: "united-states/austin", weight: "text-3xl font-black text-white" },
      { name: "Baltimore", timezone: "America/New_York", slug: "united-states/baltimore", weight: "text-lg font-medium text-white/80" },
      { name: "Boston", timezone: "America/New_York", slug: "united-states/boston", weight: "text-xl font-medium text-white/90" },
      { name: "Charlotte", timezone: "America/New_York", slug: "united-states/charlotte", weight: "text-lg font-medium text-white/80" },
      { name: "Chicago", timezone: "America/Chicago", slug: "united-states/chicago", weight: "text-4xl font-black text-white" },
      { name: "Cleveland", timezone: "America/New_York", slug: "united-states/cleveland", weight: "text-sm font-medium text-white/70" },
      { name: "Colorado Springs", timezone: "America/Denver", slug: "united-states/colorado-springs", weight: "text-xs font-normal text-white/60" },
      { name: "Columbus", timezone: "America/New_York", slug: "united-states/columbus", weight: "text-2xl font-bold text-white" },
      { name: "Dallas", timezone: "America/Chicago", slug: "united-states/dallas", weight: "text-3xl font-black text-white" },
      { name: "Denver", timezone: "America/Denver", slug: "united-states/denver", weight: "text-xl font-normal text-white/80" },
      { name: "Detroit", timezone: "America/Detroit", slug: "united-states/detroit", weight: "text-lg font-semibold text-white/90" },
      { name: "El Paso", timezone: "America/Denver", slug: "united-states/el-paso", weight: "text-base font-medium text-white/70" },
      { name: "Fort Worth", timezone: "America/Chicago", slug: "united-states/fort-worth", weight: "text-2xl font-bold text-white" },
      { name: "Fresno", timezone: "America/Los_Angeles", slug: "united-states/fresno", weight: "text-sm font-normal text-white/60" },
      { name: "Houston", timezone: "America/Chicago", slug: "united-states/houston", weight: "text-4xl font-black text-white" },
      { name: "Indianapolis", timezone: "America/Indiana/Indianapolis", slug: "united-states/indianapolis", weight: "text-2xl font-black text-white" },
      { name: "Jacksonville", timezone: "America/New_York", slug: "united-states/jacksonville", weight: "text-3xl font-bold text-white" },
      { name: "Juneau", timezone: "America/Juneau", slug: "united-states/juneau", weight: "text-xs font-normal text-white/50" },
      { name: "Kansas City", timezone: "America/Chicago", slug: "united-states/kansas-city", weight: "text-sm font-medium text-white/70" },
      { name: "Las Vegas", timezone: "America/Los_Angeles", slug: "united-states/las-vegas", weight: "text-base font-normal text-white/80" },
      { name: "Long Beach", timezone: "America/Los_Angeles", slug: "united-states/long-beach", weight: "text-sm font-medium text-white/60" },
      { name: "Los Angeles", timezone: "America/Los_Angeles", slug: "united-states/los-angeles", weight: "text-5xl font-black text-white" },
      { name: "Memphis", timezone: "America/Chicago", slug: "united-states/memphis", weight: "text-lg font-medium text-white/80" },
      { name: "Mesa", timezone: "America/Phoenix", slug: "united-states/mesa", weight: "text-sm font-normal text-white/50" },
      { name: "Miami", timezone: "America/New_York", slug: "united-states/miami", weight: "text-sm font-normal text-white/70" },
      { name: "Milwaukee", timezone: "America/Chicago", slug: "united-states/milwaukee", weight: "text-base font-medium text-white/80" },
      { name: "Minneapolis", timezone: "America/Chicago", slug: "united-states/minneapolis", weight: "text-sm font-medium text-white/60" },
      { name: "Nashville", timezone: "America/Chicago", slug: "united-states/nashville", weight: "text-sm font-medium text-white/60" },
      { name: "New York", timezone: "America/New_York", slug: "united-states/new-york", weight: "text-5xl font-black text-white" },
      { name: "Oakland", timezone: "America/Los_Angeles", slug: "united-states/oakland", weight: "text-xs font-normal text-white/60" },
      { name: "Oklahoma City", timezone: "America/Chicago", slug: "united-states/oklahoma-city", weight: "text-base font-medium text-white/80" },
      { name: "Omaha", timezone: "America/Chicago", slug: "united-states/omaha", weight: "text-sm font-normal text-white/50" },
      { name: "Philadelphia", timezone: "America/New_York", slug: "united-states/philadelphia", weight: "text-4xl font-black text-white" },
      { name: "Phoenix", timezone: "America/Phoenix", slug: "united-states/phoenix", weight: "text-4xl font-black text-white" },
      { name: "Portland", timezone: "America/Los_Angeles", slug: "united-states/portland", weight: "text-base font-medium text-white/70" },
      { name: "Raleigh", timezone: "America/New_York", slug: "united-states/raleigh", weight: "text-sm font-medium text-white/60" },
      { name: "Sacramento", timezone: "America/Los_Angeles", slug: "united-states/sacramento", weight: "text-sm font-medium text-white/70" },
      { name: "San Antonio", timezone: "America/Chicago", slug: "united-states/san-antonio", weight: "text-3xl font-black text-white" },
      { name: "San Diego", timezone: "America/Los_Angeles", slug: "united-states/san-diego", weight: "text-3xl font-black text-white" },
      { name: "San Francisco", timezone: "America/Los_Angeles", slug: "united-states/san-francisco", weight: "text-3xl font-black text-white" },
      { name: "San Jose", timezone: "America/Los_Angeles", slug: "united-states/san-jose", weight: "text-2xl font-bold text-white" },
      { name: "Seattle", timezone: "America/Los_Angeles", slug: "united-states/seattle", weight: "text-base font-medium text-white/80" },
      { name: "Staten Island", timezone: "America/New_York", slug: "united-states/staten-island", weight: "text-xs font-medium text-white/50" },
      { name: "Tucson", timezone: "America/Phoenix", slug: "united-states/tucson", weight: "text-xs font-normal text-white/50" },
      { name: "Tulsa", timezone: "America/Chicago", slug: "united-states/tulsa", weight: "text-sm font-normal text-white/60" },
      { name: "Virginia Beach", timezone: "America/New_York", slug: "united-states/virginia-beach", weight: "text-sm font-medium text-white/70" },
      { name: "Washington, D.C.", timezone: "America/New_York", slug: "united-states/washington-dc", weight: "text-5xl md:text-6xl font-black text-white" },
      { name: "Wichita", timezone: "America/Chicago", slug: "united-states/wichita", weight: "text-xs font-medium text-white/50" },
    ]
  },
  {
    country: "Global Top Destinations",
    cities: [
      { name: "London", timezone: "Europe/London", slug: "united-kingdom/london", weight: "text-4xl md:text-5xl font-black text-white" },
      { name: "Tokyo", timezone: "Asia/Tokyo", slug: "japan/tokyo", weight: "text-3xl md:text-4xl font-bold text-white/90" },
      { name: "Paris", timezone: "Europe/Paris", slug: "france/paris", weight: "text-2xl md:text-3xl font-bold text-white/80" },
      { name: "Dubai", timezone: "Asia/Dubai", slug: "uae/dubai", weight: "text-3xl md:text-4xl font-black text-white" },
      { name: "Singapore", timezone: "Asia/Singapore", slug: "singapore/singapore", weight: "text-xl md:text-2xl font-bold text-white/70" },
      { name: "Hong Kong", timezone: "Asia/Hong_Kong", slug: "hong-kong/hong-kong", weight: "text-lg font-semibold text-white/60" },
      { name: "Sydney", timezone: "Australia/Sydney", slug: "australia/sydney", weight: "text-2xl font-bold text-white/80" },
      { name: "Toronto", timezone: "America/Toronto", slug: "canada/toronto", weight: "text-xl font-semibold text-white/70" },
      { name: "Berlin", timezone: "Europe/Berlin", slug: "germany/berlin", weight: "text-lg font-medium text-white/50" },
      { name: "Mumbai", timezone: "Asia/Kolkata", slug: "india/mumbai", weight: "text-2xl font-bold text-white/80" },
      { name: "Seoul", timezone: "Asia/Seoul", slug: "south-korea/seoul", weight: "text-xl font-semibold text-white/60" },
      { name: "São Paulo", timezone: "America/Sao_Paulo", slug: "brazil/sao-paulo", weight: "text-base font-medium text-white/40" },
      { name: "Mexico City", timezone: "America/Mexico_City", slug: "mexico/mexico-city", weight: "text-xl font-bold text-white/70" },
      { name: "Cape Town", timezone: "Africa/Johannesburg", slug: "south-africa/cape-town", weight: "text-base font-normal text-white/40" },
    ]
  }
]

export default function CityCloud() {
  return (
    <div className="w-full space-y-24 py-16">
      {DESTINATION_LISTS.map((list) => (
        <div key={list.country} className="flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black text-rose-500 mb-14 tracking-tight text-center">
            {list.country}
          </h2>
          <div className="flex flex-wrap items-baseline justify-center gap-x-8 gap-y-6 max-w-6xl text-center px-4">
            {list.cities.map((city) => (
              <Link 
                key={city.name}
                href={`/time/${city.slug}?timezone=${city.timezone}`}
                className={cn(
                  "hover:text-primary transition-all duration-300 hover:scale-[1.05] cursor-pointer inline-block mx-2",
                  city.weight
                )}
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
