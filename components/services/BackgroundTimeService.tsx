'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
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

  // Track already rung alarm keys to prevent repeated triggers in the same minute
  const rungAlarmsRef = useRef<Set<string>>(new Set())
  const rungSharedAlarmsRef = useRef<Set<string>>(new Set())

  // 1. Audio Pre-warming & Notification Permission on First Interaction
  useEffect(() => {
    if (typeof window === 'undefined') return

    const unlockAudioAndNotify = () => {
      // Pre-warm audio element with user gesture so background playback is never blocked
      if (!audioRef.current) {
        const audio = new Audio(SOUNDS.vibe)
        audio.volume = 0
        audio.play().then(() => {
          audio.pause()
          audio.currentTime = 0
          audio.volume = 0.8
        }).catch(() => {})
        audioRef.current = audio
      }

      // Request browser notification permission for native OS popups across any app
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {})
      }
    }

    window.addEventListener('click', unlockAudioAndNotify, { once: true })
    window.addEventListener('keydown', unlockAudioAndNotify, { once: true })
    window.addEventListener('touchstart', unlockAudioAndNotify, { once: true })

    return () => {
      window.removeEventListener('click', unlockAudioAndNotify)
      window.removeEventListener('keydown', unlockAudioAndNotify)
      window.removeEventListener('touchstart', unlockAudioAndNotify)
    }
  }, [])

  // 2. Sync Shared Alarm Documents from Firestore
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
              setActiveSharedAlarms((prev) => prev.filter((a) => a.alarmId !== id))
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
    const interval = setInterval(loadAndListenSharedAlarms, 5000)

    return () => {
      clearInterval(interval)
      Object.values(unsubsRef.current).forEach((unsub) => unsub())
      unsubsRef.current = {}
    }
  }, [])

  // 3. Play / Stop Ringing Audio globally
  useEffect(() => {
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

    const soundUrl = SOUNDS[targetSound] || SOUNDS.vibe

    if (isRinging) {
      // If already playing the correct sound, keep looping
      if (audioRef.current && audioRef.current.src.includes(soundUrl) && !audioRef.current.paused) {
        return
      }

      // Stop previous audio if running
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Play new sound loop
      const audio = audioRef.current || new Audio(soundUrl)
      audio.src = soundUrl
      audio.loop = true
      audio.volume = 0.9
      audio.play().catch((e) => console.warn('Background audio playback blocked:', e))
      audioRef.current = audio
    } else {
      // Clear audio when nothing is ringing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [activeAlarmId, countdowns, ringingSharedAlarm, alarms])

  // 4. Core Expiration Check Callback
  const checkExpiration = useCallback(() => {
    const now = new Date()
    const nowMs = now.getTime()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const currentDay = now.getDay()
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

    // A. Check local alarms (Trigger reliably on ANY tick during the target minute)
    alarms.forEach((alarm) => {
      if (alarm.isActive && alarm.time === currentTime) {
        const triggerKey = `${alarm.id}-${dateKey}-${currentTime}`
        if (!rungAlarmsRef.current.has(triggerKey)) {
          if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
            rungAlarmsRef.current.add(triggerKey)
            setRingingAlarmId(alarm.id)
            sendPushNotification('⏰ Alarm Ringing!', alarm.label || `Your ${alarm.time} alarm is ringing.`)
          }
        }
      }
    })

    // Clean up old alarm trigger keys once the minute has passed
    if (rungAlarmsRef.current.size > 50) {
      rungAlarmsRef.current.clear()
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
        const timeSinceAlarm = nowMs - alarmTime
        
        if (nowMs >= alarmTime) {
          if (timeSinceAlarm < 300000 && !ringingSharedAlarm && !rungSharedAlarmsRef.current.has(sa.alarmId)) {
            rungSharedAlarmsRef.current.add(sa.alarmId)
            setRingingSharedAlarm(sa)
            sendPushNotification('⏰ Shared Alarm!', sa.title || 'A shared group alarm is ringing.')
          }

          if (timeSinceAlarm >= 300000) {
            const currentSessionId = localStorage.getItem('caoSessionId')
            const isCreator = sa.createdBy === currentSessionId
            if (isCreator) {
              deleteSharedAlarm(sa.alarmId)
            } else {
              const received = getMyReceivedAlarms().filter((id) => id !== sa.alarmId)
              localStorage.setItem('myReceivedAlarms', JSON.stringify(received))
            }
          }
        }
      }
    })
  }, [alarms, countdowns, activeSharedAlarms, ringingSharedAlarm, updateCountdown, setRingingAlarmId, setRingingSharedAlarm])

  // 5. Central Background-Resistant Tick Engine (Web Worker + Interval Fallback)
  useEffect(() => {
    let worker: Worker | null = null
    let fallbackInterval: NodeJS.Timeout | null = null

    // Try creating a Web Worker: Web Workers run on a background OS thread and are NOT throttled by browsers when tabs are inactive
    try {
      const blob = new Blob([`
        let timer = null;
        self.onmessage = function(e) {
          if (e.data === 'START') {
            if (!timer) {
              timer = setInterval(function() {
                self.postMessage('TICK');
              }, 1000);
            }
          } else if (e.data === 'STOP') {
            if (timer) {
              clearInterval(timer);
              timer = null;
            }
          }
        };
      `], { type: 'application/javascript' })

      const workerUrl = URL.createObjectURL(blob)
      worker = new Worker(workerUrl)
      worker.onmessage = (e) => {
        if (e.data === 'TICK') {
          checkExpiration()
        }
      }
      worker.postMessage('START')
    } catch {
      // Fallback to standard interval if Web Workers are restricted by browser security policies
      fallbackInterval = setInterval(checkExpiration, 1000)
    }

    return () => {
      if (worker) {
        worker.postMessage('STOP')
        worker.terminate()
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval)
      }
    }
  }, [checkExpiration])

  // 6. Tab Visibility Resynchronization (Catches up immediately upon returning to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkExpiration()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkExpiration])

  return null
}

// Native Desktop Push Notification with Click-to-Focus
function sendPushNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/icon.png',
          tag: 'cao-alarm-alert',
          requireInteraction: true, // Keeps notification visible on Windows/Mac until dismissed or clicked
        })
        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      } catch (e) {
        console.warn('Native notification display error:', e)
      }
    }
  }
}
