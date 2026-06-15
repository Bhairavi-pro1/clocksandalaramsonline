import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://clocksandalarmsonline.com';

  return {
    rules: [
      // Default: allow all bots, block /studio
      {
        userAgent: '*',
        allow: '/',
        disallow: '/studio',
      },
      // Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/studio',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: '/studio',
      },
      // Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: '/studio',
      },
      // OpenAI / ChatGPT
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: '/studio',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: '/studio',
      },
      // Microsoft Copilot
      {
        userAgent: 'CopilotBot',
        allow: '/',
        disallow: '/studio',
      },
      // Apple
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: '/studio',
      },
      // DuckDuckGo
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: '/studio',
      },
      // Yahoo
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: '/studio',
      },
      // Yandex
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: '/studio',
      },
      // Facebook
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: '/studio',
      },
      // Twitter
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: '/studio',
      },
      // LinkedIn
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        disallow: '/studio',
      },
      // Anthropic Claude
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: '/studio',
      },
      // Google Gemini
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: '/studio',
      },
      // Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: '/studio',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
