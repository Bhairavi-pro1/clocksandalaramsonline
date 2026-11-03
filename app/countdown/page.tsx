import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import CountdownRedirector from '@/components/pages/CountdownRedirector';
import holidayData from '@/data/seo/holidays.json';
import StructuredData from '@/components/seo/StructuredData';
import AdBanner from '@/components/ui/AdBanner';
import ToolSEO from '@/components/seo/ToolSEO';
import { Calendar, Globe, Sparkles, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCountrySlug } from '@/lib/countryResolver';

export const metadata: Metadata = {
  title: 'Holiday Countdowns — Live Global Holiday Countdown Clocks',
  description: 'Track live countdown clocks for major national holidays, bank holidays, and cultural festivals worldwide. Accurate to the millisecond with full-screen displays.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/countdown/',
  },
  openGraph: {
    title: 'Global Holiday Countdowns — Clocks and Alarms Online',
    description: 'Track live countdown clocks for major national holidays, bank holidays, and cultural festivals worldwide. Accurate to the millisecond with full-screen displays.',
    url: 'https://clocksandalarmsonline.com/countdown/',
    siteName: 'Clocks and Alarms Online',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Holiday Countdowns - Clocks and Alarms Online'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Global Holiday Countdowns — Clocks and Alarms Online',
    description: 'Track live countdown clocks for major national holidays, bank holidays, and cultural festivals worldwide. Accurate to the millisecond with full-screen displays.',
    images: ['/icon.png'],
  }
};

const featuredCountries = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'za', name: 'South Africa', flag: '🇿🇦' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪' },
];

