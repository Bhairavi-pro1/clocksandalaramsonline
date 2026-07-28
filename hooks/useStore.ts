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
      addAlarm: (alarm) => set((state) => ({ 
        alarms: [...state.alarms, { ...alarm, id: Math.random().toString(36).substring(7) }] 
      })),
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
        countdowns: [...state.countdowns, { ...countdown, id: Math.random().toString(36).substring(7) }]
      })),
      removeCountdown: (id) => set((state) => ({
        countdowns: state.countdowns.filter((c) => c.id !== id)
      })),

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
    }
  )
)
