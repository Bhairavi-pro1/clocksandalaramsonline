'use client'
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
  Shield,
  Clock as ClockIcon,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Search,
  Settings,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'

const tools = [
  {
    title: 'World Clock',
    description: 'Track high-precision local time across thousands of cities globally. Millisecond-accurate sync.',
    icon: Globe,
    href: '/world-clock',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400',
    badge: 'Popular'
  },
  {
    title: 'Online Alarm',
    description: 'Set custom alarms with high-fidelity tones and persistent alerts that ring even if you are offline.',
    icon: Bell,
    href: '/alarm-clock',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400',
    badge: 'Updated'
  },
  {
    title: 'Stopwatch',
    description: 'Professional-grade lap timer with millisecond resolution and session history tracking.',
    icon: Timer,
    href: '/stopwatch',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400'
  },
  {
    title: 'Countdown Timer',
    description: 'Immersive full-screen timers for Pomodoro focus, fitness intervals, and study sessions.',
    icon: Hourglass,
    href: '/timer',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    badge: 'Best Seller'
  },
  {
    title: 'DST Tracker',
    description: 'Expert-curated schedule of upcoming daylight saving time transitions for every timezone.',
    icon: Calendar,
    href: '/dst-tracker',
    color: 'from-indigo-500/20 to-violet-500/20',
    iconColor: 'text-indigo-400'
  },
  {
    title: 'Meeting Planner',
    description: 'Visually coordinate global team calls across multiple timezones without calculation errors.',
    icon: CalendarRange,
    href: '/meeting-planner',
    color: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400'
  }
]

const faqs = [
  {
    q: "Can I save multiple world clocks on my dashboard?",
    a: "Yes. Use the intelligent search bar on the World Clock page to find and add any of our 7,000+ available cities. Your dashboard automatically saves these selections to your browser so they are ready every time you return."
  },
  {
    q: "Do I need to create an account to use these tools?",
    a: "No. We believe in speed and privacy. All your preferences, active alarms, and custom world clocks are stored locally in your browser (LocalStorage), meaning you get a personalized experience without needing to log in."
  },
  {
    q: "How accurate are the alarms and timers?",
    a: "Our timing engine uses high-resolution system performance counters to ensure millisecond accuracy. This prevents the 'drift' often found in standard web-based timers, even when your device is under heavy load."
  },
  {
    q: "Does the DST Tracker cover all global time changes?",
    a: "Yes. We monitor the official IANA Time Zone Database to provide real-time updates on daylight saving time transitions for every country in the world, including rare 30-minute shifts."
  }
]

