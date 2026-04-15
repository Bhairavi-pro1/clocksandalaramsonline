import { useEffect, useRef, useState } from 'react'
import { useStore, Alarm } from './useStore'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

export function useAlarm() {
  const { alarms, toggleAlarm } = useStore()
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const currentDay = now.getDay()
      const currentSeconds = now.getSeconds()

      if (currentSeconds !== 0) return // Only trigger at the start of a minute

      alarms.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime) {
          // Check if it's a specific day or every day
          if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
            triggerAlarm(alarm)
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [alarms])

  const triggerAlarm = (alarm: Alarm) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audio = new Audio(SOUNDS[alarm.sound] || SOUNDS.vibe)
    audio.loop = true
    audio.volume = 0.8
    audio.play().catch(e => console.error('Alarm audio blocked:', e))
    audioRef.current = audio

    setActiveAlarmId(alarm.id)

    if (Notification.permission === 'granted') {
      new Notification('⏰ Alarm!', { 
        body: alarm.label || `Your ${alarm.time} alarm is ringing.`,
        icon: '/icons/icon-192.png'
      })
    }
  }

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setActiveAlarmId(null)
  }

  return { activeAlarmId, stopAlarm, triggerAlarm }
}
