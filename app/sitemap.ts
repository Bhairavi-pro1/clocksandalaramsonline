import { MetadataRoute } from 'next'
import timerData from '@/data/seo/timers.json'
import cityData from '@/data/seo/cities.json'
import countriesData from '@/data/countries.json'
import { getAllPosts } from '@/lib/sanity'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

function getHolidaySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

// Helper function to generate all 1440 paths from 12:00 AM to 11:59 PM
function getAlarmPaths() {
  const paths: string[] = []
  const periods = ['am', 'pm']
  
  for (let p of periods) {
    for (let h = 0; h < 12; h++) {
      const hour = h === 0 ? 12 : h
      for (let m = 0; m < 60; m += 1) {
        const minute = m === 0 ? '' : `-${m.toString().padStart(2, '0')}`
        paths.push(`set-alarm-for-${hour}${minute}-${p}`)
      }
    }
  }
  return paths
}

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

  // 1440 dynamic alarm paths
  const alarmRoutes = getAlarmPaths().map((route) => ({
    url: `${baseUrl}/alarm-clock/${route}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
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

  // Holiday Dynamic Routes (Read ONLY from Firestore cache — 0 Calendarific API calls)
  let cachedHolidayRoutes: MetadataRoute.Sitemap = []
  try {
    const cacheSnapshot = await getDocs(collection(db, 'holiday_cache'))
    const seenUrls = new Set<string>()

    cacheSnapshot.forEach((docSnap) => {
      const data = docSnap.data()
      const countryCode = (data.country || docSnap.id.split('_')[0])?.toLowerCase()
      if (countryCode && Array.isArray(data.holidays)) {
        for (const holiday of data.holidays) {
          if (holiday?.name) {
            const slug = getHolidaySlug(holiday.name)
            const url = `${baseUrl}/countdown/${countryCode}/${slug}/`
            if (!seenUrls.has(url)) {
              seenUrls.add(url)
              cachedHolidayRoutes.push({
                url,
                lastModified: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
              })
            }
          }
        }
      }
    })
  } catch (err) {
    // Graceful fallback if offline or Firestore query is unavailable
    console.error('Failed to read holiday_cache in sitemap:', err)
  }

  return [
    ...routes, 
    ...secondaryRoutes, 
    ...blogRoutes,
    ...timerRoutes, 
    ...worldClockRoutes, 
    ...countryCountdownRoutes,
    ...cachedHolidayRoutes,
    ...alarmRoutes
  ]
}

