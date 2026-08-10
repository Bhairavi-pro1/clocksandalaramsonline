import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getHolidays } from '@/lib/holidays';
import holidayData from '@/data/seo/holidays.json';
import { getHolidaysServer, FormattedHoliday } from '@/lib/getHolidaysServer';
import countriesData from '@/data/countries.json';
import CountryHolidayClient from '@/components/pages/CountryHolidayClient';
import HolidayCountdownClient from '@/components/pages/HolidayCountdownClient';
import StructuredData from '@/components/seo/StructuredData';
import AdBanner from '@/components/ui/AdBanner';
import FAQAccordion from '@/components/seo/FAQAccordion';
import { HelpCircle, Calendar, Clock, Maximize2, Info } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

function getCountryByCode(code: string) {
  return countriesData.find(c => c.code.toLowerCase() === code.toLowerCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const countryObj = getCountryByCode(slug);
  
  if (countryObj) {
    const name = countryObj.name;
    return {
      title: `Holiday Countdowns for ${name} (2026 & 2027) — Clocks and Alarms Online`,
      description: `Track the seconds until the next big celebration in ${name}. Millisecond-accurate countdowns for national, regional, and bank holidays.`,
      alternates: {
        canonical: `https://clocksandalarmsonline.com/countdown/${slug.toLowerCase()}`,
      },
      openGraph: {
        title: `Holiday Countdowns in ${name}`,
        description: `Track the seconds until holidays in ${name} with our professional-grade countdown timers.`,
        type: 'website',
      }
    };
  } else {
    const holidays = getHolidays();
    const holiday = holidays.find(h => h.name.toLowerCase().replace(/\s+/g, '-') === slug);
    const seoInfo = holidayData.find(h => h.slug === slug);
    
    if (!holiday) return { title: 'Holiday Not Found' };
    
    return {
      title: seoInfo?.title || `Countdown to ${holiday.name} — Clocks and Alarms Online`,
      description: seoInfo?.description || `High-precision countdown to ${holiday.name}. Track exactly how much time is left with millisecond accuracy.`,
      alternates: {
        canonical: `https://clocksandalarmsonline.com/countdown/${slug}`,
      },
      openGraph: {
        title: seoInfo?.title || `Countdown to ${holiday.name}`,
        description: seoInfo?.description || `Track the seconds until ${holiday.name} with our professional-grade countdown timer.`,
        type: 'website',
      }
    };
  }
}

export default async function CountdownSegmentPage({ params }: Props) {
  const { slug } = await params;
  const countryObj = getCountryByCode(slug);

  if (countryObj) {
    // -------------------------------------------------------------
    // CASE A: Segment is a Country Code (e.g. "us", "in")
    // -------------------------------------------------------------
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
          "item": "https://clocksandalarmsonline.com/countdown"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": countryName,
          "item": `https://clocksandalarmsonline.com/countdown/${slug.toLowerCase()}`
        }
      ]
    };

    return (
      <div className="w-full min-h-screen">
        <StructuredData data={softwareSchema} />
        <StructuredData data={breadcrumbSchema} />

        <div className="max-w-7xl mx-auto px-4 pt-16 text-center space-y-6 animate-in fade-in duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            Universal Celebration Trackers
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
            {countryName} Holiday <span className="text-primary italic font-serif">Countdowns</span>
          </h1>
          <p className="text-lg text-muted/60 max-w-3xl mx-auto font-medium">
            Track every upcoming public, religious, and federal holiday in {countryName} with millisecond-accurate countdowns synchronized with global atomic time.
          </p>
        </div>

        <CountryHolidayClient
          countryCode={countryCode}
          countryName={countryName}
          initialYear={initialYear}
          initialHolidays={initialHolidays}
        />

        <div className="max-w-7xl mx-auto px-4 my-8">
          <AdBanner />
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-24 space-y-20">
          <section className="bg-[#1a0b36]/40 p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
            <h2 className="text-3xl font-black text-white">About {countryName} Celebrations</h2>
            <div className="text-lg text-muted/80 font-medium leading-relaxed space-y-6">
              <p>
                Each country features unique holiday observances reflecting its history, culture, and traditions. 
                Our real-time tracker keeps you up-to-date with every major event in {countryName}, ensuring you can map out long weekends, prepare for festivals, or schedule business deadlines with absolute precision.
              </p>
              <p>
                The timer calculations use system hardware performance ticks synchronized with global atomic time servers. 
                This prevents local CPU drift and provides reliability down to the millisecond, whether you are running a countdown display at a public event or tracking the holidays on your mobile screen.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  } else {
    // -------------------------------------------------------------
    // CASE B: Segment is a Holiday Slug (e.g. "christmas", "new-year")
    // -------------------------------------------------------------
    const holidays = getHolidays();
    const holiday = holidays.find(h => h.name.toLowerCase().replace(/\s+/g, '-') === slug);
    const seoInfo = holidayData.find(h => h.slug === slug);

    if (!holiday) {
      notFound();
    }

    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": `${holiday.name} Countdown Tracker`,
      "description": `Professional-grade high-precision countdown to ${holiday.name} with millisecond accuracy.`,
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
          "name": `How accurate is this ${holiday.name} countdown?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Our countdown uses high-precision system performance counters synchronized with atomic time servers to ensure millisecond accuracy for ${holiday.name}.`
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
            Holiday Countdown 
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter animate-in fade-in duration-1000">
            {seoInfo?.title || `Countdown to ${holiday.name}`}
          </h1>
        </div>

        <HolidayCountdownClient holiday={holiday} seoInfo={seoInfo} />
        
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <AdBanner />
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-24 space-y-32">
          <section className="w-auto sm:w-full bg-[#1a0b36]/40 p-6 sm:p-10 md:p-16 rounded-none sm:rounded-[3rem] border border-x-0 sm:border border-white/5 shadow-2xl space-y-6 sm:space-y-8 -mx-4 sm:mx-0">
            <h2 className="text-2xl sm:text-3xl font-black text-white">About the {holiday.name} Tracker</h2>
            <div className="text-sm sm:text-base md:text-lg text-muted/80 font-medium leading-relaxed space-y-4 sm:space-y-6">
              <p>
                {seoInfo?.content || `This high-precision countdown is set specifically for ${holiday.name}. Whether you are coordinating travel, preparing gifts, or planning a celebratory event, our reliable global tracker ensures you never miss a second of the holiday season.`}
              </p>
              <p>
                Our platform uses high-precision millisecond tracking synchronized with global atomic time to provide the most accurate countdown on the web. Stay perfectly on schedule with our high-precision countdown system, designed for reliability and visual excellence.
              </p>
            </div>
          </section>

          <section className="space-y-8 sm:space-y-16">
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">How to <span className="text-primary">Master the Countdown</span></h2>
              <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
              {[
                { 
                  icon: Calendar, 
                  title: "1. Global Sync", 
                  text: "The countdown automatically synchronizes with the official date and global atomic time servers." 
                },
                { 
                  icon: Clock, 
                  title: "2. Track Seconds", 
                  text: "Monitor the buildup in real-time with millisecond accuracy, ensuring you're ready for the celebration." 
                },
                { 
                  icon: Maximize2, 
                  title: "3. Full Screen", 
                  text: "Use the expansion icon for a cinematic, distraction-free view ideal for public event displays." 
                },
                { 
                  icon: Info, 
                  title: "4. Holiday Insights", 
                  text: "Read expert timing insights and historical context curated specifically for this celebration." 
                }
              ].map((item, i) => (
                <div key={i} className="group p-4 sm:p-8 rounded-none sm:rounded-[2.5rem] bg-[#1a0b36]/40 border border-x-0 sm:border border-violet-500/10 hover:border-violet-500/30 hover:bg-[#1a0b36]/60 transition-all duration-500 flex flex-col md:flex-row items-start gap-4 sm:gap-6 w-auto sm:w-full -mx-4 sm:mx-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/40 transition-colors shrink-0">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted/80 leading-relaxed font-medium text-justify">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8 sm:space-y-16">
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight">{holiday.name} <span className="text-primary italic">Countdown FAQ</span></h2>
              <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
            </div>

            <FAQAccordion 
              faqs={[
                { 
                  q: `When exactly is ${holiday.name}?`, 
                  a: `For this year, ${holiday.name} falls on ${new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`
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
              ]} 
            />
          </section>
        </div>
        <div className="mt-16 max-w-7xl mx-auto px-4">
          <AdBanner />
        </div>
      </div>
    );
  }
}
