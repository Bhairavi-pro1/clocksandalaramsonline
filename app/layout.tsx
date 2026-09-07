import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Orbitron } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/ui/LayoutWrapper'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta'
})

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://clocksandalarmsonline.com'),
  title: {
    default: 'Free Online Alarm Clock & World Clock | Clocks & Alarms',
    template: '%s | Clocks and Alarms Online'
  },
  description: 'Free online alarm clock and world clock suite. High-precision stopwatch, countdown timer, and loud alarm options.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${orbitron.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var store = localStorage.getItem('clocks-and-alarms-storage');
                var theme = 'dark';
                if (store) {
                  var parsed = JSON.parse(store);
                  if (parsed && parsed.state && parsed.state.theme) {
                    theme = parsed.state.theme;
                  }
                }
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `
          }}
        />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://clocksandalarmsonline.com/#organization',
                  'name': 'Clocks and Alarms Online',
                  'url': 'https://clocksandalarmsonline.com',
                  'logo': {
                    '@type': 'ImageObject',
                    '@id': 'https://clocksandalarmsonline.com/#logo',
                    'url': 'https://clocksandalarmsonline.com/icon.png',
                    'caption': 'Clocks and Alarms Online Logo'
                  },
                  'description': 'Free online alarm clock, world clock, stopwatch, and timer utility suite. Precision timekeeping tools for international teams and daily productivity.'
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://clocksandalarmsonline.com/#website',
                  'url': 'https://clocksandalarmsonline.com',
                  'name': 'Clocks and Alarms Online',
                  'description': 'Free online alarm clock and world clock suite. High-precision stopwatch, countdown timer, and loud alarm options.',
                  'publisher': {
                    '@id': 'https://clocksandalarmsonline.com/#organization'
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen selection:bg-primary/30">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-43759W7BVR"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-43759W7BVR');
          `}
        </Script>
      </body>
    </html>
  )
}
