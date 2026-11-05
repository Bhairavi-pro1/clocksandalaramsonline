import type { Metadata } from 'next'
import Link from 'next/link'
import SharedTimerDashboard from '@/components/pages/SharedTimerDashboard'
import SharedTimerRoom from '@/components/pages/SharedTimerRoom'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import ToolSEO from '@/components/seo/ToolSEO'
import timerData from '@/data/seo/timers.json'
import { cn } from '@/lib/utils'
import { 
  Users, Timer, Sparkles, Clock, CheckCircle2, 
  Briefcase, GraduationCap, Dumbbell, Code, Coffee, Globe
} from 'lucide-react'

export const metadata: Metadata = {
  title: {
    absolute: 'Shared Timer — Real-Time Synchronized Group Countdown | Clocks & Alarms'
  },
  description: 'Create and share real-time group timers with friends, teams, or classrooms. Synchronize countdowns across all devices with zero drift and automatic 5-minute cleanup.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/shared-timer/',
  },
  openGraph: {
    title: 'Shared Timer — Real-Time Synchronized Group Countdown | Clocks & Alarms',
    description: 'Create and share real-time group timers with friends, teams, or classrooms. Synchronize countdowns across all devices with zero drift and automatic 5-minute cleanup.',
    url: 'https://clocksandalarmsonline.com/shared-timer/',
    siteName: 'Clocks and Alarms Online',
    type: 'website',
    images: [
      {
        url: 'https://clocksandalarmsonline.com/icon.png',
        width: 512,
        height: 512,
        alt: 'Shared Timer - Clocks and Alarms Online'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Shared Timer — Real-Time Synchronized Group Countdown | Clocks & Alarms',
    description: 'Create and share real-time group timers with friends, teams, or classrooms. Synchronize countdowns across all devices with zero drift and automatic 5-minute cleanup.',
    images: ['https://clocksandalarmsonline.com/icon.png'],
  }
}

const getTimerDisplay = (slug: string) => {
  switch (slug) {
    case 'pomodoro': return { label: '25 Min', sub: 'Pomodoro' }
    case '1-minute': return { label: '1 Min', sub: 'Quick Drill' }
    case '2-minute': return { label: '2 Min', sub: 'Speed Check' }
    case '3-minute': return { label: '3 Min', sub: 'Brief Pitch' }
    case '5-minute': return { label: '5 Min', sub: 'Quick Standup' }
    case '10-minute': return { label: '10 Min', sub: 'Lightning Talk' }
    case '15-minute': return { label: '15 Min', sub: 'Team Sprint' }
    case '20-minute': return { label: '20 Min', sub: 'Focus Interval' }
    case '30-minute': return { label: '30 Min', sub: 'Meeting Block' }
    case '45-minute': return { label: '45 Min', sub: 'Deep Work' }
    case '60-minute': return { label: '60 Min', sub: 'Full Hour' }
    default: return { label: slug.replace('-minute', ' Min').toUpperCase(), sub: 'Timer' }
  }
}

const timerOrder = ['pomodoro', '5-minute', '10-minute', '15-minute', '20-minute', '30-minute', '45-minute', '60-minute']
const featuredTimers = [...timerData]
  .filter(t => timerOrder.includes(t.slug))
  .sort((a, b) => timerOrder.indexOf(a.slug) - timerOrder.indexOf(b.slug))

export default async function SharedTimerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const roomParam = typeof params.room === 'string' ? params.room : (typeof params.id === 'string' ? params.id : null)

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
        "name": "Shared Timer",
        "item": "https://clocksandalarmsonline.com/shared-timer/"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Shared Timer Tool",
    "description": "Create, distribute, and synchronize group countdown timers across multiple devices globally in real-time with zero drift and zero registration required.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "512",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Frequently Asked Questions About Shared Timer",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I need to sign up or create an account to use Shared Timer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! Our Shared Timer is 100% login-free and registration-free. We use anonymous session tokens to let you host, invite, and control rooms immediately."
        }
      },
      {
        "@type": "Question",
        "name": "How does time synchronization work across different time zones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike shared alarms which can get confusing across time zone boundaries, a Shared Timer counts down duration against a standardized Epoch timestamp (endsAt). All participants worldwide reach 00:00 at the exact same physical millisecond."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if a participant joins after the timer has already started?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mid-session joiners automatically calculate the exact remaining seconds based on the target completion timestamp, instantly joining the active session in progress with zero manual adjustment."
        }
      },
      {
        "@type": "Question",
        "name": "How long is the timer data saved in the cloud?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To keep database storage lean, clean, and private, every timer room and its participant records are automatically and permanently deleted 5 minutes after the timer finishes."
        }
      },
      {
        "@type": "Question",
        "name": "Does the countdown consume database reads every second?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The second-by-second countdown runs 100% locally on each participant device using high-precision hardware timestamps. Firestore is only contacted on state changes (start, pause, resume, reset, or delete), making it lightning-fast and efficient."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      {!roomParam && (
        <>
          <StructuredData data={breadcrumbSchema} />
          <StructuredData data={softwareSchema} />
          <StructuredData data={faqSchema} />
        </>
      )}

      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-2 sm:pt-6 md:pt-10 pb-12 sm:pb-20">
          {roomParam ? (
            <SharedTimerRoom roomId={roomParam} />
          ) : (
            <>
              {/* Visual Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
                  <li>
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  </li>
                  <li className="opacity-40">/</li>
                  <li className="text-slate-900 dark:text-white font-bold" aria-current="page">Shared Timer</li>
                </ol>
              </nav>

              <SharedTimerDashboard />

              {/* Popular Solo Countdown Presets Directory */}
              <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-white/10">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
                    <Timer className="w-5 h-5 text-primary" />
                    Popular Solo Countdown Presets
                  </h2>
                  <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
                    Need an individual focus timer? Jump straight into pre-calibrated productivity countdowns
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
                  {featuredTimers.map((t) => {
                    const display = getTimerDisplay(t.slug)
                    return (
                      <Link
                        key={t.slug}
                        href={t.slug === 'pomodoro' ? '/timer/pomodoro/' : `/timer/${t.slug}/`}
                        className={cn(
                          "group p-3 rounded-2xl border transition-all text-center flex flex-col justify-center items-center shadow-sm relative",
                          "bg-slate-50 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/5 hover:border-primary/50 hover:bg-primary/5 text-slate-900 dark:text-white hover:shadow-md"
                        )}
                      >
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {display.label}
                        </div>
                        <div className="text-[10px] sm:text-[11px] mt-0.5 font-medium text-slate-500 dark:text-muted">
                          {display.sub}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="max-w-7xl mx-auto my-8 md:my-12">
                <AdBanner />
              </div>

              {/* ToolSEO Integration */}
              <div className="mt-12 md:mt-16">
                <ToolSEO
                  toolName="Shared Timer"
                  introTag="Multiplayer Countdown Synchronization"
                  introHeading="Synchronize Team Sprints, Classrooms, and Focus Blocks in Real-Time"
                  introParagraph="Our Shared Timer brings distributed teams, classrooms, workout partners, and study groups together into a synchronized countdown room. Whether you are running an agile sprint standup, moderating a competitive hackathon pitch session, synchronizing a virtual classroom quiz, or pacing a high-intensity interval training (HIIT) workout, our multiplayer timer ensures every participant experiences the exact same countdown progression down to the millisecond. No logins, zero installs, and perfectly time-zone agnostic."
                  howToSteps={[
                    { title: "Create Your Timer Room", text: "Choose your planned duration (e.g., 15 minutes, 25-minute Pomodoro, or custom hours/minutes), give it a title, pick your alert chime, and click Create." },
                    { title: "Share Your Invite Link", text: "Click the Share button to copy the unique room link (or share the room code) via Slack, Microsoft Teams, WhatsApp, Discord, or email." },
                    { title: "Gather in the Lobby", text: "Participants join the lobby in real time. Host sees connected teammates, while guests unlock audio permissions with a single tap." },
                    { title: "Synchronized Start & Control", text: "When everyone is ready, the host clicks START. The timer launches for every participant simultaneously across the globe." }
                  ]}
                  proTips={[
                    "Mid-Session Joiners: Arriving late? No problem! Anyone opening the room link while a timer is active automatically jumps into the correct remaining second without disrupting others.",
                    "Host Controls: The creator has exclusive host authority to pause, resume, or reset the countdown. Participants' screens update dynamically the instant a state change occurs.",
                    "Lean Database Design: All completed timers and participant lists are automatically purged from database storage 5 minutes after finishing, keeping your history tidy and private.",
                    "Zero Battery Drain: The countdown renders at 60fps locally on each client device, querying cloud servers only when control actions take place."
                  ]}
                  useCases={[
                    { icon: Briefcase, title: "For Agile Sprints & Standups", text: "Scrum masters keep daily 15-minute standups strictly on schedule by displaying a shared countdown visible to every remote engineer." },
                    { icon: GraduationCap, title: "For Teachers & Online Classrooms", text: "Educators pace timed reading tests, breakout group discussions, and pop quizzes where every student must finish together." },
                    { icon: Code, title: "For Hackathons & Live Pitches", text: "Enforce strict 3-minute or 5-minute presentation time limits during hackathons, demo days, and startup pitches with a transparent clock." },
                    { icon: Coffee, title: "For Group Pomodoro Sessions", text: "Study with friends remotely using shared 25-minute deep focus sprints followed by synchronized 5-minute coffee breaks." },
                    { icon: Dumbbell, title: "For Fitness Bootcamps & Workouts", text: "Personal trainers sync timed plank challenges, circuit intervals, and rest periods with remote clients effortlessly." },
                    { icon: Globe, title: "For Distributed Remote Teams", text: "Eliminate time-zone confusion. A 10-minute countdown is exactly 10 minutes whether you are in Tokyo, London, or San Francisco." }
                  ]}
                  whyChooseUs={`Most collaboration tools require everyone to register an account, download a heavy desktop application, or join a complex corporate workspace just to share a simple timer.
                  
                  Clocks and Alarms Online operates completely friction-free. Our Shared Timer architecture utilizes lightweight real-time state synchronization. You do not need an account, and neither do your attendees. Generate a link in three seconds, start the timer, and focus on what truly matters.`}
                  troubleshooting={`Questions about room connections or audio playback?
                  
                  1. Audio Playback: Modern web browsers require a user interaction (like clicking "Join Room" or anywhere on the page) before allowing audio playback. Ensure your participants tap the screen to unlock the end-of-timer chime.
                  2. Room Expired: Once a timer finishes, it remains available for 5 minutes for participants to review, after which the room is permanently removed to conserve cloud storage.
                  3. Connection Drops: If your device temporarily loses internet connection, the local countdown clock continues ticking accurately based on the original server anchor.`}
                  faqs={[
                    { q: "Do participants need an account or login to join a shared timer?", a: "No! Participants simply click your link or enter the 7-character room code. No registration, email verification, or password is required." },
                    { q: "How does time synchronization stay accurate across different time zones?", a: "Unlike static alarms that depend on local clock settings, the Shared Timer calculates duration against a universal server timestamp (endsAt). Every participant counts down to the exact same physical moment in time." },
                    { q: "What happens if someone joins midway through an active countdown?", a: "Mid-session joiners automatically calculate how many seconds have elapsed and join the active countdown in seamless synchronization." },
                    { q: "Can guests pause or reset the timer?", a: "No. Only the host who created the room holds the secure authentication token required to start, pause, resume, or reset the countdown." },
                    { q: "How long does a shared timer room remain active?", a: "A room remains active during the waiting lobby and countdown phases. Exactly 5 minutes after the timer finishes, all room and participant data are automatically erased from cloud storage." },
                    { q: "Does the countdown drain my data or server quotas?", a: "Not at all. The timer ticks 100% on your device hardware using requestAnimationFrame. Database operations only happen on state transitions like starting or pausing." },
                    { q: "Can I use Shared Timer on smartphones and tablets?", a: "Yes! Shared Timer is fully responsive and optimized for mobile screens, tablets, laptops, and large monitor displays." }
                  ]}
                />
              </div>

              <div className="mt-16 max-w-7xl mx-auto">
                <AdBanner />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

