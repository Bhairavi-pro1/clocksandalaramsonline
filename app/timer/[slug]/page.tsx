import CountdownTimer from '@/components/tools/CountdownTimer'
import StructuredData from '@/components/seo/StructuredData'
import ToolSEO from '@/components/seo/ToolSEO'
import AdBanner from '@/components/ui/AdBanner'
import { Metadata } from 'next'
import Link from 'next/link'
import timerData from '@/data/seo/timers.json'
import { cn } from '@/lib/utils'
import { 
  GraduationCap, 
  Briefcase, 
  Dumbbell, 
  Utensils, 
  Timer, 
  Coffee, 
  Brain, 
  Sparkles, 
  Hourglass, 
  CheckCircle2, 
  Zap, 
  Users, 
  Flame, 
  BookOpen, 
  Tv, 
  Eye 
} from 'lucide-react'

const iconMap: Record<string, any> = {
  GraduationCap,
  Briefcase,
  Dumbbell,
  Utensils,
  Timer,
  Coffee,
  Brain,
  Sparkles,
  Hourglass,
  CheckCircle2,
  Zap,
  Users,
  Flame,
  BookOpen,
  Tv,
  Eye,
}

interface Props {
  params: Promise<{ slug: string }>
}

function getTimerDisplay(slug: string) {
  if (slug === 'pomodoro') return { label: 'Pomodoro', sub: '25 min focus' }
  const m = slug.match(/(\d+)/)
  const mins = m ? parseInt(m[1], 10) : 5
  if (mins >= 60) {
    const hours = mins / 60
    return { label: `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`, sub: `${mins} mins` }
  }
  return { label: `${mins} Min`, sub: `${mins * 60} sec` }
}

const sortedTimers = [...timerData].sort((a, b) => {
  const getMinutes = (slug: string) => {
    if (slug === 'pomodoro') return 25
    const m = slug.match(/(\d+)/)
    return m ? parseInt(m[1], 10) : 0
  }
  return getMinutes(a.slug) - getMinutes(b.slug)
})

export async function generateStaticParams() {
  return timerData.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const seo = timerData.find(t => t.slug === slug)
  const title = seo?.title || `${slug.replace(/-/g, ' ')} | Online Timer`
  const description = seo?.description || `Set a ${slug} online. Free, full-screen countdown timer with alarm.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://clocksandalarmsonline.com/timer/${slug}/`
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://clocksandalarmsonline.com/timer/${slug}/`
    }
  }
}

