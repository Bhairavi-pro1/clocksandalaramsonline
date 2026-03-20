import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pre-render all pages at build — SEO critical (Using SSR/ISR for infinite dynamic cities instead of purely static export)
  // output: 'export',  // Removed to allow dynamic route rendering for infinite global timezones
  trailingSlash: true,  // clocksandalarmsonline.com/timer/ (Google prefers)
  
  images: {
    unoptimized: true,  // Required for static export
  },
  
  // Remove X-Powered-By header (minor security + SEO)
  poweredByHeader: false,
  
  // Strict mode for catching bugs early
  reactStrictMode: true,
  
  // Appease build for Next 15/16
  // @ts-ignore
  turbopack: {},
};

export default nextConfig;
