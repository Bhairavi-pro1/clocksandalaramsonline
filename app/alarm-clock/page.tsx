import type { Metadata } from 'next'
import AlarmClockClient from '@/components/pages/AlarmClockClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Bell, Clock, Zap, Shield } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export const metadata: Metadata = {
  title: 'Online Alarm Clock – Professional High-Precision Alert System',
  description: 'A sophisticated yet simple-to-use online alarm clock. Manage multiple alarms with custom labels, high-fidelity sounds, and persistent browser notifications.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/alarm-clock',
  },
  openGraph: {
    title: 'Online Alarm Clock – Professional High-Precision Alert System',
    description: 'Never miss a beat with our persistent, high-fidelity online alarm system. Custom sounds and labels included.',
    type: 'website',
  }
}

export default function AlarmPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Professional Online Alarm Clock",
    "description": "High-precision online alarm clock with custom labels, multiple sound profiles, and persistent browser-based alerts.",
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
        "name": "Will the online alarm work if my browser is closed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For the most reliable experience, you should keep this browser tab open. However, our system uses persistent state management to resume any active alarms immediately if you accidentally close and reopen the site."
        }
      },
      {
        "@type": "Question",
        "name": "Can I set multiple alarms at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can add an unlimited number of alarms with custom labels like 'Work Call', 'Medication', or 'Gym' to keep your whole day organized from one central dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "Are the alarm sounds customizable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We offer a curated library of high-fidelity alert tones, ranging from gentle morning birds to high-energy electronic beeps, ensuring you wake up in the way that suits you best."
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
          Online <span className="text-primary italic">Alarm</span> Clock
        </h1>
      </div>

      <AlarmClockClient />

      {/* High-Precision SEO Content & User Guide (Server Side) */}
      <div className="max-w-6xl mx-auto pb-24 space-y-32">
        {/* Excellent SEO Paragraph */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 mt-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            The Smartest Way to Wake Up
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            Professional Online Alarm Clock <br />
            <span className="text-primary/80">for a Seamless Daily Routine</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Clocks and Alarms Online offers a sophisticated yet simple-to-use alarm clock that integrates seamlessly 
            into your life. Designed for those who wake up with precision and intent, our tool allows you to manage 
            multiple alarms with customized labels and high-fidelity audio tones. Never miss a critical meeting 
            or early flight again with our persistent, browser-based notification system.
          </p>
        </section>

        {/* 📖 New How to Use Section for Alarm Clock */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary not-italic">Master the Alarm Clock</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Clock, 
                title: "1. Set Your Time", 
                text: "Use our precise time picker to select your wake-up or reminder time with high accuracy." 
              },
              { 
                icon: Bell, 
                title: "2. Choose a Tone", 
                text: "Select from our library of high-fidelity alert sounds, from gentle birds to high-energy beeps." 
              },
              { 
                icon: Shield, 
                title: "3. Confirm Settings", 
                text: "Save your alarm and ensure your volume is active. Our persistent system handles the rest." 
              },
              { 
                icon: Zap, 
                title: "4. Stay Synced", 
                text: "Keep the dashboard open for the most reliable experience. Your alarms save automatically." 
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
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Alarm Clock <span className="text-primary italic">Help Center</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                q: "Do I need to stay on this page for the alarm to ring?", 
                a: "Yes, for the best reliability, keep the tab open. Our system utilizes minor background processing to ensure alerts trigger even if you are working in other browser tabs."
              },
              {
                q: "Are my alarms saved if I refresh the page?",
                a: "Yes! Every alarm you configure is automatically stored in your browser's local cache. This means your wake-up schedule persists through refreshes and browser restarts."
              },
              {
                q: "Can I use the alarm clock on my tablet?",
                a: "Absolutely. Our interface is fully responsive and optimized for mobile and tablet devices, providing a premium bedside experience on any screen size."
              },
              {
                q: "Is there a snooze feature available?",
                a: "Yes. When an alarm triggers, you'll have the option to stop the alert or snooze for a few minutes to catch those extra moments of rest."
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
