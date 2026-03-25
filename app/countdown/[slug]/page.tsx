import { getHolidays } from '@/lib/holidays'
import holidayData from '@/data/seo/holidays.json'
import HolidayCountdownClient from '@/components/pages/HolidayCountdownClient'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HelpCircle, Calendar, Clock, Maximize2, Info } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const holidays = getHolidays()
  return holidays.map((h) => ({
    slug: h.name.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const holidays = getHolidays()
  const holiday = holidays.find(h => h.name.toLowerCase().replace(/\s+/g, '-') === slug)
  const seoInfo = holidayData.find(h => h.slug === slug)

  if (!holiday) return { title: 'Holiday Not Found' }

  return {
    title: seoInfo?.title || `Countdown to ${holiday.name} — Clocks and Alarms Online`,
    description: seoInfo?.description || `High-precision countdown to ${holiday.name}. Track exactly how much time is left with millisecond accuracy.`,
    alternates: {
      canonical: `https://clocksandalarmsonline.com/countdown/${slug}`,
    },
    openGraph: {
      title: seoInfo?.title || `Countdown to ${holiday.name}`,
      description: seoInfo?.description || `Track the seconds until ${holiday.name} with our professional-grade countdown timer.`,
      type: 'website',
    }
  }
}

export default async function HolidayCountdownPage({ params }: Props) {
  const { slug } = await params
  const holidays = getHolidays()
  const holiday = holidays.find(h => h.name.toLowerCase().replace(/\s+/g, '-') === slug)
  const seoInfo = holidayData.find(h => h.slug === slug)

  if (!holiday) {
    notFound()
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${holiday.name} Countdown Tracker`,
    "description": `Professional-grade high-precision countdown to ${holiday.name} with millisecond accuracy.`,
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
        "name": `How accurate is this ${holiday.name} countdown?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Our countdown uses high-precision system performance counters synchronized with atomic time servers to ensure millisecond accuracy for ${holiday.name}.`
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this countdown in full-screen mode?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool features a cinematic full-screen mode perfect for event displays, office screens, or personal focus during the holiday buildup."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-16 text-center space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest mb-1">
          Holiday Countdown 
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter animate-in fade-in duration-1000">
          {seoInfo?.title || `Countdown to ${holiday.name}`}
        </h1>
      </div>

      <HolidayCountdownClient holiday={holiday} seoInfo={seoInfo} />
      
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdBanner />
      </div>

      {/* SEO Content & Dynamic FAQ Section (Server Side) */}
      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-32">
        <section className="bg-[#1a0b36]/40 p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
          <h2 className="text-3xl font-black text-white">About the {holiday.name} Tracker</h2>
          <div className="text-lg text-muted/80 font-medium leading-relaxed space-y-6">
            <p>
              {seoInfo?.content || `This high-precision countdown is set specifically for ${holiday.name}. Whether you are coordinating travel, preparing gifts, or planning a celebratory event, our reliable global tracker ensures you never miss a second of the holiday season.`}
            </p>
            <p>
              Our platform uses high-precision millisecond tracking synchronized with global atomic time to provide the most accurate countdown on the web. Stay perfectly on schedule with our high-precision countdown system, designed for reliability and visual excellence.
            </p>
          </div>
        </section>

        {/* 📖 New How to Use Section for Holiday Page */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary not-italic">Master the Countdown</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Calendar, 
                title: "1. Global Sync", 
                text: "The countdown automatically synchronizes with the official date and global atomic time servers." 
              },
              { 
                icon: Clock, 
                title: "2. Track Seconds", 
                text: "Monitor the buildup in real-time with millisecond accuracy, ensuring you're ready for the celebration." 
              },
              { 
                icon: Maximize2, 
                title: "3. Full Screen", 
                text: "Use the expansion icon for a cinematic, distraction-free view ideal for public event displays." 
              },
              { 
                icon: Info, 
                title: "4. Holiday Insights", 
                text: "Read expert timing insights and historical context curated specifically for this celebration." 
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
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{holiday.name} <span className="text-primary italic">Countdown FAQ</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                q: `When exactly is ${holiday.name}?`, 
                a: `For this year, ${holiday.name} falls on ${new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`
              },
              {
                q: "What makes this countdown different?",
                a: "Unlike standard web timers, our countdown utilizes high-frequency system performance counters to ensure that the time remains accurate down to the millisecond, even during intense CPU usage."
              },
              {
                q: "Does it work on mobile devices?",
                a: "Yes, our tool is fully responsive and optimized for both iOS and Android, allowing you to track the holiday buildup on any screen size with a premium interface."
              },
              {
                q: "Can I share this countdown?",
                a: "Absolutely. Use the share button in the top right corner to copy the direct link and share the excitement with friends, family, or colleagues."
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
