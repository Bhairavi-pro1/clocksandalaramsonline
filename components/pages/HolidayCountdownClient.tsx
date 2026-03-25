'use client'
import { useState, useEffect, useRef } from 'react'
import { Share2, Maximize2, Minimize2, Info, Check } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'
import InternalLinks from '@/components/ui/InternalLinks'
import { cn } from '@/lib/utils'
import { Holiday } from '@/lib/holidays'

interface Props {
  holiday: Holiday
  seoInfo: any
}

export default function HolidayCountdownClient({ holiday, seoInfo }: Props) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Fullscreen & Interaction state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      // Ensure the holiday date is a Date object if it was serialized
      const targetDate = holiday.date instanceof Date ? holiday.date : new Date(holiday.date)
      const target = targetDate.getTime()
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

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cardRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const targetDate = holiday.date instanceof Date ? holiday.date : new Date(holiday.date)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-10">
        {/* Header Section - Hide in fullscreen */}
        {!isFullscreen && (
          <div className="text-center space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest mb-1">
              Holiday Countdown 
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {seoInfo?.title || `Countdown to ${holiday.name}`}
            </h2>
          </div>
        )}

        {/* Digital Countdown Hero Component */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className={cn(
            "bg-card border border-card-border/60 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-2xl transition-all duration-700",
            isFullscreen ? "fixed inset-0 z-[100] rounded-none border-none bg-[#05010a] flex flex-col items-center justify-center pointer-events-auto" : "relative"
          )}
        >
          {/* Background Glows (Always present, but subtle) */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 transition-transform duration-1000 ease-out z-0"
            style={{ 
              transform: `translate(${(mousePos.x - 50) * 0.05}%, ${(mousePos.y - 50) * 0.05}%)`
            }}
          >
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/30 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/30 blur-[120px] rounded-full" />
          </div>

          {/* Fullscreen Header (Title & Controls) */}
          {isFullscreen && (
            <div className="absolute top-8 left-0 right-0 flex flex-col items-center z-20 pointer-events-none">
              <p className="text-white/70 text-[10px] md:text-sm font-black uppercase tracking-[0.5em] mb-2 drop-shadow-xl select-none">
                {holiday.name} Countdown
              </p>
              <div className="h-0.5 w-16 bg-primary/40 rounded-full" />
            </div>
          )}

          {/* Toolbar Sidebar/Top Corner (Always active) */}
          <div className={cn(
            "absolute flex items-center gap-4 text-white/50 z-30 transition-all duration-500",
            isFullscreen ? "top-8 right-8" : "top-6 right-6"
          )}>
            <button onClick={handleShare} className="hover:text-primary transition-colors flex items-center">
              {copied ? <Check size={18} className="text-success" /> : <Share2 size={16} />}
            </button>
            <button onClick={toggleFullscreen} className="hover:text-primary transition-colors">
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={16} />}
            </button>
          </div>

          <div className={cn(
            "relative z-10 flex flex-col items-center text-center",
            isFullscreen ? "space-y-2 md:space-y-4 mb-4" : "space-y-6"
          )}>
            {/* Main Digital Stack */}
            <div className={cn(
              "flex flex-col items-center font-orbitron text-primary",
              isFullscreen ? "space-y-2" : "space-y-2"
            )}>
              {/* Days Display */}
              <div className="flex flex-col items-center">
                <span className={cn(
                  "font-black leading-none tracking-tighter tabular-nums text-white transition-all duration-700",
                  isFullscreen ? "text-[max(6rem,10vw)]" : "text-6xl md:text-7xl"
                )}>
                  {timeLeft.days.toString().padStart(3, '0')}
                </span>
                <span className={cn(
                  "font-bold uppercase tracking-[0.4em] opacity-70 transition-all",
                  isFullscreen ? "text-xs mt-0" : "text-[8px] mt-1"
                )}>
                  Days Remaining
                </span>
              </div>

              {/* HMS Display */}
              <div className="flex flex-col items-center pt-2">
                <div className={cn(
                  "font-black leading-none tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-700",
                  isFullscreen ? "text-[max(4.5rem,4vw)]" : "text-3xl md:text-5xl"
                )}>
                  {timeLeft.hours.toString().padStart(2, '0')+" "}: 
                  {" "+ timeLeft.minutes.toString().padStart(2, '0') +" "}: 
                  {" "+timeLeft.seconds.toString().padStart(2, '0')+" "}
                </div>
                <div className={cn(
                  "flex font-bold uppercase tracking-[0.3em] opacity-70 transition-all",
                  isFullscreen ? "gap-12 text-xs mt-0" : "gap-6 text-[8px] mt-2"
                )}>
                  <span>Hours</span>
                  <span>Min</span>
                  <span>Sec</span>
                </div>
              </div>
            </div>

            {/* Target Date Box */}
            <div className={cn(
              "border-t border-white/5 w-full flex flex-col items-center gap-1 transition-all",
              isFullscreen ? "pt-4 mt-2 max-w-sm" : "pt-4 max-w-[240px]"
            )}>
              <p className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase mb-0.5">Target Date</p>
              <div className={cn(
                "rounded-lg bg-white/5 border border-white/5 font-black tracking-[0.05em] text-white/80 transition-all",
                isFullscreen ? "px-6 py-3 text-base md:text-xl" : "px-3 py-1.5 text-xs md:text-sm"
              )}>
                {targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).replace(/,/g, ' -')}
              </div>
            </div>
          </div>

          {/* Fullscreen Ad - Stripped to Minimal without the box */}
          {isFullscreen && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center z-20">
              <div className="w-full max-w-4xl px-4 animate-in slide-in-from-bottom-2 duration-1000">
                <div className="relative">
                  <AdBanner />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ad Space (Standard) */}
        {!isFullscreen && (
          <div className="w-full">
            <AdBanner />
          </div>
        )}

        {/* Explanation & SEO Content Section */}
        {!isFullscreen && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
              {/* Main Info */}
              <section className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 bg-primary/5 p-5 rounded-2xl border border-primary/10">
                  <div className="min-w-[40px] h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Info size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">About the {holiday.name} Tracker</h3>
                </div>
                
                <div className="prose prose-invert max-w-none space-y-4 text-muted/80 text-sm font-medium leading-relaxed">
                  <p>
                    {seoInfo?.content || `This high-precision countdown is set specifically for ${holiday.name}. Whether you are coordinating travel, preparing gifts, or planning a celebratory event, our reliable global tracker ensures you never miss a second of the holiday season.`}
                  </p>
                  <p>
                    Our platform uses high-precision millisecond tracking synchronized with global atomic time to provide the most accurate countdown on the web. Stay perfectly on schedule with our high-precision countdown.
                  </p>
                </div>
              </section>

              {/* Side Card */}
              <aside className="space-y-6">
                <div className="bg-[#1a0b36]/40 p-6 rounded-2xl border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500 shadow-xl">
                  <h4 className="text-base font-bold text-white mb-2">Atomic Precision</h4>
                  <p className="text-[13px] text-muted/60 leading-relaxed font-medium">
                    Every second matters. Our trackers are synchronized with precision time sources for unmatched reliability.
                  </p>
                </div>
              </aside>
            </div>

            {/* Explore Other Tools */}
            <div className="pt-20 border-t border-white/5">
              <header className="text-center mb-12">
                <h3 className="text-2xl font-black text-white mb-3">Explore More Tools</h3>
                <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
              </header>
              <InternalLinks />
            </div>
          </>
        )}
      </div>
      <AdBanner />
    </div>
  )
}
