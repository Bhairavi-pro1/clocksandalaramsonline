import type { Metadata } from 'next'
import TimerClient from '@/components/pages/TimerClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Hourglass, Play, Bell, Maximize2 } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export const metadata: Metadata = {
  title: 'Online Countdown Timer – High-Precision Productivity Tool',
  description: 'A high-precision online countdown timer for students, professionals, and chefs. Features Pomodoro support, fitness intervals, and immersive full-screen focus mode.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/timer',
  },
  openGraph: {
    title: 'Online Countdown Timer – High-Precision Productivity Tool',
    description: 'Boost your focus with our millisecond-accurate countdown timer. Perfect for Pomodoro and heavy-duty productivity.',
    type: 'website',
  }
}

export default function TimerPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "High-Precision Online Timer",
    "description": "Millisecond-accurate online countdown timer with support for multiple presets, Pomodoro, and full-screen focus mode.",
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
        "name": "Are the countdown timers accurate for high-stakes tasks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our timing engine uses performance.now() to achieve millisecond precision, ensuring that our timers remain accurate even when your computer is running complex background tasks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this timer for the Pomodoro technique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Our timer is designed with productivity in mind. You can easily set a 25-minute Pomodoro block and use the full-screen mode to eliminate all visual distractions."
        }
      },
      {
        "@type": "Question",
        "name": "Will the timer sound if I am in a different browser tab?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our system uses high-fidelity audio alerts and standard browser notifications to ensure you're alerted as soon as the countdown reaches zero, regardless of which tab you're viewing."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-10 text-white tracking-tighter animate-in fade-in duration-1000">
          Online <span className="text-primary italic">Countdown</span> Timer
        </h1>
      </div>

      <TimerClient />

      {/* High-Precision SEO Content & User Guide (Server Side) */}
      <div className="max-w-6xl mx-auto pb-24 space-y-32">
        {/* Excellent SEO Paragraph */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 mt-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            The Ultimate Productivity Tool
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            High-Precision Online Countdown Timer <br />
            <span className="text-primary/80">for Unstoppable Focus and Results</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Welcome to Clocks and Alarms Online, your premier destination for the most reliable countdown timer on the web. 
            Our high-precision online timer is meticulously designed for students, professionals, and home chefs who 
            demand millisecond accuracy. Whether you are mastering the Pomodoro technique, tracking fitness intervals, 
            or counting down to a high-stakes event, our persistent and visually stunning interface ensures you stay 
            on track and ahead of your schedule.
          </p>
        </section>

        {/* 📖 New How to Use Section for Timer */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary not-italic">Master the Countdown</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Hourglass, 
                title: "1. Set Duration", 
                text: "Select from our quick presets or enter a custom duration for your countdown using the intuitive entry field." 
              },
              { 
                icon: Play, 
                title: "2. Trigger Timer", 
                text: "Click start to begin the high-precision countdown. Our engine ensures zero-drift performance for any duration." 
              },
              { 
                icon: Bell, 
                title: "3. Listen for Alert", 
                text: "Once the countdown reaches zero, a high-fidelity audio alert will trigger, even if you are in a different tab." 
              },
              { 
                icon: Maximize2, 
                title: "4. Enable Focus", 
                text: "Enter full-screen mode to eliminate distractions during Pomodoro blocks or fitness interval sessions." 
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
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Timer <span className="text-primary italic">Knowledge Base</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                q: "How many timers can I run simultaneously?", 
                a: "Our platform allows you to manage multiple active countdowns at the same time. You can give each timer a unique label to stay organized across different tasks."
              },
              {
                q: "Does the timer work offline?",
                a: "Once the page is loaded, the core timing logic runs in your browser. However, a stay-active internet connection is recommended for real-time synchronization and sound loading."
              },
              {
                q: "Are there preset times for common tasks?",
                a: "Yes! We offer a library of countdown scenarios for fitness, cooking, and study sessions that you can activate with a single click."
              },
              {
                q: "Can I use the timer in full-screen mode?",
                a: "Absolutely. Our 'focus mode' allows you to expand the timer to fill your entire screen, which is perfect for teaching, workouts, or high-intensity focus sessions."
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
