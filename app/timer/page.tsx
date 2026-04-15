import type { Metadata } from 'next'
import TimerClient from '@/components/pages/TimerClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Hourglass, Play, Bell, Maximize2, GraduationCap, Briefcase, Dumbbell, Utensils, Timer } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'
import ToolSEO from '@/components/seo/ToolSEO'
export const metadata: Metadata = {
  title: 'Online Countdown Timer – High-Precision Productivity Tool',
  description: 'A high-precision online countdown timer for students, professionals, and chefs. Features Pomodoro support, fitness intervals, and immersive full-screen focus mode.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/timer',
  },
  openGraph: {
    title: 'Online Countdown Timer – High-Precision Productivity Tool',
    description: 'Boost your focus with our millisecond-accurate countdown timer. Perfect for Pomodoro and heavy-duty productivity.',
    type: 'website',
  }
}

export default function TimerPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "High-Precision Online Timer",
    "description": "Millisecond-accurate online countdown timer with support for multiple presets, Pomodoro, and full-screen focus mode.",
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
        "name": "Are the countdown timers accurate for high-stakes tasks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our timing engine uses performance.now() to achieve millisecond precision, ensuring that our timers remain accurate even when your computer is running complex background tasks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this timer for the Pomodoro technique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Our timer is designed with productivity in mind. You can easily set a 25-minute Pomodoro block and use the full-screen mode to eliminate all visual distractions."
        }
      },
      {
        "@type": "Question",
        "name": "Will the timer sound if I am in a different browser tab?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our system uses high-fidelity audio alerts and standard browser notifications to ensure you're alerted as soon as the countdown reaches zero, regardless of which tab you're viewing."
        }
      }
    ]
  }

  return (
    <div className="w-full">
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-10 text-white tracking-tighter animate-in fade-in duration-1000">
          Online <span className="text-primary italic">Countdown</span> Timer
        </h1>
      </div>

      <TimerClient />

      {/* High-Precision SEO Content & User Guide (Server Side) */}
      <ToolSEO
        toolName="Countdown Timer"
        introTag="Determine Your Destiny, Second by Second"
        introHeading="High-Precision Online Countdown Timer for Unstoppable Focus and Results"
        introParagraph="Welcome to Clocks and Alarms Online, your premier destination for the most reliable countdown timer on the web. Our high-precision online timer is meticulously designed for students, professionals, and home chefs who demand millisecond accuracy. Whether you are mastering the Pomodoro technique, tracking fitness intervals, or counting down to a high-stakes event, our persistent and visually stunning interface ensures you stay on track and ahead of your schedule. Thousands of people rely on our real-time countdown clock every single day."
        howToSteps={[
          { title: "Configure Your Duration", text: "Use the preset buttons for quick 5, 10, or 25-minute timers, or manually input exact hours, minutes, and seconds for pinpoint accuracy." },
          { title: "Start the Countdown", text: "Click the highly visible play button to engage the timer. The beautiful, large numerical display will instantly begin ticking down in real-time." },
          { title: "Engage Focus Mode", text: "Click the full-screen icon in the corner to expand the timer. This removes all visual noise, which is critical for deep-work focus sessions." },
          { title: "Wait for the Alert", text: "When the countdown hits 00:00:00, our system automatically fires a high-fidelity continuous audio alert to bring you back to reality." }
        ]}
        proTips={[
          "For intense study sessions, use the 25-minute Pomodoro preset followed by a 5-minute break preset to maximize your brain's retention.",
          "Keep the browser tab active to prevent modern web browsers like Safari and Chrome from aggressively throttling JavaScript processes in the background.",
          "If you are using this as an egg timer or kitchen timer, turn your PC volume to exactly 100% so you can hear the chime over running water."
        ]}
        useCases={[
          { icon: GraduationCap, title: "For Students & Learners", text: "The online timer is the quintessential tool for exam preparation. Use it to time practice tests accurately, ensuring you are answering questions within the strict time limits of the SAT or LSAT." },
          { icon: Briefcase, title: "For Professionals & Remote Workers", text: "In corporate environments, use the timer to strictly enforce meeting durations. Set a timer for 15 minutes during a daily stand-up to stop colleagues from rambling and protect company resources." },
          { icon: Dumbbell, title: "For Fitness & Training", text: "Perfect for high-intensity interval training (HIIT). Throw the timer on full screen on your laptop while doing a 1-minute plank or tabata sprint." },
          { icon: Utensils, title: "For Cooking & Kitchen Tasks", text: "Cooking a multi-course meal requires precise coordination. Set timers for boiling pasta, roasting chicken, or letting a perfectly cooked steak rest." },
          { icon: Timer, title: "For Time Management & Productivity", text: "Embrace the Pomodoro technique. Working in hyper-focused blocks prevents burnout and significantly increases long-term daily output." }
        ]}
        whyChooseUs={`When searching for a countdown timer, you need absolute trust that it will ring precisely at zero, independent of what else your computer is doing. Many cheap timers drift over time. 
        
        Our timer uses performance.now() browser hooks to calculate exact elapsed time, resulting in zero-drift accuracy down to the millisecond. Additionally, our interface is 100% ad-free during the actual countdown sequence, ensuring that you are never distracted by flashing banners when you are trying to study or work. Finally, the elegant dark-mode glassmorphism design protects your eyes in low light conditions.`}
        troubleshooting={`If your timer visual freezes or sound fails:
        
        1. Tab Throttling: Browsers artificially slow down timers if you minimize the window. Try keeping the timer in a standalone window, slightly visible on your screen.
        2. Audio Autoplay: If the timer hits zero and there is no sound, your browser likely blocked 'autoplay'. You MUST click the start button manually and not through an automated script so the browser grants audio permissions.
        3. Hardware Issues: Ensure your system isn't muting the specific browser via the Volume Mixer on Windows.`}
        faqs={[
          { q: "How many timers can I run simultaneously?", a: "Currently, our main dashboard supports one massive, beautiful primary timer. For multiple simultaneous countdowns, we recommend opening the timer page in multiple browser windows and arranging them side-by-side." },
          { q: "Does the timer work if my internet goes offline?", a: "Yes! Once you have loaded the tool page, all the logic and audio files are cached directly into your browser memory. Even if your Wi-Fi drops, the timer will continue ticking and ring perfectly." },
          { q: "Are there preset times for common tasks?", a: "Yes, we prominently feature quick-add presets for 1 minute, 5 minutes, 10 minutes, and 25 minutes (the standard Pomodoro cycle)." },
          { q: "Can I use the timer in full-screen mode?", a: "Absolutely. Click the expand arrows in the top right of the timer to enter a distraction-free, cinematic focus mode that scales perfectly to any monitor or TV size." },
          { q: "What happens if I accidentally close the tab?", a: "Depending on your browser settings, the timer may reset. We highly recommend using the full-screen mode to prevent accidental tab closures." },
          { q: "Is the timer accurate enough for scientific experiments?", a: "While we use high-grade browser APIs (performance.now()), we generally do not recommend web-based timers for situations requiring sub-millisecond precision because operating system CPU loads can introduce micro-delays." },
          { q: "Can I change the alarm sound when the timer finishes?", a: "Currently the timer uses a highly penetrating, scientifically chosen chime designed to break through deep focus. Customizable sounds are coming in a future update." },
          { q: "Is it safe to use for long tasks like an 8-hour countdown?", a: "Yes! The timer calculates duration based on absolute system timestamps, meaning it will correctly calculate an 8-hour countdown even if the browser slows down in the interim." }
        ]}
      />
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
