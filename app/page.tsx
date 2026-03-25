import type { Metadata } from 'next'
import HomeClient from '@/components/pages/HomeClient'
import StructuredData from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Clocks and Alarms Online — High-Precision World Clock & Global Tracker',
  description: 'The gold standard in online timekeeping. Track world time, set alarms, and use high-precision timers with a vibrant, intuitive interface. Synchronized with world atomic time.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com',
  },
  openGraph: {
    title: 'Clocks and Alarms Online — High-Precision World Clock & Global Tracker',
    description: 'Precision meets design. The ultimate suite of professional-grade timekeeping tools.',
    type: 'website',
  }
}

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Clocks and Alarms Online",
    "description": "Professional-grade high-precision online timekeeping suite including world clock, alarm clock, stopwatch, and countdown timers.",
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
        "name": "Can I save multiple world clocks on my dashboard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can add any of our 7,000+ available cities to your dashboard. Your selections are automatically saved using local browser storage."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an account to use the alarms and clocks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All your data, alarms, and world clocks are stored locally in your browser. No login or account is required."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={websiteSchema} />
      <StructuredData data={faqSchema} />
      <HomeClient />
    </div>
  )
}
