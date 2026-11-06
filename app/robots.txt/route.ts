export const dynamic = 'force-static';
export const revalidate = 86400;

const ROBOTS_TXT = `# Content Signals for AI & Search Crawlers
Content-Signal: search=yes, ai-train=no

User-agent: *
Allow: /
Disallow: /studio

User-agent: Googlebot
Allow: /
Disallow: /studio

User-agent: Googlebot-Image
Allow: /
Disallow: /studio

User-agent: Bingbot
Allow: /
Disallow: /studio

User-agent: GPTBot
Allow: /
Disallow: /studio

User-agent: ChatGPT-User
Allow: /
Disallow: /studio

User-agent: CopilotBot
Allow: /
Disallow: /studio

User-agent: Applebot
Allow: /
Disallow: /studio

User-agent: DuckDuckBot
Allow: /
Disallow: /studio

User-agent: Slurp
Allow: /
Disallow: /studio

User-agent: Yandex
Allow: /
Disallow: /studio

User-agent: facebookexternalhit
Allow: /
Disallow: /studio

User-agent: Twitterbot
Allow: /
Disallow: /studio

User-agent: LinkedInBot
Allow: /
Disallow: /studio

User-agent: ClaudeBot
Allow: /
Disallow: /studio

User-agent: Google-Extended
Allow: /
Disallow: /studio

User-agent: PerplexityBot
Allow: /
Disallow: /studio

Sitemap: https://clocksandalarmsonline.com/sitemap.xml
`;

export async function GET() {
  return new Response(ROBOTS_TXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Signal': 'search=yes, ai-train=no',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
    },
  });
}

