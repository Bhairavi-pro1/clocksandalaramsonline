import Link from 'next/link'
import { Clock, Mail, Info, ShieldCheck, FileText, Globe, Timer, Hourglass, Bell, CalendarRange, Calendar } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-8 py-20 border-t border-card-border/30 transition-opacity">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="text-primary w-5 h-5" />
              </div>
              <h4 className="text-xl font-extrabold font-display text-white tracking-tight">
                Clocks and Alarms <span className="text-primary/70">Online</span>
              </h4>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md font-medium">
              Your ultimate high-precision timekeeping suite. Track global time zones, 
              set powerful alarms, and use our millisecond-accurate stopwatch and 
              countdown tools with confidence and ease. Built for modern productivity.
            </p>
          </div>

          {/* Tools Links */}
          <div className="md:col-span-3 space-y-6">
            <h6 className="text-[10px] uppercase font-bold text-white tracking-[0.2em]">Tools</h6>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/world-clock" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Globe className="w-3.5 h-3.5" /> World Clock</Link></li>
              <li><Link href="/stopwatch" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Timer className="w-3.5 h-3.5" /> Stopwatch</Link></li>
              <li><Link href="/timer" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Hourglass className="w-3.5 h-3.5" /> Countdown</Link></li>
              <li><Link href="/alarm-clock" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Bell className="w-3.5 h-3.5" /> Alarms</Link></li>
              <li><Link href="/meeting-planner" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><CalendarRange className="w-3.5 h-3.5" /> Meeting Planner</Link></li>
              <li><Link href="/dst-tracker" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Calendar className="w-3.5 h-3.5" /> DST Tracker</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-3 space-y-6">
            <h6 className="text-[10px] uppercase font-bold text-white tracking-[0.2em]">Company</h6>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/about" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Info className="w-3.5 h-3.5" /> About Us</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><Mail className="w-3.5 h-3.5" /> Contact Us</Link></li>
              <li><Link href="/privacy" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 font-medium"><FileText className="w-3.5 h-3.5" /> Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-card-border/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] text-white/50 font-bold tracking-wide">
            &copy; {currentYear} Clocks and Alarms Online. All rights reserved. 
            <span className="mx-3 opacity-20">|</span> 
            <span className="text-primary/70">Precision in Every Second</span>
          </p>
          <div className="flex items-center space-x-6">
             <div className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Designed for speed</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
