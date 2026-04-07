import type { Metadata } from 'next'
import HomeClient from '@/components/pages/HomeClient'
import StructuredData from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Free Online Alarm Clock, World Clock & Timers | Clocks and Alarms Online',
  description: 'The ultimate free online alarm clock and world clock suite. Set precision alarms, track global time, and use our countdown timer full screen. No login required.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com',
  },
  openGraph: {
    title: 'Free Online Alarm Clock & World Clock | Clocks and Alarms Online',
    description: 'The gold standard in online timekeeping. Loud alarm clock online options, precise world clocks, and timers with a vibrant interface.',
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
          "text": "No. All your data, alarms, and world clocks are stored locally in your browser. No login or account is required to use our free alarm."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best online world clock?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best online world clocks provide high-precision atomic syncing and support thousands of cities like ours, allowing you to track global time without creating an account."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use a free alarm with no account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our free online alarm clock works entirely within your browser without requiring an account or login. Your alarms are saved securely using local browser storage."
        }
      }
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://clocksandalarmsonline.com"
    }]
  }

  return (
    <div className="w-full">
      <StructuredData data={websiteSchema} />
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <HomeClient />
    </div>
  )
}
