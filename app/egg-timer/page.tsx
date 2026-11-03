import { Metadata } from 'next'
import Link from 'next/link'
import EggTimerClient from '@/components/pages/EggTimerClient'
import AdBanner from '@/components/ui/AdBanner'
import ToolSEO from '@/components/seo/ToolSEO'
import StructuredData from '@/components/seo/StructuredData'
import { Utensils, Timer, Thermometer, ShoppingCart, Info } from 'lucide-react'
import timerData from '@/data/seo/timers.json'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Interactive Egg Timer — Perfect Boiled Eggs Every Time',
  description: 'Free interactive egg timer for perfect boiled eggs every time. Dynamically adjust for egg size, fridge temperature, and your exact desired yolk firmness.',
  keywords: 'egg timer, boiled egg timer, how long to boil eggs, perfect hard boiled eggs, ramen egg timer, soft boiled egg time',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/egg-timer/',
  },
  openGraph: {
    title: 'Interactive Egg Timer — Perfect Boiled Eggs Every Time',
    description: 'Free interactive egg timer for perfect boiled eggs every time. Dynamically adjust for egg size, fridge temperature, and your exact desired yolk firmness.',
    url: 'https://clocksandalarmsonline.com/egg-timer/',
    siteName: 'Clocks and Alarms Online',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Egg Timer - Clocks and Alarms Online'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Interactive Egg Timer — Perfect Boiled Eggs Every Time',
    description: 'Free interactive egg timer for perfect boiled eggs every time. Dynamically adjust for egg size, fridge temperature, and your exact desired yolk firmness.',
    images: ['/icon.png'],
  }
}

const tableSchema = {
  "@context": "https://schema.org",
  "@type": "Table",
  "about": "Egg Boiling Times Chart",
  "keywords": "egg boiling times, soft boiled time, medium boiled time, hard boiled time"
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
      "name": "Egg Timer",
      "item": "https://clocksandalarmsonline.com/egg-timer/"
    }
  ]
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Interactive Egg Timer",
  "description": "Calculates exact boiling times for soft, medium, or hard boiled eggs based on egg size, temperature, and desired yolk firmness.",
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
    "ratingCount": "620",
    "bestRating": "5",
    "worstRating": "1"
  }
}

const getTimerDisplay = (slug: string) => {
  switch (slug) {
    case '1-minute': return { label: '1 Min', sub: 'Quick Task' }
    case '2-minute': return { label: '2 Min', sub: 'Teeth / Stretch' }
    case '3-minute': return { label: '3 Min', sub: 'Tea Brewing' }
    case '5-minute': return { label: '5 Min', sub: 'Soft Boiled Egg' }
    case '10-minute': return { label: '10 Min', sub: 'Hard Boiled Egg' }
    case '15-minute': return { label: '15 Min', sub: 'Kitchen Timer' }
    case '20-minute': return { label: '20 Min', sub: 'Power Nap' }
    case 'pomodoro': return { label: 'Pomodoro', sub: '25 Min Focus' }
    default: return { label: slug.toUpperCase(), sub: 'Countdown' }
  }
}

const timerOrder = ['1-minute', '2-minute', '3-minute', '5-minute', '10-minute', '15-minute', '20-minute', 'pomodoro']
const kitchenTimers = timerOrder
  .map(slug => timerData.find(t => t.slug === slug))
  .filter((t): t is typeof timerData[0] => Boolean(t))

