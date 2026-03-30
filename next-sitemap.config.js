/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://clocksandalarmsonline.com',
  generateRobotsTxt: true,
  exclude: ['/legacy/*', '/api/*'],
  outDir: 'public',
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {
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
  },
  transform: async (config, path) => {
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
  },
};
