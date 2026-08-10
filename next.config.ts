import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pre-render all pages at build — SEO critical (Using SSR/ISR for infinite dynamic cities instead of purely static export)
  // output: 'export',  // Removed to allow dynamic route rendering for infinite global timezones
  trailingSlash: true,  // clocksandalarmsonline.com/timer/ (Google prefers)
  
  images: {
    unoptimized: true,  // Required for static export
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  
  // Remove X-Powered-By header (minor security + SEO)
  poweredByHeader: false,
  
  // Strict mode for catching bugs early
  reactStrictMode: true,
  
  // Appease build for Next 15/16
  // @ts-ignore
  turbopack: {},

  // Global security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const cspValue = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://www.gstatic.com https://core.sanity-cdn.com https://*.adtrafficquality.google https://*.acscdn.com https://acscdn.com https://*.adexchangerapid.com http://*.adexchangerapid.com https://adexchangerapid.com http://adexchangerapid.com https://*.crcdn.org https://crcdn.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://*.google.com https://*.google.co.in https://*.doubleclick.net https://*.acscdn.com https://acscdn.com https://*.adtrafficquality.google https://*.adexchangerapid.com http://*.adexchangerapid.com https://adexchangerapid.com http://adexchangerapid.com https://*.crcdn.org https://crcdn.org; connect-src 'self' https://*.googleapis.com https://*.firebaseapi.com https://*.firestore.googleapis.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://stats.g.doubleclick.net https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://*.adtrafficquality.google https://*.acscdn.com https://acscdn.com https://*.adexchangerapid.com http://*.adexchangerapid.com https://adexchangerapid.com http://adexchangerapid.com https://*.crcdn.org https://crcdn.org; frame-src 'self' https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://*.adtrafficquality.google https://*.google.com https://*.google.co.in https://*.acscdn.com https://acscdn.com https://*.adexchangerapid.com http://*.adexchangerapid.com https://adexchangerapid.com http://adexchangerapid.com https://*.crcdn.org https://crcdn.org; worker-src 'self' blob:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';" + (isDev ? "" : " upgrade-insecure-requests;");

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
