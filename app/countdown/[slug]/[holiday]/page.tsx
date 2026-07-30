import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getHolidaysServer, FormattedHoliday } from '@/lib/getHolidaysServer';
import countriesData from '@/data/countries.json';
import HolidayCountdownClient from '@/components/pages/HolidayCountdownClient';
import StructuredData from '@/components/seo/StructuredData';
import AdBanner from '@/components/ui/AdBanner';
import { HelpCircle, Calendar, Clock, Maximize2, Info } from 'lucide-react';

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
      
      <div className="max-w-7xl mx-auto px-4 pt-16 text-center space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest mb-1">
          Holiday Countdown — {countryObj.name}
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter animate-in fade-in duration-1000">
          {seoInfo.title}
        </h1>
      </div>

      <HolidayCountdownClient holiday={clientHoliday} seoInfo={seoInfo} />
      
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdBanner />
      </div>

      {/* SEO Content & Dynamic FAQ Section (Server Side) */}
      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-32">
        <section className="bg-[#1a0b36]/40 p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
          <h2 className="text-3xl font-black text-white">About the {matchedHoliday.name} Tracker</h2>
          <div className="text-lg text-muted/80 font-medium leading-relaxed space-y-6">
            <p>
              {seoInfo.content}
            </p>
            <p>
              Our platform uses high-precision millisecond tracking synchronized with global atomic time to provide the most accurate countdown on the web. Stay perfectly on schedule with our high-precision countdown system, designed for reliability and visual excellence.
            </p>
          </div>
        </section>

        {/* Dynamic FAQ */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{matchedHoliday.name} <span className="text-primary italic">Countdown FAQ</span></h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                q: `When exactly is ${matchedHoliday.name} in ${countryObj.name}?`, 
                a: `For this occurrence, ${matchedHoliday.name} falls on ${new Date(matchedHoliday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`
              },
              {
                q: "What makes this countdown different?",
                a: "Unlike standard web timers, our countdown utilizes high-frequency system performance counters to ensure that the time remains accurate down to the millisecond, even during intense CPU usage."
              },
              {
                q: "Does it work on mobile devices?",
                a: "Yes, our tool is fully responsive and optimized for both iOS and Android, allowing you to track the holiday buildup on any screen size with a premium interface."
              },
              {
                q: "Can I share this countdown?",
                a: "Absolutely. Use the share button in the top right corner to copy the direct link and share the excitement with friends, family, or colleagues."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
                <div className="flex gap-4 mb-4">
                  <HelpCircle className="text-primary group-hover:scale-110 transition-transform animate-in fade-in" />
                  <h3 className="text-lg font-bold text-white tracking-tight">{faq.q}</h3>
                </div>
                <p className="text-sm text-muted/70 leading-relaxed font-medium pl-10">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  );
}