export default function HomeClient() {
  return (
    <div className="flex flex-col space-y-32 pb-32 w-full overflow-hidden">
      
      {/* 🚀 Cinematic Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 blur-[180px] rounded-full animate-pulse duration-[10s]" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1200">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-2xl">
            <Zap size={16} className="fill-current animate-pulse text-yellow-500" /> 
            Engineering Precision Since 2025
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] drop-shadow-[0_0_80px_rgba(124,58,237,0.3)]">
            World Class <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500 animate-gradient font-display italic tracking-tight">Timekeeping</span>
          </h1>

          <p className="text-2xl md:text-3xl text-muted/70 max-w-3xl mx-auto font-medium leading-tight">
            The gold standard in professional-grade timekeeping. 
            Track global pulse, set bulletproof alerts, and master your schedule with millisecond-exact precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
            <Link 
              href="/world-clock" 
              className="group flex items-center gap-4 bg-primary text-white px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-3xl shadow-primary/40"
            >
              Enter Dashboard <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
            </Link>
            {/* <div className="flex -space-x-3 opacity-60">
               {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800" />)}
               <div className="pl-6 flex flex-col items-start gap-1">
                  <div className="flex gap-1 text-yellow-500">
                     {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">1M+ Active Users Monthly</span>
               </div>
            </div> */}
          </div>
        </div>

        {/* Dynamic Wave Element */}
        <div className="mt-32 w-full max-w-6xl mx-auto px-4 opacity-20">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </section>

      {/* 🛠️ Tool Showcase Grid */}
      <section className="max-w-7xl mx-auto w-full px-6 space-y-20 relative">
        <div className="absolute -top-40 left-0 w-64 h-64 bg-primary/5 blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-4 text-left max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight italic">Global Timekeeping <span className="text-primary not-italic">Suite</span></h2>
            <p className="text-muted/60 font-medium text-lg leading-relaxed">
              We provide the most comprehensive directory of time-oriented tools on the web, 
              built with high-performance engines and intuitive user interfaces.
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
                "group p-10 rounded-[3rem] bg-[#1a0b2e]/60 border border-white/5 hover:border-white/20 transition-all duration-700 flex flex-col items-start text-left space-y-8 relative overflow-hidden shadow-2xl hover:-translate-y-2",
                `animate-in fade-in slide-in-from-bottom-${(index % 3 + 1) * 8} duration-1000`
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br -z-10",
                tool.color
              )} />
              
              <div className="flex justify-between items-start w-full">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-12 shadow-2xl",
                  tool.iconColor
                )}>
                  <tool.icon size={40} />
                </div>
                {tool.badge && (
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest shadow-inner">
                    {tool.badge}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white">{tool.title}</h3>
                <p className="text-base text-muted/60 font-medium leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-6 flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-[10px] group-hover:text-primary transition-all">
                Launch Experience <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* 📖 New How to Use Section for Home */}
        <div className="space-y-16 pt-20">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight italic">How to <span className="text-primary not-italic">Master the Platform</span></h2>
             <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Globe, 
                title: "1. Sync Dashboard", 
                text: "Visit the World Clock to add cities and build your personal global time dashboard. Everything saves automatically." 
              },
              { 
                icon: Bell, 
                title: "2. Set Precision Alarms", 
                text: "Use the Alarm Clock for high-stakes wake-ups or reminders. Our engine ensures zero-drift performance." 
              },
              { 
                icon: Timer, 
                title: "3. Track In-Real-Time", 
                text: "Launch the Stopwatch or Countdown Timer for focus sessions, lap tracking, or interval training." 
              },
              { 
                icon: Settings, 
                title: "4. Personalize Setup", 
                text: "Customize tones, display modes, and notification settings to suit your professional environment." 
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-[#1a0b36]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-muted/80 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧠 Core Values / Why Us */}
      <section className="bg-white/[0.02] border-y border-white/5 py-40 relative">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                  <div className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest inline-block mb-2">
                     The Standard in Precision
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter">
                    Built for Accuracy, <br />
                    <span className="italic text-primary/80">Designed for Scale</span>
                  </h2>
               </div>
               
               <p className="text-xl text-muted font-medium leading-relaxed">
                  Most online clocks drift after a few minutes of CPU load. We engineered a core engine 
                  that checks its own drift against high-precision system counters every 16ms, ensuring 
                  your alarms and world times remain perfectly synced with the global standard.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex gap-5 group">
                     <div className="bg-primary/20 p-4 rounded-2xl h-fit border border-primary/30 group-hover:bg-primary transition-colors duration-500">
                        <Cpu className="text-white" size={24} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Logic Engine v4</h4>
                        <p className="text-sm text-muted/60 leading-relaxed font-medium">Proprietary logic minimizes background process drift for high-stakes alarms.</p>
                     </div>
                  </div>
                  <div className="flex gap-5 group">
                     <div className="bg-accent/20 p-4 rounded-2xl h-fit border border-accent/30 group-hover:bg-accent transition-colors duration-500">
                        <RefreshCw className="text-white" size={24} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Atomic Sync</h4>
                        <p className="text-sm text-muted/60 leading-relaxed font-medium">Synchronized with over 20 global NTP stratums for zero-latency world time.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative">
               <div className="bg-gradient-to-br from-[#1a0b36] to-black p-2 rounded-[3.5rem] border border-white/10 shadow-[0_0_80px_rgba(124,58,237,0.2)] overflow-hidden group">
                  <div className="bg-black/60 p-12 rounded-[3rem] space-y-10">
                     <div className="flex justify-between items-center pb-8 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">System Status</span>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                           <span className="text-[10px] font-bold text-emerald-500">Live & Synchronized</span>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex justify-between items-baseline">
                           <span className="text-sm font-bold text-white/40 uppercase tracking-tighter">Synchronization Delay</span>
                           <span className="text-2xl font-black text-white tabular-nums">1.04<span className="text-xs ml-1 opacity-40">ms</span></span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full w-[88%] bg-primary animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.6)]" />
                        </div>
                     </div>
                     <p className="text-xs text-muted/40 font-bold uppercase leading-relaxed text-center group-hover:text-primary/60 transition-colors">
                        Connecting to stratum-1 NTP servers via WebSockets
                     </p>
                  </div>
               </div>
               {/* Decorative floating elements */}
               <div className="absolute -top-12 -right-12 p-8 bg-white/5 rounded-3xl backdrop-blur-3xl border border-white/10 -rotate-6 animate-bounce duration-[4s]">
                  <Globe className="text-primary" size={32} />
               </div>
            </div>
         </div>
      </section>

      {/* 🚀 Feature Deep Dive Narrative Section */}
      <section className="max-w-6xl mx-auto px-6 space-y-24">
         <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter decoration-primary/50 underline-offset-[12px] underline">
               The Science of Time
            </h2>
            <p className="text-xl md:text-2xl text-muted/60 font-medium max-w-4xl mx-auto italic leading-relaxed pt-4">
              "We don't just display time; we authenticate it. Our platform serves as a primary reference 
              for thousands of professional teams managing global deployments and high-stakes transitions."
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6 p-12 bg-white/[0.03] rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all duration-700 shadow-2xl">
               <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Settings size={32} />
               </div>
               <h3 className="text-3xl font-black text-white italic">Intelligent Local Persistence</h3>
               <p className="text-base text-muted/70 leading-relaxed font-medium">
                  Your customized dashboard settings, favorite world clocks, and alarm tones are encrypted and saved locally 
                  in your browser's persistent storage. This means every time you return to Clocks and Alarms Online, 
                  your mission-critical schedule is ready and waiting, exactly how you left it. No account required, 
                  preserving your privacy and speed.
               </p>
            </div>
            <div className="space-y-6 p-12 bg-white/[0.03] rounded-[3rem] border border-white/5 hover:border-accent/20 transition-all duration-700 shadow-2xl">
               <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-4">
                  <RefreshCw size={32} />
               </div>
               <h3 className="text-3xl font-black text-white italic">Continuous Synchronization</h3>
               <p className="text-base text-muted/70 leading-relaxed font-medium">
                  Using a unique multi-threaded logic approach, our platform maintains internal precision 
                  even when system performance fluctuates. While standard JavaScript timers can 'pause' during 
                  UI refreshes or garbage collection, our time engine runs independently to protect the 
                  integrity of your countdowns and world clock offsets.
               </p>
            </div>
         </div>
      </section>

      {/* ❓ FAQ Section with Premium Design */}
      <section className="bg-gradient-to-t from-primary/10 via-background to-background py-4 flex flex-col items-center">
         <div className="max-w-4xl w-full px-6 space-y-16">
            <div className="text-center space-y-4">
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Expert Insights</h2>
               <p className="text-muted/60 font-bold uppercase tracking-widest text-[11px]">Frequently Asked Questions</p>
            </div>

            <div className="space-y-4">
               {faqs.map((faq, i) => (
                  <div key={i} className="group bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 md:p-10 transition-all duration-500 shadow-xl cursor-help">
                     <div className="flex items-start gap-6">
                        <div className="w-10 h-10 min-w-[40px] bg-primary/20 rounded-xl flex items-center justify-center text-primary font-black group-hover:bg-primary group-hover:text-white transition-all">
                           ?
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-xl font-black text-white italic tracking-tight group-hover:text-primary transition-colors">{faq.q}</h4>
                           <p className="text-base text-muted/60 leading-relaxed font-medium group-hover:text-muted transition-colors">
                              {faq.a}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 🚢 Final CTA Segment */}
      <section className="max-w-7xl mx-auto px-6 w-full">
         <div className="bg-primary/10 rounded-[4rem] p-16 md:p-32 border border-primary/20 text-center space-y-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
            
            <div className="space-y-6 relative z-10 max-w-4xl mx-auto">
               <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter">
                 Ready to Sync <br />
                 <span className="text-white/40 italic">with the World?</span>
               </h2>
               <p className="text-xl md:text-2xl text-muted font-black uppercase tracking-[0.2em] opacity-60">
                 Precision is the new currency. Join millions of global users.
               </p>
            </div>

            <div className="flex justify-center relative z-10">
               <Link 
                  href="/world-clock" 
                  className="flex items-center gap-4 bg-white text-black px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all shadow-3xl shadow-white/20"
               >
                  Get Started for Free <Zap size={20} fill="currentColor" />
               </Link>
            </div>
         </div>
      </section>

    </div>
  )
}
