'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Clock, 
  Menu, 
  X, 
  ChevronDown,
  Globe, 
  Timer, 
  Hourglass, 
  Bell, 
  Calendar,
  CalendarRange,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tools = [
  { label: 'World Clock', icon: Globe, href: '/world-clock', description: 'Global time tracking' },
  { label: 'Stopwatch', icon: Timer, href: '/stopwatch', description: 'Precision lap timer' },
  { label: 'Countdown', icon: Hourglass, href: '/timer', description: 'Productivity timers' },
  { label: 'Alarm', icon: Bell, href: '/alarm-clock', description: 'Bulletproof alerts' },
  { label: 'Meeting Planner', icon: CalendarRange, href: '/meeting-planner', description: 'Global coordination' },
  { label: 'DST Tracker', icon: Calendar, href: '/dst-tracker', description: 'Daylight saving updates' }
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b",
          isScrolled 
            ? "bg-[#0a0118]/80 backdrop-blur-2xl border-white/10 py-3 shadow-2xl" 
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-3 group outline-none">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30 group-hover:rotate-6 shadow-lg shadow-primary/10 border border-primary/20 overflow-hidden p-2">
              <img 
                src="/assets/clock_site_logo.png" 
                alt="Clocks and Alarms Online Logo" 
                className="w-full h-full object-contain filter invert brightness-200 transition-all duration-500 group-hover:brightness-250 animate-pulse"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white font-display leading-[0.8] transition-colors group-hover:text-primary">
                Clocks and Alarms
              </span>
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mt-1 ml-0.5 opacity-80">
                Online
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {/* Tools Dropdown */}
            <div className="relative group">
              <button 
                onMouseEnter={() => setIsToolsOpen(true)}
                onMouseLeave={() => setIsToolsOpen(false)}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all hover:text-primary",
                  isToolsOpen ? "text-primary" : "text-white/70"
                )}
              >
                Tools <ChevronDown size={14} className={cn("transition-transform duration-300", isToolsOpen && "rotate-180")} />
              </button>

              {/* Mega Menu Dropdown */}
              <div 
                onMouseEnter={() => setIsToolsOpen(true)}
                onMouseLeave={() => setIsToolsOpen(false)}
                className={cn(
                  "absolute top-full -left-10 mt-4 w-[480px] bg-[#0f041e] border border-white/10 rounded-[2.5rem] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.6)] transition-all duration-500 origin-top",
                  isToolsOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-4 invisible"
                )}
              >
                <div className="grid grid-cols-2 gap-4">
                  {tools.map((tool) => (
                    <Link 
                      key={tool.href} 
                      href={tool.href}
                      className="group/item p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                        <tool.icon size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white group-hover/item:text-primary transition-colors">{tool.label}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">{tool.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between px-2">
                   <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Professional Grade Precision</span>
                   <Link href="/world-clock" className="text-[10px] font-black uppercase text-primary hover:text-accent transition-colors tracking-widest flex items-center gap-2">
                      View All Tools <Zap size={10} fill="currentColor" />
                   </Link>
                </div>
              </div>
            </div>

            <Link href="#expert-insights" className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-primary transition-all">
              Expert Insights
            </Link>
          </nav>

          {/* Right: CTA & Mobile Toggle */}
          <div className="flex items-center gap-6">
            <Link 
              href="/world-clock" 
              className="hidden md:flex items-center gap-3 bg-gradient-to-r from-primary via-accent to-pink-500 text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 border border-white/10"
            >
              Get Started Free <Zap size={14} fill="currentColor" className="animate-pulse" />
            </Link>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all active:scale-90"
            >
              {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-[90] lg:hidden transition-all duration-700",
        isOpen ? "visible" : "invisible"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-700",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer Content */}
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-full bg-[#0a0118] p-10 pt-32 pb-20 flex flex-col space-y-10 transition-transform duration-700 ease-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
           <div className="space-y-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Tools</span>
              <div className="grid grid-cols-1 gap-3">
                 {tools.map((tool) => (
                    <Link 
                      key={tool.href} 
                      href={tool.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all font-bold text-white group"
                    >
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <tool.icon size={20} />
                       </div>
                       <span className="group-hover:translate-x-1 transition-transform">{tool.label}</span>
                    </Link>
                 ))}
              </div>
           </div>

           <div className="pt-10 border-t border-white/5 space-y-6 text-center">
              <Link 
                href="/world-clock"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-gradient-to-r from-primary to-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
              >
                Get Started Free
              </Link>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                ⚡ No Login Required
              </p>
           </div>
        </div>
      </div>
    </>
  )
}
