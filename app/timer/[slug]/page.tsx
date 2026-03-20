import CountdownTimer from '@/components/tools/CountdownTimer'
import StructuredData from '@/components/seo/StructuredData'
import InternalLinks from '@/components/ui/InternalLinks'
import { Metadata } from 'next'
import timerData from '@/data/seo/timers.json'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return timerData.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const seo = timerData.find(t => t.slug === slug)
  
  return {
    title: seo?.title || `${slug.replace(/-/g, ' ')} | Online Timer`,
    description: seo?.description || `Set a ${slug} online. Free, full-screen countdown timer with alarm.`
  }
}

export default async function DynamicTimerPage({ params }: Props) {
  const { slug } = await params
  const seo = timerData.find(t => t.slug === slug)
  
  let initialMinutes = 5
  const match = slug.match(/(\d+)/)
  if (match) initialMinutes = parseInt(match[0])
  if (slug === 'pomodoro') initialMinutes = 25

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": seo?.title,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <StructuredData data={schema} />
      <h1 className="text-4xl md:text-5xl font-black text-center mb-16">
        {seo?.title || slug.replace(/-/g, ' ')}
      </h1>
      <CountdownTimer 
        id={`preset-${slug}`}
        label={seo?.title || slug.replace(/-/g, ' ')}
        initialSeconds={initialMinutes * 60}
        sound="/sounds/alarm.mp3"
      />
      
      <div className="mt-20 prose prose-invert max-w-none bg-card/30 p-8 rounded-3xl border border-card-border">
        <h2>About our {slug.replace(/-/g, ' ')} tool</h2>
        <p className="text-lg text-muted">
          {seo?.content || `This pre-configured timer is set specifically for your convenience. Whether you are timing a workout, a break, or a task, our reliable countdown will alert you precisely when time is up.`}
        </p>
      </div>

      <InternalLinks />
    </div>
  )
}
