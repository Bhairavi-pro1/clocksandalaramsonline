'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Bell, Volume2, Square, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const PERIODS = ['AM', 'PM']

interface AddAlarmModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (alarm: { label: string; time: string; sound: string; isActive: boolean; days: number[] }) => void
}

export default function AddAlarmModal({ isOpen, onClose, onAdd }: AddAlarmModalProps) {
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [label, setLabel] = useState('')
  const [timeStr, setTimeStr] = useState('07:00')
  const [selectedSound, setSelectedSound] = useState('vibe')
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  // Split timeStr (HH:mm)
  const [hStr, mStr] = timeStr.split(':')
  const rawHours = parseInt(hStr || '7')
  const derivedMinute = mStr || '00'
  
  // For 12-hour format
  const derivedPeriod = rawHours >= 12 ? 'PM' : 'AM'
  const h12 = rawHours % 12 || 12
  const derivedHour12 = String(h12).padStart(2, '0')

  // For 24-hour format
  const derivedHour24 = String(rawHours).padStart(2, '0')

  const handle12hChange = (h12Val: string, mVal: string, pVal: string) => {
    let hours = parseInt(h12Val)
    if (pVal === 'PM' && hours < 12) hours += 12
    if (pVal === 'AM' && hours === 12) hours = 0
    setTimeStr(`${String(hours).padStart(2, '0')}:${mVal}`)
  }

  const handle24hChange = (h24Val: string, mVal: string) => {
    setTimeStr(`${h24Val}:${mVal}`)
  }

  useEffect(() => {
    if (isOpen) {
      setCurrentTime(new Date())
      const interval = setInterval(() => setCurrentTime(new Date()), 1000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      setTimeStr(`${h}:${m}`)
    }
  }, [isOpen])

  if (!isOpen) return null

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

    const audio = new Audio(SOUNDS[selectedSound] || SOUNDS.vibe)
    audio.volume = 0.8
    audio.onended = () => setIsPreviewPlaying(false)
    
    audio.play().catch(e => {
      console.error('Audio preview blocked:', e)
      setIsPreviewPlaying(false)
    })
    
    previewAudioRef.current = audio
    setIsPreviewPlaying(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onAdd({
      label: label || 'Alarm',
      time: timeStr,
      sound: selectedSound,
      isActive: true,
      days: []
    })
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setLabel('')
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    setTimeStr(`${h}:${m}`)
    setSelectedSound('vibe')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a0b36] border border-slate-200 dark:border-violet-500/20 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <span className="p-2 rounded-xl bg-primary/20 text-primary">
                  <Bell size={24} />
                </span>
                New Alarm
              </h2>
              {currentTime && (
                <p className="text-slate-500 dark:text-white/50 text-sm mt-2 ml-[3.25rem] font-medium">
                  Current Time: {currentTime.toLocaleTimeString([], { hour12: !(mounted && is24Hour) })}
                </p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-white/40 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1">Label</label>
              <input 
                type="text" 
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Wake Up, Gym, Medication..."
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-white/20 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1">Time</label>
              {mounted && is24Hour ? (
                <div className="grid grid-cols-2 gap-2">
                  {/* Hour Select */}
                  <div className="relative group">
                    <select 
                      value={derivedHour24}
                      onChange={(e) => handle24hChange(e.target.value, derivedMinute)}
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-sm font-bold text-center"
                    >
                      {HOURS_24.map(h => <option key={h} value={h} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{h}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                  </div>

                  {/* Minute Select */}
                  <div className="relative group">
                    <select 
                      value={derivedMinute}
                      onChange={(e) => handle24hChange(derivedHour24, e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-sm font-bold text-center"
                    >
                      {MINUTES.map(m => <option key={m} value={m} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {/* Hour Select */}
                  <div className="relative group">
                    <select 
                      value={derivedHour12}
                      onChange={(e) => handle12hChange(e.target.value, derivedMinute, derivedPeriod)}
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-sm font-bold text-center"
                    >
                      {HOURS_12.map(h => <option key={h} value={h} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{h}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                  </div>

                  {/* Minute Select */}
                  <div className="relative group">
                    <select 
                      value={derivedMinute}
                      onChange={(e) => handle12hChange(derivedHour12, e.target.value, derivedPeriod)}
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-sm font-bold text-center"
                    >
                      {MINUTES.map(m => <option key={m} value={m} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                  </div>

                  {/* Period Select */}
                  <div className="relative group">
                    <select 
                      value={derivedPeriod}
                      onChange={(e) => handle12hChange(derivedHour12, derivedMinute, e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-sm font-bold text-center"
                    >
                      {PERIODS.map(p => <option key={p} value={p} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{p}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1">Alarm Sound</label>
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative group">
                  <select 
                    value={selectedSound}
                    onChange={(e) => setSelectedSound(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-sm font-bold"
                  >
                    <option value="vibe" className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">Vibe</option>
                    <option value="editorial" className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">Editorial</option>
                    <option value="guitar" className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">Guitar</option>
                    <option value="riser" className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">Riser</option>
                    <option value="birds" className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">Birds</option>
                    <option value="fun" className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">Fun</option>
                    <option value="synthwave" className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">Synthwave</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                </div>
                <button 
                  type="button"
                  onClick={handlePreviewSound}
                  className={`px-4 py-3 rounded-2xl border transition-all flex items-center justify-center ${
                    isPreviewPlaying 
                      ? 'bg-red-500/20 border-red-500/30 text-red-500' 
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 shadow-inner'
                  }`}
                >
                  {isPreviewPlaying ? <Square size={20} fill="currentColor" /> : <Volume2 size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white py-3 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4"
            >
              SAVE ALARM
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