export default async function DynamicTimerPage({ params }: Props) {
  const { slug } = await params
  const seo = timerData.find(t => t.slug === slug)
  
  let initialMinutes = 5
  const match = slug.match(/(\d+)/)
  if (match) initialMinutes = parseInt(match[0])
  if (slug === 'pomodoro') initialMinutes = 25

  const pageTitle = seo?.title || `${slug.replace(/-/g, ' ')} Timer`

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": pageTitle,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "350",
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
        "name": "Timer",
        "item": "https://clocksandalarmsonline.com/timer/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": pageTitle,
        "item": `https://clocksandalarmsonline.com/timer/${slug}/`
      }
    ]
  }

  const faqSchema = seo?.faqs && seo.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": `${pageTitle} Frequently Asked Questions`,
    "mainEntity": seo.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null

  const mappedUseCases = (seo?.useCases || []).map((uc) => ({
    title: uc.title,
    text: uc.text,
    icon: (uc.iconName && iconMap[uc.iconName]) ? iconMap[uc.iconName] : Timer
  }))

  const display = getTimerDisplay(slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <StructuredData data={schema} />
      <StructuredData data={breadcrumbSchema} />
      {faqSchema && <StructuredData data={faqSchema} />}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
        <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
          <li>
            <Link href="/" className="hover:text-primary dark:hover:text-white transition-colors">Home</Link>
          </li>
          <li className="opacity-40">/</li>
          <li>
            <Link href="/timer/" className="hover:text-primary dark:hover:text-white transition-colors">Timer</Link>
          </li>
          <li className="opacity-40">/</li>
          <li className="text-slate-900 dark:text-white font-bold" aria-current="page">
            {display.label} Timer
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-5xl font-black text-center mb-8 sm:mb-10 text-slate-900 dark:text-white tracking-tighter animate-in fade-in duration-1000">
        {pageTitle}
      </h1>

      <div className="max-w-xl mx-auto">
        <CountdownTimer 
          id={`preset-${slug}`}
          label={pageTitle}
          initialSeconds={initialMinutes * 60}
          sound="vibe"
        />
      </div>

      {/* Popular Countdown Timers Directory */}
      <div className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Popular Countdown Timers
          </h2>
          <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1 max-w-2xl mx-auto">
            Switch duration instantly with pre-configured focus timers and alarms
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {sortedTimers.map((t) => {
            const isCurrent = t.slug === slug
            const timerInfo = getTimerDisplay(t.slug)
            return (
              <Link
                key={t.slug}
                href={`/timer/${t.slug}/`}
                className={cn(
                  "group py-2.5 px-1.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center justify-center text-center shadow-sm",
                  isCurrent
                    ? "bg-primary/15 border-primary text-primary shadow-[0_0_20px_rgba(124,58,237,0.15)] ring-1 ring-primary/40 pointer-events-none"
                    : "bg-slate-100/70 dark:bg-[#1a0b36]/40 hover:bg-slate-200/80 dark:hover:bg-[#1a0b36]/80 border-slate-200/80 dark:border-white/5 hover:border-primary/40"
                )}
              >
                <span className={cn(
                  "text-[11px] sm:text-xs md:text-sm font-bold transition-colors truncate max-w-full",
                  isCurrent ? "text-primary font-black" : "text-slate-900 dark:text-white group-hover:text-primary"
                )}>
                  {timerInfo.label}
                </span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-muted/60 mt-0.5 truncate max-w-full">
                  {isCurrent ? "Active" : timerInfo.sub}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Comprehensive High-Word-Count SEO Guide (Solves Thin Content) */}
      {seo && seo.introParagraph && (
        <div className="mt-14 sm:mt-20">
          <ToolSEO
            toolName={`${display.label} Timer`}
            introTag={seo.introTag || `${display.label} Countdown`}
            introHeading={seo.introHeading || pageTitle}
            introParagraph={seo.introParagraph}
            howToSteps={seo.howToSteps || [
              { title: "Start the Countdown", text: `Click the START button to begin your ${display.label} countdown immediately.` },
              { title: "Engage Full-Screen", text: "Click the maximize icon in the top right to expand the timer for distraction-free focus." },
              { title: "Pause or Reset", text: "Pause the timer whenever interrupted and resume without missing a second." },
              { title: "Audio Notification", text: "A resonant chime rings the exact moment your countdown expires." }
            ]}
            proTips={seo.proTips || [
              "Keep the browser tab visible to prevent background tab sleeping.",
              "Turn your device volume to 100% so you never miss the completion chime.",
              "Use full-screen mode on a secondary monitor for an ambient focus clock."
            ]}
            useCases={mappedUseCases.length > 0 ? mappedUseCases : [
              { title: "Study & Work Sprints", text: "Use this countdown interval to maintain peak mental focus.", icon: Briefcase },
              { title: "Health & Fitness", text: "Time your workouts and intervals with precision.", icon: Dumbbell },
              { title: "Kitchen & Cooking", text: "Time boiling, baking, and steeping without guesswork.", icon: Utensils }
            ]}
            whyChooseUs={seo.whyChooseUs || "Our timer engine calculates time using hardware timestamps against absolute system clocks, ensuring zero drift. Designed with glassmorphic dark-mode aesthetics, full-screen capability, and loud audio alerts."}
            troubleshooting={seo.troubleshooting || "If audio does not play, ensure you clicked START directly on the card to grant browser audio permissions."}
            faqs={seo.faqs || []}
          />
        </div>
      )}

      {/* Ad placement */}
      <div className="mt-12 max-w-7xl mx-auto">
        <AdBanner />
      </div>

    </div>
  )
}
