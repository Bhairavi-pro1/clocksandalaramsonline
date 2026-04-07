import { MetadataRoute } from 'next'

// Helper function to generate all 1440 paths from 12:00 AM to 11:59 PM
function getAlarmPaths() {
  const paths: string[] = []
  const periods = ['am', 'pm']
  
  for (let p of periods) {
    for (let h = 0; h < 12; h++) {
      const hour = h === 0 ? 12 : h
      for (let m = 0; m < 60; m += 1) {
        const minute = m === 0 ? '' : `-${m.toString().padStart(2, '0')}`
        paths.push(`/set-alarm-for-${hour}${minute}-${p}`)
      }
    }
  }
  return paths
}

export default function sitemap(): MetadataRoute.Sitemap {
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

  // 1440 dynamic alarm paths
  const alarmRoutes = getAlarmPaths().map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7, // Slightly lower priority than main tools
  }))

  return [...routes, ...secondaryRoutes, ...alarmRoutes]
}
