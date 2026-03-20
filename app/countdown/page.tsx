'use client'
import { useState, useEffect, use } from 'react'
import { getHolidays, Holiday } from '@/lib/holidays'
import { Share2, Minus, Plus, Maximize2, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdBanner from '@/components/ui/AdBanner'
import InternalLinks from '@/components/ui/InternalLinks'
import holidayData from '@/data/seo/holidays.json'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export default function HolidayCountdownPage({ params }: Props) {
  const { slug } = use(params)
  const [holiday, setHoliday] = useState<Holiday | null>(null)
  const [seoInfo, setSeoInfo] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const holidays = getHolidays()
    const found = holidays.find(h => h.name.toLowerCase().replace(/\s+/g, '-') === slug)
    if (found) {
      setHoliday(found)
      const seo = holidayData.find(h => h.slug === slug)
      setSeoInfo(seo)
    }
  }, [slug])

  useEffect(() => {
    if (!holiday) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = holiday.date.getTime()
      const diff = target - now

      if (diff <= 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [holiday])

  if (!holiday) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-1000">
      
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            Holiday Countdown 
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            {seoInfo?.title || `Countdown to ${holiday.name}`}
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto font-medium">
            {seoInfo?.description || `Our high-precision tracker shows exactly how long remains until ${holiday.name} celebrations begin.`}
          </p>
        </div>

        {/* Digital Countdown Hero Component */}
        <div className="bg-card border border-card-border/60 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group shadow-2xl">
          {/* Background Glows shifted to site theme (Violet/Primary) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/20 blur-[120px] rounded-full" />
          </div>

          {/* Toolbar */}
          <div className="absolute top-10 right-10 flex items-center gap-4 text-white/30 z-20">
            <button className="hover:text-primary transition-colors"><Share2 size={20} /></button>
            <button className="hover:text-primary transition-colors"><Maximize2 size={20} /></button>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-12">
            {/* Major Digital Countdown Display */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 font-orbitron text-primary drop-shadow-[0_0_50px_rgba(124,58,237,0.4)]">
              {/* Days */}
              <div className="flex flex-col items-center">
                <span className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter tabular-nums">
                  {timeLeft.days.toString().padStart(3, '0')}
                </span>
                <span className="text-sm md:text-xl font-bold uppercase tracking-[0.4em] opacity-40 mt-4">Days</span>
              </div>

              {/* Time HMS */}
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-[10rem] font-black leading-none tracking-tighter tabular-nums">
                  {timeLeft.hours.toString().padStart(2, '0')}:
                  {timeLeft.minutes.toString().padStart(2, '0')}:
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="flex gap-8 md:gap-24 text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] opacity-40 mt-4">
                  <span>Hours</span>
                  <span>Min</span>
                  <span>Sec</span>
                </div>
              </div>
            </div>

            {/* Target Date Footer */}
            <div className="pt-10 border-t border-white/5 w-full flex flex-col items-center gap-2">
              <p className="text-xs font-black tracking-[0.5em] text-white/20 uppercase mb-2">Event Date</p>
              <div className="px-8 py-3 rounded-2xl bg-white/5 border border-white/5 text-xl md:text-2xl font-black tracking-[0.2em] text-white/80">
                {holiday.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).replace(/,/g, ' -')}
              </div>
            </div>
          </div>
        </div>

        {/* Ad Space */}
        <div className="w-full">
          <AdBanner />
        </div>

        {/* Explanation & SEO Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          {/* Main Info */}
          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <div className="min-w-[48px] h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">About our {holiday.name} Tracker</h2>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-6 text-muted font-medium leading-relaxed">
              <p className="text-lg">
                {seoInfo?.content || `This high-precision countdown is set specifically for ${holiday.name}. Whether you are coordinating travel, preparing gifts, or planning a celebratory event, our reliable global tracker ensures you never miss a second of the holiday season.`}
              </p>
              <p>
                Our platform uses high-precision millisecond tracking synchronized with global atomic time to provide the most accurate countdown on the web. We understand that every second matters when counting down to significant life events and celebrations, which is why our interface is designed for zero latency and persistent state management.
              </p>
              <p>
                Stay ahead of the holiday rush by using our dedicated focus tools. In addition to this tracker, we recommend using our integrated alarm system and task timers to manage your schedule effectively as the big day approaches.
              </p>
            </div>
          </section>

          {/* Quick Tips or Side Card */}
          <aside className="space-y-6">
            <div className="bg-[#1a0b36]/40 p-8 rounded-[2rem] border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500 shadow-xl">
              <h4 className="text-lg font-bold text-white mb-4">Master Consistency</h4>
              <p className="text-sm text-muted leading-relaxed font-medium mb-6">
                Success is built on reliable habits. Use this countdown as a visual milestone to keep yourself motivated and focused on your goals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Accurate Atomic Sync
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Persistent Progress
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Immersive Visuals
                </li>
              </ul>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 mb-2">PRO TIP</p>
              <p className="text-sm font-bold text-white leading-snug">
                Enter fullscreen mode (top-right icon) for a distraction-free countdown centerpiece.
              </p>
            </div>
          </aside>
        </div>

        {/* Explore Other Tools */}
        <div className="pt-24 border-t border-white/5">
          <header className="text-center mb-16">
            <h3 className="text-2xl md:text-4xl font-black text-white mb-4">Explore More Productivity Tools</h3>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </header>
          <InternalLinks />
        </div>
      </div>
    </div>
  )
}
