'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Alarm {
  id: string
  time: string // HH:mm
  label: string
  isActive: boolean
  sound: string
  days: number[] // 0-6 for Sunday-Saturday
}

export interface Countdown {
  id: string
  label: string
  seconds: number
  sound: string
  isActive?: boolean
  isPaused?: boolean
  timeLeft?: number
  endTime?: number | null
  isRinging?: boolean
}

interface AppState {
  alarms: Alarm[]
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void
  removeAlarm: (id: string) => void
  toggleAlarm: (id: string) => void
  updateAlarm: (id: string, updates: Partial<Alarm>) => void
  
  // Countdowns State
  countdowns: Countdown[]
  addCountdown: (countdown: Omit<Countdown, 'id'>) => void
  removeCountdown: (id: string) => void
  updateCountdown: (id: string, updates: Partial<Countdown>) => void

  // Ringing states
  activeAlarmId: string | null
  setRingingAlarmId: (id: string | null) => void

  // Preferences
  is24Hour: boolean
  toggleTimeFormat: () => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      alarms: [],
      addAlarm: (alarm) => set((state) => {
        const existingIndex = state.alarms.findIndex((a) => a.time === alarm.time)
        if (existingIndex !== -1) {
          // If alarm for this time already exists, ensure it is active without creating a duplicate card
          const updated = [...state.alarms]
          updated[existingIndex] = {
            ...updated[existingIndex],
            isActive: true,
            label: alarm.label || updated[existingIndex].label
          }
          return { alarms: updated }
        }
        return { 
          alarms: [...state.alarms, { ...alarm, id: Math.random().toString(36).substring(7) }] 
        }
      }),
      removeAlarm: (id) => set((state) => ({ 
        alarms: state.alarms.filter((a) => a.id !== id) 
      })),
      toggleAlarm: (id) => set((state) => ({
        alarms: state.alarms.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a)
      })),
      updateAlarm: (id, updates) => set((state) => ({
        alarms: state.alarms.map((a) => a.id === id ? { ...a, ...updates } : a)
      })),

      countdowns: [],
      addCountdown: (countdown) => set((state) => ({
        countdowns: [...state.countdowns, { 
          ...countdown, 
          id: Math.random().toString(36).substring(7),
          isActive: false,
          isPaused: false,
          timeLeft: countdown.seconds,
          endTime: null,
          isRinging: false
        }]
      })),
      removeCountdown: (id) => set((state) => ({
        countdowns: state.countdowns.filter((c) => c.id !== id)
      })),
      updateCountdown: (id, updates) => set((state) => {
        const exists = state.countdowns.some((c) => c.id === id)
        if (!exists) {
          const newCountdown: Countdown = {
            id,
            label: updates.label || 'Timer',
            seconds: updates.seconds || updates.timeLeft || 0,
            sound: updates.sound || 'vibe',
            isActive: updates.isActive ?? false,
            isPaused: updates.isPaused ?? false,
            timeLeft: updates.timeLeft ?? updates.seconds ?? 0,
            endTime: updates.endTime ?? null,
            isRinging: updates.isRinging ?? false,
            ...updates
          }
          return { countdowns: [...state.countdowns, newCountdown] }
        }
        return {
          countdowns: state.countdowns.map((c) => c.id === id ? { ...c, ...updates } : c)
        }
      }),

      activeAlarmId: null,
      setRingingAlarmId: (id) => set(() => ({ activeAlarmId: id })),

      is24Hour: false,
      toggleTimeFormat: () => set((state) => ({ is24Hour: !state.is24Hour })),
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
          if (nextTheme === 'light') {
            document.documentElement.classList.remove('dark');
          } else {
            document.documentElement.classList.add('dark');
          }
        }
        return { theme: nextTheme };
      }),
      setTheme: (theme) => set(() => {
        if (typeof window !== 'undefined') {
          if (theme === 'light') {
            document.documentElement.classList.remove('dark');
          } else {
            document.documentElement.classList.add('dark');
          }
        }
        return { theme };
      }),
    }),
    {
      name: 'clocks-and-alarms-storage',
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.alarms)) {
          const seen = new Set<string>()
          state.alarms = state.alarms.filter((a) => {
            if (seen.has(a.time)) return false
            seen.add(a.time)
            return true
          })
        }
      }
    }
  )
)
