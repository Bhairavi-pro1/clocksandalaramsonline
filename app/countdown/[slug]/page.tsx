import { getHolidays } from '@/lib/holidays'
import holidayData from '@/data/seo/holidays.json'
import HolidayCountdownClient from '@/components/pages/HolidayCountdownClient'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  return (
    <div className="w-full">
      <HolidayCountdownClient holiday={holiday} seoInfo={seoInfo} />
    </div>
  )
}
