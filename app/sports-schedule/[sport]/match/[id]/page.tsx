import type { Metadata } from 'next'
import Link from 'next/link'
import { getSportsMatches, generateSingleMatchSchema, getSportSlug } from '@/lib/sports'
import MatchDetailsClient from '@/components/pages/MatchDetailsClient'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'

interface Props {
  params: Promise<{ sport: string; id: string }>
}

export async function generateStaticParams() {
  const matches = await getSportsMatches()
  return matches.map((match) => ({
    sport: getSportSlug(match.sport),
    id: match.id
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport, id } = await params
  const matches = await getSportsMatches()
  const match = matches.find((m) => m.id === id)
  
  const title = match 
    ? `${match.title} Kickoff Time (${match.tournament}) – Converted`
    : 'Match Kickoff Time timezone converter'
  const description = match
    ? `Convert kickoff time for ${match.title} in the ${match.tournament} (venue: ${match.venue}) to any local timezone dynamically.`
    : 'Track sports match kickoff times in any timezone globally.'
  
  const keywords = match
    ? [
        'FIFA World Cup 2026',
        match.title,
        match.tournament,
        match.venue,
        `${match.title} kickoff time`,
        `${match.title} local time`,
        'match kickoff time converter',
        'sports timezone converter',
        'what time is the match',
        'local match timezone conversion'
      ]
    : ['sports schedule', 'kickoff times', 'timezone converter', 'FIFA World Cup 2026']

  const canonical = `https://clocksandalarmsonline.com/sports-schedule/${sport}/match/${id}/`

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Clocks and Alarms Online',
      type: 'website',
      images: [
        {
          url: 'https://clocksandalarmsonline.com/assets/clock_site_logo.png',
          width: 800,
          height: 800,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://clocksandalarmsonline.com/assets/clock_site_logo.png'],
    }
  }
}

export default async function MatchDetailsPage({ params }: Props) {
  const { sport, id } = await params
  const matches = await getSportsMatches()
  const match = matches.find((m) => m.id === id)
  
  if (!match) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-4xl font-black text-white">Match Not Found</h1>
        <p className="text-white/60 text-sm">The match event you are looking for does not exist or has expired.</p>
        <Link 
          href={`/sports-schedule/${sport}/`} 
          className="inline-block bg-primary hover:bg-primary/80 transition-all px-8 py-3 rounded-2xl font-bold text-white text-xs uppercase tracking-wider"
        >
          Back to FIFA World Cup 2026
        </Link>
      </div>
    )
  }

  const matchSchema = generateSingleMatchSchema(match)

  return (
    <div className="w-full">
      <StructuredData data={matchSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <h1 className="text-4xl md:text-5xl font-black text-center mb-10 text-white tracking-tighter">
          Match <span className="text-primary italic">Details</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 font-sans">
        <MatchDetailsClient match={match} />
      </div>

      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
