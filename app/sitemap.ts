import { MetadataRoute } from 'next'
import timerData from '@/data/seo/timers.json'
import cityData from '@/data/seo/cities.json'
import countriesData from '@/data/countries.json'
import alarmData from '@/data/seo/alarms.json'
import holidayData from '@/data/seo/holidays.json'
import { getAllPosts } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://clocksandalarmsonline.com'
  
  // Define high priority pages
  const routes = [
    '',
    '/world-clock',
    '/alarm-clock',
    '/countdown',
    '/stopwatch',
    '/timer',
    '/meeting-planner',
    '/dst-tracker',
    '/egg-timer',
    '/shared-alarm',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }))

  // Secondary pages
  const secondaryRoutes = [
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Timer Dynamic Routes
  const timerRoutes = timerData.map((timer) => ({
    url: `${baseUrl}/timer/${timer.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // World Clock Dynamic Routes
  const worldClockRoutes = cityData.map((city) => ({
    url: `${baseUrl}/world-clock/${city.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Country Countdown Landing Pages (Powered by Firebase & Calendarific)
  const countryCountdownRoutes = countriesData.map((country) => ({
    url: `${baseUrl}/countdown/${country.code.toLowerCase()}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Popular Alarms Dynamic Routes (Curated from alarms.json)
  const alarmRoutes = alarmData.map((alarm) => ({
    url: `${baseUrl}/alarm-clock/${alarm.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Popular Holiday Dynamic Routes (Curated from holidays.json)
  const holidayRoutes = holidayData.map((holiday) => ({
    url: `${baseUrl}${holiday.sublink}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Blog Dynamic Routes (from Sanity CMS)
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug.current}/`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Sanity fetch may fail during build if no posts exist yet
  }

  return [
    ...routes, 
    ...secondaryRoutes, 
    ...blogRoutes,
    ...timerRoutes, 
    ...worldClockRoutes, 
    ...countryCountdownRoutes,
    ...alarmRoutes,
    ...holidayRoutes
  ]
}