export default async function HolidayCountdownIndexPage() {
  const headersList = await headers();
  const vercelCountry = headersList.get('x-vercel-ip-country');
  
  if (vercelCountry) {
    const slug = getCountrySlug(vercelCountry);
    redirect(`/countdown/${slug}/`);
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
        "name": "Holiday Countdown",
        "item": "https://clocksandalarmsonline.com/countdown/"
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global Holiday Countdown Timers",
    "description": "Track public, national, and religious holidays around the world with millisecond-accurate countdowns.",
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
      "ratingCount": "780",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div className="w-full min-h-screen">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={softwareSchema} />
      <CountdownRedirector />

      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-6 md:pt-10">
        <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li className="opacity-40">/</li>
          <li className="text-slate-900 dark:text-white font-bold" aria-current="page">Holiday Countdown</li>
        </ol>
      </nav>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-8 text-center space-y-3 md:space-y-5 animate-in fade-in duration-1000">
        <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2">
          Universal Celebration Trackers
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
          Global Holiday <span className="text-primary italic font-serif">Countdowns</span>
        </h1>
        <p className="text-sm md:text-lg text-slate-600 dark:text-white/60 max-w-3xl mx-auto font-medium">
          Live, millisecond-accurate countdowns for national, cultural, and bank holidays around the world. Synchronized directly with atomic time servers.
        </p>
      </div>

      {/* Popular Global Holidays Directory */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Popular Global Holiday Countdowns
          </h2>
          <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
            Count down to the world&apos;s most celebrated festive events, observances, and bank holidays
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {holidayData.map((h) => (
            <Link
              key={h.slug}
              href={h.sublink}
              className={cn(
                "group p-2.5 sm:p-3.5 rounded-2xl border transition-all text-center flex flex-col justify-center items-center shadow-sm relative min-h-[76px] sm:min-h-[84px]",
                "bg-slate-50 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/5 hover:border-primary/50 hover:bg-primary/5 text-slate-900 dark:text-white hover:shadow-md"
              )}
            >
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors text-center leading-snug break-words w-full">
                {h.name}
              </div>
              <div className="text-[10px] sm:text-[11px] mt-1 font-semibold text-slate-500 dark:text-muted uppercase tracking-wider">
                {h.country}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Country Hubs Directory */}
      <div className="max-w-7xl mx-auto px-4 pb-8 md:pb-12">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Browse Holidays by Country
          </h2>
          <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
            Explore national calendars and upcoming public holiday countdowns for your region
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2.5 sm:gap-3">
          {featuredCountries.map((c) => {
            const countrySlug = getCountrySlug(c.name);
            return (
              <Link
                key={c.code}
                href={`/countdown/${countrySlug}/`}
              className={cn(
                "group p-2.5 sm:p-3 rounded-2xl border transition-all text-center flex flex-col justify-center items-center shadow-sm relative min-h-[84px]",
                "bg-slate-50 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/5 hover:border-primary/50 hover:bg-primary/5 text-slate-900 dark:text-white hover:shadow-md"
              )}
            >
              <span className="text-lg sm:text-xl mb-1">{c.flag}</span>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors text-center leading-snug break-words w-full">
                {c.name}
              </div>
              <div className="text-[10px] sm:text-[11px] mt-1 font-mono font-semibold text-slate-500 dark:text-muted uppercase">
                {c.code}
              </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 my-8">
        <AdBanner />
      </div>

      {/* SEO & Knowledge Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12 sm:pb-24">
        <ToolSEO
          toolName="Global Holiday Countdown"
          introTag="Celebration & Vacation Planner"
          introHeading="Track upcoming holidays and festivals around the globe with millisecond precision"
          introParagraph="Discover real-time, atomic-accurate countdown clocks for every major federal, cultural, and religious holiday worldwide. Whether you are scheduling vacations, planning long weekends, or coordinating global team deliverables, our countdown dashboard keeps you perfectly synchronized."
          howToSteps={[
            { title: "Select a Country or Holiday", text: "Browse our curated directory of popular global holidays or choose your specific country to view its official holiday calendar." },
            { title: "Review Time Remaining", text: "View live days, hours, minutes, and seconds ticking down in real time with high-precision atomic synchronization." },
            { title: "Toggle Full-Screen Mode", text: "Open any holiday countdown in distraction-free fullscreen mode for celebration displays, event screens, or office monitors." },
            { title: "Plan Ahead", text: "Check upcoming bank dates across both 2026 and 2027 to organize paid time off and prevent cross-border calendar conflicts." }
          ]}
          proTips={[
            "Bookmark your target holiday page for instant access whenever you want to check the remaining days.",
            "Use the fullscreen view on smart TVs or tablets to create a stunning live event display.",
            "Check international holidays before scheduling major client meetings to ensure team availability.",
            "Pair holiday countdowns with our World Clock and Meeting Planner tools for seamless international scheduling."
          ]}
          useCases={[
            { title: "Vacation & Long Weekend Planning", text: "Strategically schedule time off around upcoming public holidays to extend vacations with minimal PTO usage.", icon: Calendar },
            { title: "Global Team Coordination", text: "Track international bank closures to prevent project delays and respect cross-border business downtime.", icon: Briefcase },
            { title: "Family & Festive Gatherings", text: "Count down together to Christmas, New Year, Thanksgiving, Diwali, and other cherished family celebrations.", icon: Users }
          ]}
          whyChooseUs="Our countdown engine runs with high-frequency CPU performance counters synchronized with global atomic time servers. This prevents browser background throttling and device drift, delivering dependable, millisecond-accurate timekeeping."
          troubleshooting="If countdown timers ever show a discrepancy, ensure your device's system time is set to sync automatically via network time protocol (NTP). The countdown system automatically handles network reconnection seamlessly."
          faqs={[
            { q: "How accurate are the holiday countdowns?", a: "Every timer uses atomic time synchronization to ensure millisecond accuracy across all desktop and mobile browsers." },
            { q: "Which holidays are covered?", a: "We cover national public holidays, federal bank holidays, and major religious and cultural observances across dozens of countries." },
            { q: "Can I use countdowns on mobile devices?", a: "Yes, our responsive interface is engineered for optimal viewing on smartphones, tablets, and desktop displays." },
            { q: "Is fullscreen mode supported?", a: "Yes, clicking the expand icon switches any holiday countdown into an immersive, distraction-free fullscreen view." }
          ]}
        />
      </div>
    </div>
  );
}
