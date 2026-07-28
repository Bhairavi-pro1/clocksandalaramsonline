'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Play, Music, Volume2, Square, ChevronDown } from 'lucide-react'
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

interface AddCountdownModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (countdown: { label: string; seconds: number; sound: string }) => void
}

export default function AddCountdownModal({ isOpen, onClose, onAdd }: AddCountdownModalProps) {
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [label, setLabel] = useState('')
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('5')
  const [seconds, setSeconds] = useState('0')
  const [selectedSound, setSelectedSound] = useState('vibe')
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    if (isOpen) {
      setCurrentTime(new Date())
      const interval = setInterval(() => setCurrentTime(new Date()), 1000)
      return () => clearInterval(interval)
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
    const h = parseInt(hours) || 0
    const m = parseInt(minutes) || 0
    const s = parseInt(seconds) || 0
    const totalSeconds = (h * 3600) + (m * 60) + s
    if (totalSeconds <= 0) return
    
    onAdd({
      label: label || 'Timer',
      seconds: totalSeconds,
      sound: selectedSound
    })
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setLabel('')
    setHours('0')
    setMinutes('5')
    setSeconds('0')
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
                  <Music size={24} />
                </span>
                New Timer
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
                placeholder="Work, Workout, Cooking..."
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-white/20 font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 text-center block">
                  Hours
                </label>
                <input 
                  type="number" 
                  min="0"
                  max="99"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-14 text-xl font-bold text-center text-slate-800 dark:text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 text-center block">
                  Minutes
                </label>
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-14 text-xl font-bold text-center text-slate-800 dark:text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 text-center block">
                  Seconds
                </label>
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-14 text-xl font-bold text-center text-slate-800 dark:text-white focus:outline-none focus:border-primary/50"
                />
              </div>
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
              className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white py-3 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4 flex items-center justify-center gap-3"
            >
              <Play size={20} fill="currentColor" />
              CREATE TIMER
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
