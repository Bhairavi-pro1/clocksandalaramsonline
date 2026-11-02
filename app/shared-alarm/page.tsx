import type { Metadata } from 'next'
import Link from 'next/link'
import SharedAlarmDashboard from '@/components/pages/SharedAlarmDashboard'
import SharedAlarmPreview from '@/components/pages/SharedAlarmPreview'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import { Share2, Clock, CheckCircle2, Link2, HelpCircle, GraduationCap, Briefcase, Dumbbell, Utensils, Timer, Globe, Bell } from 'lucide-react'
import ToolSEO from '@/components/seo/ToolSEO'
import alarmData from '@/data/seo/alarms.json'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Shared Alarms — Sync Time Together in Real Time',
  description: 'Create and share alarms instantly without an account. Keep your team, family, or friends on the same schedule with real-time atomic syncing.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/shared-alarm/',
  },
  openGraph: {
    title: 'Shared Alarms — Sync Time Together in Real Time',
    description: 'Create and share alarms instantly without an account. Keep your team on the same schedule with real-time syncing.',
    url: 'https://clocksandalarmsonline.com/shared-alarm/',
    siteName: 'Clocks and Alarms Online',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Shared Alarms - Clocks and Alarms Online'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Shared Alarms — Sync Time Together in Real Time',
    description: 'Create and share alarms instantly without an account. Keep your team on the same schedule with real-time syncing.',
    images: ['/icon.png'],
  }
}

const getAlarmDisplay = (slug: string) => {
  switch (slug) {
    case '6-am': return { label: '6 AM', sub: 'Early Riser' }
    case '7-am': return { label: '7 AM', sub: 'Wake Up Call' }
    case '8-am': return { label: '8 AM', sub: 'Work & School' }
    case '9-am': return { label: '9 AM', sub: 'Morning Sync' }
    case '10-am': return { label: '10 AM', sub: 'Late Morning' }
    case '12-pm': return { label: '12 PM', sub: 'Midday / Lunch' }
    case '6-pm': return { label: '6 PM', sub: 'Evening Routine' }
    case '12-am': return { label: 'Midnight', sub: 'Night Reminder' }
    default: return { label: slug.toUpperCase(), sub: 'Alarm' }
  }
}

const alarmOrder = ['6-am', '7-am', '8-am', '9-am', '10-am', '12-pm', '6-pm', '12-am']
const sortedAlarms = [...alarmData].sort((a, b) => {
  const iA = alarmOrder.indexOf(a.slug)
  const iB = alarmOrder.indexOf(b.slug)
  return (iA === -1 ? 99 : iA) - (iB === -1 ? 99 : iB)
})

