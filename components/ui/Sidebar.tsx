'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Clock, 
  Globe, 
  Timer, 
  Hourglass, 
  Bell, 
  Calendar,
  CalendarRange,
  Info, 
  Mail,
  Menu,
  X,
  Share2,
  Thermometer,
  PartyPopper,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'

const navItems = [
  { label: 'World Clock', icon: Globe, href: '/world-clock' },
  { label: 'Stopwatch', icon: Timer, href: '/stopwatch' },
  { label: 'Timer', icon: Hourglass, href: '/timer' },
  { label: 'Alarm', icon: Bell, href: '/alarm-clock' },
  { label: 'Meeting Planner', icon: CalendarRange, href: '/meeting-planner' },
  { label: 'DST Tracker', icon: Calendar, href: '/dst-tracker' },
  { label: 'Holiday Countdown', icon: PartyPopper, href: '/countdown' },
  { label: 'Shared Alarm', icon: Share2, href: '/shared-alarm' },
  { label: 'Egg Timer', icon: Thermometer, href: '/egg-timer' },
  { label: 'Blog', icon: BookOpen, href: '/blog' }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const { is24Hour, toggleTimeFormat, theme, toggleTheme } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link 
        href="/" 
        onClick={() => setIsOpen(false)}
        className="p-8 pb-12 flex items-center space-x-3 group cursor-pointer"
      >
        <div className="w-11 h-11 bg-primary/20 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30 group-hover:rotate-6 shadow-lg shadow-primary/10 overflow-hidden p-2">
          <img 
            src="/assets/clock_site_logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain dark:invert dark:brightness-200 animate-pulse"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white font-display leading-none">Clocks and Alarms</span>
          <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mt-1 ml-0.5">Online</span>
        </div>
      </Link>

      <nav className="flex-1 px-4 space-y-3 pb-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-5 py-4 rounded-[1.25rem] transition-all duration-500 group relative overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-primary via-primary to-accent text-white shadow-none" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center space-x-4 relative z-10 font-bold">
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-500",
                  isActive ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "group-hover:text-primary transition-colors"
                )} />
                <span className={cn(
                  "text-sm tracking-tight transition-all duration-500",
                  isActive ? "translate-x-1" : "group-hover:translate-x-1"
                )}>{item.label}</span>
              </div>
              
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_12px_rgba(255,255,255,1)] relative z-10" />
              )}
              
              {/* Subtle inner glow for active item */}
              {isActive && (
                <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-sm" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings / Format Toggle */}
      <div className="px-8 pt-4 pb-8 border-t border-white/5 mt-auto space-y-4">
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Settings</span>
        
        {/* Time Format */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time Format</div>
          <div className="flex w-full rounded-full border border-primary/30 overflow-hidden bg-white/5 p-0.5">
            <button
              type="button"
              onClick={() => is24Hour && toggleTimeFormat()}
              className={cn(
                "flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer",
                mounted && !is24Hour 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-transparent text-white/50 hover:text-white"
              )}
            >
              12H
            </button>
            <button
              type="button"
              onClick={() => !is24Hour && toggleTimeFormat()}
              className={cn(
                "flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer",
                mounted && is24Hour 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-transparent text-white/50 hover:text-white"
              )}
            >
              24H
            </button>
          </div>
        </div>

        {/* Theme Preference */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Theme</div>
          <div className="flex w-full rounded-full border border-primary/30 overflow-hidden bg-white/5 p-0.5">
            <button
              type="button"
              onClick={() => theme !== 'light' && toggleTheme()}
              className={cn(
                "flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5",
                mounted && theme === 'light' 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-transparent text-white/50 hover:text-white"
              )}
            >
              <Sun size={10} /> Light
            </button>
            <button
              type="button"
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={cn(
                "flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5",
                mounted && theme === 'dark' 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-transparent text-white/50 hover:text-white"
              )}
            >
              <Moon size={10} /> Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-[#0a0118]/80 backdrop-blur-2xl border-b border-white/10 py-3 px-6 shadow-2xl flex items-center justify-between">
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="flex items-center space-x-3 group outline-none"
        >
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30 group-hover:rotate-6 shadow-lg shadow-primary/10 border border-primary/20 overflow-hidden p-2">
            <img 
              src="/assets/clock_site_logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain dark:invert dark:brightness-200 transition-all duration-500 group-hover:brightness-110 dark:group-hover:brightness-250 animate-pulse"
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
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all active:scale-90"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-sidebar/40 backdrop-blur-3xl border-r border-white/5 hidden lg:flex flex-col z-50 overflow-y-auto shadow-[2px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_30px_rgba(0,0,0,0.25)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/90 backdrop-blur-md z-[65] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-80 bg-sidebar/80 backdrop-blur-3xl border-r border-white/10 flex flex-col z-[70] transition-transform duration-500 ease-out lg:hidden shadow-2xl overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex justify-end p-6">
           <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 transition-all active:scale-90"
           >
            <X className="w-5 h-5 text-white" />
           </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  )
}
