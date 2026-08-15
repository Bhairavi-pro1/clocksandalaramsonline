'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Clock, Volume2, Square, ChevronDown } from 'lucide-react'
import { SharedAlarm } from '@/lib/sharedAlarmLogic'
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

interface SharedAlarmModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string, description: string, alarmDateTime: string, sound: string }) => void
  initialData?: SharedAlarm | null
}

export default function SharedAlarmModal({ isOpen, onClose, onSave, initialData }: SharedAlarmModalProps) {
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sound, setSound] = useState('vibe')
  
  // Default to current time
  const defaultDate = new Date()
  
  const [dateStr, setDateStr] = useState(defaultDate.toISOString().split('T')[0])
  
  const hours = String(defaultDate.getHours()).padStart(2, '0')
  const minutes = String(defaultDate.getMinutes()).padStart(2, '0')
  const [timeStr, setTimeStr] = useState(`${hours}:${minutes}`)
  
  // Split timeStr (HH:mm)
  const [hStr, mStr] = timeStr.split(':')
  const rawHours = parseInt(hStr || '12')
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

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      setSound(initialData.sound || 'vibe')
      const dt = new Date(initialData.alarmDateTime)
      setDateStr(dt.toISOString().split('T')[0])
      setTimeStr(`${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`)
    } else if (isOpen && !initialData) {
       // Reset on open if new
       setTitle('')
       setDescription('')
       setSound('vibe')
       const d = new Date()
       setDateStr(d.toISOString().split('T')[0])
       setTimeStr(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
    }
  }, [initialData, isOpen])

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

  useEffect(() => {
    if (!isOpen) handleStopPreview()
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dateStr || !timeStr) return

    // Combine date and time into ISO
    const combined = new Date(`${dateStr}T${timeStr}:00`);
    onSave({
      title,
      description,
      alarmDateTime: combined.toISOString(),
      sound
    });
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="absolute inset-0"
      />
      
      <div className="relative w-full max-w-md bg-[#110624] border border-white/10 p-4 sm:p-8 rounded-[1.75rem] sm:rounded-[2.5rem] shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/30 shrink-0">
            <Clock className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
              {initialData ? "Edit Shared Alarm" : "New Shared Alarm"}
            </h2>
            {currentTime && (
              <p className="text-xs sm:text-sm text-white/50 font-medium mt-0.5">
                Current Time: {currentTime.toLocaleTimeString([], { hour12: !(mounted && is24Hour) })}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Title</label>
            <input 
               autoFocus
               required
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Morning Meeting"
               className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium animate-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Description (Optional)</label>
            <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Don't forget to join the Zoom call..."
               className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium resize-none min-h-[60px] sm:min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Date</label>
                <input 
                   required
                   type="date"
                   value={dateStr}
                   min={new Date().toISOString().split('T')[0]}
                   onChange={(e) => setDateStr(e.target.value)}
                   onClick={(e) => {
                      try {
                         e.currentTarget.showPicker();
                      } catch (err) {
                         console.warn("showPicker is not supported on this browser/element", err);
                      }
                   }}
                   className="w-full bg-slate-100 dark:bg-[#1a0b36]/40 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 dark:[color-scheme:dark] h-[38px] sm:h-[46px]"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Time</label>
                {mounted && is24Hour ? (
                   <div className="grid grid-cols-2 gap-1.5">
                      {/* Hour Select */}
                      <div className="relative group">
                         <select 
                            value={derivedHour24}
                            onChange={(e) => handle24hChange(e.target.value, derivedMinute)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-2 py-2 sm:px-3 sm:py-3 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07] text-xs sm:text-sm font-bold text-center h-[38px] sm:h-[46px]"
                         >
                            {HOURS_24.map(h => <option key={h} value={h} className="bg-[#1a0b36]">{h}</option>)}
                         </select>
                         <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                      </div>

                      {/* Minute Select */}
                      <div className="relative group">
                         <select 
                            value={derivedMinute}
                            onChange={(e) => handle24hChange(derivedHour24, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-2 py-2 sm:px-3 sm:py-3 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07] text-xs sm:text-sm font-bold text-center h-[38px] sm:h-[46px]"
                         >
                            {MINUTES.map(m => <option key={m} value={m} className="bg-[#1a0b36]">{m}</option>)}
                         </select>
                         <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                      </div>
                   </div>
                ) : (
                   <div className="grid grid-cols-3 gap-1">
                      {/* Hour Select */}
                      <div className="relative group">
                         <select 
                            value={derivedHour12}
                            onChange={(e) => handle12hChange(e.target.value, derivedMinute, derivedPeriod)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-1.5 py-2 sm:px-3 sm:py-3 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07] text-xs sm:text-sm font-bold text-center h-[38px] sm:h-[46px]"
                         >
                            {HOURS_12.map(h => <option key={h} value={h} className="bg-[#1a0b36]">{h}</option>)}
                         </select>
                         <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                      </div>

                      {/* Minute Select */}
                      <div className="relative group">
                         <select 
                            value={derivedMinute}
                            onChange={(e) => handle12hChange(derivedHour12, e.target.value, derivedPeriod)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-1.5 py-2 sm:px-3 sm:py-3 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07] text-xs sm:text-sm font-bold text-center h-[38px] sm:h-[46px]"
                         >
                            {MINUTES.map(m => <option key={m} value={m} className="bg-[#1a0b36]">{m}</option>)}
                         </select>
                         <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                      </div>

                      {/* Period Select */}
                      <div className="relative group">
                         <select 
                            value={derivedPeriod}
                            onChange={(e) => handle12hChange(derivedHour12, derivedMinute, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-3 sm:py-3 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07] text-xs sm:text-sm font-bold text-center h-[38px] sm:h-[46px]"
                         >
                            {PERIODS.map(p => <option key={p} value={p} className="bg-[#1a0b36]">{p}</option>)}
                         </select>
                         <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
                      </div>
                   </div>
                )}
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Alarm Sound</label>
            <div className="flex gap-2 sm:gap-3 items-center">
              <div className="flex-1 relative group">
                <select 
                  value={sound}
                  onChange={(e) => setSound(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-2 sm:px-6 sm:py-3 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.07] text-xs sm:text-sm font-bold h-[38px] sm:h-[46px]"
                >
                  <option value="vibe" className="bg-[#1a0b36]">Vibe</option>
                  <option value="editorial" className="bg-[#1a0b36]">Editorial</option>
                  <option value="guitar" className="bg-[#1a0b36]">Guitar</option>
                  <option value="riser" className="bg-[#1a0b36]">Riser</option>
                  <option value="birds" className="bg-[#1a0b36]">Birds</option>
                  <option value="fun" className="bg-[#1a0b36]">Fun</option>
                  <option value="synthwave" className="bg-[#1a0b36]">Synthwave</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors pointer-events-none" />
              </div>
              <button 
                type="button"
                onClick={handlePreviewSound}
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center h-[38px] w-[38px] sm:h-[46px] sm:w-[46px] shrink-0 ${
                  isPreviewPlaying 
                    ? 'bg-red-500/20 border-red-500/30 text-red-500' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 shadow-inner'
                }`}
              >
                {isPreviewPlaying ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-2"
          >
            {initialData ? "Save Changes" : "Create Alarm"}
          </button>
        </form>
      </div>
    </div>
  )
}
