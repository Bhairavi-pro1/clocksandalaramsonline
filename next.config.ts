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
    const cspValue = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https: http:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https: http:; connect-src 'self' blob: data: https: http: wss:; frame-src 'self' data: blob: https: http:; worker-src 'self' blob:; font-src 'self' data: https:; object-src 'none'; base-uri 'self'; form-action 'self';" + (isDev ? "" : " upgrade-insecure-requests;");

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
