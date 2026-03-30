import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Orbitron } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/ui/LayoutWrapper'
import ConsentManager from '@/components/ui/ConsentManager'
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
    default: 'Free Online Alarm Clock & World Clock | Clocks and Alarms Online',
    template: '%s | Clocks and Alarms Online'
  },
  description: 'Set free online alarms, timers, and track world time for any city worldwide. Professional-grade high-precision tools with a premium design.',
  icons: {
    icon: '/assets/clock_site_logo.png',
    shortcut: '/assets/clock_site_logo.png',
    apple: '/assets/clock_site_logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${orbitron.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen selection:bg-primary/30">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        
        <ConsentManager />

        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