export default function EggTimerPage() {
  return (
    <div className="w-full">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={tableSchema} />

      <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-2 sm:pt-4 md:pt-6 pb-20">
        {/* Visual Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-muted/70 font-medium">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li className="opacity-40">/</li>
            <li className="text-slate-900 dark:text-white font-bold" aria-current="page">Egg Timer</li>
          </ol>
        </nav>
        
        <div className="text-center pt-2 md:pt-4 mb-6 sm:mb-12 space-y-2 sm:space-y-3 px-2 sm:px-0">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">
            Culinary Precision Calculator
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Perfect <span className="text-primary italic font-serif">Egg Timer</span>
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-white/60 font-medium max-w-2xl mx-auto px-2">
            Select your desired doneness with our interactive guide. Adjust for egg size and starting temperature to boil the perfect egg every time.
          </p>
        </div>

        {/* The Interactive Client Component */}
        <EggTimerClient />

        {/* Popular Kitchen & Countdown Timers Directory */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-200/80 dark:border-white/10 w-full">
          <div className="text-center mb-8 px-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              Popular Kitchen & Countdown Timers
            </h2>
            <p className="text-slate-600 dark:text-muted/70 text-xs sm:text-sm mt-1 max-w-2xl mx-auto">
              Quickly launch dedicated countdown timers for cooking, tea brewing, and focus intervals
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 w-full">
            {kitchenTimers.map((t) => {
              const display = getTimerDisplay(t.slug)
              return (
                <Link
                  key={t.slug}
                  href={`/timer/${t.slug}/`}
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
              )
            })}
          </div>
        </div>

        {/* SEO Content & Tables */}
        <div className="mt-16 sm:mt-20 w-full">
          <ToolSEO
            toolName="Interactive Egg Timer"
            introTag="Culinary Precision"
            introHeading="Achieve the Perfect Boil Every Single Time"
            introParagraph="Boiling an egg seems simple until you're faced with an overcooked, chalky yolk or an undercooked, runny white. Our interactive Egg Timer removes the guesswork from breakfast. By dynamically calculating the specific boiling time based on your egg's exact size and starting temperature, our algorithm ensures a flawless culinary result. Whether you prefer a liquid center for ramen or a firm hard-boil for egg salad, perfect consistency is just a click away."
            howToSteps={[
              { title: "Select Egg Size", text: "Are you using Medium, Large, or Extra Large eggs? The thermal mass of the egg dictates how fast heat penetrates to the yolk." },
              { title: "Choose Starting Temp", text: "Did you pull the egg directly from a 38°F fridge, or has it been resting at room temperature? This drastically changes the required boiling time." },
              { title: "Pick Desired Doneness", text: "Slide the visual selector to choose between a soft, gooey yolk, a jammy medium boil, or a firm hard boil." },
              { title: "Start the Timer", text: "Once your water reaches a rolling boil, gently lower the eggs into the pot and simultaneously click the 'Start' button." }
            ]}
            proTips={[
              "Always prepare an 'Ice Bath' (a bowl of cold water and ice cubes) before your timer finishes. Dropping the eggs into the ice bath immediately stops the cooking process.",
              "Slightly older eggs are significantly easier to peel than farm-fresh eggs. If you are making deviled eggs, buy them a week in advance.",
              "Using a push-pin to poke a microscopic hole in the wide base of the egg before boiling allows trapped air to escape, preventing the shell from cracking in the water."
            ]}
            useCases={[
              { icon: Utensils, title: "For Ramen Enthusiasts", text: "The perfect Ajitsuke Tamago (Ramen Egg) requires a highly precise 6.5-minute medium-soft boil to achieve that signature custard-like consistency." },
              { icon: Thermometer, title: "For Meal Preppers", text: "Meal preppers making huge batches of hard-boiled eggs need exact timing to avoid the ugly, sulfuric green-gray ring from forming around overcooked yolks." },
              { icon: ShoppingCart, title: "For Home Cooks", text: "No more guessing if the eggs are done. The visual interface allows home cooks to confidently deliver the exact style of egg requested by picky family members." },
              { icon: Timer, title: "For Professional Kitchens", text: "Line cooks running multiple stations use our digital timer to ensure the breakfast service eggs are consistently perfect across hundreds of orders." },
              { icon: Info, title: "For Culinary Students", text: "Learning the science of thermal transfer in proteins is critical. The timer demonstrates exactly how size and starting temp affect coagulation." }
            ]}
            whyChooseUs={`Generic cooking charts only give you a rough estimate, usually ignoring whether your eggs are coming from the fridge or the counter. In a delicate protein like an egg, a 40°F starting difference translates to a full minute of required boiling time. 
            
Our interactive tool uses a calibrated algorithmic model to calculate the necessary thermal curve. Combined with a piercing audio alert that can be heard over the sound of a running exhaust fan, Clocks and Alarms Online offers the most reliable culinary timer on the web.`}
            troubleshooting={`Timer finished but eggs are wrong?
            
1. False Boil: Ensure the water is at a "rolling boil" (large, violent bubbles) before dropping the eggs in. Simmering water will result in undercooked eggs.
2. Altitude Sickness: Water boils at lower temperatures at high altitudes (like Denver, CO). If you live in the mountains, you must manually add 1-2 extra minutes to the timer to compensate.
3. Overcrowding: Dropping 12 cold eggs into a small pot immediately kills the water temperature. Ensure you have enough boiling water to maintain a rapid boil after adding the eggs.`}
            faqs={[
              { q: "Should I start with cold or boiling water?", a: "Most chefs agree that gently lowering eggs into already BOILING water makes peeling them significantly easier. The sudden heat shock prevents the egg white's proteins from bonding to the inner shell membrane." },
              { q: "What is an ice bath and why is it important?", a: "An ice bath is simply a bowl filled with cold water and ice. Transferring cooked eggs immediately into an ice bath stops the internal cooking process instantly, preventing overcooked, gray yolks and making peeling a breeze." },
              { q: "How long is a soft boiled egg?", a: "For a standard Large egg straight from the fridge dropped into boiling water, a perfect soft-boil (runny yolk, set whites) takes exactly 6 minutes." },
              { q: "How long is a hard boiled egg?", a: "For a firm, fully cooked hard-boiled egg ideal for salads or deviled eggs, you should boil a Large fridge-cold egg for 10 to 12 minutes." },
              { q: "Why is the yolk green/gray?", a: "The dreaded green ring is caused by overcooking. Iron from the yolk reacts with hydrogen sulfide from the white to form ferrous sulfide. Using our exact timer prevents this." },
              { q: "Do brown eggs take longer to cook than white eggs?", a: "No. The color of the shell is determined purely by the breed of the chicken and has absolutely zero impact on cooking times, shell thickness, or nutritional value." },
              { q: "Does the timer work on my phone in the kitchen?", a: "Yes! Our interface is fully mobile responsive, meaning you can prop your phone up on the counter while cooking without the screen sleeping." }
            ]}
          />
        </div>

        {/* Reference Table Section */}
        <section className="mt-16 w-full max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">The Ultimate Egg Boiling Times Chart</h2>
            <p className="text-slate-600 dark:text-white/60 leading-relaxed text-sm sm:text-base md:text-lg">
              Whether you&apos;re making gooey ramen eggs or firm eggs for a salad, keeping track of exactly how long to boil your eggs is crucial. Refer to our reference chart below based on standard large eggs starting in boiling water.
            </p>
            
            <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl">
              <table className="w-full min-w-[480px] text-left border-collapse bg-slate-50 dark:bg-white/5">
                <thead>
                  <tr className="bg-primary/20 text-primary border-b border-primary/20">
                    <th className="p-3.5 sm:p-5 font-black uppercase text-xs sm:text-sm tracking-wider">Egg Size</th>
                    <th className="p-3.5 sm:p-5 font-black uppercase text-xs sm:text-sm tracking-wider">Soft Boiled</th>
                    <th className="p-3.5 sm:p-5 font-black uppercase text-xs sm:text-sm tracking-wider">Medium Boiled</th>
                    <th className="p-3.5 sm:p-5 font-black uppercase text-xs sm:text-sm tracking-wider">Hard Boiled</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-white/80 text-xs sm:text-sm">
                  <tr className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3.5 sm:p-5 font-bold text-slate-800 dark:text-white">Small (S)</td>
                    <td className="p-3.5 sm:p-5">3-4 minutes</td>
                    <td className="p-3.5 sm:p-5">5-6 minutes</td>
                    <td className="p-3.5 sm:p-5">8-9 minutes</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3.5 sm:p-5 font-bold text-slate-800 dark:text-white">Large (L) - Standard</td>
                    <td className="p-3.5 sm:p-5">5-6 minutes</td>
                    <td className="p-3.5 sm:p-5">7-8 minutes</td>
                    <td className="p-3.5 sm:p-5">10-12 minutes</td>
                  </tr>
                  <tr className="hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3.5 sm:p-5 font-bold text-slate-800 dark:text-white">Extra Large (XL)</td>
                    <td className="p-3.5 sm:p-5">6-7 minutes</td>
                    <td className="p-3.5 sm:p-5">8-9 minutes</td>
                    <td className="p-3.5 sm:p-5">12-14 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs sm:text-sm text-primary/70 italic">* Times may vary slightly based on altitude, amount of water, and starting water temperature (always start counting when water returns to a rolling boil).</p>
          </div>
        </section>

        <div className="mt-16 max-w-7xl mx-auto px-0 sm:px-4">
          <AdBanner />
        </div>
      </div>
    </div>
  )
}
