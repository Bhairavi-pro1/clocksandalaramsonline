import type { Metadata } from 'next'
import WorldClockClient from '@/components/pages/WorldClockClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Search, Globe, Maximize2, Save } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export const metadata: Metadata = {
  title: 'World Clock — Current Local Time Worldwide',
  description: 'Track local time in any city worldwide with high precision. Our world clock supports all major timezones and adjusts automatically for daylight savings time.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/world-clock',
  },
  openGraph: {
    title: 'World Clock — Current Local Time Worldwide',
    description: 'Track local time in any city worldwide with high precision. Sync with global atomic time.',
    type: 'website',
  }
}

export default function WorldClockPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global World Clock Dashboard",
    "description": "High-precision world clock synchronized with global atomic time, featuring persistent city tracking and live weather data.",
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
        "name": "How accurate is this world clock?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our world clock is synchronized with global atomic time servers and utilizes high-resolution system performance counters to ensure millisecond accuracy across all timezones."
        }
      },
      {
        "@type": "Question",
        "name": "Does it automatically adjust for Daylight Saving Time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our system uses the latest IANA Time Zone Database to automatically adjust the local time for every city as soon as a DST transition occurs."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my favorite cities?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Any city you add to your dashboard is automatically saved to your browser's local storage and will be ready for you every time you return to the site."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <div className="text-center space-y-4 animate-in fade-in duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            Global Time Synchronization
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
            World <span className="text-primary italic font-serif">Clock</span> Dashboard
          </h1>
          <p className="text-lg text-muted/60 max-w-3xl mx-auto font-medium">
            Monitor real-time clocks across over 7,000 cities with high-precision atomic sync and persistent tracking.
          </p>
        </div>
      </div>

      <WorldClockClient />

      {/* High-Precision SEO Content & User Guide (Server Side) */}
      <div className="max-w-6xl mx-auto pb-24 px-6 space-y-32 mt-20">
        
        {/* Excellent SEO Paragraph */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            High-Precision World Clock & Global Tracker <br />
            <span className="text-primary/80">for Unmatched Productivity</span>
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            Welcome to the World Clock dashboard on Clocks and Alarms Online. Our high-precision world clock is engineered 
            to deliver millisecond-accurate time synchronization across every corner of the globe. 
            Whether you are managing international teams, trading across markets, or simply keeping in touch 
            with loved ones, our vibrant interface ensures you stay in sync with the world.
          </p>
        </section>

        {/* Comprehensive "How to Use" Guide */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary">Use</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Globe, 
                title: "View Local Time", 
                text: "The main dashboard card instantly syncs with your device to show you your local time with high accuracy." 
              },
              { 
                icon: Search, 
                title: "Add Global Zones", 
                text: "Use the intelligent search bar above the grid to find cities or countries and add them to your persistent dashboard." 
              },
              { 
                icon: Maximize2, 
                title: "Go Full-Screen", 
                text: "Click the expand icon in the corner of any clock to enter a dedicated focus mode, perfect for public displays." 
              },
              { 
                icon: Save, 
                title: "Auto-Save", 
                text: "Your selected timezones are automatically saved to your browser and will load every time you return to the site." 
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
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
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">World Clock <span className="text-primary italic">Expert Insights</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                q: "What is UTC and why is it important?", 
                a: "Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time. Our system uses UTC as the base for all calculations to ensure perfect synchronization between different global regions."
              },
              {
                q: "How often is the weather updated?",
                a: "Weather data for each city is refreshed every 30 minutes to provide you with the most current temperature and conditions alongside the local time."
              },
              {
                q: "Can I use the world clock for meeting planning?",
                a: "Yes! While this dashboard is great for quick checks, we also offer a dedicated Meeting Planner tool that helps you find the perfect time window across multiple zones."
              },
              {
                q: "Is there a limit to how many clocks I can add?",
                a: "There is no hard limit. You can add as many cities as your browser storage allows, making it ideal for large-scale international coordination."
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
