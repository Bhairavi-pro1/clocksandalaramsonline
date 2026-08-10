'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Square, Settings2, Info, Pause, Volume2, ChevronDown } from 'lucide-react'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'
import AdBanner from '@/components/ui/AdBanner'

// --- CONSTANTS & MAPPINGS ---
const EGG_STATES = {
  3: { label: "Soft", desc: "Mostly liquid whites, completely raw yolk." },
  4: { label: "Soft", desc: "Partially set whites, completely liquid yolk." },
  5: { label: "Soft", desc: "Soft set whites, completely runny yolk." },
  6: { label: "Soft", desc: "Firm whites, completely runny yolk." },
  7: { label: "Medium Soft", desc: "Firm whites, jammy, slightly fudgy yolk — ramen style." },
  8: { label: "Medium", desc: "Mostly set yolk, soft creamy center." },
  9: { label: "Medium Hard", desc: "Firm yolk, slight soft center." },
  10: { label: "Hard", desc: "Fully set yolk, soft texture, no gray ring." },
  11: { label: "Hard", desc: "Firm, fully cooked yolk." },
  12: { label: "Hard", desc: "Very firm, fully cooked — great for egg salad." },
  13: { label: "Overcooked", desc: "Chalky yolk, slight greenish ring starting." },
  14: { label: "Overcooked", desc: "Very chalky, strong green ring, rubbery whites." }
}

const SIZE_MODIFIERS: Record<string, number> = {
  'Small (S)': -60,
  'Medium (M)': -30,
  'Large (L)': 0,
  'Extra Large (XL)': 30
}

const TEMP_MODIFIERS: Record<string, number> = {
  'Fridge / Chilled': 0,
  'Room Temperature': -45
}

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

