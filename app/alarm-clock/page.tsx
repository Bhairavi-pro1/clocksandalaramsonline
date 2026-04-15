import type { Metadata } from 'next'
import AlarmClockClient from '@/components/pages/AlarmClockClient'
import StructuredData from '@/components/seo/StructuredData'
import { HelpCircle, Bell, Clock, Zap, Shield, GraduationCap, Briefcase, Dumbbell, Utensils, Timer } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'
import ToolSEO from '@/components/seo/ToolSEO'
export const metadata: Metadata = {
  title: 'Free Online Alarm Clock - Set Alarms & Timers | Wake Up On Time',
  description: 'Set free online alarms and timers instantly. Our alarm clock works in your browser with custom sounds, multiple alarms, and a beautiful interface.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/alarm-clock',
  },
  openGraph: {
    title: 'Free Online Alarm Clock - Set Alarms & Timers | Wake Up On Time',
    description: 'Set free online alarms and timers instantly. Multiple sounds, custom labels, and a beautiful interface.',
    type: 'website',
  }
}

export default function AlarmPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Professional Online Alarm Clock",
    "description": "High-precision online alarm clock with custom labels, multiple sound profiles, and persistent browser-based alerts.",
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
        "name": "Will the online alarm work if my browser is closed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For the most reliable experience, you should keep this browser tab open. However, our system uses persistent state management to resume any active alarms immediately if you accidentally close and reopen the site."
        }
      },
      {
        "@type": "Question",
        "name": "Can I set multiple alarms at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can add an unlimited number of alarms with custom labels like 'Work Call', 'Medication', or 'Gym' to keep your whole day organized from one central dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "Are the alarm sounds customizable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We offer a curated library of high-fidelity alert tones, ranging from gentle morning birds to high-energy electronic beeps, ensuring you wake up in the way that suits you best."
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
          Online <span className="text-primary italic">Alarm</span> Clock
        </h1>
      </div>

      <AlarmClockClient />

      {/* High-Precision SEO Content & User Guide (Server Side) */}
      {/* Huge SEO Payload via ToolSEO Component */}
      <ToolSEO
        toolName="Alarm Clock"
        introTag="The Smartest Way to Wake Up"
        introHeading="Professional Online Alarm Clock for a Seamless Daily Routine"
        introParagraph="Clocks and Alarms Online offers a sophisticated yet simple-to-use alarm clock that integrates seamlessly into your life. Designed for those who wake up with precision and intent, our tool allows you to manage multiple alarms with customized labels and high-fidelity audio tones. Never miss a critical meeting or early flight again with our persistent, browser-based notification system. Over 100,000 users rely on our precision engineering every single day to start their mornings exactly when they need to."
        howToSteps={[
          { title: "Set Your Wake-Up Time", text: "Select your desired Hour, Minute, and AM/PM using the intuitive selection interface. Our 24-hour underlying architecture guarantees zero drift." },
          { title: "Assign a Descriptive Label", text: "Whether it's 'Morning Jog', 'Medication', or 'Investor Meeting', naming your alarm helps structure your mental schedule for the day." },
          { title: "Choose Your Audio Profile", text: "Select from seven high-fidelity tones. Use 'Birds' for a gentle awakening, or 'Synthwave' when you need high-energy immediate action." },
          { title: "Save and Activate", text: "Hit save. The alarm card will appear in your Active Alarms grid. Leave the tab open to guarantee the alarm executes flawlessly using browser APIs." }
        ]}
        proTips={[
          "Keep the browser tab active or in its own window. Modern browsers frequently snooze background tabs which can delay audio playback.",
          "Use the 'Full Screen' active alarm modal to immediately halt the alarm when you wake up—you won't have to squint to find the stop button.",
          "Turn your device volume to maximum and ensure your operating system's 'Do Not Disturb' settings allow browser notifications."
        ]}
        useCases={[
          { icon: GraduationCap, title: "For Students & Learners", text: "College students use our alarm to manage complex class schedules, power naps between lectures, and ensuring they never oversleep before a crucial final exam." },
          { icon: Briefcase, title: "For Professionals & Remote Workers", text: "Remote workers rely on precise alarms to signify the start of a meeting across different timezones, preventing the dreaded 'sorry I'm late' apologies." },
          { icon: Dumbbell, title: "For Fitness & Training", text: "Set intervals for morning runs or yoga sessions. Use customized labels so you know exactly which phase of your workout you are in." },
          { icon: Utensils, title: "For Cooking & Kitchen Tasks", text: "Never burn a roast again. Set an alarm labeled 'Oven Check' using a high-pitched tone that can be heard over the sizzle of the stove." },
          { icon: Timer, title: "For Time Management & Productivity", text: "Pair our alarms with the Pomodoro technique. Work for 25 minutes until the 'Break Time' alarm fires, ensuring you take the mental rest you need." }
        ]}
        whyChooseUs={`When searching for an online alarm clock, reliability is the only metric that matters. Our tool is built on modern Web APIs, meaning it doesn't just rely on standard JavaScript timers that browsers put to sleep. We leverage high-frequency polling and local storage persistence. 
        
        Zero installation is required. You don't need to download an app that tracks your location or drains your battery. Simply load the page, set your time, and go to sleep. It is entirely free, perfectly synchronized with global atomic time, and beautifully designed to serve as a bedside clock display if left open in full screen.`}
        troubleshooting={`If your alarm fails to ring or play sound, check these common fixes:
        
        1. Browser Audio Policies: Browsers like Chrome and Safari block auto-playing audio unless you have interacted with the page first. Always click somewhere on the page before leaving it unattended.
        2. Do Not Disturb Mode: Ensure your Windows or Mac 'Focus Assist' / 'Do Not Disturb' mode is not silencing the browser.
        3. Background Throttling: If your laptop goes to sleep or the lid is closed, the alarm cannot run. Always keep your device plugged in or disable sleep mode while waiting for a critical alarm.`}
        faqs={[
          { q: "Do I need to stay on this page for the alarm to ring?", a: "Yes, for the absolute best reliability, keep the tab open. Our system utilizes minor background processing to ensure alerts trigger even if you are working in other browser tabs, but if the browser is entirely closed, the alarm cannot trigger." },
          { q: "Are my alarms saved if I refresh the page?", a: "Yes! Every alarm you configure is automatically stored in your browser's local cache. This means your wake-up schedule persists through refreshes and accidental browser restarts." },
          { q: "Can I use the alarm clock on my mobile phone or tablet?", a: "Absolutely. Our interface is fully responsive and optimized for mobile and tablet devices, providing a premium bedside display experience on any screen size." },
          { q: "Is there a snooze feature available?", a: "No native snooze button exists yet, however the prominent 'Stop' button immediately silences the alarm. You can easily add a new alarm for 5 minutes later from the dashboard." },
          { q: "What should I do if the volume is too low?", a: "The volume is entirely dependent on your system's output device. Check your OS volume mixer to ensure your browser is turned up to 100%, and verify hardware speakers are powered on." },
          { q: "Can I use a custom YouTube song as an alarm?", a: "Currently, we only support our meticulously curated library of high-fidelity tones to ensure instant loading times and prevent copyright or buffering issues." },
          { q: "How many alarms can I create?", a: "There is no hard limit on the number of alarms you can create! You can configure separate alarms for every 15 minutes of your entire day." },
          { q: "Does the alarm adjust for Daylight Saving Time automatically?", a: "Yes, because the alarm utilizes your device's native clock APIs, it automatically inherits any DST shifts enacted by your operating system overnight." }
        ]}
      />
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
