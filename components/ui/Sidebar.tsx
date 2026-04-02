'use client'
import { useState } from 'react'
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
  Share2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'World Clock', icon: Globe, href: '/world-clock' },
  { label: 'Stopwatch', icon: Timer, href: '/stopwatch' },
  { label: 'Countdown', icon: Hourglass, href: '/timer' },
  { label: 'Alarm', icon: Bell, href: '/alarm-clock' },
  { label: 'Meeting Planner', icon: CalendarRange, href: '/meeting-planner' },
  { label: 'DST Tracker', icon: Calendar, href: '/dst-tracker' },
  { label: 'Shared Alarm', icon: Share2, href: '/shared-alarm' }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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
            className="w-full h-full object-contain filter invert brightness-200 animate-pulse"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white font-display leading-none">Clocks and Alarms</span>
          <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mt-1 ml-0.5">Online</span>
        </div>
      </Link>

      <nav className="flex-1 px-4 space-y-3">
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
                  ? "bg-gradient-to-r from-primary via-primary to-accent text-white shadow-xl shadow-primary/30 scale-[1.02]" 
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
    </div>
  )

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar/80 backdrop-blur-2xl border-b border-white/5 z-[60] flex items-center justify-between px-5 shadow-lg">
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="flex items-center space-x-3 group"
        >
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/5 overflow-hidden p-1.5">
            <img 
              src="/assets/clock_site_logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain filter invert brightness-200"
            />
          </div>
          <span className="text-sm font-black tracking-tighter text-white uppercase leading-tight">Clocks and Alarms <br/><span className="text-primary text-[10px] tracking-[0.4em]">Online</span></span>
        </Link>
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl shadow-inner hover:bg-white/10 transition-all active:scale-90"
        >
          <Menu className="text-white w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-sidebar/40 backdrop-blur-3xl border-r border-white/5 hidden md:flex flex-col z-50 overflow-y-auto shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/90 backdrop-blur-md z-[65] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-80 bg-sidebar/80 backdrop-blur-3xl border-r border-white/10 flex flex-col z-[70] transition-transform duration-500 ease-out md:hidden shadow-2xl overflow-y-auto",
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
