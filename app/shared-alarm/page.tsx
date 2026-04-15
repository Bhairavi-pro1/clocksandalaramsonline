import type { Metadata } from 'next'
import SharedAlarmDashboard from '@/components/pages/SharedAlarmDashboard'
import SharedAlarmPreview from '@/components/pages/SharedAlarmPreview'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import { Share2, Clock, CheckCircle2, Link2, HelpCircle, GraduationCap, Briefcase, Dumbbell, Utensils, Timer, Globe } from 'lucide-react'
import ToolSEO from '@/components/seo/ToolSEO'

export const metadata: Metadata = {
  title: 'Shared Alarms - Sync Time Together | Clocks and Alarms Online',
  description: 'Create and share alarms instantly without an account. Keep yourself and your team on the same schedule with real-time syncing.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/shared-alarm',
  },
  openGraph: {
    title: 'Shared Alarms - Sync Time Together | Clocks and Alarms Online',
    description: 'Create and share alarms instantly without an account. Keep yourself and your team on the same schedule with real-time syncing.',
    type: 'website',
  }
}

export default async function SharedAlarmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const shareId = typeof params.id === 'string' ? params.id : null;

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
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
          <StructuredData data={softwareSchema} />
          <StructuredData data={faqSchema} />
        </>
      )}

      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-24 pb-20">
          
          {shareId ? (
             <SharedAlarmPreview alarmId={shareId} />
          ) : (
             <>
                <div className="text-center mb-12 animate-in fade-in duration-1000">
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                    Shared <span className="text-primary italic">Alarms</span>
                  </h1>
                  <p className="mt-4 text-white/50 font-medium max-w-xl mx-auto">
                    Create alarms and share them with a link. Stay in sync with friends, family, or colleagues in real-time. No login required.
                  </p>
                </div>
                
                <SharedAlarmDashboard />
                <div className="max-w-7xl mx-auto">
                  <AdBanner />
                </div>

                {/* ToolSEO Integration */}
                <div className="mt-32">
                  <ToolSEO
                    toolName="Shared Alarms"
                    introTag="Seamless Group Coordination"
                    introHeading="Synchronize Your Schedule With the People Who Matter"
                    introParagraph="Our Shared Alarms feature fundamentally bridges the gap between personal timekeeping and complex group coordination. Whether you are reminding a remote team about an upcoming sprint meeting, waking up friends for an early road trip, or syncing a daily medication routine with an elderly parent, you can distribute a live, synchronized alarm to anyone instantly. Real-time websocket updates ensure that everyone stays perfectly on the same page without ever needing to install an app."
                    howToSteps={[
                      { title: "Create the Prototype", text: "Set up a new alarm with a specific time, date, and descriptive title from your primary dashboard as you normally would." },
                      { title: "Generate Share Link", text: "Click the 'Share' icon on your newly created alarm card to instantly generate a secure, unique cryptographic invite link." },
                      { title: "Distribute Invite", text: "Send the secure URL via WhatsApp, Slack, iMessage, or email to whoever needs to be on your synchronized schedule." },
                      { title: "Watch Live Sync", text: "Sit back and watch in real-time as recipients click your link and accept the invite. If you edit the time, their dashboards update instantly." }
                    ]}
                    proTips={[
                      "Are you a streamer or content creator? Drop your shared alarm link in your Discord so your community gets a synchronized audio alert exactly when you go live.",
                      "Use the unified dashboard to track who has accepted your invite so you know exactly who is 'checked in' and ready for the event.",
                      "The link acts as a persistent channel. Even if you change the alarm from 8 AM to 9 AM, you do not need to send out a new link—the websocket pushes the update to all subscribers."
                    ]}
                    useCases={[
                      { icon: Briefcase, title: "For Remote Managers", text: "A project manager creates a shared 'Standup' alarm for 9:45 AM. The entire team gets a unified chime on their respective laptops, eliminating excuses for being late to the Zoom call." },
                      { icon: GraduationCap, title: "For Study Groups", text: "College students use shared alarms to synchronize Pomodoro study sessions across different dorm rooms. When the alarm rings, everyone takes a break at the exact same moment." },
                      { icon: Clock, title: "For Road Trips", text: "Planning to leave at 5 AM? Send the alarm to everyone in the carpool the night before. You control the master clock, ensuring no one oversleeps." },
                      { icon: Utensils, title: "For Family Dinners", text: "Parents can send a shared 'Dinner Time' alarm to their teenagers' laptops. Once it goes off, it's a non-negotiable unified signal to come downstairs." },
                      { icon: Timer, title: "For Online Gamers", text: "Raid leaders in MMOs use shared alarms to ensure their 40-person squad logs in at the precise moment a major world boss spawns." }
                    ]}
                    whyChooseUs={`Most shared scheduling systems require you to download a clunky app, create an account, verify an email, and add people to a 'family plan' just to share a simple timer.
                    
                    Clocks and Alarms Online operates entirely friction-free. Our Shared Alarm infrastructure uses anonymous sessions and secure Supabase real-time websockets. You do not need to log in, and neither do your recipients. The moment you generate a link, the real-time tunnel is established. This allows for massive, spontaneous coordination that standard calendar apps simply cannot compete with.`}
                    troubleshooting={`Invite link not working or alarms not syncing?
                    
                    1. Link Expired: For security and server cleanliness, shared alarms are automatically purged from our database once the set time passes. If your event was yesterday, the link is dead.
                    2. Disconnected Client: If a recipient loses Wi-Fi, they will drop off the real-time sync. The alarm will still ring on their local machine at the previously synced time, but they won't see any live edits you make while they are offline.
                    3. Browser Permissions: The recipient has to explicitly click "Accept" when they open your link. Browsers will strictly block audio alarms from playing unless the user has actively clicked the page first.`}
                    faqs={[
                      { q: "Do I need to create an account to share an alarm?", a: "No! Our Shared Alarm system is completely and entirely login-free. We use a secure, anonymous browser session to link your alarms to your device so you can share instantly." },
                      { q: "How does the real-time syncing actually work?", a: "We utilize persistent websockets. When you as the 'admin' edit the time or title, the change packet is broadcasted to all connected participants globally in under 50 milliseconds without anyone needing to refresh the page." },
                      { q: "What happens when an alarm expires?", a: "For your digital privacy and to keep the global system clean, shared alarms are permanently wiped from our backend servers the moment their scheduled time safely passes." },
                      { q: "If I cross timezones, does the shared alarm break?", a: "No. The alarm is anchored to an absolute point in time (UTC). If you set an alarm for 3 PM in New York, a friend in California who accepts the link will automatically see it scheduled for 12 PM their time." },
                      { q: "Can recipients turn the alarm off?", a: "Recipients can 'leave' the shared group or mute the alert on their local device, but they cannot delete the master alarm for everyone else. Only the creator has admin editing privileges." },
                      { q: "How many people can I share one alarm with?", a: "Currently, our websocket infrastructure supports hundreds of concurrent listeners for a single shared alarm link, making it perfect for both small teams and entire communities." },
                      { q: "Does the link expire?", a: "The link remains active and secure up until the exact moment the alarm rings. Afterward, it self-destructs to ensure privacy." },
                      { q: "Can I use this on my mobile phone?", a: "Absolutely. You can create the alarm on your desktop and text the link to someone's phone. As long as they keep the mobile browser tab active, it will sync perfectly." }
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
