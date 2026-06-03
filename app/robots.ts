import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { 
        userAgent: '*', 
        allow: '/',
        disallow: ['/studio', '/studio/'],
      },
      {
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'Omgilibot', 'FacebookBot'],
        allow: '/',
        disallow: ['/studio', '/studio/'],
      }
    ],
    sitemap: 'https://clocksandalarmsonline.com/sitemap.xml',
  };
}
