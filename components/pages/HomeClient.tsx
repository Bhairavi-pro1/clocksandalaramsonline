'use client'
import { useState } from 'react'
import Link from 'next/link'
import { 
  Globe, 
  Timer, 
  Hourglass, 
  Bell, 
  Calendar,
  CalendarRange,
  ArrowRight,
  Zap,
  Clock as ClockIcon,
  Cpu,
  RefreshCw,
  Search,
  Settings,
  Users,
  ChefHat,
  PartyPopper,
  BookOpen,
  Laptop,
  Smartphone,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'
import { Post, urlFor } from '@/lib/sanity'

const categoryLabels: Record<string, string> = {
  'time-history': 'Time History',
  'clock-technology': 'Clock Technology',
  'productivity-tips': 'Productivity Tips',
  'tool-guides': 'Tool Guides',
  'time-zones-dst': 'Time Zones & DST',
  'fun-facts': 'Fun Facts',
}

const tools = [
  {
    title: 'World Clock',
    description: 'Track high-precision local time across thousands of cities globally. Perfect for international business coordination and remote team scheduling. Includes automatic calculations for daylight saving transitions in real-time.',
    icon: Globe,
    href: '/world-clock',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400',
    badge: 'Popular',
    ctaText: 'Launch World Clock'
  },
  {
    title: 'Online Alarm',
    description: 'Set custom alarms with high-fidelity tones, snooze timers, and persistent audio notifications. Works seamlessly in your background browser tab to ensure you never miss a critical meeting or daily routine.',
    icon: Bell,
    href: '/alarm-clock',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400',
    badge: 'Updated',
    ctaText: 'Set Alarm Clock'
  },
  {
    title: 'Stopwatch',
    description: 'A professional-grade lap timer with millisecond resolution and session history tracking. Perfect for workouts, cooking, laboratory experiments, or programming sprint intervals with download options.',
    icon: Timer,
    href: '/stopwatch',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    ctaText: 'Start Stopwatch'
  },
  {
    title: 'Countdown Timer',
    description: 'An immersive full-screen timer designed for Pomodoro study intervals, training sessions, and productivity tracking. Features highly customizable sound alarms and clean visual progress bars.',
    icon: Hourglass,
    href: '/timer',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    badge: 'Best Seller',
    ctaText: 'Start Countdown Timer'
  },
  {
    title: 'DST Tracker',
    description: 'An expert-curated database tracking daylight saving time transitions worldwide. Stay informed about when clocks turn forward or backward in each timezone, helping you prevent scheduling mix-ups.',
    icon: Calendar,
    href: '/dst-tracker',
    color: 'from-indigo-500/20 to-violet-500/20',
    iconColor: 'text-indigo-400',
    ctaText: 'Check DST Schedule'
  },
  {
    title: 'Meeting Planner',
    description: 'Visually coordinate international team conferences across multiple timezone grids simultaneously. Find the overlapping green zone of working hours automatically without complex mental math.',
    icon: CalendarRange,
    href: '/meeting-planner',
    color: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400',
    ctaText: 'Plan World Meeting'
  },
  {
    title: 'Shared Alarm',
    description: 'Create, schedule, and broadcast custom synchronized alarms across multiple remote devices simultaneously. Great for morning standups, study cohorts, or multiplayer time coordination.',
    icon: Users,
    href: '/shared-alarm',
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
    badge: 'New',
    ctaText: 'Create Shared Alarm'
  },
  {
    title: 'Egg Timer',
    description: 'Perfectly boil soft, medium, or hard-boiled eggs every single time. Offers precise cooking intervals adjusted for culinary consistency. Say goodbye to overcooked breakfasts.',
    icon: ChefHat,
    href: '/egg-timer',
    color: 'from-orange-400/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    ctaText: 'Start Egg Timer'
  },
  {
    title: 'Holiday Countdown',
    description: 'Count down the exact days, hours, minutes, and seconds until global holidays, seasonal celebrations, and major public events with high precision visual counters.',
    icon: PartyPopper,
    href: '/countdown',
    color: 'from-fuchsia-500/20 to-purple-500/20',
    iconColor: 'text-fuchsia-400',
    ctaText: 'Launch Holiday Countdown'
  }
]

const faqs = [
  {
    q: "How does the World Clock handle daylight saving changes?",
    a: "Our World Clock is directly integrated with the latest IANA Time Zone Database updates. Whenever a country shifts its clock due to Daylight Saving Time (DST) changes, the system automatically detects it and displays the exact time without requiring any manual adjustments. You can always trust it to stay current."
  },
  {
    q: "Will my alarms go off if I close the browser tab?",
    a: "For your alarms and timers to sound, the browser tab must remain open. However, because our application runs entirely on your device client-side, the timers will keep running in the background even if you switch tabs or minimize the window. We recommend keeping the tab pinned for critical alarms."
  },
  {
    q: "How do you guarantee the accuracy of your stopwatch and timers?",
    a: "Standard web timers built with simple JavaScript intervals often drift under heavy browser or CPU usage. Clocks and Alarms Online solves this by using high-resolution performance counters ('performance.now()' web API). This matches calculations against your device's physical CPU crystal clock, ensuring zero timer drift."
  },
  {
    q: "Do I need to sign up or pay to use the tools?",
    a: "No. The entire suite of tools is 100% free and open to everyone. You do not need to register an account, input an email address, or pay subscription fees. We believe in providing instant utility without hurdles, supported transparently by safe, standard web advertising partners."
  },
  {
    q: "Can I save my personalized world clock dashboard?",
    a: "Absolutely. Any cities you add to your dashboard or custom configuration settings are stored locally in your browser's LocalStorage memory. They will load instantly whenever you return to the site, even if you are offline, without uploading any personal profile data to external servers."
  },
  {
    q: "Are these tools friendly for smartphones and tablets?",
    a: "Yes. Our interface uses a responsive, mobile-first design system. Whether you are using a smartphone (iOS and Android), tablet, desktop computer, laptop, or even a smart TV web browser, the controls dynamically adapt to provide clear readability and quick finger-tap access."
  }
]

export default function HomeClient({ posts }: { posts: Post[] }) {
  // Slicing to get the latest 3 posts
  const latestPosts = posts?.slice(0, 3) || []
  const [activeMobileFaq, setActiveMobileFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col space-y-16 md:space-y-32 pb-16 md:pb-32 w-full overflow-hidden">
      
      {/* 🚀 Cinematic Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-34 md:pt-36 pb-10 md:pb-16">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 blur-[180px] rounded-full animate-pulse duration-[10s]" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[140px] rounded-full" />
          {/* Mask to fade out the glows smoothly at the bottom without sharp edges */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-2xl">
            <Zap size={16} className="fill-current animate-pulse text-yellow-500" /> 
            Professional Time & Productivity Suite
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] drop-shadow-[0_0_80px_rgba(124,58,237,0.3)]">
            High Precision <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500 animate-gradient font-display italic tracking-tight">Timekeeping</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted/70 max-w-3xl mx-auto font-medium leading-normal">
            Your free, high-performance portal for global world clocks, loud online alarms, high-fidelity stopwatches, and focus timers. No accounts, no installs, instant load.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
            <Link 
              href="/world-clock" 
              className="group flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-3xl shadow-primary/40"
            >
              Open Time Dashboard <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>

        {/* Dynamic Wave Element */}
        <div className="mt-10 md:mt-20 w-full max-w-6xl mx-auto px-4 opacity-20">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </section>

      {/* 📘 Section 1: What is Clocks and Alarms Online */}
      <section id="overview" className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
          Overview & Utility
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          What is Clocks and <span className="text-primary">Alarms Online?</span>
        </h2>
        <div className="flex flex-col gap-6 text-base text-muted/70 leading-relaxed font-medium text-justify">
          <p>
            Clocks and Alarms Online is a professional, comprehensive web-based platform offering a suite of precision utility tools designed to make time management simple and accessible for everyone. We provide an integrated interface featuring world clocks, stopwatch lap trackers, countdown timers, daylight saving databases, and shared alarm grids.
          </p>
          <p>
            Unlike default software programs bundled with desktop operating systems or mobile phones, our tools require absolutely no software installation, register zero background battery strain, and load instantly on any web-enabled platform. We ensure that you can coordinate worldwide schedules, set alarms, time activities, and track global time shifts directly from your browser.
          </p>
        </div>
      </section>

      {/* 📘 Section 2: Why Does This Platform Exist? */}
      <section id="mission" className="max-w-6xl mx-auto px-6 space-y-6 border-t border-white/5 pt-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-2">
          Our Core Mission
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Why Does This <span className="text-accent">Platform Exist?</span>
        </h2>
        <div className="flex flex-col gap-6 text-base text-muted/70 leading-relaxed font-medium text-justify">
          <p>
            In our increasingly interconnected remote-work world, timezone synchronization and task execution timing have become absolute necessities. Team members are distributed across multiple continents, daylight saving shifts happen unexpectedly, and task-switching costs are higher than ever. Standard tools are scattered, bloated with advertisements, or lock key features behind subscription walls.
          </p>
          <p>
            We built this platform to unify time utility workflows into a single dashboard. By providing high-precision tools for free in a privacy-first web model, we enable cross-border teams to align, developers to benchmark, athletes to track cycles, and users to set loud alarms without sharing personal data, registering accounts, or worrying about software bloat.
          </p>
        </div>
      </section>

      {/* 🛠️ Section 3: Tool Showcase Grid */}
      <section id="features" className="max-w-7xl mx-auto w-full px-6 space-y-20 relative">
        <div className="absolute -top-40 left-0 w-64 h-64 bg-primary/5 blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-4 text-left max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic">Our Utility <span className="text-primary not-italic">Features</span></h2>
            <p className="text-muted/60 font-medium text-lg leading-relaxed">
              Explore our range of high-performance tools, built with zero-drift engines and visually rich interfaces to boost your productivity.
            </p>
          </div>
          <div className="h-px flex-1 bg-white/5 mx-12 hidden md:block mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tools.map((tool, index) => (
            <Link 
              key={tool.title} 
              href={tool.href}
              className={cn(
                "group p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-[#1a0b2e]/60 border border-white/5 hover:border-white/20 transition-all duration-700 flex flex-row md:flex-col items-start text-left gap-5 md:gap-0 md:space-y-8 relative overflow-hidden shadow-2xl hover:-translate-y-2",
                `animate-in fade-in slide-in-from-bottom-${(index % 3 + 1) * 8} duration-1000`
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br -z-10",
                tool.color
              )} />
              
              {/* Left column on mobile, top row on desktop */}
              <div className="flex md:flex-row md:justify-between md:items-start shrink-0 w-auto md:w-full">
                <div className={cn(
                  "w-14 h-14 md:w-20 md:h-20 rounded-[1.2rem] md:rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-12 shadow-2xl",
                  tool.iconColor
                )}>
                  <tool.icon className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                {tool.badge && (
                  <span className="hidden md:inline-block px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest shadow-inner">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Right column on mobile, middle/bottom rows on desktop */}
              <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl md:text-3xl font-black text-white">{tool.title}</h3>
                  {tool.badge && (
                    <span className="inline-block md:hidden px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest shadow-inner">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-base text-muted/60 font-medium leading-relaxed line-clamp-2 md:line-clamp-none">
                  {tool.description}
                </p>
                <div className="pt-2 md:pt-6 flex items-center gap-2 md:gap-3 text-white font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] group-hover:text-primary transition-all">
                  {tool.ctaText} <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🚀 Section 4 & 5: Benefits & Supported Devices */}
      <section className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Benefits Card */}
        <div id="benefits" className="p-0 md:p-12 bg-transparent md:bg-white/[0.02] border-0 md:border border-white/5 rounded-none md:rounded-[3rem] space-y-8 flex flex-col hover:border-primary/25 transition-all duration-500 shadow-none md:shadow-2xl">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">Why Choose Clocks and Alarms Online?</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted/70 leading-relaxed font-medium text-left md:text-justify">
                Our suite offers distinct benefits tailored to modern digital workflows. By running directly in the browser's execution thread with hardware optimization, we consume fewer system resources than electron-based desktop utility apps.
              </p>
              <ul className="space-y-3 text-sm text-muted font-medium">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong>Zero Cost:</strong> Access all pro features like world meeting planner and shared alarms at absolutely no expense.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong>Instant Launch:</strong> No registration, sign-up forms, or emails required. Enter the site and start timing in one click.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong>Persistent Memory:</strong> All added cities, alarm tones, and configuration presets save automatically to local storage.</span>
                </li>
              </ul>
            </div>
          </div>
          <Link href="/world-clock" className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2 hover:translate-x-1.5 transition-transform pt-4 w-fit">
            Try the benefits yourself <ArrowRight size={14} />
          </Link>
        </div>

        {/* Supported Devices Card */}
        <div id="devices" className="p-0 md:p-12 bg-transparent md:bg-white/[0.02] border-0 md:border border-white/5 rounded-none md:rounded-[3rem] space-y-8 flex flex-col hover:border-accent/25 transition-all duration-500 shadow-none md:shadow-2xl">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent border border-accent/20">
              <Laptop size={28} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">Universal Supported Devices</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted/70 leading-relaxed font-medium text-left md:text-justify">
                We designed our platform with responsiveness at its core. It is cross-platform compatible and functions smoothly across all devices without needing downloads.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Laptop className="text-accent" size={20} />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Computers</div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Smartphone className="text-accent" size={20} />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Mobiles</div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Globe className="text-accent" size={20} />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Smart TVs</div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Users className="text-accent" size={20} />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Tablets</div>
                </div>
              </div>
              <p className="text-xs text-muted/50 leading-relaxed font-medium pt-2">
                Compatible with Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, Opera, and other WebKit/Chromium browsers on Windows, macOS, Linux, ChromeOS, iOS, and Android.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 Section 6: Accuracy */}
      <section id="accuracy" className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
          <Cpu size={14} /> Zero-Drift Engineering
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          How Do We Guarantee <span className="text-emerald-400">Atomic Time Accuracy?</span>
        </h2>
        <div className="flex flex-col gap-6 text-base text-muted/70 leading-relaxed font-medium text-justify">
          <p>
            Timer drift is a major issue on the web. Standard JavaScript timers created using `setInterval` or `setTimeout` run on the main browser thread. If the system undergoes CPU spikes, handles heavy layouts, or goes inactive, these functions delay, accumulating seconds of drift over minutes.
          </p>
          <p>
            Clocks and Alarms Online avoids this entirely. Our timing engine operates on a hardware-precision loop. It uses the `performance.now()` web API to fetch high-resolution millisecond timestamps directly matching physical CPU crystal counters. Additionally, our alarms and world clocks synchronize continuously with NTP standards and local browser operating system checks to compensate for background state changes. This ensures your alarms sound exactly when scheduled, and stopwatch records stay accurate to the millisecond.
          </p>
        </div>
      </section>

      {/* 🔬 Section 7: Privacy First */}
      <section id="privacy" className="max-w-6xl mx-auto px-6 space-y-6 border-t border-white/5 pt-16">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
          <ShieldAlert size={14} /> 100% Privacy-First Architecture
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Your Time data remains <span className="text-violet-400">Completely Yours</span>
        </h2>
        <div className="flex flex-col gap-6 text-base text-muted/70 leading-relaxed font-medium text-justify">
          <p>
            Your privacy is our core priority. Unlike typical time tools that require accounts or save your alarms on a remote cloud database, our site stores all data client-side. The dashboard configuration, world clocks, alarms, and settings save exclusively inside your browser's LocalStorage memory cache.
          </p>
          <p>
            We have no back-end registration databases, meaning we cannot store, read, or track your routines, alarms, or geographical selections. Your dashboard runs entirely locally on your device. To keep this high-performance site free for everyone, we work with transparent ad providers like TrafficStars. These providers utilize standard, non-personally identifiable browser cookies to display clean, contextually relevant advertisements. You can check how these cookies are managed at any time in our [Privacy Policy](/privacy).
          </p>
        </div>
      </section>

      {/* ❓ Section 8: FAQ Section */}
      <section id="faq" className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-left space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <HelpCircle size={14} /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Got Questions? We Have <span className="text-primary italic">Answers</span>
          </h2>
          <p className="text-lg text-muted/60 max-w-2xl font-medium">
            Find simple, straightforward answers to the questions our global community asks most.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6 pt-8 w-full">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-[#1a0b36]/40 border border-white/5 hover:border-primary/20 transition-all duration-500 shadow-2xl flex flex-col justify-start w-full">
              <h4 
                className="text-base md:text-lg font-black text-white flex items-center justify-between gap-3 leading-snug w-full cursor-pointer md:cursor-default select-none"
                onClick={() => setActiveMobileFaq(activeMobileFaq === i ? null : i)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold text-base md:text-lg">Q.</span>
                  <span>{faq.q}</span>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-muted transition-transform duration-300 md:hidden shrink-0 mt-0.5", activeMobileFaq === i && "rotate-180")} />
              </h4>
              
              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                activeMobileFaq === i ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 md:grid-rows-[1fr] md:opacity-100 md:mt-4"
              )}>
                <div className="overflow-hidden">
                  <p className="text-sm text-muted/70 leading-relaxed font-medium pl-0 md:pl-6 text-justify">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📰 Section 10: Latest Blogs Section */}
      {latestPosts.length > 0 && (
        <section id="blogs" className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
            <div className="space-y-4 text-left max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <BookOpen size={14} /> Insights & Articles
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Read Our Latest <span className="text-primary italic">Blogs</span>
              </h2>
              <p className="text-muted/60 font-medium text-lg leading-relaxed">
                Stay updated with expert time-management guides, historical insights, and productivity tips.
              </p>
            </div>
            <Link 
              href="/blog" 
              className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white transition-all px-6 py-3.5 rounded-full whitespace-nowrap mb-2"
            >
              View All Articles <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {latestPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group relative bg-[#1a0b2e]/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all duration-500 flex flex-col justify-between shadow-2xl hover:-translate-y-1.5"
              >
                <div>
                  {post.mainImage?.asset && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={urlFor(post.mainImage)
                          .width(600)
                          .height(380)
                          .quality(80)
                          .url()}
                        alt={post.mainImage.alt || post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="p-8 space-y-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 inline-block">
                      {categoryLabels[post.category] || post.category}
                    </span>
                    <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted/60 font-medium line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClockIcon size={14} className="text-primary" />
                      <span className="text-xs font-bold text-white/40">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {post.estimatedReadingTime && (
                      <span className="text-xs font-bold text-white/30">
                        {post.estimatedReadingTime} min read
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🔗 Section 9: Related Tools Quick Access Footer */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-black text-white">Related Timekeeping Utilities</h3>
          <p className="text-sm text-muted/50 max-w-lg mx-auto font-medium">
            Jump directly to any other page in our network. These tools operate on the same zero-drift performance engine.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/world-clock" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">World Clock</Link>
            <Link href="/alarm-clock" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">Alarm Clock</Link>
            <Link href="/stopwatch" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">Stopwatch</Link>
            <Link href="/timer" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">Countdown Timer</Link>
            <Link href="/dst-tracker" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">DST Tracker</Link>
            <Link href="/meeting-planner" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">Meeting Planner</Link>
            <Link href="/shared-alarm" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">Shared Alarm</Link>
            <Link href="/egg-timer" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">Egg Timer</Link>
            <Link href="/countdown" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-all">Holiday Countdown</Link>
          </div>
        </div>
      </section>

      {/* Static Ad Placement Anchor */}
      <div className="max-w-7xl mx-auto px-6 w-full">
        <AdBanner />
      </div>

    </div>
  )
}
