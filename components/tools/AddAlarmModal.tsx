'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Bell, Volume2, Square, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const PERIODS = ['AM', 'PM']

interface AddAlarmModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (alarm: { label: string; time: string; sound: string; isActive: boolean; days: number[] }) => void
}

export default function AddAlarmModal({ isOpen, onClose, onAdd }: AddAlarmModalProps) {
  const [label, setLabel] = useState('')
  const [hour, setHour] = useState('07')
  const [minute, setMinute] = useState('00')
  const [period, setPeriod] = useState('AM')
  const [selectedSound, setSelectedSound] = useState('vibe')
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      let h = now.getHours()
      const m = now.getMinutes()
      const p = h >= 12 ? 'PM' : 'AM'
      if (h === 0) h = 12
      else if (h > 12) h -= 12

      setHour(String(h).padStart(2, '0'))
      setMinute(String(m).padStart(2, '0'))
      setPeriod(p)
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
    
    // Convert 12h to 24h for storage
    let h = parseInt(hour)
    if (period === 'PM' && h < 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    const time24 = `${String(h).padStart(2, '0')}:${minute}`

    onAdd({
      label: label || 'Alarm',
      time: time24,
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
    let h = now.getHours()
    const p = h >= 12 ? 'PM' : 'AM'
    if (h === 0) h = 12
    else if (h > 12) h -= 12
    setHour(String(h).padStart(2, '0'))
    setMinute(String(now.getMinutes()).padStart(2, '0'))
    setPeriod(p)
    setSelectedSound('vibe')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-[#1a0b36] border border-violet-500/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
        
        <div className="p-8 sm:p-10 relative z-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-primary/20 text-primary">
                <Bell size={24} />
              </span>
              New Alarm
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/5 text-white/40 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                LABEL
              </label>
              <input 
                type="text" 
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Wake Up, Medication, Gym..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                ALARM TIME
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Hour Select */}
                <div className="relative group">
                  <select 
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] h-20 text-3xl font-bold text-center text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07]"
                  >
                    {HOURS.map(h => <option key={h} value={h} className="bg-[#1a0b36]">{h}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                </div>

                {/* Minute Select */}
                <div className="relative group">
                  <select 
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] h-20 text-3xl font-bold text-center text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07]"
                  >
                    {MINUTES.map(m => <option key={m} value={m} className="bg-[#1a0b36]">{m}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                </div>

                {/* Period Select */}
                <div className="relative group">
                  <select 
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] h-20 text-xl font-black text-center text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07]"
                  >
                    {PERIODS.map(p => <option key={p} value={p} className="bg-[#1a0b36]">{p}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                ALARM SOUND
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative group">
                  <select 
                    value={selectedSound}
                    onChange={(e) => setSelectedSound(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07] text-sm font-bold"
                  >
                    <option value="vibe" className="bg-[#1a0b36]">Vibe</option>
                    <option value="editorial" className="bg-[#1a0b36]">Editorial</option>
                    <option value="guitar" className="bg-[#1a0b36]">Guitar</option>
                    <option value="riser" className="bg-[#1a0b36]">Riser</option>
                    <option value="birds" className="bg-[#1a0b36]">Birds</option>
                    <option value="fun" className="bg-[#1a0b36]">Fun</option>
                    <option value="synthwave" className="bg-[#1a0b36]">Synthwave</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                </div>
                <button 
                  type="button"
                  onClick={handlePreviewSound}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${
                    isPreviewPlaying 
                      ? 'bg-red-500/20 border-red-500/30 text-red-500' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 shadow-inner'
                  }`}
                >
                  {isPreviewPlaying ? <Square size={24} fill="currentColor" /> : <Volume2 size={24} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white font-black py-5 rounded-[1.5rem] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
            >
              SAVE ALARM
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