export default async function SharedAlarmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const shareId = typeof params.id === 'string' ? params.id : null;

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
        "name": "Shared Alarm",
        "item": "https://clocksandalarmsonline.com/shared-alarm/"
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Shared Alarms Tool",
    "description": "Create, distribute, and sync alarms across multiple devices in real-time instantly without any login required.",
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
      "ratingCount": "430",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Frequently Asked Questions",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I need to create an account to share an alarm?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! Our Shared Alarm system is completely login-free. We use a secure, anonymous session to link your alarms to your browser so you can create and share instantly."
        }
      },
      {
        "@type": "Question",
        "name": "How does real-time syncing work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When you edit the time or title of an alarm, or when someone accepts your invite, the changes propagate to all connected participants instantly without needing to refresh the page."
        }
      },
      {
        "@type": "Question",
        "name": "What happens when an alarm expires?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For your privacy and to keep the system clean, shared alarms are permanently deleted from our servers the moment their time passes."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      {!shareId && (
        <>
          <StructuredData data={breadcrumbSchema} />
          <StructuredData data={softwareSchema} />
          <StructuredData data={faqSchema} />
        </>
      )}

      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-10 pb-20">
          
          {shareId ? (
             <SharedAlarmPreview alarmId={shareId} />
          ) : (
             <>
                {/* Visual Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="mb-4">
                  <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
                    <li>
                      <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    </li>
                    <li className="opacity-40">/</li>
                    <li className="text-slate-900 dark:text-white font-bold" aria-current="page">Shared Alarm</li>
                  </ol>
                </nav>

                <div className="text-center pt-2 md:pt-4 mb-8 md:mb-12 animate-in fade-in duration-1000 space-y-2 md:space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">
                    Multi-Device Synchronization
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                    Shared <span className="text-primary italic font-serif">Alarms</span>
                  </h1>
                  <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-white/60 font-medium max-w-xl mx-auto">
                    Create alarms and share them with a link. Stay in sync with friends, family, or colleagues in real-time across all devices with zero login required.
                  </p>
                </div>
                
                <SharedAlarmDashboard />

                {/* Popular Alarm Times Directory */}
                <div className="mt-12 md:mt-16 pt-8 border-t border-slate-200/80 dark:border-white/10">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Popular Alarm Times
                    </h2>
                    <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
                      Explore pre-configured online alarm wake-up times and reminders
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
                    {sortedAlarms.map((a) => {
                      const display = getAlarmDisplay(a.slug);
                      return (
                        <Link
                          key={a.slug}
                          href={`/alarm-clock/${a.slug}/`}
                          className={cn(
                            "group p-2 sm:p-3 rounded-2xl border transition-all text-center flex flex-col justify-center items-center shadow-sm relative",
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
                      );
                    })}
                  </div>
                </div>

                <div className="max-w-7xl mx-auto my-8 md:my-12">
                  <AdBanner />
                </div>

                {/* ToolSEO Integration */}
                <div className="mt-12 md:mt-16">
                  <ToolSEO
                    toolName="Shared Alarms"
                    introTag="Seamless Group Coordination"
                    introHeading="Synchronize Your Schedule With the People Who Matter"
                    introParagraph="Our Shared Alarms feature fundamentally bridges the gap between personal timekeeping and complex group coordination. Whether you are reminding a remote team about an upcoming sprint meeting, waking up friends for an early road trip, or syncing a daily medication routine with an elderly parent, you can distribute a live, synchronized alarm to anyone instantly. Real-time updates ensure that everyone stays perfectly on the same page without ever needing to install an app."
                    howToSteps={[
                      { title: "Create the Alarm", text: "Set up a new alarm with a specific time, date, and descriptive title from your dashboard." },
                      { title: "Generate Share Link", text: "Click the 'Share' icon on your newly created alarm card to instantly copy a secure, unique invite link." },
                      { title: "Distribute Invite", text: "Send the secure URL via WhatsApp, Slack, iMessage, or email to whoever needs to be on your synchronized schedule." },
                      { title: "Watch Live Sync", text: "Recipients click your link and accept the invite. If you edit the time or title, their dashboards update in real-time." }
                    ]}
                    proTips={[
                      "Are you a streamer or host? Share your alarm link with your community so everyone gets a synchronized audio alert when your stream begins.",
                      "Use the unified dashboard to track who has accepted your invite so you know exactly who is checked in.",
                      "The link acts as a persistent channel. Even if you change the alarm time, the update pushes to all connected participants automatically."
                    ]}
                    useCases={[
                      { icon: Briefcase, title: "For Remote Teams", text: "A project manager creates a shared standup alarm for 9:45 AM. The entire team gets a unified chime, eliminating excuses for missing sprint meetings." },
                      { icon: GraduationCap, title: "For Study Groups", text: "Students use shared alarms to synchronize Pomodoro study sessions across different locations so everyone takes a break together." },
                      { icon: Clock, title: "For Road Trips", text: "Planning an early departure? Send the alarm to everyone in the carpool the night before to keep departure on track." },
                      { icon: Utensils, title: "For Family Routines", text: "Send a shared dinner or chore alarm to family members' devices for a clear, unified reminder." },
                      { icon: Timer, title: "For Online Events", text: "Event organizers use shared alarms to ensure participants join precisely when the session or tournament begins." }
                    ]}
                    whyChooseUs={`Most shared scheduling systems require you to download a clunky app, create an account, verify an email, and add people to a complex workspace just to share a simple timer.
                    
                    Clocks and Alarms Online operates entirely friction-free. Our Shared Alarm infrastructure uses anonymous sessions and real-time synchronization. You do not need to log in, and neither do your recipients. The moment you generate a link, the real-time sync is established.`}
                    troubleshooting={`Invite link not working or alarms not syncing?
                    
                    1. Link Expired: For security and server cleanliness, shared alarms are automatically purged from our database once the set time passes.
                    2. Disconnected Client: If a recipient loses internet connectivity, the alarm will still ring locally at the previously synced time, but live edits will resume once reconnected.
                    3. Browser Permissions: The recipient has to click "Accept" when they open your link so browsers allow audio playback.`}
                    faqs={[
                      { q: "Do I need to create an account to share an alarm?", a: "No! Our Shared Alarm system is completely and entirely login-free. We use a secure, anonymous browser session to link your alarms to your device so you can share instantly." },
                      { q: "How does the real-time syncing actually work?", a: "We utilize real-time cloud database synchronization. When you edit the time or title, the change packet is broadcasted to all connected participants without anyone needing to refresh the page." },
                      { q: "What happens when an alarm expires?", a: "For your digital privacy and to keep the global system clean, shared alarms are permanently wiped from our backend servers once their scheduled time safely passes." },
                      { q: "If I cross timezones, does the shared alarm break?", a: "No. The alarm is anchored to an absolute point in time (UTC). If you set an alarm for 3 PM in New York, a friend in California who accepts the link will automatically see it scheduled for 12 PM their time." },
                      { q: "Can recipients turn the alarm off?", a: "Recipients can decline or mute the alert on their local device, but they cannot delete the master alarm for everyone else. Only the creator has editing privileges." },
                      { q: "How many people can I share one alarm with?", a: "Our infrastructure supports concurrent listeners for a single shared alarm link, making it perfect for both small teams and large groups." },
                      { q: "Does the link expire?", a: "The link remains active up until the alarm rings, after which it automatically cleans up." },
                      { q: "Can I use this on mobile phones?", a: "Absolutely. You can create the alarm on your desktop and text the link to someone's phone. As long as the mobile browser tab is active, it will sync and ring." }
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
