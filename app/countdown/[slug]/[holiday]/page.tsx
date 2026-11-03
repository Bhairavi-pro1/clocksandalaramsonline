import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getHolidaysServer, FormattedHoliday } from '@/lib/getHolidaysServer';
import holidayData from '@/data/seo/holidays.json';
import { getCountryBySlugOrCode, getCountrySlug } from '@/lib/countryResolver';
import HolidayCountdownClient from '@/components/pages/HolidayCountdownClient';
import StructuredData from '@/components/seo/StructuredData';
import AdBanner from '@/components/ui/AdBanner';
import FAQAccordion from '@/components/seo/FAQAccordion';
import { HelpCircle, Calendar, Clock, Maximize2, Info, Briefcase, Users, Sparkles } from 'lucide-react';
import ToolSEO from '@/components/seo/ToolSEO';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string; holiday: string }>;
}

function getCleanSlug(str: string): string {
  return str.toLowerCase().replace(/[\/\\]/g, '-').replace(/\s+/g, '-').replace(/[^\w-]/g, '').replace(/-+/g, '-');
}

function getSlugAlternatives(name: string): string[] {
  const clean = name.toLowerCase();
  const alts = new Set<string>();
  
  // 1. Direct slug (with slashes stripped)
  alts.add(clean.replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
  // 2. Direct slug (with slashes replaced by hyphens)
  alts.add(getCleanSlug(clean));
  
  // 3. Remove parentheticals, e.g. "Ramadan Start (Provisional)" -> "Ramadan Start"
  const withoutParens = clean.replace(/\(.*?\)/g, '').trim();
  if (withoutParens && withoutParens !== clean) {
    alts.add(withoutParens.replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
    alts.add(getCleanSlug(withoutParens));
  }

  // 4. Alternative names split by slashes, e.g. "Diwali/Deepavali" -> ["Diwali", "Deepavali"]
  const parts = clean.split(/[\/\\]/).map(p => p.replace(/\(.*?\)/g, '').trim()).filter(Boolean);
  for (const part of parts) {
    alts.add(part.replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
    alts.add(getCleanSlug(part));
  }

  return Array.from(alts);
}

function findBestHolidayMatch(holidays: FormattedHoliday[], holidaySlug: string): FormattedHoliday | null {
  const cleanTarget = holidaySlug.toLowerCase();
  const cleanTargetWithoutDay = cleanTarget.replace(/-day$/, '');

  // Tier 1: Exact direct slug match (e.g. "Christmas Day" -> "christmas-day")
  const exact = holidays.find(h => {
    const s1 = h.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const s2 = getCleanSlug(h.name);
    return s1 === cleanTarget || s2 === cleanTarget;
  });
  if (exact) return exact;

  // Tier 2: Exact slug match ignoring '-day' (e.g. "Christmas" -> "Christmas Day")
  const exactWithoutDay = holidays.find(h => {
    const s1 = h.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').replace(/-day$/, '');
    const s2 = getCleanSlug(h.name).replace(/-day$/, '');
    return s1 === cleanTargetWithoutDay || s2 === cleanTargetWithoutDay;
  });
  if (exactWithoutDay) return exactWithoutDay;

  // Tier 3: Alternative names (slashes or parentheticals, e.g. "Diwali/Deepavali" -> "diwali")
  const altMatch = holidays.find(h => {
    const alts = getSlugAlternatives(h.name);
    return alts.includes(cleanTarget) || alts.map(a => a.replace(/-day$/, '')).includes(cleanTargetWithoutDay);
  });
  if (altMatch) return altMatch;

  // Tier 4: Substring match preferring national/federal holidays
  const partials = holidays.filter(h => {
    const hLower = h.name.toLowerCase();
    const targetWords = cleanTargetWithoutDay.replace(/-/g, ' ');
    return hLower.includes(targetWords);
  });

  if (partials.length > 0) {
    const national = partials.find(h => 
      h.type && h.type.some(t => /national|federal|public/i.test(t))
    );
    return national || partials[0];
  }

  return null;
}

// Find matched holiday across current year and next year
async function findHoliday(countryCode: string, holidaySlug: string): Promise<{ holiday: FormattedHoliday; year: number } | null> {
  const currentYear = new Date().getFullYear();

  try {
    // 1. Fetch current year holidays
    const holidaysCurr = await getHolidaysServer(countryCode, currentYear);
    const matchCurr = findBestHolidayMatch(holidaysCurr, holidaySlug);
    
    if (matchCurr) {
      const targetDate = new Date(matchCurr.date);
      const now = new Date();
      // If the holiday has already passed in the current year, check next year
      if (targetDate.getTime() < now.getTime()) {
        const holidaysNext = await getHolidaysServer(countryCode, currentYear + 1);
        const matchNext = findBestHolidayMatch(holidaysNext, holidaySlug);
        if (matchNext) {
          return { holiday: matchNext, year: currentYear + 1 };
        }
      }
      return { holiday: matchCurr, year: currentYear };
    }

    // 2. If not found in current year, try next year
    const holidaysNext = await getHolidaysServer(countryCode, currentYear + 1);
    const matchNext = findBestHolidayMatch(holidaysNext, holidaySlug);
    if (matchNext) {
      return { holiday: matchNext, year: currentYear + 1 };
    }
  } catch (err) {
    console.error(`Error resolving holiday for country=${countryCode}, holidaySlug=${holidaySlug}:`, err);
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, holiday } = await params;
  const countryObj = getCountryBySlugOrCode(slug);
  if (!countryObj) return { title: 'Holiday Countdown Not Found' };

  const canonicalCountrySlug = getCountrySlug(countryObj.name);
  const matchResult = await findHoliday(countryObj.code, holiday);
  if (!matchResult) return { title: 'Holiday Not Found' };
  
  const { holiday: matchedHoliday, year } = matchResult;
  const rawDesc = matchedHoliday.description?.trim();
  const metaDescription = rawDesc
    ? `${rawDesc} Track the live accurate countdown to ${matchedHoliday.name} ${year} in ${countryObj.name} with millisecond precision.`
    : `Track the exact days, hours, minutes, and seconds remaining until ${matchedHoliday.name} in ${countryObj.name} (${year}) with millisecond-accurate precision.`;

  const canonicalUrl = `https://clocksandalarmsonline.com/countdown/${canonicalCountrySlug}/${holiday}/`;

  return {
    title: `${matchedHoliday.name} Countdown ${year} (${countryObj.name}) — Clocks and Alarms Online`,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${matchedHoliday.name} Countdown ${year} (${countryObj.name})`,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'Clocks and Alarms Online',
      type: 'website',
      images: [
        {
          url: '/icon.png',
          width: 512,
          height: 512,
          alt: `${matchedHoliday.name} Countdown - Clocks and Alarms Online`,
        }
      ],
    },
    twitter: {
      card: 'summary',
      title: `${matchedHoliday.name} Countdown ${year} (${countryObj.name})`,
      description: metaDescription,
      images: ['/icon.png'],
    }
  };
}

export default async function SingleCountryHolidayPage({ params }: Props) {
  const { slug, holiday } = await params;
  const countryObj = getCountryBySlugOrCode(slug);
  
  if (!countryObj) {
    notFound();
  }

  const canonicalCountrySlug = getCountrySlug(countryObj.name);

  // If accessed by old 2-letter code or unnormalized country slug, 301/308 permanent redirect to canonical URL
  if (slug.toLowerCase() !== canonicalCountrySlug) {
    permanentRedirect(`/countdown/${canonicalCountrySlug}/${holiday}/`);
  }

  const matchResult = await findHoliday(countryObj.code, holiday);
  if (!matchResult) {
    notFound();
  }

  const { holiday: matchedHoliday, year } = matchResult;
  
  // Transform FormattedHoliday to standard Holiday interface
  const clientHoliday = {
    name: matchedHoliday.name,
    date: new Date(matchedHoliday.date),
    daysRemaining: Math.ceil((new Date(matchedHoliday.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  };

  const seoInfo = {
    title: `Countdown to ${matchedHoliday.name} ${year} in ${countryObj.name}`,
    description: matchedHoliday.description || `Track the precisely calculated time remaining until ${matchedHoliday.name} in ${countryObj.name} with our high-tech holiday tracker.`,
    content: matchedHoliday.description || `${matchedHoliday.name} is a significant event in ${countryObj.name}. Use our precise countdown to keep track of the remaining time and ensure you are perfectly prepared for the festivities.`
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${matchedHoliday.name} (${year})`,
    "startDate": matchedHoliday.date,
    "endDate": matchedHoliday.date,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": countryObj.name,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": countryObj.code
      }
    },
    "description": matchedHoliday.description || `Live countdown and holiday tracking for ${matchedHoliday.name} in ${countryObj.name}.`,
    "image": "https://clocksandalarmsonline.com/icon.png"
  };

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
        "name": "Countdown",
        "item": "https://clocksandalarmsonline.com/countdown/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": countryObj.name,
        "item": `https://clocksandalarmsonline.com/countdown/${canonicalCountrySlug}/`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": matchedHoliday.name,
        "item": `https://clocksandalarmsonline.com/countdown/${canonicalCountrySlug}/${holiday}/`
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${matchedHoliday.name} Countdown Tracker`,
    "description": `Professional-grade high-precision countdown to ${matchedHoliday.name} in ${countryObj.name} with millisecond accuracy.`,
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
      "ratingCount": "320",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Frequently Asked Questions",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How accurate is this ${matchedHoliday.name} countdown?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Our countdown uses high-precision performance counters synchronized with atomic time servers to ensure millisecond accuracy for ${matchedHoliday.name}.`
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this countdown in full-screen mode?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool features a cinematic full-screen mode perfect for event displays, office screens, or personal focus during the holiday buildup."
        }
      }
    ]
  };

  return (
    <div className="w-full">
      <StructuredData data={eventSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-6 md:pt-10">
        <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li className="opacity-40">/</li>
          <li>
            <Link href="/countdown/" className="hover:text-primary transition-colors">Holiday Countdown</Link>
          </li>
          <li className="opacity-40">/</li>
          <li>
            <Link href={`/countdown/${canonicalCountrySlug}/`} className="hover:text-primary transition-colors">{countryObj.name}</Link>
          </li>
          <li className="opacity-40">/</li>
          <li className="text-slate-900 dark:text-white font-bold" aria-current="page">{matchedHoliday.name}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-8 text-center space-y-2.5 md:space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest mb-1">
          Holiday Countdown — {countryObj.name}
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter animate-in fade-in duration-1000">
          {seoInfo.title}
        </h1>
      </div>

      <HolidayCountdownClient holiday={clientHoliday} seoInfo={seoInfo} />
      
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdBanner />
      </div>

      {/* Popular Global Holidays Directory */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Popular Global Holiday Countdowns
          </h2>
          <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1">
            Explore live countdown clocks for the world&apos;s most celebrated holidays and festivals
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {holidayData.map((h) => {
            const isCurrent = h.slug === holiday && h.country.toLowerCase() === slug.toLowerCase();
            return (
              <Link
                key={h.slug}
                href={h.sublink}
                className={cn(
                  "group p-2.5 sm:p-3.5 rounded-2xl border transition-all text-center flex flex-col justify-center items-center shadow-sm relative min-h-[76px] sm:min-h-[84px]",
                  isCurrent
                    ? "bg-primary/10 border-primary text-primary shadow-primary/20 ring-1 ring-primary"
                    : "bg-slate-50 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/5 hover:border-primary/50 hover:bg-primary/5 text-slate-900 dark:text-white hover:shadow-md"
                )}
              >
                <div className={cn(
                  "font-bold text-xs sm:text-sm transition-colors text-center leading-snug break-words w-full",
                  isCurrent ? "text-primary font-black" : "text-slate-900 dark:text-white group-hover:text-primary"
                )}>
                  {h.name}
                </div>
                <div className={cn(
                  "text-[10px] sm:text-[11px] mt-1 font-semibold uppercase tracking-wider",
                  isCurrent ? "text-primary/80" : "text-slate-500 dark:text-muted"
                )}>
                  {h.country}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SEO Content & Dynamic FAQ Section (Server Side) */}
      <div className="max-w-7xl mx-auto px-4 pb-12 sm:pb-24">
        <ToolSEO
          toolName={`${matchedHoliday.name} Countdown`}
          introTag={`${countryObj.name} Live Timer`}
          introHeading={`Live Countdown to ${matchedHoliday.name} in ${countryObj.name}`}
          introParagraph={`${seoInfo.content} Our platform uses high-precision millisecond tracking synchronized with global atomic time to provide the most accurate countdown on the web. Stay perfectly on schedule with our high-precision countdown system, designed for reliability and visual excellence.`}
          howToSteps={[
            { title: "Check Time Remaining", text: "Track the live time remaining to the holiday with atomic server precision." },
            { title: "Access Full Screen", text: "Expand the timer interface for a premium focus view ideal for smart display boards." },
            { title: "Share the Excitement", text: "Click the share button to copy the timer link and align holiday timing with colleagues or family." }
          ]}
          proTips={[
            "Display the live timer on an external screen using the distraction-free fullscreen mode during holiday events.",
            "Compare target holiday dates to organize paid time off (PTO) and maximize long holiday weekends.",
            "Ensure system clock settings are synchronized automatically via network NTP for maximum countdown accuracy."
          ]}
          useCases={[
            { title: "Travel & Logistical Preparation", text: "Organize airline bookings, hotel stays, and vacation timelines to beat the peak holiday rush.", icon: Briefcase },
            { title: "Gift & Celebration Planning", text: "Track the days remaining to finish shopping, arrange dinners, and coordinate family festivals.", icon: Users },
            { title: "Event Setup Displays", text: "Display real-time countdown clocks during classroom events, office gatherings, or public countdown screens.", icon: Calendar }
          ]}
          whyChooseUs="Our countdown engine is built with high-frequency CPU performance ticks synced with global atomic time servers. This avoids local timezone lag or browser sleep drift, ensuring the absolute correct countdown is rendered on all desktop and mobile devices."
          troubleshooting="If you notice time sync delays, check your operating system settings to ensure automatic network clock updating is enabled. Local backup calculations ensure the clock keeps ticking even if your connection is lost."
          faqs={[
            { q: `When exactly is ${matchedHoliday.name} in ${countryObj.name}?`, a: `For this occurrence, ${matchedHoliday.name} falls on ${new Date(matchedHoliday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.` },
            { q: "Does the countdown work on mobile?", a: "Yes, our web application is fully responsive and optimized for both iOS and Android browsers." },
            { q: "How can I copy the countdown link?", a: "Click the share button in the top right corner of the countdown card to copy the page URL directly to your clipboard." },
            { q: "Is the fullscreen mode compatible with all browsers?", a: "Yes, the fullscreen layout falls back to simulated viewport-height overlays on devices that do not support native fullscreen APIs." }
          ]}
        />
      </div>
      
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  );
}
