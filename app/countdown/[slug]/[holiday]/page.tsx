import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getHolidaysServer, FormattedHoliday } from '@/lib/getHolidaysServer';
import countriesData from '@/data/countries.json';
import HolidayCountdownClient from '@/components/pages/HolidayCountdownClient';
import StructuredData from '@/components/seo/StructuredData';
import AdBanner from '@/components/ui/AdBanner';
import FAQAccordion from '@/components/seo/FAQAccordion';
import { HelpCircle, Calendar, Clock, Maximize2, Info, Briefcase, Users } from 'lucide-react';
import ToolSEO from '@/components/seo/ToolSEO';

interface Props {
  params: Promise<{ slug: string; holiday: string }>;
}

function getCountryByCode(code: string) {
  return countriesData.find(c => c.code.toLowerCase() === code.toLowerCase());
}

function getSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Find matched holiday across current year and next year
async function findHoliday(countryCode: string, holidaySlug: string): Promise<{ holiday: FormattedHoliday; year: number } | null> {
  const currentYear = new Date().getFullYear();
  
  try {
    // 1. Fetch current year holidays
    const holidaysCurr = await getHolidaysServer(countryCode, currentYear);
    const matchCurr = holidaysCurr.find(h => getSlug(h.name) === holidaySlug);
    
    if (matchCurr) {
      const targetDate = new Date(matchCurr.date);
      const now = new Date();
      // If the holiday has already passed, check next year
      if (targetDate.getTime() < now.getTime()) {
        const holidaysNext = await getHolidaysServer(countryCode, currentYear + 1);
        const matchNext = holidaysNext.find(h => getSlug(h.name) === holidaySlug);
        if (matchNext) {
          return { holiday: matchNext, year: currentYear + 1 };
        }
      }
      return { holiday: matchCurr, year: currentYear };
    }

    // 2. If not found in current year, try next year
    const holidaysNext = await getHolidaysServer(countryCode, currentYear + 1);
    const matchNext = holidaysNext.find(h => getSlug(h.name) === holidaySlug);
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
  const countryObj = getCountryByCode(slug);
  if (!countryObj) return { title: 'Country Not Found' };
  
  const matchResult = await findHoliday(countryObj.code, holiday);
  if (!matchResult) return { title: 'Holiday Not Found' };
  
  const { holiday: matchedHoliday, year } = matchResult;
  return {
    title: `${matchedHoliday.name} Countdown ${year} (${countryObj.name}) — Clocks and Alarms Online`,
    description: `Track the exact days, hours, minutes, and seconds remaining until ${matchedHoliday.name} in ${countryObj.name} (${year}) with millisecond-accurate precision.`,
    alternates: {
      canonical: `https://clocksandalarmsonline.com/countdown/${slug.toLowerCase()}/${holiday}`,
    },
    openGraph: {
      title: `Countdown to ${matchedHoliday.name} ${year} (${countryObj.name})`,
      description: `Track the seconds until ${matchedHoliday.name} with our professional-grade countdown timer.`,
      type: 'website',
    }
  };
}

export default async function SingleCountryHolidayPage({ params }: Props) {
  const { slug, holiday } = await params;
  const countryObj = getCountryByCode(slug);
  
  if (!countryObj) {
    notFound();
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
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 text-center space-y-2.5 md:space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest mb-1">
          Holiday Countdown — {countryObj.name}
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter animate-in fade-in duration-1000">
          {seoInfo.title}
        </h1>
      </div>

      <HolidayCountdownClient holiday={clientHoliday} seoInfo={seoInfo} />
      
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdBanner />
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
