'use client'
import { useEffect, useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Play, Pause, RotateCcw, Copy, Check, Users, Volume2, VolumeX,
  Trash2, ArrowLeft, Clock, AlertCircle, Sparkles, CheckCircle2,
  Share2, Shield, User
} from 'lucide-react'
import { 
  SharedTimer, Participant, subscribeToSharedTimer, 
  subscribeToParticipants, joinSharedTimer, startSharedTimer, 
  pauseSharedTimer, resumeSharedTimer, resetSharedTimer, 
  deleteSharedTimer, calculateTimerState, checkAndPruneExpiredTimer,
  markSharedTimerCompleted,
  isHostOfTimer, getHostToken, getSessionId, getSavedUserName
} from '@/lib/sharedTimerLogic'
import { cn } from '@/lib/utils'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'

interface SharedTimerRoomProps {
  roomId: string
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

function formatTime(seconds: number): { hours: string; minutes: string; seconds: string; hasHours: boolean } {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
    hasHours: h > 0
  }
}

export default function SharedTimerRoom({ roomId }: SharedTimerRoomProps) {
  const router = useRouter()
  const [timer, setTimer] = useState<SharedTimer | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  
  // Local display state for high-frequency 60fps countdown
  const [displaySeconds, setDisplaySeconds] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [displayStatus, setDisplayStatus] = useState<'waiting' | 'running' | 'paused' | 'completed' | 'expired'>('waiting')
  
  // Guest Join State
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinName, setJoinName] = useState('')
  const [isPending, startTransition] = useTransition()

  // Auto-deletion remaining minutes counter
  const [autoDeleteTimeLeft, setAutoDeleteTimeLeft] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioTriggeredRef = useRef(false)
  const previousSecondsLeftRef = useRef<number | null>(null)
  const sessionId = useRef<string>('')

  // Determine host status
  const hostToken = timer ? getHostToken(timer.id) : null
  const isHost = Boolean(timer && isHostOfTimer(timer.id, timer.hostToken))

  // 1. Initial Setup & Session Init
  useEffect(() => {
    if (typeof window === 'undefined') return
    sessionId.current = getSessionId()
    const saved = getSavedUserName()
    if (saved) setJoinName(saved)
  }, [])

  // 2. Subscribe to Firestore Real-Time Timer & Participants
  useEffect(() => {
    if (!roomId) return
    setLoading(true)

    const unsubTimer = subscribeToSharedTimer(roomId, (remoteTimer) => {
      setLoading(false)
      if (!remoteTimer) {
        setNotFound(true)
        setTimer(null)
        return
      }
      setNotFound(false)
      setTimer(remoteTimer)

      // Check if user has already joined
      const savedName = getSavedUserName()
      const isCreator = isHostOfTimer(remoteTimer.id, remoteTimer.hostToken)
      if (isCreator) {
        // Creator is auto-joined
        setShowJoinModal(false)
      } else if (!savedName) {
        setShowJoinModal(true)
      } else {
        // Auto-join silently if name is remembered
        joinSharedTimer(remoteTimer.id, savedName).catch(() => {})
      }
    }, (err) => {
      console.error('Subscription error:', err)
      setLoading(false)
      setNotFound(true)
    })

    const unsubParts = subscribeToParticipants(roomId, (parts) => {
      setParticipants(parts)
    })

    return () => {
      unsubTimer()
      unsubParts()
    }
  }, [roomId])

  // 3. High-Precision Local Countdown Loop (Zero Firestore reads during countdown!)
  useEffect(() => {
    if (!timer) return

    const storageKey = `shared_timer_rung_${timer.id}`
    const alreadyRung = typeof window !== 'undefined' && sessionStorage.getItem(storageKey) === 'true'

    // If entering a room that is ALREADY completed, or has already rung: do NOT ring again!
    const initialState = calculateTimerState(timer)
    if (initialState.isDone || initialState.displayStatus === 'completed' || alreadyRung) {
      audioTriggeredRef.current = true
    }

    const tick = () => {
      const state = calculateTimerState(timer)
      setDisplaySeconds(state.secondsLeft)
      setProgress(state.progress)
      setDisplayStatus(state.displayStatus)

      // Calculate auto-deletion time left if timer ended
      if (timer.endsAt) {
        const fiveMinMs = 5 * 60 * 1000
        const deleteAt = timer.endsAt + fiveMinMs
        const msUntilDelete = deleteAt - Date.now()
        if (msUntilDelete <= 0) {
          // Trigger cleanup in background
          checkAndPruneExpiredTimer(timer).catch(() => {})
          setDisplayStatus('expired')
        } else {
          setAutoDeleteTimeLeft(Math.max(0, Math.ceil(msUntilDelete / 1000)))
        }
      }

      // Handle Completion Sound Trigger:
      // ONLY trigger if the user was actively present while timer was running (> 0 seconds),
      // and it just reached 0, AND it hasn't rung yet!
      const hasRung = audioTriggeredRef.current || (typeof window !== 'undefined' && sessionStorage.getItem(storageKey) === 'true')
      const wasActivelyRunningInRoom = previousSecondsLeftRef.current !== null && previousSecondsLeftRef.current > 0

      if (state.isDone && state.displayStatus === 'completed' && wasActivelyRunningInRoom && !hasRung) {
        audioTriggeredRef.current = true
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(storageKey, 'true')
        }
        if (!isMuted) {
          playAlertSound(timer.sound)
        }
        // If host, update status to 'completed' in Firestore
        if (isHost && timer.status !== 'completed') {
          markSharedTimerCompleted(timer.id).catch(() => {})
        }
      }

      // Remember current secondsLeft for the next tick
      previousSecondsLeftRef.current = state.secondsLeft

      // Reset trigger if reset back to waiting
      if (timer.status === 'waiting') {
        audioTriggeredRef.current = false
        previousSecondsLeftRef.current = null
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(storageKey)
        }
        stopAlertSound()
      }
    }

    tick()
    const interval = setInterval(tick, 200)
    return () => clearInterval(interval)
  }, [timer, isMuted, isHost])

  // 4. Sound Controls
  const playAlertSound = (soundKey: string) => {
    try {
      const soundFile = SOUNDS[soundKey] || SOUNDS.vibe
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(soundFile)
      audio.loop = true
      audio.volume = 0.85
      audio.play().then(() => {
        setIsPlayingAudio(true)
      }).catch((e) => {
        console.warn('Playback error:', e)
      })
      audioRef.current = audio
    } catch (e) {
      console.warn('Audio play failed:', e)
    }
  }

  const stopAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlayingAudio(false)
  }

  // Pre-warm audio unlock on user click anywhere
  const unlockAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(SOUNDS.vibe)
      audio.volume = 0
      audio.play().then(() => {
        audio.pause()
        audio.currentTime = 0
      }).catch(() => {})
      audioRef.current = audio
    }
  }

  // 5. Host Actions
  const handleStart = async () => {
    if (!timer || !hostToken) return
    unlockAudio()
    await startSharedTimer(timer.id, hostToken)
  }

  const handlePause = async () => {
    if (!timer || !hostToken) return
    await pauseSharedTimer(timer.id, hostToken, displaySeconds)
  }

  const handleResume = async () => {
    if (!timer || !hostToken) return
    await resumeSharedTimer(timer.id, hostToken)
  }

  const handleReset = async () => {
    if (!timer || !hostToken) return
    stopAlertSound()
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`shared_timer_rung_${timer.id}`)
    }
    audioTriggeredRef.current = false
    previousSecondsLeftRef.current = null
    await resetSharedTimer(timer.id, hostToken)
  }

  const handleDelete = async () => {
    if (!timer) return
    if (confirm('Delete this room and discard the timer for all participants?')) {
      stopAlertSound()
      await deleteSharedTimer(timer.id)
      router.push('/shared-timer/')
    }
  }

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!timer) return
    unlockAudio()
    const name = joinName.trim() || 'Guest'
    await joinSharedTimer(timer.id, name)
    setShowJoinModal(false)
  }

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/shared-timer/?room=${roomId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // -------------------------------------------------------------
  // Render: Loading State
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Connecting to Shared Timer...</h2>
        <p className="text-sm text-slate-500 dark:text-muted mt-2">Joining room #{roomId} in real time</p>
      </div>
    )
  }

  // -------------------------------------------------------------
  // Render: Expired or Not Found State
  // -------------------------------------------------------------
  if (notFound || displayStatus === 'expired') {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white dark:bg-card border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-xl dark:shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Timer Expired or Room Not Found</h1>
          <p className="text-sm text-slate-600 dark:text-muted max-w-md mx-auto leading-relaxed">
            {displayStatus === 'expired' 
              ? 'This shared timer finished over 5 minutes ago and has been automatically pruned from Firestore storage to keep the database lean and clean.' 
              : `Room #${roomId} does not exist or was deleted by the host.`}
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shared-timer/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-lg shadow-primary/20"
          >
            Create a New Shared Timer
          </Link>
          <Link
            href="/timer/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-muted hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-colors"
          >
            Open Solo Timer
          </Link>
        </div>
      </div>
    )
  }

  if (!timer) return null

  const formatted = formatTime(displaySeconds)
  const radius = 135
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress * circumference)

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Status Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 bg-white/90 dark:bg-card/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-sm dark:shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/shared-timer/"
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-muted hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            title="Back to All Shared Timers"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-600 dark:text-muted/70 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                Room #{timer.id}
              </span>
              {isHost && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                  <Shield size={10} /> Host
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {timer.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              if (isPlayingAudio) stopAlertSound()
              setIsMuted(!isMuted)
            }}
            className={cn(
              "p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5",
              isMuted 
                ? "bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20" 
                : "bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-muted hover:text-slate-900 dark:hover:text-white"
            )}
            title={isMuted ? "Sound muted" : "Sound enabled"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-800 dark:text-white transition-all flex items-center gap-1.5 border border-slate-200/80 dark:border-white/5"
            title="Copy room invitation link"
          >
            {copied ? <Check size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={14} />}
            <span className="text-[11px] sm:text-xs">{copied ? 'Copied!' : 'Invite'}</span>
          </button>

          {/* Host Delete */}
          {isHost && (
            <button
              onClick={handleDelete}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-rose-500/15 dark:bg-white/5 dark:hover:bg-rose-500/15 text-slate-600 dark:text-muted hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              title="Delete Room"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Completion Alarm Notification Bar (active when ringing) */}
      {isPlayingAudio && (
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/20 via-primary/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xl sm:text-2xl">🔔</span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Time is Up!</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-muted">The timer finished for everyone in this room.</p>
            </div>
          </div>
          <button
            onClick={stopAlertSound}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs sm:text-sm transition-all shadow-lg shrink-0"
          >
            Silence Alarm
          </button>
        </div>
      )}

      {/* Main Countdown Stage */}
      <div className="relative bg-white/95 dark:bg-card/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-xl dark:shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-all duration-700",
            displayStatus === 'running' && "bg-gradient-to-b from-primary/30 to-purple-600/20",
            displayStatus === 'paused' && "bg-gradient-to-b from-amber-500/30 to-orange-500/20",
            displayStatus === 'completed' && "bg-gradient-to-b from-emerald-500/30 to-teal-500/20",
            displayStatus === 'waiting' && "bg-gradient-to-b from-primary/10 to-transparent"
          )}
        />

        {/* Circular Progress Display */}
        <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center my-2 sm:my-4">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 300 300">
            {/* Background Track Circle — clearly visible in both light & dark mode */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              className="text-slate-200 dark:text-white/10"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              className={cn(
                "transition-[stroke-dashoffset] duration-300 ease-linear",
                displayStatus === 'running' && "text-primary",
                displayStatus === 'paused' && "text-amber-500 dark:text-amber-400",
                displayStatus === 'completed' && "text-emerald-500 dark:text-emerald-400",
                displayStatus === 'waiting' && "text-primary/40 dark:text-primary/30"
              )}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Time & Status Center Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5 sm:space-y-1">
            {/* Status Pill */}
            <div className="mb-0.5 sm:mb-1">
              {displayStatus === 'waiting' && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-primary/15 text-primary border border-primary/30">
                  <Clock size={10} /> Lobby Waiting
                </span>
              )}
              {displayStatus === 'running' && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Live Syncing
                </span>
              )}
              {displayStatus === 'paused' && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Pause size={10} /> Paused by Host
                </span>
              )}
              {displayStatus === 'completed' && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 size={11} /> Finished!
                </span>
              )}
            </div>

            {/* Large Digital Digits */}
            <div className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white select-none">
              {formatted.hasHours ? (
                <span>
                  {formatted.hours}:{formatted.minutes}:{formatted.seconds}
                </span>
              ) : (
                <span>
                  {formatted.minutes}:{formatted.seconds}
                </span>
              )}
            </div>

            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-muted uppercase tracking-wider">
              {displayStatus === 'waiting' ? 'Planned Duration' : 'Remaining Time'}
            </p>
          </div>
        </div>

        {/* Room Description / Agenda */}
        {timer.description && (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-muted/90 max-w-lg mb-3 sm:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 font-medium">
            {timer.description}
          </p>
        )}

        {/* Host Controls */}
        {isHost ? (
          <div className="w-full max-w-md pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {displayStatus === 'waiting' && (
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-black text-sm sm:text-lg transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
              >
                <Play size={18} fill="currentColor" />
                <span>START TIMER FOR ALL</span>
              </button>
            )}

            {displayStatus === 'running' && (
              <>
                <button
                  onClick={handlePause}
                  className="px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 sm:gap-2"
                >
                  <Pause size={16} />
                  <span>Pause Timer</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2 border border-slate-200 dark:border-transparent"
                >
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>
              </>
            )}

            {displayStatus === 'paused' && (
              <>
                <button
                  onClick={handleResume}
                  className="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-primary/25 flex items-center gap-1.5 sm:gap-2"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Resume Timer</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2 border border-slate-200 dark:border-transparent"
                >
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>
              </>
            )}

            {displayStatus === 'completed' && (
              <button
                onClick={handleReset}
                className="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-primary/25 flex items-center gap-1.5 sm:gap-2"
              >
                <RotateCcw size={16} />
                <span>Restart Timer</span>
              </button>
            )}
          </div>
        ) : (
          /* Guest Info Message */
          <div className="pt-2">
            {displayStatus === 'waiting' && (
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-muted flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Waiting for the host to start the timer...
              </p>
            )}
            {displayStatus === 'running' && (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-muted/70">
                Synchronized with host across all participant timezones.
              </p>
            )}
            {displayStatus === 'paused' && (
              <p className="text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400/90">
                The host has temporarily paused the countdown.
              </p>
            )}
          </div>
        )}

        {/* 5-Minute Auto-Deletion Notice (Visible after timer ends) */}
        {displayStatus === 'completed' && autoDeleteTimeLeft !== null && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 max-w-md text-[11px] sm:text-xs text-slate-600 dark:text-muted flex items-center gap-2.5 sm:gap-3 text-left">
            <span className="text-base sm:text-lg">🧹</span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Automatic Storage Cleanup</p>
              <p>
                Room deletes automatically in{' '}
                <span className="font-mono font-black text-amber-500 dark:text-amber-400">
                  {Math.floor(autoDeleteTimeLeft / 60)}m {autoDeleteTimeLeft % 60}s
                </span>{' '}
                to conserve server resources.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Participants List Bar */}
      <div className="bg-white/90 dark:bg-card border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm dark:shadow-xl space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
            <h2 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white">
              Connected Participants ({participants.length})
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-muted">Real-time sync</span>
        </div>

        {participants.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-muted italic">Connecting participants...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {participants.map((p) => {
              const isCurrentMe = p.sessionId === sessionId.current
              return (
                <div
                  key={p.sessionId}
                  className={cn(
                    "flex items-center gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all",
                    p.isHost 
                      ? "bg-primary/10 border-primary/30 text-slate-900 dark:text-white" 
                      : "bg-slate-100 dark:bg-white/5 border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-muted hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-[11px] sm:text-xs shrink-0",
                    p.isHost ? "bg-primary text-white" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-muted"
                  )}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">
                      {p.name} {isCurrentMe && <span className="text-[10px] text-primary font-bold">(You)</span>}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-muted/70 capitalize">
                      {p.isHost ? 'Room Host' : 'Participant'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Guest Name Prompt Modal (if not joined yet) */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#1a0b36] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <User size={24} />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Join Shared Timer</h2>
              <p className="text-xs text-slate-500 dark:text-muted">
                Enter your nickname to join #{roomId} and sync with all participants.
              </p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-muted uppercase tracking-wider mb-1.5">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="e.g. Alex, Sarah M., Developer 1"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary focus:outline-none text-slate-900 dark:text-white text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Alarm Ringing Trigger Popup Modal — Centered full-screen popup on mobile & desktop */}
      <AlarmTriggerModal
        isOpen={isPlayingAudio}
        onClose={stopAlertSound}
        label={timer.title || 'Timer Finished!'}
        type="timer"
        timeText="00:00"
      />
    </div>
  )
}
