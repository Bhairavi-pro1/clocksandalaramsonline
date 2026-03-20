import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Orbitron } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/ui/Sidebar'
import Footer from '@/components/ui/Footer'
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
    default: 'Clocks and Alarms Online - World Clock & High-Precision Global Tracker',
    template: '%s | Clocks and Alarms Online'
  },
  description: 'Track world time, set alarms, and use timers with high precision. Beautiful full-screen clock for productivity.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${orbitron.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen selection:bg-primary/30">
        <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-72 p-4 lg:p-10 pt-20 md:pt-10 flex flex-col min-h-screen">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </div>
        
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
