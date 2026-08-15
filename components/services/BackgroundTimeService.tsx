'use client'
import { useEffect, useRef, useState } from 'react'
import { useStore, Alarm, Countdown } from '@/hooks/useStore'
import { db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { getMyCreatedAlarms, getMyReceivedAlarms, deleteSharedAlarm, SharedAlarm } from '@/lib/sharedAlarmLogic'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

export default function BackgroundTimeService() {
  const { 
    alarms, 
    countdowns, 
    updateCountdown,
    activeAlarmId, 
    setRingingAlarmId,
    ringingSharedAlarm,
    setRingingSharedAlarm
  } = useStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [activeSharedAlarms, setActiveSharedAlarms] = useState<SharedAlarm[]>([])
  
  // Track Firestore snapshot unsubs
  const unsubsRef = useRef<Record<string, () => void>>({})

  // Track already rung shared alarm IDs to prevent repeated triggers
  const rungSharedAlarmsRef = useRef<Set<string>>(new Set())

  // 1. Sync Shared Alarm Documents from Firestore
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadAndListenSharedAlarms = () => {
      const createdIds = getMyCreatedAlarms()
      const receivedIds = getMyReceivedAlarms()
      const allIds = Array.from(new Set([...createdIds, ...receivedIds]))

      // Remove unsubs that are no longer needed
      Object.keys(unsubsRef.current).forEach((id) => {
        if (!allIds.includes(id)) {
          unsubsRef.current[id]()
          delete unsubsRef.current[id]
          setActiveSharedAlarms((prev) => prev.filter((a) => a.alarmId !== id))
        }
      })

      // Attach new listeners
      allIds.forEach((id) => {
        if (unsubsRef.current[id]) return // Already listening

        const docRef = doc(db, 'sharedAlarms', id)
        const unsub = onSnapshot(
          docRef,
          (snap) => {
            if (!snap.exists()) {
              // Doc deleted on firestore
              setActiveSharedAlarms((prev) => prev.filter((a) => a.alarmId !== id))
              // Remove from local storage
              const created = getMyCreatedAlarms().filter((cId) => cId !== id)
              localStorage.setItem('myCreatedAlarms', JSON.stringify(created))
              const received = getMyReceivedAlarms().filter((rId) => rId !== id)
              localStorage.setItem('myReceivedAlarms', JSON.stringify(received))
            } else {
              const data = snap.data() as SharedAlarm
              setActiveSharedAlarms((prev) => {
                const filtered = prev.filter((a) => a.alarmId !== id)
                return [...filtered, data]
              })
            }
          },
          (err) => {
            console.warn(`Could not sync shared alarm ${id} in background:`, err.message)
          }
        )
        unsubsRef.current[id] = unsub
      })
    }

    loadAndListenSharedAlarms()

    // Periodically re-check active storage IDs (every 5 seconds)
    const interval = setInterval(loadAndListenSharedAlarms, 5000)

    return () => {
      clearInterval(interval)
      // Clean up all active listeners on service unmount
      Object.values(unsubsRef.current).forEach((unsub) => unsub())
      unsubsRef.current = {}
    }
  }, [])

  // 2. Play / Stop Ringing Audio globally
  useEffect(() => {
    // Determine if anything is ringing
    const ringingTimer = countdowns.find((c) => c.isRinging)
    
    const isRinging = !!activeAlarmId || !!ringingTimer || !!ringingSharedAlarm
    let targetSound = 'vibe'

    if (activeAlarmId) {
      const activeAlarm = alarms.find((a) => a.id === activeAlarmId)
      if (activeAlarm) targetSound = activeAlarm.sound
    } else if (ringingTimer) {
      targetSound = ringingTimer.sound
    } else if (ringingSharedAlarm) {
      targetSound = ringingSharedAlarm.sound
    }

    if (isRinging) {
      // If audio already playing and matches sound, do nothing
      if (audioRef.current && audioRef.current.src.includes(SOUNDS[targetSound])) {
        return
      }

      // Stop previous
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Play new sound loop
      const audio = new Audio(SOUNDS[targetSound] || SOUNDS.vibe)
      audio.loop = true
      audio.volume = 0.8
      audio.play().catch((e) => console.warn('Background audio playback blocked:', e))
      audioRef.current = audio
    } else {
      // Clear audio when nothing is ringing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
    }
  }, [activeAlarmId, countdowns, ringingSharedAlarm, alarms])

  // 3. Central Tick Loop: Runs every second
  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date()
      const nowMs = now.getTime()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const currentDay = now.getDay()
      const currentSeconds = now.getSeconds()

      // A. Check local alarms (at start of the minute)
      if (currentSeconds === 0) {
        alarms.forEach((alarm) => {
          if (alarm.isActive && alarm.time === currentTime) {
            if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
              setRingingAlarmId(alarm.id)
              sendPushNotification('⏰ Alarm!', alarm.label || `Your ${alarm.time} alarm is ringing.`)
            }
          }
        })
      }

      // B. Check active local countdown timers
      countdowns.forEach((c) => {
        if (c.isActive && !c.isPaused && c.endTime) {
          const remaining = Math.max(0, Math.ceil((c.endTime - nowMs) / 1000))
          if (remaining !== c.timeLeft) {
            updateCountdown(c.id, { timeLeft: remaining })
          }

          if (remaining <= 0) {
            updateCountdown(c.id, { isActive: false, isRinging: true, timeLeft: 0, endTime: null })
            sendPushNotification('⌛ Time Up!', c.label || 'Your timer has finished.')
          }
        }
      })

      // C. Check active shared alarms
      activeSharedAlarms.forEach((sa) => {
        if (sa.isActive) {
          const alarmTime = new Date(sa.alarmDateTime).getTime()
          
          if (nowMs >= alarmTime) {
            // Trigger ring if expiration is recent (within 60 seconds) and not rung yet
            if (nowMs - alarmTime < 60000 && !ringingSharedAlarm && !rungSharedAlarmsRef.current.has(sa.alarmId)) {
              rungSharedAlarmsRef.current.add(sa.alarmId)
              setRingingSharedAlarm(sa)
              sendPushNotification('⏰ Shared Alarm!', sa.title || 'A shared group alarm is ringing.')
            }

            // Expiration clean up
            const isCreator = sa.createdBy === localStorage.getItem('clocks-and-alarms-session-id')
            if (isCreator) {
              deleteSharedAlarm(sa.alarmId)
            } else {
              // Receiver: remove from local storage
              const received = getMyReceivedAlarms().filter((id) => id !== sa.alarmId)
              localStorage.setItem('myReceivedAlarms', JSON.stringify(received))
            }
          }
        }
      })
    }

    const interval = setInterval(checkExpiration, 1000)

    return () => clearInterval(interval)
  }, [alarms, countdowns, activeSharedAlarms, ringingSharedAlarm, updateCountdown, setRingingAlarmId, setRingingSharedAlarm])

  // 4. Tab Visibility Synchronization (re-check time gaps when returning to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const nowMs = Date.now()
        
        // Resync timers in case background tabs throttled JavaScript intervals
        countdowns.forEach((c) => {
          if (c.isActive && !c.isPaused && c.endTime) {
            const remaining = Math.max(0, Math.ceil((c.endTime - nowMs) / 1000))
            updateCountdown(c.id, { timeLeft: remaining })

            if (remaining <= 0) {
              updateCountdown(c.id, { isActive: false, isRinging: true, timeLeft: 0, endTime: null })
              sendPushNotification('⌛ Time Up!', c.label || 'Your timer has finished.')
            }
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [countdowns, updateCountdown])

  return null
}

// Push notification helper
function sendPushNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icons/icon-192.png',
      })
    }
  }
}
