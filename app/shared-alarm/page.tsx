import type { Metadata } from 'next'
import SharedAlarmDashboard from '@/components/pages/SharedAlarmDashboard'
import SharedAlarmPreview from '@/components/pages/SharedAlarmPreview'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import { Share2, Clock, CheckCircle2, Link2, HelpCircle } from 'lucide-react'

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

                {/* High-Precision SEO Content & User Guide (Server Side) */}
                <div className="max-w-6xl mx-auto mt-32 pb-8 space-y-32">
                  
                  {/* Excellent SEO Paragraph */}
                  <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                      Seamless Group Coordination
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
                      Synchronize Your Schedule <br />
                      <span className="text-primary/80">With the People Who Matter</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
                      Our Shared Alarms feature bridges the gap between personal timekeeping and group coordination. Whether you're reminding a team about an upcoming meeting, waking up friends for an early road trip, or syncing a daily stand-up, you can distribute a live alarm to anyone instantly. Real-time updates ensure that everyone stays perfectly on the same page.
                    </p>
                  </section>

                  {/* 📖 How to Use Section */}
                  <section className="space-y-16">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">How to <span className="text-primary not-italic">Share an Alarm</span></h2>
                      <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                        { 
                          icon: Clock, 
                          title: "1. Create", 
                          text: "Set up a new alarm with a specific time, date, and title from your dashboard." 
                        },
                        { 
                          icon: Link2, 
                          title: "2. Generate Link", 
                          text: "Click the Share button on your alarm card to instantly copy a unique invite link." 
                        },
                        { 
                          icon: Share2, 
                          title: "3. Distribute", 
                          text: "Send the link via WhatsApp, Slack, or email to whoever needs the reminder." 
                        },
                        { 
                          icon: CheckCircle2, 
                          title: "4. Live Sync", 
                          text: "Watch in real-time as recipients accept the invite. Edit the time and everyone updates instantly." 
                        }
                      ].map((item, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] bg-[#1a0b36]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
                          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                          <p className="text-sm text-muted/80 leading-relaxed font-medium">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* FAQ Section */}
                  <section className="space-y-16">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Shared Alarms <span className="text-primary italic">Help Center</span></h2>
                      <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {faqSchema.mainEntity.map((faq, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
                          <div className="flex gap-4 mb-4">
                            <HelpCircle className="text-primary group-hover:scale-110 transition-transform flex-shrink-0 mt-1" />
                            <h3 className="text-lg font-bold text-white tracking-tight">{faq.name}</h3>
                          </div>
                          <p className="text-sm text-muted/70 leading-relaxed font-medium pl-10">
                            {faq.acceptedAnswer.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
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
