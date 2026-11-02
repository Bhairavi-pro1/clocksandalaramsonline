import { Metadata } from 'next'
import AlarmTimeClient from './AlarmTimeClient'
import StructuredData from '@/components/seo/StructuredData'
import alarmData from '@/data/seo/alarms.json'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return alarmData.map((item) => ({ 
    slug: item.slug 
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const seoItem = alarmData.find(a => a.slug === slug)
  
  const cleaned = slug.replace('set-alarm-for-', '').replace(/-/g, ' ').trim()
  const parts = cleaned.split(/\s+/)
  
  let hours = 0
  let minutes = 0
  let period = 'AM'

  const lastPart = parts[parts.length - 1].toUpperCase()
  if (lastPart === 'AM' || lastPart === 'PM') {
    period = lastPart
    parts.pop()
  }

  const timeData = parts.join(':')
  if (timeData.includes(':')) {
    const t = timeData.split(':')
    hours = parseInt(t[0])
    minutes = parseInt(t[1]) || 0
  } else {
    hours = parseInt(timeData)
    minutes = 0
  }
  
  const displayTime = `${hours}:${String(minutes).padStart(2, '0')} ${period}`
  const title = seoItem?.title || `Set Alarm for ${displayTime} — Free Online Alarm`
  const description = seoItem?.description || `Set a free online alarm for ${displayTime} instantly. Choose custom sounds and messages. Works directly in your browser.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://clocksandalarmsonline.com/alarm-clock/${slug}/`
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://clocksandalarmsonline.com/alarm-clock/${slug}/`
    }
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const seoItem = alarmData.find(a => a.slug === slug)

  const cleaned = slug.replace('set-alarm-for-', '').replace(/-/g, ' ').trim()
  const parts = cleaned.split(/\s+/)
  let hours = 0
  let minutes = 0
  let period = 'AM'
  const lastPart = parts[parts.length - 1].toUpperCase()
  if (lastPart === 'AM' || lastPart === 'PM') {
    period = lastPart
    parts.pop()
  }
  const timeData = parts.join(':')
  if (timeData.includes(':')) {
    const t = timeData.split(':')
    hours = parseInt(t[0])
    minutes = parseInt(t[1]) || 0
  } else {
    hours = parseInt(timeData)
    minutes = 0
  }
  const displayTime = `${hours}:${String(minutes).padStart(2, '0')} ${period}`
  const pageTitle = seoItem?.title || `Set Alarm for ${displayTime}`

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": pageTitle,
    "description": seoItem?.description || `High-precision online alarm clock set for ${displayTime}.`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "420",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://clocksandalarmsonline.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Alarm Clock",
        "item": "https://clocksandalarmsonline.com/alarm-clock/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Set Alarm for ${displayTime}`,
        "item": `https://clocksandalarmsonline.com/alarm-clock/${slug}/`
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={breadcrumbSchema} />
      <AlarmTimeClient params={resolvedParams} seoItem={seoItem} />
    </div>
  )
}
