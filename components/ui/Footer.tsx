'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Mail, Info, ShieldCheck, FileText, Globe, Timer, Hourglass, Bell, CalendarRange, Calendar, Share2, Thermometer, PartyPopper, BookOpen } from 'lucide-react'
import { useStore } from '@/hooks/useStore'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Neutral theme fits best on dark backgrounds, light matches light themes
  const activeTheme = mounted && theme === 'dark' ? 'neutral' : 'light'

  return (
    <footer className="mt-8 py-20 border-t border-card-border/30 transition-opacity">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center overflow-hidden p-1.5">
                <img 
                  src="/assets/clock_site_logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain filter invert brightness-200"
                />
              </div>
              <h4 className="text-xl font-extrabold font-display text-white tracking-tight">
                Clocks and Alarms <span className="text-primary/70">Online</span>
              </h4>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md font-medium text-justify">
              Your ultimate high-precision timekeeping suite. Track global time zones, 
              set powerful alarms, and use our millisecond-accurate stopwatch and 
              countdown tools with confidence and ease. Built for modern productivity.
            </p>
          </div>

          {/* Tools Links */}
          <div className="md:col-span-8 lg:col-span-5 space-y-6">
            <h6 className="text-[10px] uppercase font-bold text-white tracking-[0.2em]">Tools</h6>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <li><Link href="/world-clock" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><Globe className="w-3.5 h-3.5 flex-shrink-0" /> World Clock</Link></li>
              <li><Link href="/stopwatch" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><Timer className="w-3.5 h-3.5 flex-shrink-0" /> Stopwatch</Link></li>
              <li><Link href="/timer" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><Hourglass className="w-3.5 h-3.5 flex-shrink-0" /> Timer</Link></li>
              <li><Link href="/alarm-clock" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><Bell className="w-3.5 h-3.5 flex-shrink-0" /> Alarms</Link></li>
              <li><Link href="/meeting-planner" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><CalendarRange className="w-3.5 h-3.5 flex-shrink-0" /> Meeting Planner</Link></li>
              <li><Link href="/dst-tracker" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><Calendar className="w-3.5 h-3.5 flex-shrink-0" /> DST Tracker</Link></li>
              <li><Link href="/countdown" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><PartyPopper className="w-3.5 h-3.5 flex-shrink-0" /> Holiday Countdown</Link></li>
              <li><Link href="/shared-alarm" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><Share2 className="w-3.5 h-3.5 flex-shrink-0" /> Shared Alarm</Link></li>
              <li><Link href="/egg-timer" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium whitespace-nowrap"><Thermometer className="w-3.5 h-3.5 flex-shrink-0" /> Egg Timer</Link></li>
            </ul>
          </div>
 
          {/* Company Links */}
          <div className="md:col-span-4 lg:col-span-2 space-y-6">
            <h6 className="text-[10px] uppercase font-bold text-white tracking-[0.2em]">Company</h6>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-3 text-sm">
              <li><Link href="/about" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Info className="w-3.5 h-3.5 flex-shrink-0" /> About Us</Link></li>
              <li><Link href="/blog" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><BookOpen className="w-3.5 h-3.5 flex-shrink-0" /> Blog</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Mail className="w-3.5 h-3.5 flex-shrink-0" /> Contact Us</Link></li>
              <li><Link href="/privacy" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" /> Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><FileText className="w-3.5 h-3.5 flex-shrink-0" /> Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-card-border/10 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-[11px] text-white/50 font-bold tracking-wide">
            &copy; {currentYear} Clocks and Alarms Online. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] font-bold">
            <span className="text-primary/70">Precision in Every Second</span>
            <span className="text-white/20">|</span>
            <span className="text-primary/60 uppercase tracking-widest text-[9px] font-black">Designed for speed</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
