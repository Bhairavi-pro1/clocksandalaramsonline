import { MetadataRoute } from 'next'
import timerData from '@/data/seo/timers.json'
import cityData from '@/data/seo/cities.json'
import holidayData from '@/data/seo/holidays.json'
import { getAllPosts } from '@/lib/sanity'
import { getSportsMatches, getSportSlug } from '@/lib/sports'

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
    '/sports-schedule/fifa-worldcup-2026',
    '/sports-schedule/football',
    '/sports-schedule/basketball',
    '/sports-schedule/cricket',
    '/sports-schedule/tennis',
    '/sports-schedule/formula1',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
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
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Timer Dynamic Routes
  const timerRoutes = timerData.map((timer) => ({
    url: `${baseUrl}/timer/${timer.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // World Clock Dynamic Routes
  const worldClockRoutes = cityData.map((city) => ({
    url: `${baseUrl}/world-clock/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Countdown Dynamic Routes
  const countdownRoutes = holidayData.map((holiday) => ({
    url: `${baseUrl}/countdown/${holiday.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.9,
  }))

  // 1440 dynamic alarm paths
  const alarmRoutes = getAlarmPaths().map((route) => ({
    url: `${baseUrl}/alarm-clock/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7, // Slightly lower priority than main tools
  }))

  // Blog Dynamic Routes (from Sanity CMS)
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug.current}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Sanity fetch may fail during build if no posts exist yet
  }

  // Sports Match Dynamic Routes
  let sportsMatchRoutes: MetadataRoute.Sitemap = []
  try {
    const matches = await getSportsMatches()
    sportsMatchRoutes = matches.map((match) => ({
      url: `${baseUrl}/sports-schedule/${getSportSlug(match.sport)}/match/${match.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  } catch (error) {
    console.error('Failed to generate sitemap routes for sports matches:', error)
  }

  return [
    ...routes, 
    ...secondaryRoutes, 
    ...blogRoutes,
    ...timerRoutes, 
    ...worldClockRoutes, 
    ...countdownRoutes, 
    ...alarmRoutes,
    ...sportsMatchRoutes
  ]
}
