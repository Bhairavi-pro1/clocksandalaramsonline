'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Play, Clock, Volume2, Square, ChevronDown } from 'lucide-react'
import { createSharedTimer } from '@/lib/sharedTimerLogic'
import { useRouter } from 'next/navigation'

interface CreateSharedTimerModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: (timerId: string) => void
}

const PRESET_DURATIONS = [
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '15m', seconds: 900 },
  { label: '25m', seconds: 1500 },
  { label: '30m', seconds: 1800 },
  { label: '45m', seconds: 2700 },
  { label: '60m', seconds: 3600 },
]

const SOUND_OPTIONS = [
  { id: 'vibe', name: 'Digital Vibe' },
  { id: 'editorial', name: 'Editorial Tone' },
  { id: 'guitar', name: 'Acoustic Guitar' },
  { id: 'riser', name: 'Riser Alert' },
  { id: 'birds', name: 'Morning Birds' },
  { id: 'fun', name: 'Fun Bell' },
  { id: 'synthwave', name: 'Synthwave' },
]

const SOUND_FILES: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

export default function CreateSharedTimerModal({
  isOpen,
  onClose,
  onCreated
}: CreateSharedTimerModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState('Team Sprint')
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('15')
  const [seconds, setSeconds] = useState('0')
  const [sound, setSound] = useState('vibe')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup audio preview when modal closes
  const handleStopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current.currentTime = 0
      previewAudioRef.current = null
    }
    setIsPreviewPlaying(false)
  }

  useEffect(() => {
    if (!isOpen) {
      handleStopPreview()
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      handleStopPreview()
    }
  }, [])

  if (!isOpen) return null

  const handleSelectPreset = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    setHours(h.toString())
    setMinutes(m.toString())
    setSeconds(s.toString())
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

    const soundUrl = SOUND_FILES[sound] || SOUND_FILES.vibe
    const audio = new Audio(soundUrl)
    audio.volume = 0.8
    audio.onended = () => setIsPreviewPlaying(false)
    
    audio.play().then(() => {
      setIsPreviewPlaying(true)
    }).catch((e) => {
      console.warn('Audio preview blocked:', e)
      setIsPreviewPlaying(false)
    })
    
    previewAudioRef.current = audio
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handleStopPreview()
    
    const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0)
    if (totalSeconds <= 0) return

    setIsSubmitting(true)
    try {
      const { timerId } = await createSharedTimer(
        title.trim() || 'Shared Timer',
        totalSeconds,
        sound,
        description.trim()
      )

      if (onCreated) {
        onCreated(timerId)
      } else {
        router.push(`/shared-timer/?room=${timerId}`)
      }
      onClose()
    } catch (err) {
      console.error('Failed to create shared timer:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentTotalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-background/80 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={() => {
          handleStopPreview()
          onClose()
        }}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a0b36] border border-slate-200 dark:border-violet-500/20 p-5 sm:p-6 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-white/5 border border-primary/30 text-primary">
                  <Clock size={20} />
                </span>
                Create Shared Timer
              </h2>
              <p className="text-slate-500 dark:text-white/50 text-xs mt-1 ml-[2.6rem] font-medium">
                Synchronized across all participants worldwide
              </p>
            </div>
            <button 
              onClick={() => {
                handleStopPreview()
                onClose()
              }}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-white/40 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Timer Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 block">
                Timer Name
              </label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 15m Team Sprint, Pomodoro"
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-white/20 font-medium"
              />
            </div>

            {/* Quick Duration Presets */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 block">
                Quick Presets
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {PRESET_DURATIONS.map((preset) => {
                  const isSelected = currentTotalSeconds === preset.seconds
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSelectPreset(preset.seconds)}
                      className={`py-1.5 px-0.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        isSelected 
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30' 
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Duration Inputs */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 block">
                Duration
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 ml-1 text-center block">
                    Hours
                  </span>
                  <input 
                    type="number" 
                    min="0"
                    max="99"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-11 text-lg font-bold text-center text-slate-800 dark:text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 ml-1 text-center block">
                    Minutes
                  </span>
                  <input 
                    type="number" 
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-11 text-lg font-bold text-center text-slate-800 dark:text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 ml-1 text-center block">
                    Seconds
                  </span>
                  <input 
                    type="number" 
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-11 text-lg font-bold text-center text-slate-800 dark:text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Completion Sound with Test Audio Play/Stop Button */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 block">
                Completion Sound
              </label>
              <div className="flex gap-2.5 items-center">
                <div className="flex-1 relative group">
                  <select 
                    value={sound}
                    onChange={(e) => {
                      handleStopPreview()
                      setSound(e.target.value)
                    }}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all hover:bg-slate-200/50 dark:hover:bg-white/[0.07] text-xs sm:text-sm font-bold"
                  >
                    {SOUND_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 group-hover:text-primary transition-colors pointer-events-none" />
                </div>

                {/* Play / Stop Test Audio Button */}
                <button 
                  type="button"
                  onClick={handlePreviewSound}
                  className={`px-3 py-2.5 rounded-2xl border transition-all flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 ${
                    isPreviewPlaying 
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20' 
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 shadow-inner'
                  }`}
                  title={isPreviewPlaying ? 'Stop preview audio' : 'Test play preview audio'}
                >
                  {isPreviewPlaying ? (
                    <>
                      <Square size={13} fill="currentColor" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <span>Test Audio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Optional Agenda / Room Notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 ml-1 block">
                Agenda / Notes <span className="text-[10px] lowercase text-slate-400 dark:text-white/30 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Discuss deliverables, then Q&A"
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] text-white py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Play size={16} fill="currentColor" />
                {isSubmitting ? 'Creating Room...' : 'CREATE & OPEN ROOM'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
