'use client'
import { useState, useRef, useEffect } from 'react'
import { useStopwatch } from '@/hooks/useStopwatch'
import { Timer as StopwatchIcon, Maximize2, Minimize2, RotateCcw, Play, Pause, Flag, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import InternalLinks from '@/components/ui/InternalLinks'
import AdBanner from '@/components/ui/AdBanner'

export default function StopwatchPage() {
  const { time, setTime, isRunning, laps, setLaps, start, pause, reset, lap, formatTime } = useStopwatch()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [history, setHistory] = useState<{id: string, time: number, laps: number[], date: string}[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Load history from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('stopwatch_history')
    if (saved) setHistory(JSON.parse(saved))
    setIsLoaded(true)
  }, [])

  // Save history to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('stopwatch_history', JSON.stringify(history.slice(0, 10))) // Keep last 10
    }
  }, [history, isLoaded])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cardRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleReset = () => {
    if (time > 0) {
      const newSession = {
        id: Date.now().toString(),
        time,
        laps: [...laps],
        date: new Date().toLocaleString()
      }
      setHistory(prev => [newSession, ...prev])
    }
    reset()
  }

  const loadSession = (session: {time: number, laps: number[]}) => {
    pause()
    setTime(session.time)
    setLaps(session.laps)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setHistory(prev => prev.filter(s => s.id !== id))
  }

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 space-y-12">
      {/* Sub-Header */}
      {!isFullscreen && (
        <div className="text-center animate-in fade-in duration-700">
          <h1 className="text-primary font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4">
            Online Stopwatch – High-Precision Lap Timer
          </h1>
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-8", !isFullscreen ? "lg:grid-cols-12" : "grid-cols-1")}>
        {/* Main Column */}
        <div className={cn(!isFullscreen ? "lg:col-span-8" : "col-span-1", "space-y-8")}>
          
          {/* Main Stopwatch Card */}
          <div 
            ref={cardRef}
            className={cn(
              "bg-[#1a0b2e]/60 border border-violet-500/20 rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group transition-all duration-500 flex flex-col items-center justify-center",
              isFullscreen ? "h-screen rounded-none border-none p-0 bg-background" : "min-h-[500px]"
            )}
          >
            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen}
              className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 z-20"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white/50 group-hover:text-white" />}
            </button>

            <div className={cn(
              "flex flex-col items-center w-full relative z-10",
              isFullscreen && "pb-32"
            )}>
              {/* Timer Display */}
              <div className={cn(
                "font-mono font-black tracking-tighter text-white tabular-nums flex items-center justify-center drop-shadow-[0_0_50px_rgba(124,58,237,0.3)] mb-12 select-none",
                isFullscreen ? "text-9xl md:text-[14rem] lg:text-[18rem]" : "text-5xl md:text-7xl xl:text-8xl font-black"
              )}>
                {formatTime(time).split('').map((char, i) => (
                  <span key={i} className={cn(char === ':' || char === '.' ? "mx-1 opacity-40" : "w-[0.6em] md:w-[0.65em] inline-block text-center")}>
                    {char}
                  </span>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-lg px-6">
                {!isRunning ? (
                  <button 
                    onClick={start}
                    className="flex-1 min-w-[120px] py-4 rounded-2xl bg-primary text-white font-black text-sm md:text-base shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all"
                  >
                    Start
                  </button>
                ) : (
                  <button 
                    onClick={pause}
                    className="flex-1 min-w-[120px] py-4 rounded-2xl bg-white/10 text-white font-black text-sm md:text-base border border-white/10 hover:bg-white/20 transition-all"
                  >
                    Pause
                  </button>
                )}
                
                <button 
                  onClick={lap}
                  disabled={!isRunning && time === 0}
                  className="flex-1 min-w-[120px] py-4 rounded-2xl bg-[#2d1b4e] text-white font-black text-sm md:text-base border border-violet-500/20 hover:bg-[#3d2b5e] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Lap
                </button>

                <button 
                  onClick={handleReset}
                  className="flex-1 min-w-[120px] py-4 rounded-2xl bg-[#ff2e88] text-white font-black text-sm md:text-base shadow-[0_0_20px_rgba(255,46,136,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Ad Space Inside Card */}
            <AdBanner />
          </div>

          {/* Usage History Section */}
          {!isFullscreen && (
            <div className="bg-[#1a0b2e]/40 border border-violet-500/10 rounded-[2.5rem] p-10 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold font-display text-white tracking-tight">Usage History</h2>
                <button 
                  onClick={() => setHistory([])}
                  className="text-[10px] text-white/30 hover:text-danger px-3 py-1 rounded-full border border-white/5 hover:border-danger/30 transition-all uppercase font-black"
                >
                  Clear History
                </button>
              </div>
              
              {history.length === 0 ? (
                <div className="py-20 text-center space-y-4 opacity-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                  <RotateCcw className="w-12 h-12 mx-auto" />
                  <p className="font-bold text-sm uppercase tracking-widest">No sessions saved in history</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.map((session) => (
                    <div 
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className="group p-6 bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/20 rounded-[2.5rem] transition-all text-left relative overflow-hidden cursor-pointer"
                    >
                      <div className="relative z-10 flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">{session.date}</p>
                          <p className="text-3xl font-mono font-black text-white tabular-nums">{formatTime(session.time)}</p>
                          <p className="text-xs text-white/40 font-bold mt-1 uppercase tracking-tighter">{session.laps.length} Laps Recorded</p>
                        </div>
                        
                        <div className="flex flex-col gap-3 items-center ml-4">
                          {/* Circle Remove Button - Always Visible */}
                          <button 
                            onClick={(e) => removeSession(e, session.id)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-danger/20 flex items-center justify-center border border-white/10 hover:border-danger/30 transition-all z-20"
                            title="Remove session"
                          >
                            <X className="w-5 h-5 text-white/40 group-hover:text-danger" />
                          </button>

                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary/50 transition-all">
                             <Clock className="w-5 h-5 text-white/50 group-hover:text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Lap Times (Hidden in fullscreen) */}
        {!isFullscreen && (
          <div className="lg:col-span-4 h-full">
            <div className="bg-[#1a0b2e]/60 border border-violet-500/20 rounded-[2.5rem] shadow-xl h-full flex flex-col sticky top-24 max-h-[calc(100vh-120px)]">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  <Flag className="w-5 h-5 text-primary" /> Lap Times
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {laps.length === 0 ? (
                  <div className="h-full py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                    <RotateCcw className="w-12 h-12" />
                    <p className="font-bold text-sm uppercase tracking-widest font-display">No laps recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...laps].reverse().map((lTime, index, reversedArr) => (
                      <div 
                        key={index} 
                        className="group flex justify-between items-center p-5 bg-white/5 hover:bg-primary/10 rounded-2xl border border-white/5 hover:border-primary/20 transition-all animate-in slide-in-from-left-3 duration-300"
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Lap {index + 1}</span>
                          <span className="font-mono font-bold text-xl text-white tabular-nums">{formatTime(lTime)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-white/40 block uppercase tracking-tighter mb-1">Difference</span>
                          <span className="text-xs font-bold text-white/60">
                             {index > 0 ? `+${formatTime(lTime - reversedArr[index - 1])}` : '---'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 bg-white/5 rounded-b-[2.5rem] border-t border-white/5">
                <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-widest">
                  Precision tracking enabled
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extended SEO Content & How to Use (Bottom of page) */}
      {!isFullscreen && (
        <div className="space-y-24 pt-20">
          {/* Detailed Description */}
          <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              Professional Grade Timing
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
              A High-Precision Stopwatch <br />
              <span className="text-primary/80">for Every Second That Counts</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
              The Clocks and Alarms Online stopwatch is engineered for performance. Unlike standard 
              web timers, our tool utilizes high-frequency system performance counters to ensure that the 
              displayed time never lags, even during intense CPU usage. Whether you're an athlete timing 
              splits or a professional developer tracking work cycles, our tool provides the stability you need.
            </p>
          </section>

          {/* How to Use Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                <span className="text-xl font-black text-white">1</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Start the Clock</h4>
              <p className="text-sm text-muted/80 leading-relaxed font-medium">Click the Start button to begin tracking time in real-time with millisecond-accuracy.</p>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                <span className="text-xl font-black text-white">2</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Record Splits</h4>
              <p className="text-sm text-muted/80 leading-relaxed font-medium">Hit 'Lap' to freeze the current time without stopping the stopwatch to compare your splits.</p>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                <span className="text-xl font-black text-white">3</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Full Screen</h4>
              <p className="text-sm text-muted/80 leading-relaxed font-medium">Expand the timer to fill your entire display—perfect for athletics or gym environments.</p>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-[#1a0b2e]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                <span className="text-xl font-black text-white">4</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Reset Anytime</h4>
              <p className="text-sm text-muted/80 leading-relaxed font-medium">Clear your current time and lap history instantly by hitting the magenta Reset button.</p>
            </div>
          </section>
          
          <AdBanner />
        </div>
      )}

      {!isFullscreen && <InternalLinks />}
    </div>
  )
}
