import * as cityTimezones from 'city-timezones'
import { countryToZone } from '@/lib/timezoneData'
import cityData from '@/data/seo/cities.json'

export interface ResolvedCity {
  slug: string
  name: string
  country: string
  timezone: string
  lat: number
  lon: number
  title: string
  description: string
  content: string
  introTag?: string
  introHeading?: string
  introParagraph?: string
  howToSteps?: Array<{ title: string; text: string }>
  proTips?: string[]
  useCases?: Array<{ title: string; text: string; icon?: string }>
  whyChooseUs?: string
  troubleshooting?: string
  faqs?: Array<{ q: string; a: string }>
}

const allCityMappings: any[] = 
  (cityTimezones as any).cityMapping || 
  (cityTimezones as any).default?.cityMapping || 
  []

export function resolveCityOrCountry(rawSlug: string): ResolvedCity {
  const slug = decodeURIComponent(rawSlug || '').toLowerCase().trim()

  // 1. Check curated cities in cities.json first
  const curated = cityData.find(c => c.slug === slug)
  if (curated) {
    return {
      country: curated.name,
      ...curated
    } as ResolvedCity
  }

  // 2. Normalize slug (replace hyphens and underscores with spaces)
  const normalized = slug.replace(/[-_]+/g, ' ')

  // 3. Search in cityTimezones (7,300+ global cities with lat, lon, pop, country)
  const cityMatches = allCityMappings.filter(c => 
    c.city?.toLowerCase() === normalized || 
    c.city_ascii?.toLowerCase() === normalized ||
    c.city?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug ||
    c.city_ascii?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  )

  if (cityMatches && cityMatches.length > 0) {
    const match = [...cityMatches].sort((a, b) => (b.pop || 0) - (a.pop || 0))[0]

    return {
      slug,
      name: match.city,
      country: match.country,
      timezone: match.timezone,
      lat: match.lat,
      lon: match.lng,
      title: `Current Local Time in ${match.city}, ${match.country} — World Clock Online`,
      description: `Exact current local time in ${match.city}, ${match.country}. Real-time digital clock, sunrise, sunset, and live weather forecast with millisecond precision.`,
      content: `${match.city} is located in ${match.country} and operates in the ${match.timezone} timezone. This world clock display provides atomic-synchronized local time, complete with astronomical data (sunrise and sunset) and real-time weather conditions.`
    }
  }

  // 4. Search in countryToZone (Supported countries & regions)
  const countryEntry = Object.entries(countryToZone).find(([country]) => 
    country.toLowerCase() === normalized ||
    country.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  )

  if (countryEntry) {
    const [countryName, primaryTz] = countryEntry
    const tzMatch = allCityMappings.find(c => 
      c.country?.toLowerCase() === countryName.toLowerCase() || 
      c.timezone === primaryTz
    )

    return {
      slug,
      name: countryName,
      country: countryName,
      timezone: primaryTz,
      lat: tzMatch ? tzMatch.lat : 0,
      lon: tzMatch ? tzMatch.lng : 0,
      title: `Current Local Time in ${countryName} — World Clock Online`,
      description: `Exact current local time in ${countryName}. Synchronized with official standard ${primaryTz} with live weather and sunrise/sunset times.`,
      content: `The official time in ${countryName} is determined by the ${primaryTz} timezone standard. Stay synchronized with accurate atomic time, sunrise and sunset tracking, and live meteorological updates.`
    }
  }

  // 5. Fallback for any other custom city or valid slug
  const formattedName = slug
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')

  return {
    slug,
    name: formattedName || 'Local Time',
    country: 'Global',
    timezone: 'UTC',
    lat: 0,
    lon: 0,
    title: `Current Local Time in ${formattedName || 'World Location'} — World Clock Online`,
    description: `Real-time digital clock, sunrise/sunset, and local timezone details for ${formattedName || 'world locations'}.`,
    content: `Local time in ${formattedName || 'this region'}. Synchronized with global atomic clocks for accurate timekeeping.`
  }
}
