'use client'
import { useState, useEffect } from 'react'
import { Clock, Play, Pause, CheckCircle2, Copy, Check, Trash2, ArrowRight, Users, ShieldAlert } from 'lucide-react'
import { 
  SharedTimer, deleteSharedTimer, isHostOfTimer, 
  calculateTimerState, markSharedTimerCompleted, checkAndPruneExpiredTimer 
} from '@/lib/sharedTimerLogic'
import Link from 'next/link'

interface SharedTimerCardProps {
  timer: SharedTimer
  onDeleted?: (timerId: string) => void
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}h ${m > 0 ? `${m}m` : ''} ${s > 0 ? `${s}s` : ''}`.trim()
  }
  if (m > 0) {
    return `${m}m ${s > 0 ? `${s}s` : ''}`.trim()
  }
  return `${s}s`
}

export default function SharedTimerCard({ timer, onDeleted }: SharedTimerCardProps) {
  const [copied, setCopied] = useState(false)
  const [, setTick] = useState(0)
  const isHost = isHostOfTimer(timer.id, timer.hostToken)

  // 1-second tick loop so status badges & countdowns update live on the dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const timerState = calculateTimerState(timer)

  // Auto-mark completed in Firestore once endsAt is reached
  useEffect(() => {
    if (timerState.isDone && timer.status === 'running') {
      markSharedTimerCompleted(timer.id).catch(() => {})
    }
    if (timerState.displayStatus === 'expired') {
      checkAndPruneExpiredTimer(timer).then((pruned) => {
        if (pruned && onDeleted) {
          onDeleted(timer.id)
        }
      }).catch(() => {})
    }
  }, [timerState.isDone, timerState.displayStatus, timer, onDeleted])

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/shared-timer/?room=${timer.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`Delete shared timer "${timer.title}"?`)) {
      await deleteSharedTimer(timer.id)
      if (onDeleted) onDeleted(timer.id)
    }
  }

  const getStatusBadge = () => {
    const timerState = calculateTimerState(timer)
    switch (timerState.displayStatus) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Running
          </span>
        )
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Pause size={10} /> Paused
          </span>
        )
      case 'completed':
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <CheckCircle2 size={11} /> Finished
          </span>
        )
      case 'waiting':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-primary/15 text-primary border border-primary/30">
            <Clock size={10} /> In Lobby
          </span>
        )
    }
  }

  return (
    <div className="group relative bg-white dark:bg-card border border-slate-200/80 dark:border-white/10 hover:border-primary/40 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-primary/10 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted/70 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                #{timer.id}
              </span>
              {isHost && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Host
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">{timer.title}</h3>
          </div>
          {getStatusBadge()}
        </div>

        {timer.description && (
          <p className="text-xs text-slate-600 dark:text-muted/80 line-clamp-2 mb-3 font-medium">
            {timer.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-muted mb-5 font-semibold">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            <span>{formatDuration(timer.durationSeconds)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="capitalize">{timer.sound} tone</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-muted hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            title="Copy room link"
          >
            {copied ? <Check size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={14} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
          
          {isHost && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-500/15 dark:bg-white/5 dark:hover:bg-rose-500/10 text-slate-600 dark:text-muted hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              title="Delete room"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <Link
          href={`/shared-timer/?room=${timer.id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-black transition-all hover:scale-105 shadow-md shadow-primary/20"
        >
          <span>Enter Room</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
