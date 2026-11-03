import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getHolidaysServer, FormattedHoliday } from '@/lib/getHolidaysServer';
import holidayData from '@/data/seo/holidays.json';
import CountryHolidayClient from '@/components/pages/CountryHolidayClient';
import StructuredData from '@/components/seo/StructuredData';
import AdBanner from '@/components/ui/AdBanner';
import { Calendar, Briefcase, Users, Sparkles } from 'lucide-react';
import ToolSEO from '@/components/seo/ToolSEO';
import { cn } from '@/lib/utils';
import { getCountryBySlugOrCode, getCountrySlug } from '@/lib/countryResolver';

interface Props {
  params: Promise<{ slug: string }>;
}

function getMatchedHoliday(slug: string) {
  const clean = slug.toLowerCase();
  return holidayData.find(h => 
    h.slug === clean || 
    h.slug.replace(/-day$/, '') === clean || 
    clean.replace(/-day$/, '') === h.slug.replace(/-day$/, '')
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const countryObj = getCountryBySlugOrCode(slug);
  
  if (!countryObj) {
    const matchedHoliday = getMatchedHoliday(slug);
    if (matchedHoliday) {
      return {
        title: matchedHoliday.title,
        description: matchedHoliday.description,
        alternates: {
          canonical: `https://clocksandalarmsonline.com${matchedHoliday.sublink}`
        }
      };
    }
    return { title: 'Country Countdown Not Found' };
  }

  const name = countryObj.name;
  const canonicalCountrySlug = getCountrySlug(countryObj.name);
  const canonicalUrl = `https://clocksandalarmsonline.com/countdown/${canonicalCountrySlug}/`;
  const desc = `Track the seconds until the next big celebration in ${name}. Millisecond-accurate countdowns for national, regional, and bank holidays.`;

  return {
    title: `Holiday Countdowns for ${name} (2026 & 2027) — Clocks and Alarms Online`,
    description: desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Holiday Countdowns in ${name}`,
      description: desc,
      url: canonicalUrl,
      siteName: 'Clocks and Alarms Online',
      type: 'website',
      images: [
        {
          url: '/icon.png',
          width: 512,
          height: 512,
          alt: `${name} Holiday Countdowns - Clocks and Alarms Online`
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `Holiday Countdowns in ${name}`,
      description: desc,
      images: ['/icon.png'],
    }
  };
}

export default async function CountdownSegmentPage({ params }: Props) {
  const { slug } = await params;
  const countryObj = getCountryBySlugOrCode(slug);

  if (!countryObj) {
    const matchedHoliday = getMatchedHoliday(slug);
    if (matchedHoliday) {
      permanentRedirect(matchedHoliday.sublink);
    }
    notFound();
  }

  const canonicalCountrySlug = getCountrySlug(countryObj.name);

  // If accessed by old 2-letter code or unnormalized slug, 301/308 permanent redirect to canonical country slug
  if (slug.toLowerCase() !== canonicalCountrySlug) {
    permanentRedirect(`/countdown/${canonicalCountrySlug}/`);
  }

  const countryCode = countryObj.code;
  const countryName = countryObj.name;
  const initialYear = 2026;

  let initialHolidays: FormattedHoliday[] = [];
  try {
    initialHolidays = await getHolidaysServer(countryCode, initialYear);
  } catch (error: any) {
    console.error(`Failed to fetch initial holidays for ${countryCode} 2026:`, error);
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `Holiday Countdown for ${countryName}`,
    "description": `Track public, national, and religious holidays in ${countryName} with millisecond-accurate countdowns.`,
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
      "ratingCount": "560",
      "bestRating": "5",
      "worstRating": "1"
    }
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
        "name": countryName,
        "item": `https://clocksandalarmsonline.com/countdown/${canonicalCountrySlug}/`
      }
    ]
  };

  return (
    <div className="w-full min-h-screen">
      <StructuredData data={softwareSchema} />
      <StructuredData data={breadcrumbSchema} />

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
          <li className="text-slate-900 dark:text-white font-bold" aria-current="page">{countryName}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-8 text-center space-y-3 md:space-y-6 animate-in fade-in duration-1000">
        <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2">
          Universal Celebration Trackers
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
          {countryName} Holiday <span className="text-primary italic font-serif">Countdowns</span>
        </h1>
        <p className="text-sm md:text-lg text-slate-600 dark:text-white/60 max-w-3xl mx-auto font-medium">
          Track every upcoming public, religious, and federal holiday in {countryName} with millisecond-accurate countdowns synchronized with global atomic time.
        </p>
      </div>

      <CountryHolidayClient
        countryCode={countryCode}
        countryName={countryName}
        countrySlug={canonicalCountrySlug}
        initialYear={initialYear}
        initialHolidays={initialHolidays}
      />

      <div className="max-w-7xl mx-auto px-4 my-8">
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

      <div className="max-w-7xl mx-auto px-4 pb-12 sm:pb-24">
        <ToolSEO
          toolName={`${countryName} Holiday Countdown`}
          introTag="Celebration & Vacation Planner"
          introHeading={`Track every upcoming holiday in ${countryName} with millisecond accuracy`}
          introParagraph={`Discover the ultimate ${countryName} holiday countdown dashboard. Whether you need to track federal bank holidays, national public holidays, or cultural religious festivals, our real-time atomic-accurate countdown timers keep you perfectly aligned. Stay ahead of your holiday calendar planning, organize long weekends, and prepare for festivals with absolute precision.`}
          howToSteps={[
            { title: "Select Your Target Year", text: "Toggle between 2026 and 2027 to see both current and next year's full schedule of holidays and bank dates." },
            { title: "Apply High-Density Filters", text: "Filter by upcoming/passed status or category (National, Religious, etc.) to target the specific holidays you want to track." },
            { title: "Open Live Countdown", text: "Click on any holiday card or list row to launch its high-resolution, millisecond-accurate countdown timer page." },
            { title: "Activate Full-Screen Mode", text: "Click the maximize icon in the top right to switch the countdown clock into a beautiful, distraction-free display for event boards or screens." }
          ]}
          proTips={[
            "Bookmark the tool to automatically save your last selected target country, year, and category filters for the next visit.",
            "Use simulated full-screen mode on mobile devices for a clean, distraction-free horizontal dashboard widget style.",
            "Track regional bank holidays and combine them with weekends to maximize your paid time off (PTO) and plan long vacation trips.",
            "Coordinate cross-border team schedules by checking holiday dates in advance to avoid calendar clashes."
          ]}
          useCases={[
            { title: "Vacation & Travel Planning", text: "Map out upcoming public bank holidays and school breaks to maximize vacation days and schedule getaways.", icon: Calendar },
            { title: "Project & Business Schedules", text: "Keep track of international holidays to prevent delays in deliverables and coordinate with cross-border teams.", icon: Briefcase },
            { title: "Cultural & Family Gatherings", text: "Stay updated on traditional, regional, and religious festivals to prepare celebrations and connect with family.", icon: Users }
          ]}
          whyChooseUs={`Our holiday countdown engine is designed for absolute timing precision. By syncing with global atomic time servers, we eliminate hardware CPU drift. The interface supports dynamic categorization, state persistence, responsive mobile row layouts, and cinematic full-screen display modes.`}
          troubleshooting={`If countdown times appear slightly off, verify that your browser's system clock is set to sync automatically. The countdown fallback ticks keep the timer running smoothly in high-resolution even during temporary network drops.`}
          faqs={[
            { q: `How accurate is this ${countryName} holiday countdown?`, a: "The countdown is millisecond-accurate, synchronizing system hardware timers with atomic time servers to prevent device time drift." },
            { q: "Are all state and national bank holidays included?", a: "Yes, our real-time database covers all major federal, public, and bank holidays, as well as significant cultural and religious observances." },
            { q: "Does the search function support autocomplete?", a: "Yes, type the country name in the selector input to quickly switch to another country's real-time holiday listing." },
            { q: "Can I use the tool in dark mode?", a: "Yes, the layout fully supports responsive system dark mode, automatically rendering in a premium deep purple neon space aesthetic or clean glassmorphic light theme." }
          ]}
        />
      </div>
    </div>
  );
}
