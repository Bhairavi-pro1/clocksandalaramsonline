import type { Metadata } from 'next'
import StopwatchClient from '@/components/pages/StopwatchClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Timer, RotateCcw, List, Maximize2 } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export const metadata: Metadata = {
  title: 'Online Stopwatch – High-Precision Lap Timer',
  description: 'A professional-grade online stopwatch with millisecond accuracy. Features lap timing, history tracking, and full-screen mode for athletics and productivity.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/stopwatch',
  },
  openGraph: {
    title: 'Online Stopwatch – High-Precision Lap Timer',
    description: 'Professional millisecond-accurate stopwatch for any activity. Lap tracking and full-screen mode included.',
    type: 'website',
  }
}

export default function StopwatchPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "High-Precision Online Stopwatch",
    "description": "Millisecond-accurate online stopwatch with lap timing and history tracking for professional and athletic use.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How accurate is this online stopwatch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our stopwatch uses high-resolution system performance counters (performance.now) to ensure millisecond accuracy, preventing timing drift even under heavy CPU load."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my lap times?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, your lap times and session history are automatically saved to your browser's local storage so you can review them even after closing the tab."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work in full-screen mode?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. You can click the maximize icon to enter full-screen mode, which is perfect for gym use, athletics, or public presentations. This mode hides all browser distractions."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <h1 className="text-primary font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4 text-center animate-in fade-in duration-700">
          Online Stopwatch – High-Precision Lap Timer
        </h1>
      </div>

      <StopwatchClient />

      {/* Extended SEO Content & How to Use (Bottom of page - Server Side) */}
      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-32">
        {/* Detailed Description */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 mt-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Professional Grade Timing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            A High-Precision Stopwatch <br />
            <span className="text-primary/80">for Every Second That Counts</span>
          </h2>
          <p className="text-lg text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            The Clocks and Alarms Online stopwatch is engineered for performance. Unlike standard 
            web timers, our tool utilizes high-frequency system performance counters to ensure that the 
            displayed time never lags, even during intense CPU usage. Whether you&apos;re an athlete timing 
            splits or a professional developer tracking work cycles, our tool provides the stability you need.
          </p>
        </section>

        {/* 📖 New How to Use Section for Stopwatch */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary not-italic">Master the Stopwatch</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Timer, 
                title: "1. Start/Stop", 
                text: "Initialize the timer with the primary action button to begin tracking time with high precision. Click again to pause." 
              },
              { 
                icon: RotateCcw, 
                title: "2. Record Laps", 
                text: "Capture intermediate splits or lap times without interrupting the main timing sequence for detailed analysis." 
              },
              { 
                icon: List, 
                title: "3. Review History", 
                text: "View your full session history in the detailed table below. Your laps are saved automatically to your browser." 
              },
              { 
                icon: Maximize2, 
                title: "4. Full Screen", 
                text: "Expand to Cinema Mode for athletic training or public events requiring high visibility from a distance." 
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-[#1a0b36]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-muted/80 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed FAQ Section for SEO */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Stopwatch <span className="text-primary italic">Expert Guide</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                q: "How accurate is this online stopwatch?", 
                a: "Our stopwatch uses high-resolution system performance counters (performance.now) to ensure millisecond accuracy, preventing timing drift even under heavy CPU load."
              },
              {
                q: "Does it work the same on mobile devices?",
                a: "Yes, our stopwatch is fully responsive and optimized for touch interactions on both iOS and Android, maintaining high precision across all modern mobile browsers."
              },
              {
                q: "What happens if I accidental close the browser?",
                a: "Your session state and lap history are saved in real-time to your browser's LocalStorage. Simply reopen the page to resume from where you left off."
              },
              {
                q: "Is there a limit to the number of laps?",
                a: "There is no hard limit on lap recording. You can track hundreds of laps for long-distance events or complex multi-stage tasks without performance degradation."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
                <div className="flex gap-4 mb-4">
                  <HelpCircle className="text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white tracking-tight">{faq.q}</h3>
                </div>
                <p className="text-sm text-muted/70 leading-relaxed font-medium pl-10">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
