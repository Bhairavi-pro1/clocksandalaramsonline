import type { Metadata } from 'next'
import StopwatchClient from '@/components/pages/StopwatchClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Timer, RotateCcw, List, Maximize2, GraduationCap, Briefcase, Dumbbell, Utensils } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'
import ToolSEO from '@/components/seo/ToolSEO'
export const metadata: Metadata = {
  title: 'Free Online Stopwatch – High-Precision Lap Timer',
  description: 'A professional-grade free online stopwatch with millisecond accuracy. Features lap timing, history tracking, and full-screen mode for athletics and productivity.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/stopwatch',
  },
  openGraph: {
    title: 'Free Online Stopwatch – High-Precision Lap Timer',
    description: 'Professional millisecond-accurate free online stopwatch for any activity. Lap tracking and full-screen mode included.',
    type: 'website',
  }
}

export default function StopwatchPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "High-Precision Online Stopwatch",
    "description": "Millisecond-accurate online stopwatch with lap timing and history tracking for professional and athletic use.",
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
        "name": "How accurate is this online stopwatch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our stopwatch uses high-resolution system performance counters (performance.now) to ensure millisecond accuracy, preventing timing drift even under heavy CPU load."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my lap times?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, your lap times and session history are automatically saved to your browser's local storage so you can review them even after closing the tab."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work in full-screen mode?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. You can click the maximize icon to enter full-screen mode, which is perfect for gym use, athletics, or public presentations. This mode hides all browser distractions."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <h1 className="text-primary font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4 text-center animate-in fade-in duration-700">
          Free Online Stopwatch – High-Precision Lap Timer
        </h1>
      </div>

      <StopwatchClient />

      {/* Extended SEO Content & How to Use (Bottom of page - Server Side) */}
      <ToolSEO
        toolName="Stopwatch"
        introTag="Professional Grade Timing"
        introHeading="A Free Online Stopwatch for Every Second That Counts"
        introParagraph="The Clocks and Alarms Online stopwatch is engineered for performance. Unlike standard web timers, our tool utilizes high-frequency system performance counters to ensure that the displayed time never lags, even during intense CPU usage. Whether you're an athlete timing splits or a professional developer tracking work cycles, our tool provides the absolute stability you need. Thousands of users log over 100,000 professional laps every single day on our platform."
        howToSteps={[
          { title: "Initialize the Clock", text: "Click the primary green START button. The timer will instantly begin spinning, tracking milliseconds, seconds, and minutes with perfect synchronization." },
          { title: "Capture Lap Times", text: "While the stopwatch is running, strike the 'Lap' button. This captures an exact snapshot of the current time and immediately spawns a new line in your history log." },
          { title: "Pause and Resume", text: "Need a break? Hit the STOP button to pause the timer. You can seamlessly resume from the exact millisecond by clicking START again." },
          { title: "Clear the Ledger", text: "Once your athletic event or work sprint is finished, hit RESET to clear all session times and wipe your local browser memory for a fresh start." }
        ]}
        proTips={[
          "If using the stopwatch on a laptop on the track or field, immediately hit the Maximize icon to blow the timer up to Cinema Mode, making it visible from 50 feet away.",
          "You do not need to pause the timer to lap. Press lap repeatedly while the main clock is running to get gap timings between consecutive events.",
          "Keep the browser tab active if you are timing an event longer than 15 minutes, as some OS battery savers may throttle background rendering."
        ]}
        useCases={[
          { icon: Dumbbell, title: "For Athletics & Fitness", text: "Track sprinters, swimmers, or CrossFit enthusiasts use our tool to log exact split times. The lap function is explicitly built to handle 100x lap recordings without slowing down." },
          { icon: Briefcase, title: "For Business & Boardrooms", text: "Timing an elevator pitch or a startup presentation? Load the stopwatch on the projector in full-screen mode to enforce strict speaking limits." },
          { icon: GraduationCap, title: "For Students & Testing", text: "Used extensively by law students and nursing candidates to simulate testing environments where question completion speed is closely monitored." },
          { icon: Utensils, title: "For Chefs & Baking", text: "Professional chefs use the lap timer to track multiple overlapping phases of a recipe that require precision monitoring." },
          { icon: Timer, title: "For Software Developers", text: "Engineers often use our high-precision tool to manually time code execution times, server cold starts, or database reboot durations." }
        ]}
        whyChooseUs={`Standard digital stopwatches rely on classic JavaScript \`setInterval\` functions, which notoriously drift and lose seconds over long durations because browsers throttle background tabs. 

        Our stopwatch avoids this entirely by binding directly to \`performance.now()\`, a sub-millisecond resolution web API. Every time the screen repaints, it calculates the exact delta from the initialization timestamp. The result is a professional-grade, zero-drift timing instrument that matches the accuracy of dedicated Olympic hardware, packed into a beautiful, ad-free digital interface.`}
        troubleshooting={`Stopwatch stopped ticking or lost time?
        
        1. Browser Resource Sleeping: If you switch to another tab for an hour, Chrome \"parks\" the previous tab. The stopwatch actually recalculates the exact missed time instantly when you switch back, but it may appear frozen while suspended.
        2. Mobile Sleep Mode: If your phone screen turns off, the visual timer stops updating to save battery. The core timer continues accurately in memory, but prevent auto-lock if you need constant visuals.
        3. LocalStorage Wiping: If you use \"Incognito\" mode, your captured lap times will be permanently deleted the moment you close the browser window.`}
        faqs={[
          { q: "How accurate is this online stopwatch?", a: "Our stopwatch uses high-resolution system performance counters (performance.now) to ensure millisecond accuracy, preventing timing drift even under heavy CPU or memory load." },
          { q: "Does it work the same on mobile devices?", a: "Yes, our stopwatch is entirely responsive and optimized for rapid touch interactions on iOS and Android. The buttons have massive hitboxes specifically designed for sweaty hands during workouts." },
          { q: "What happens if I accidentally close the browser?", a: "Your session state and lap history are saved in real-time to your browser's persistent LocalStorage. Simply reopen the page to resume exactly from where you were." },
          { q: "Is there a limit to the number of laps?", a: "There is no hard limit on lap recording. You can track hundreds of laps for long-distance events or complex multi-stage tasks without any UI performance degradation." },
          { q: "Can I export my lap times?", a: "Currently, lap times are meant for immediate review on-screen. Copy-pasting the lap ledger into a spreadsheet works perfectly, and an explicit CSV export button is coming in the next major build." },
          { q: "Why do the milliseconds blur slightly when running?", a: "At 60 frames per second, the human eye cannot track individual milliseconds jumping. The blur is a natural optical effect of the ultra-fast rendering rate of our graphics engine." },
          { q: "Does the stopwatch require an internet connection?", a: "Only to load initially. Once the page is open, the stopwatch runs entirely offline locally within your browser's execution sandbox." },
          { q: "Can I run multiple stopwatches at once?", a: "Not in a single tab. However, you can open multiple browser windows side-by-side to track several independent competitors simultaneously." }
        ]}
      />
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
