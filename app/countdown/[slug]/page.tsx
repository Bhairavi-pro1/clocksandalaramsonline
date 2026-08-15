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
import { HelpCircle, Calendar, Clock, Maximize2, Info, Briefcase, Users } from 'lucide-react';
import ToolSEO from '@/components/seo/ToolSEO';

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

        <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 text-center space-y-3 md:space-y-6 animate-in fade-in duration-1000">
          <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2">
            Universal Celebration Trackers
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
            {countryName} Holiday <span className="text-primary italic font-serif">Countdowns</span>
          </h1>
          <p className="text-sm md:text-lg text-muted/60 max-w-3xl mx-auto font-medium">
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

        <div className="max-w-7xl mx-auto px-4 pb-12 sm:pb-24">
          <ToolSEO
            toolName={`${holiday.name} Countdown`}
            introTag="Holiday Live Timer"
            introHeading={`Track the exact days and seconds remaining until ${holiday.name}`}
            introParagraph={seoInfo?.content || `Stay perfectly synchronized with the exact countdown to ${holiday.name}. Whether you are planning holiday travel, shopping for gifts, coordinating a corporate party, or getting ready for family getaways, our high-tech live tracking clock shows days, hours, minutes, and seconds left with millisecond precision.`}
            howToSteps={[
              { title: "Synchronize the Timer", text: "The countdown automatically retrieves and aligns with the official calendar date for this holiday." },
              { title: "Monitor the Build-Up", text: "Watch the countdown refresh in real-time, down to the millisecond, keeping the excitement alive." },
              { title: "Enable Cinematic View", text: "Click the maximize icon in the top right to switch to a stunning, distraction-free full-screen display." },
              { title: "Share the Buzz", text: "Use the built-in share icon to copy the direct link and countdown timer details for your family and friends." }
            ]}
            proTips={[
              "Display the live timer in full-screen mode on a tablet or second monitor to build seasonal anticipation in your office or home.",
              "Utilize the sharing feature to align event planning details with coworkers, friends, or holiday guests.",
              "Adjust your device system time settings to automatically update via network NTP for maximum countdown accuracy.",
              "Bookmark the specific holiday countdown page to easily check the days remaining without searching again."
            ]}
            useCases={[
              { title: "Travel & Logistical Preparation", text: "Prepare flight bookings, coordinate hotel reservations, and manage holiday schedules to beat the travel rush.", icon: Briefcase },
              { title: "Gift & Celebration Planning", text: "Keep track of days left to complete your holiday shopping, wrap presents, and prepare local gatherings.", icon: Users },
              { title: "Seasonal Event Promotion", text: "Utilize the live timer as a background display during corporate seasonal parties or school holiday events.", icon: Calendar }
            ]}
            whyChooseUs={`Our countdown system is designed to provide visual excellence and timing accuracy. Powered by client-side hardware performance clocks synced with global atomic servers, it remains perfectly accurate without device CPU lag. It features responsive dark/light modes and cinematic full-screen display layouts.`}
            troubleshooting={`If the clock looks out of sync, refresh the webpage or check if your operating system's timezone and clock sync are enabled. The offline fallback ensures the countdown continues ticking even during temporary connectivity issues.`}
            faqs={[
              { q: `When exactly is ${holiday.name}?`, a: `This occurrence falls on ${new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.` },
              { q: "Is the millisecond calculation accurate?", a: "Yes, our tracker leverages high-frequency system timers aligned with network atomic time to prevent browser delay." },
              { q: "Can I open the countdown in full-screen mode?", a: "Yes, our interface has a cinematic fullscreen display option. Click the maximize button in the top right to show it distraction-free." },
              { q: "Is there a share option for this timer?", a: "Yes, click share in the top right to copy the direct page URL to your clipboard for easy distribution." }
            ]}
          />
        </div>
        <div className="mt-16 max-w-7xl mx-auto px-4">
          <AdBanner />
        </div>
      </div>
    );
  }
}