export default function EggTimerClient() {
  const [targetMinute, setTargetMinute] = useState(7)
  const [eggSize, setEggSize] = useState('Large (L)')
  const [eggTemp, setEggTemp] = useState('Fridge / Chilled')
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle')
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  
  // Audio state
  const [sound, setSound] = useState('vibe')
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  const finalAudioRef = useRef<HTMLAudioElement | null>(null)
  const endTimeRef = useRef<number | null>(null)

  const storageKey = 'egg_timer_state'

  const saveState = (
    s: typeof status, 
    tLeft: number | null, 
    end: number | null,
    tm: number = targetMinute,
    es: string = eggSize,
    et: string = eggTemp
  ) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        status: s,
        timeLeft: tLeft,
        endTime: end,
        targetMinute: tm,
        eggSize: es,
        eggTemp: et
      }))
    } catch(e) {}
  }

  // Handle preference changes and save
  useEffect(() => {
    if (status === 'idle') {
      saveState('idle', null, null, targetMinute, eggSize, eggTemp)
    }
  }, [targetMinute, eggSize, eggTemp, status])

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.targetMinute) setTargetMinute(parsed.targetMinute)
        if (parsed.eggSize) setEggSize(parsed.eggSize)
        if (parsed.eggTemp) setEggTemp(parsed.eggTemp)

        if (parsed.status === 'running' && parsed.endTime) {
          const now = Date.now()
          const remaining = Math.max(0, Math.ceil((parsed.endTime - now) / 1000))
          if (remaining > 0) {
            setTimeLeft(remaining)
            setStatus('running')
            endTimeRef.current = parsed.endTime
          } else {
            setTimeLeft(0)
            setStatus('idle')
            localStorage.removeItem(storageKey)
          }
        } else if (parsed.status === 'paused') {
          setTimeLeft(parsed.timeLeft)
          setStatus('paused')
        }
      }
    } catch(e) {}
  }, [])

  const handleStopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current.currentTime = 0
      previewAudioRef.current = null
    }
    setIsPreviewPlaying(false)
  }

  const handlePreviewSound = () => {
    if (isPreviewPlaying) {
      handleStopPreview()
      return
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current.currentTime = 0
    }
    
    const audio = new Audio(SOUNDS[sound] || SOUNDS.vibe)
    audio.volume = 0.8
    audio.onended = () => setIsPreviewPlaying(false)
    
    audio.play().catch(e => {
      console.error('Audio preview blocked:', e)
      setIsPreviewPlaying(false)
    })
    
    previewAudioRef.current = audio
    setIsPreviewPlaying(true)
  }
  
  const calculatedSeconds = Math.max(1, (targetMinute * 60) + SIZE_MODIFIERS[eggSize] + TEMP_MODIFIERS[eggTemp])

  // Timer Countdown tick (accurate to 200ms)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'running') {
      interval = setInterval(() => {
        if (endTimeRef.current) {
          const now = Date.now()
          const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000))
          
          if (remaining !== timeLeft) {
             setTimeLeft(remaining)
          }
          
          if (remaining <= 0) {
             setStatus('finished')
             setIsAlertOpen(true)
             endTimeRef.current = null
             localStorage.removeItem(storageKey)

             if (finalAudioRef.current) {
               finalAudioRef.current.pause()
               finalAudioRef.current.currentTime = 0
             }
             
             const audio = new Audio(SOUNDS[sound] || SOUNDS.vibe)
             audio.volume = 1.0
             audio.loop = true
             audio.play().catch(e => console.error('Egg timer audio blocked:', e))
             
             finalAudioRef.current = audio
          }
        }
      }, 200)
    }
    return () => clearInterval(interval)
  }, [status, timeLeft, sound])

  const handleStart = () => {
    handleStopPreview()
    const timeToStart = status === 'paused' && timeLeft !== null ? timeLeft : calculatedSeconds;
    const end = Date.now() + timeToStart * 1000
    
    setTimeLeft(timeToStart)
    setStatus('running')
    endTimeRef.current = end
    saveState('running', timeToStart, end)
  }

  const handlePause = () => {
    setStatus('paused')
    endTimeRef.current = null
    saveState('paused', timeLeft, null)
  }

  const handleResume = () => {
    const end = Date.now() + (timeLeft || 0) * 1000
    setStatus('running')
    endTimeRef.current = end
    saveState('running', timeLeft, end)
  }

  const handleReset = () => {
    setStatus('idle')
    setTimeLeft(null)
    endTimeRef.current = null
    saveState('idle', null, null)
  }

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* FIRST ROW: TIME & BUTTON */}
      <div className="w-auto sm:w-full bg-white dark:bg-[#110624]/60 backdrop-blur-md border border-x-0 sm:border border-slate-200 dark:border-white/5 rounded-none sm:rounded-[2.5rem] p-6 sm:p-12 -mx-4 sm:mx-0 shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="z-10 w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-7xl md:text-8xl font-black text-slate-800 dark:text-white tracking-tighter tabular-nums drop-shadow-xl leading-none">
              {status === 'running' || status === 'paused' ? formatTime(timeLeft!) : formatTime(calculatedSeconds)}
            </h2>
            <p className="text-lg md:text-xl text-primary font-bold uppercase tracking-widest">
              {status === 'running' ? "Boiling..." : status === 'paused' ? "Timer Paused" : "Calculated Time"}
            </p>
          </div>

          <div className="w-full md:w-auto">
            {status === 'idle' || status === 'finished' ? (
              <button 
                onClick={handleStart}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_40px_rgba(168,85,247,0.5)] flex items-center justify-center gap-4 animate-in fade-in duration-200"
              >
                <Play className="fill-current w-6 h-6" /> START BOILING 
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {status === 'running' ? (
                  <button 
                    onClick={handlePause}
                    className="flex-1 sm:flex-none bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/30 px-10 py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Pause className="fill-current w-6 h-6" /> PAUSE
                  </button>
                ) : (
                  <button 
                    onClick={handleResume}
                    className="flex-1 sm:flex-none bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/30 px-10 py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Play className="fill-current w-6 h-6" /> RESUME
                  </button>
                )}
                <button 
                  onClick={handleReset}
                  className="flex-1 sm:flex-none bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 px-10 py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Square className="fill-current text-slate-400 dark:text-white/60 w-5 h-5" /> RESET
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECOND ROW: DONENESS & MODIFIERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Visual Slider Panel */}
        <div className={`bg-[#110624] p-8 border border-slate-200 dark:border-white/5 rounded-[2.5rem] transition-opacity duration-300 ${status === 'running' ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Desired Doneness</h3>
              <span className="bg-primary/20 text-primary px-5 py-2 rounded-full text-sm font-bold shadow-inner border border-primary/20 whitespace-nowrap">
                {EGG_STATES[targetMinute as keyof typeof EGG_STATES].label}
              </span>
            </div>

            <div className="space-y-5">
              <input
                type="range"
                min="3"
                max="14"
                step="1"
                value={targetMinute}
                onChange={(e) => setTargetMinute(Number(e.target.value))}
                className="w-full h-4 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-primary hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
              />
              <div className="relative h-8 mt-2 w-full px-1.5 box-border">
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(num => (
                  <div 
                    key={num}
                    className={`absolute top-0 flex flex-col items-center -translate-x-1/2 cursor-pointer transition-all ${targetMinute === num ? 'scale-125 z-10' : 'hover:scale-110'}`}
                    style={{ left: `calc(${((num - 3) / 11) * 100}%)` }}
                    onClick={() => setTargetMinute(num)}
                  >
                    <div className={`w-0.5 h-1.5 mb-1 rounded-full ${targetMinute === num ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`} />
                    <span className={`text-[10px] font-black ${targetMinute === num ? 'text-primary' : 'text-slate-400 dark:text-white/40'}`}>
                      {num}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#110624] p-6 rounded-2xl border border-primary/20 relative overflow-hidden shadow-inner h-[150px] flex flex-col justify-center shrink-0">
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 blur-[30px] rounded-full pointer-events-none" />
               <p className="text-xs uppercase tracking-widest text-primary font-black mb-2 opacity-80 z-10 relative flex items-center gap-2">
                 Result at {targetMinute} Minutes
               </p>
               <p className="text-white text-lg md:text-xl font-bold leading-relaxed z-10 relative line-clamp-3">
                 {EGG_STATES[targetMinute as keyof typeof EGG_STATES].desc}
               </p>
            </div>
          </div>
        </div>

        {/* Modifiers Panel */}
        <div className={`bg-[#110624] p-8 border border-slate-200 dark:border-white/5 rounded-[2.5rem] space-y-6 shadow-[0_0_40px_rgba(124,58,237,0.05)] ${status === 'running' ? 'opacity-50 pointer-events-none' : ''}`}>
           <div className="flex items-center gap-3 mb-2">
              <Settings2 className="text-primary w-6 h-6" />
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Modifiers</h3>
           </div>
           
           <div className="space-y-6">
              {/* Egg Size */}
              <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">Egg Size</label>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.keys(SIZE_MODIFIERS).map(size => (
                       <button
                          key={size}
                          onClick={() => setEggSize(size)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                             eggSize === size 
                                ? 'bg-primary/20 border-primary/50 text-slate-800 dark:text-white shadow-[0_0_20px_rgba(168,85,247,0.2)] font-black' 
                                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white'
                          }`}
                       >
                          {size}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Egg Temp */}
              <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">Starting Temperature</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.keys(TEMP_MODIFIERS).map(temp => (
                       <button
                          key={temp}
                          onClick={() => setEggTemp(temp)}
                          className={`py-4 px-4 rounded-xl text-sm font-bold border transition-all ${
                             eggTemp === temp 
                                ? 'bg-primary/20 border-primary/50 text-slate-800 dark:text-white shadow-[0_0_20px_rgba(168,85,247,0.2)] font-black' 
                                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white'
                          }`}
                       >
                          {temp}
                       </button>
                    ))}
                 </div>
                 {eggTemp === 'Room Temperature' && (
                    <div className="mt-3 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl shadow-inner animate-in zoom-in-95 fade-in duration-300">
                       <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                       <p className="text-blue-700 dark:text-blue-200/90 text-[13px] font-medium leading-relaxed">
                          <strong className="text-blue-600 dark:text-blue-400">Pro Tip:</strong> Room temperature eggs cook faster. We subtracted 45 seconds from the timer for you!
                       </p>
                    </div>
                 )}
              </div>

              {/* Alarm Sound */}
              <div className={`space-y-3 pt-4 border-t border-slate-200/50 dark:border-white/5 transition-all ${status === 'running' || status === 'paused' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">Alarm Sound</label>
                 <div className="flex gap-3 items-center">
                    <div className="flex-1 relative group">
                       <select 
                          value={sound}
                          onChange={(e) => {
                             setSound(e.target.value)
                             if (isPreviewPlaying) handleStopPreview()
                          }}
                          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-sm font-bold"
                       >
                          {Object.keys(SOUNDS).map(k => (
                             <option key={k} value={k} className="bg-white dark:bg-[#110624] text-slate-800 dark:text-white">
                                {k.charAt(0).toUpperCase() + k.slice(1)}
                             </option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/50 pointer-events-none" />
                    </div>
                    <button 
                       type="button"
                       onClick={handlePreviewSound}
                       className={`px-4 py-3 rounded-2xl border transition-all flex items-center justify-center shadow-lg ${isPreviewPlaying ? 'bg-primary text-white shadow-primary/40 scale-[1.04]' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/20 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                       {isPreviewPlaying ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <div className="py-4">
        <AdBanner />
      </div>

      {/* Reusing existing beautiful modal */}
      <AlarmTriggerModal
         isOpen={isAlertOpen}
         onClose={() => {
            setIsAlertOpen(false)
            if (finalAudioRef.current) {
               finalAudioRef.current.pause()
               finalAudioRef.current.currentTime = 0
               finalAudioRef.current = null
            }
         }}
         label="Eggs are Ready!"
         type="timer"
         timeText="Boiling Complete"
      />
    </div>
  )
}
