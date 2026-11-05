'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, ArrowRight, Sparkles, Clock, Shield, RefreshCw } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { 
  SharedTimer, getMyCreatedTimers, getMyJoinedTimers, 
  removeLocalTimerReference, checkAndPruneExpiredTimer 
} from '@/lib/sharedTimerLogic'
import SharedTimerCard from '@/components/tools/SharedTimerCard'
import CreateSharedTimerModal from '@/components/tools/CreateSharedTimerModal'

export default function SharedTimerDashboard() {
  const router = useRouter()
  const [createdTimers, setCreatedTimers] = useState<SharedTimer[]>([])
  const [joinedTimers, setJoinedTimers] = useState<SharedTimer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')

  // Load created and joined timers from localStorage and Firestore
  const loadTimers = useCallback(async () => {
    setIsLoading(true)
    try {
      const createdIds = getMyCreatedTimers()
      const joinedIds = getMyJoinedTimers()

      const fetchTimer = async (id: string): Promise<SharedTimer | null> => {
        try {
          const snap = await getDoc(doc(db, 'sharedTimers', id))
          if (!snap.exists()) {
            removeLocalTimerReference(id)
            return null
          }
          const timer = snap.data() as SharedTimer
          
          // Check if expired > 5 mins
          const pruned = await checkAndPruneExpiredTimer(timer)
          if (pruned) {
            removeLocalTimerReference(id)
            return null
          }

          return timer
        } catch {
          return null
        }
      }

      const [loadedCreated, loadedJoined] = await Promise.all([
        Promise.all(createdIds.map(fetchTimer)),
        Promise.all(joinedIds.filter(id => !createdIds.includes(id)).map(fetchTimer))
      ])

      setCreatedTimers(loadedCreated.filter(Boolean) as SharedTimer[])
      setJoinedTimers(loadedJoined.filter(Boolean) as SharedTimer[])
    } catch (err) {
      console.error('Failed to load shared timers:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTimers()
  }, [loadTimers])

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = joinCode.trim().toLowerCase().replace('#', '')
    if (!clean) return
    if (clean.length < 4) {
      setJoinError('Invalid room code format.')
      return
    }
    router.push(`/shared-timer/?room=${clean}`)
  }

  const handleTimerDeleted = (timerId: string) => {
    setCreatedTimers(prev => prev.filter(t => t.id !== timerId))
    setJoinedTimers(prev => prev.filter(t => t.id !== timerId))
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-white via-white to-primary/5 dark:from-card dark:via-card dark:to-primary/10 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 dark:border-primary/25 text-xs font-black text-primary uppercase tracking-wider">
            <Sparkles size={14} /> Synchronized Global Timers
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Shared Online Timer for Distributed Teams
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-muted leading-relaxed">
            Create high-precision countdown timers and share a live link with teammates, students, or study partners. Everyone counts down together with zero drift, regardless of time zones.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Create Shared Timer</span>
            </button>

            {/* Quick Code Join Input */}
            <form onSubmit={handleJoinWithCode} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter room code..."
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value)
                  setJoinError('')
                }}
                className="w-40 sm:w-48 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary focus:outline-none text-slate-800 dark:text-white text-xs sm:text-sm font-semibold uppercase placeholder:text-slate-400 dark:placeholder:text-white/20"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border border-slate-200/80 dark:border-transparent"
              >
                <span>Join</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
          {joinError && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{joinError}</p>}
        </div>
      </div>

      {/* Active Created Rooms Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">My Active Shared Rooms</h2>
          </div>
          <button
            onClick={loadTimers}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-muted hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold border border-slate-200/80 dark:border-transparent"
            title="Refresh rooms"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-slate-100/70 dark:bg-card/50 border border-slate-200/80 dark:border-white/5 animate-pulse" />
            ))}
          </div>
        ) : createdTimers.length > 0 || joinedTimers.length > 0 ? (
          <div className="space-y-6">
            {createdTimers.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-muted uppercase tracking-wider mb-3">
                  Rooms Hosted by You ({createdTimers.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {createdTimers.map((timer) => (
                    <SharedTimerCard 
                      key={timer.id} 
                      timer={timer} 
                      onDeleted={handleTimerDeleted}
                    />
                  ))}
                </div>
              </div>
            )}

            {joinedTimers.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-muted uppercase tracking-wider mb-3">
                  Rooms You Joined ({joinedTimers.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {joinedTimers.map((timer) => (
                    <SharedTimerCard 
                      key={timer.id} 
                      timer={timer} 
                      onDeleted={handleTimerDeleted}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-card border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-muted mx-auto flex items-center justify-center">
              <Users size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Shared Timers</h3>
              <p className="text-xs text-slate-600 dark:text-muted max-w-md mx-auto">
                You haven&apos;t created or joined any live rooms yet. Start a new shared timer to coordinate sprints, workouts, or classroom activities.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs transition-all shadow-md shadow-primary/20 inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Create First Timer</span>
            </button>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-card border border-slate-200/80 dark:border-white/5 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
            🌐
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Timezone Agnostic</h4>
          <p className="text-xs text-slate-600 dark:text-muted leading-relaxed">
            Countdown target anchors to standardized server timestamps. Everyone finishes at the exact same instant regardless of local clock settings.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-card border border-slate-200/80 dark:border-white/5 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
            ⚡
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Zero Firestore Quota Drain</h4>
          <p className="text-xs text-slate-600 dark:text-muted leading-relaxed">
            Countdown ticks 100% locally on each browser via high-speed animation frames. Firestore is only contacted on state changes.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-card border border-slate-200/80 dark:border-white/5 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base">
            👥
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Mid-Session Joining</h4>
          <p className="text-xs text-slate-600 dark:text-muted leading-relaxed">
            Team members who open the link after the timer has started calculate remaining time automatically and join in seamless sync.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-card border border-slate-200/80 dark:border-white/5 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base">
            🧹
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">5-Min Auto-Purge</h4>
          <p className="text-xs text-slate-600 dark:text-muted leading-relaxed">
            To prevent orphaned database bloat, finished timers and participant records automatically delete themselves 5 minutes after completion.
          </p>
        </div>
      </div>

      {/* Creation Modal */}
      <CreateSharedTimerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
