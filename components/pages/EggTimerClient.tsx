'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Square, Settings2, Info, Pause, Volume2, ChevronDown } from 'lucide-react'
import { Howl } from 'howler'
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
  
  // Audio state (matches normal Alarm configuration)
  const [sound, setSound] = useState('vibe')
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewHowlRef = useRef<Howl | null>(null)
  const finalHowlRef = useRef<Howl | null>(null)

  const handleStopPreview = () => {
    if (previewHowlRef.current) {
      previewHowlRef.current.stop()
      previewHowlRef.current = null
    }
    setIsPreviewPlaying(false)
  }

  const handlePreviewSound = () => {
    if (isPreviewPlaying) {
      handleStopPreview()
      return
    }
    if (previewHowlRef.current) previewHowlRef.current.stop()
    
    previewHowlRef.current = new Howl({
      src: [SOUNDS[sound] || SOUNDS.vibe],
      volume: 0.8,
      onend: () => setIsPreviewPlaying(false),
      onstop: () => setIsPreviewPlaying(false)
    })
    previewHowlRef.current.play()
    setIsPreviewPlaying(true)
  }
  const calculatedSeconds = Math.max(1, (targetMinute * 60) + SIZE_MODIFIERS[eggSize] + TEMP_MODIFIERS[eggTemp])

  // Timer Countdown tick
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'running' && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, timeLeft])

  // Timer Completion Trigger
  useEffect(() => {
    if (status === 'running' && timeLeft === 0) {
      setStatus('finished')
      setIsAlertOpen(true)
      
      // Stop any rogue sounds just in case
      if (finalHowlRef.current) finalHowlRef.current.stop()
      
      // Trigger Final Sound Loop safely
      finalHowlRef.current = new Howl({
        src: [SOUNDS[sound] || SOUNDS.vibe],
        volume: 1.0,
        loop: true
      })
      finalHowlRef.current.play()
    }
  }, [timeLeft, status, sound])

  const handleStart = () => {
    handleStopPreview() // stop if preview is running
    setTimeLeft(calculatedSeconds)
    setStatus('running')
  }

  const handlePause = () => setStatus('paused')
  const handleResume = () => setStatus('running')

  const handleReset = () => {
    setStatus('idle')
    setTimeLeft(null)
  }

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: TIME & BUTTON */}
        <div className="lg:col-span-5 bg-[#110624]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden min-h-[400px]">
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="z-10 w-full space-y-10 flex flex-col items-center">
            <div className="space-y-4 w-full">
              <h2 className="text-7xl md:text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-xl">
                {status === 'running' || status === 'paused' ? formatTime(timeLeft!) : formatTime(calculatedSeconds)}
              </h2>
              <p className="text-lg md:text-xl text-primary font-bold uppercase tracking-widest">
                {status === 'running' ? "Boiling..." : status === 'paused' ? "Timer Paused" : "Calculated Time"}
              </p>
            </div>

            {/* Audio Selection Dropdown */}
            <div className={`w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 transition-all shadow-inner ${status === 'running' || status === 'paused' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
               <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">Alarm Sound</span>
                  <div className="relative">
                     <select 
                        value={sound}
                        onChange={(e) => {
                           setSound(e.target.value)
                           if (isPreviewPlaying) handleStopPreview()
                        }}
                        className="bg-transparent text-white font-black text-lg outline-none cursor-pointer appearance-none pr-8 relative z-10"
                     >
                        {Object.keys(SOUNDS).map(k => (
                           <option key={k} value={k} className="bg-[#110624] text-white">
                              {k.charAt(0).toUpperCase() + k.slice(1)}
                           </option>
                        ))}
                     </select>
                     <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
               </div>
               <button 
                  onClick={handlePreviewSound}
                  className={`p-3 rounded-xl transition-all shadow-lg ${isPreviewPlaying ? 'bg-primary text-white shadow-primary/40 scale-[1.04]' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}
               >
                  {isPreviewPlaying ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
               </button>
            </div>

            <div className="w-full">
              {status === 'idle' || status === 'finished' ? (
                <button 
                  onClick={handleStart}
                  className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 text-white py-6 rounded-[2rem] font-black text-xl transition-all shadow-[0_0_40px_rgba(168,85,247,0.5)] flex items-center justify-center gap-4"
                >
                  <Play className="fill-current w-6 h-6" /> START BOILING 
                </button>
              ) : (
                <div className="flex gap-4">
                  {status === 'running' ? (
                    <button 
                      onClick={handlePause}
                      className="flex-1 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/30 py-6 rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Pause className="fill-current w-6 h-6" /> PAUSE
                    </button>
                  ) : (
                    <button 
                      onClick={handleResume}
                      className="flex-1 bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/30 py-6 rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="fill-current w-6 h-6" /> RESUME
                    </button>
                  )}
                  <button 
                    onClick={handleReset}
                    className="flex-1 bg-white/10 text-white hover:bg-white/20 border border-white/20 py-6 rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Square className="fill-current text-white/60 w-5 h-5" /> RESET
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SLIDER & MODIFIERS */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Visual Slider Panel */}
          <div className={`flex-1 bg-white/5 p-8 border border-white/10 rounded-[2.5rem] transition-opacity duration-300 ${status === 'running' ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-8 h-full flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-2xl font-black text-white">Desired Doneness</h3>
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
                  className="w-full h-4 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary hover:bg-white/20 transition-colors"
                />
                <div className="relative h-8 mt-2 w-full px-1.5 box-border">
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(num => (
                    <div 
                      key={num}
                      className={`absolute top-0 flex flex-col items-center -translate-x-1/2 cursor-pointer transition-all ${targetMinute === num ? 'scale-125 z-10' : 'hover:scale-110'}`}
                      style={{ left: `calc(${((num - 3) / 11) * 100}%)` }}
                      onClick={() => setTargetMinute(num)}
                    >
                      <div className={`w-0.5 h-1.5 mb-1 rounded-full ${targetMinute === num ? 'bg-primary' : 'bg-white/20'}`} />
                      <span className={`text-[10px] font-black ${targetMinute === num ? 'text-primary' : 'text-white/40'}`}>
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
          <div className={`bg-[#110624] p-8 border border-white/5 rounded-[2.5rem] space-y-6 shadow-[0_0_40px_rgba(124,58,237,0.05)] ${status === 'running' ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="flex items-center gap-3 mb-2">
                <Settings2 className="text-primary w-6 h-6" />
                <h3 className="text-xl font-black text-white">Modifiers</h3>
             </div>
             
             <div className="space-y-6">
                {/* Egg Size */}
                <div className="space-y-3">
                   <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Egg Size</label>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.keys(SIZE_MODIFIERS).map(size => (
                         <button
                            key={size}
                            onClick={() => setEggSize(size)}
                            className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                               eggSize === size 
                                  ? 'bg-primary/20 border-primary/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                         >
                            {size}
                         </button>
                      ))}
                   </div>
                </div>

                {/* Egg Temp */}
                <div className="space-y-3">
                   <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Starting Temperature</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.keys(TEMP_MODIFIERS).map(temp => (
                         <button
                            key={temp}
                            onClick={() => setEggTemp(temp)}
                            className={`py-4 px-4 rounded-xl text-sm font-bold border transition-all ${
                               eggTemp === temp 
                                  ? 'bg-primary/20 border-primary/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                         >
                            {temp}
                         </button>
                      ))}
                   </div>
                   <div className="h-[88px] mt-4">
                     {eggTemp === 'Room Temperature' && (
                        <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl h-full shadow-inner animate-in zoom-in-95 fade-in duration-300">
                           <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                           <p className="text-blue-200/90 text-[13px] font-medium leading-relaxed">
                              <strong className="text-blue-400">Pro Tip:</strong> Room temperature eggs cook faster. We subtracted 45 seconds from the timer for you!
                           </p>
                        </div>
                     )}
                   </div>
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
            if (finalHowlRef.current) {
               finalHowlRef.current.stop()
            }
         }}
         label="Eggs are Ready!"
         type="timer"
         timeText="Boiling Complete"
      />
    </div>
  )
}
