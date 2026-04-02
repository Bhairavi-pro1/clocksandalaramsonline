/** @type {import('next-sitemap').IConfig} */

export const siteUrl = 'https://clocksandalarmsonline.com';
export const generateRobotsTxt = true;
export const exclude = ['/legacy/*', '/api/*'];
export const outDir = 'public';
export const generateIndexSitemap = false;
export const changefreq = 'daily';
export const priority = 0.7;
export const robotsTxtOptions = {
  policies: [
    {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/*',
        '/legacy/*',
        '/search',
        '/*?*', // Prevents duplicate content from query strings
        '/_next/static/media/*.woff2', // Save crawl budget
      ],
    },
    {
      userAgent: 'GPTBot',
      allow: '/', // Protect content from being used for AI training if desired
    },
  ],
};
export async function transform(config, path) {
  // Top Priority for Landing Pages
  const highPriority = [
    '/',
    '/world-clock/',
    '/alarm-clock/',
    '/timer/',
    '/stopwatch/',
    '/countdown/',
    '/meeting-planner/',
    '/dst-tracker/',
  ];

  if (highPriority.includes(path)) {
    return {
      loc: path,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    };
  }

  // Default for tools and dynamic slugs
  return {
    loc: path,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  };
}
