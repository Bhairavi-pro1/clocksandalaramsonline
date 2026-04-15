'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Clock, Volume2, Square, ChevronDown } from 'lucide-react'
import { SharedAlarm } from '@/lib/sharedAlarmLogic'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

interface SharedAlarmModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string, description: string, alarmDateTime: string, sound: string }) => void
  initialData?: SharedAlarm | null
}

export default function SharedAlarmModal({ isOpen, onClose, onSave, initialData }: SharedAlarmModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sound, setSound] = useState('vibe')
  
  // Default to 1 hour from now
  const defaultDate = new Date(Date.now() + 60 * 60 * 1000)
  
  const [dateStr, setDateStr] = useState(defaultDate.toISOString().split('T')[0])
  
  const hours = String(defaultDate.getHours()).padStart(2, '0')
  const minutes = String(defaultDate.getMinutes()).padStart(2, '0')
  const [timeStr, setTimeStr] = useState(`${hours}:${minutes}`)
  
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

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
       const d = new Date(Date.now() + 60 * 60 * 1000)
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
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-[#110624] border border-white/10 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <Clock className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {initialData ? "Edit Shared Alarm" : "New Shared Alarm"}
            </h2>
            <p className="text-sm text-white/50 font-medium">Configure time and details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Title</label>
            <input 
               autoFocus
               required
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Morning Meeting"
               className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Description (Optional)</label>
            <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Don't forget to join the Zoom call..."
               className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium resize-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Date</label>
               <input 
                  required
                  type="date"
                  value={dateStr}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium [color-scheme:dark]"
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Time</label>
               <input 
                  required
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium [color-scheme:dark]"
               />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Alarm Sound</label>
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <select 
                  value={sound}
                  onChange={(e) => setSound(e.target.value)}
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
            className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white py-4 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-2"
          >
            {initialData ? "Save Changes" : "Create Alarm"}
          </button>
        </form>
      </div>
    </div>
  )
}
