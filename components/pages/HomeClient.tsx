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
  Clock as ClockIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import InternalLinks from '@/components/ui/InternalLinks'

const tools = [
  {
    title: 'World Clock',
    description: 'Track high-precision local time across thousands of cities globally.',
    icon: Globe,
    href: '/world-clock',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400'
  },
  {
    title: 'Online Alarm',
    description: 'Set custom alarms with high-fidelity tones and persistent alerts.',
    icon: Bell,
    href: '/alarm-clock',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400'
  },
  {
    title: 'Stopwatch',
    description: 'Millisecond-accurate lap timer for professional and athletic use.',
    icon: Timer,
    href: '/stopwatch',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400'
  },
  {
    title: 'Countdown Timer',
    description: 'Beautiful full-screen countdowns for productivity and focus.',
    icon: Hourglass,
    href: '/timer',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400'
  },
  {
    title: 'DST Tracker',
    description: 'Automatic daylight saving time schedules for every major timezone.',
    icon: Calendar,
    href: '/dst-tracker',
    color: 'from-indigo-500/20 to-violet-500/20',
    iconColor: 'text-indigo-400'
  },
  {
    title: 'Meeting Planner',
    description: 'Coordinate global team calls without the timezone confusion.',
    icon: CalendarRange,
    href: '/meeting-planner',
    color: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400'
  }
]

export default function HomeClient() {
  return (
    <div className="flex flex-col space-y-24 pb-20 w-full overflow-hidden">
      
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            <Zap size={14} className="fill-current" /> High-Precision Timekeeping
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
            Precision Meets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient font-display italic">Vibrant Design</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Welcome to the gold standard in online timekeeping. 
            Track, set, and synchronize your schedule with millisecond accuracy across every major global timezone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link 
              href="/world-clock" 
              className="group flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-primary/30"
            >
              Get Started <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Dynamic Background Element */}
        <div className="mt-24 w-full max-w-6xl mx-auto px-4 opacity-40">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto w-full px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Powerful Tools for Global Pulse</h2>
          <p className="text-muted/60 font-bold uppercase tracking-widest text-xs">Synchronized with World Atomic Time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Link 
              key={tool.title} 
              href={tool.href}
              className={cn(
                "group p-10 rounded-[3rem] bg-[#1a0b2e]/40 border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col items-center text-center space-y-6 relative overflow-hidden",
                `animate-in fade-in slide-in-from-bottom-${(index % 3 + 1) * 5} duration-1000`
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br -z-10",
                tool.color
              )} />
              
              <div className={cn(
                "w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-2xl group-hover:shadow-white/5",
                tool.iconColor
              )}>
                <tool.icon size={36} />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white">{tool.title}</h3>
                <p className="text-sm text-muted/70 font-medium leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                Launch Tool <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Accuracy Section */}
      <section className="max-w-5xl mx-auto w-full px-6 py-24 bg-white/[0.02] rounded-[4rem] border border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
        
        <div className="relative z-10 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <ClockIcon size={24} />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight">Atomic Sync</h4>
              <p className="text-xs text-muted/60 font-medium">Synchronized with NTP servers for millisecond-level precision globally.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <Shield size={24} />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight">Reliable Core</h4>
              <p className="text-xs text-muted/60 font-medium">Robust background engine ensuring high-fidelity alerts even when idle.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <Globe size={24} />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight">Global Range</h4>
              <p className="text-xs text-muted/60 font-medium">Tracking 7,000+ cities with intelligent local daylight saving adjustments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More - Internal Links */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-12">
        <InternalLinks />
      </div>

    </div>
  )
}
