'use client'

export const SHARED_TIMER_SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

// Global AudioContext and In-Memory Buffer Cache
let audioCtx: AudioContext | null = null
const bufferCache: Map<string, AudioBuffer> = new Map()
let activeSourceNode: AudioBufferSourceNode | null = null
let keepAliveOscillator: OscillatorNode | null = null
let keepAliveGain: GainNode | null = null
let fallbackAudioEl: HTMLAudioElement | null = null
let isCurrentlyRinging = false

// Browser Tab Title Flashing Alert Reference
let titleInterval: NodeJS.Timeout | null = null
let originalTitle: string = ''

/**
 * Pre-fetches and decodes ALL available shared timer sound presets into RAM.
 * Ensures that no matter which sound is assigned to a room, the audio buffer
 * is instantly ready for background playback without asynchronous fetch rejection.
 */
export function preloadAllSharedTimerSounds() {
  if (typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  } catch {}

  if (!audioCtx) return

  Object.entries(SHARED_TIMER_SOUNDS).forEach(([key, url]) => {
    if (!bufferCache.has(key)) {
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => audioCtx!.decodeAudioData(arrayBuffer))
        .then((decoded) => {
          bufferCache.set(key, decoded)
        })
        .catch(() => {})
    }
  })
}

/**
 * Checks whether audio context has been successfully unlocked by user gesture.
 */
export function isAudioUnlocked(): boolean {
  return !!audioCtx && audioCtx.state === 'running'
}

/**
 * Initialize and unlock Web Audio API Context and HTML5 Audio element on user gesture.
 * Pre-fetches and decodes the requested sound into memory so it can ring instantly in the background.
 */
export function unlockAndPreloadSharedTimerAudio(soundKey: string = 'vibe') {
  if (typeof window === 'undefined') return

  // 1. Initialize & resume AudioContext
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
  } catch (e) {
    console.warn('AudioContext initialization failed:', e)
  }

  // 2. Pre-fetch and decode the specific sound into RAM
  const soundUrl = SHARED_TIMER_SOUNDS[soundKey] || SHARED_TIMER_SOUNDS.vibe
  if (audioCtx && !bufferCache.has(soundKey)) {
    fetch(soundUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => audioCtx!.decodeAudioData(arrayBuffer))
      .then((decoded) => {
        bufferCache.set(soundKey, decoded)
        // Once primary sound is loaded, preload the rest
        preloadAllSharedTimerSounds()
      })
      .catch((e) => {
        console.warn(`Failed to preload audio buffer for ${soundKey}:`, e)
      })
  } else {
    preloadAllSharedTimerSounds()
  }

  // 3. Pre-warm HTML5 Audio fallback element
  try {
    if (!fallbackAudioEl) {
      fallbackAudioEl = new Audio(soundUrl)
      fallbackAudioEl.preload = 'auto'
      fallbackAudioEl.volume = 0
      fallbackAudioEl.play().then(() => {
        fallbackAudioEl?.pause()
        if (fallbackAudioEl) {
          fallbackAudioEl.currentTime = 0
          fallbackAudioEl.volume = 0.95
        }
      }).catch(() => {})
    } else if (!fallbackAudioEl.src.includes(soundUrl)) {
      fallbackAudioEl.src = soundUrl
      fallbackAudioEl.load()
    }
  } catch (e) {
    console.warn('HTML5 Audio preload error:', e)
  }

  // 4. Request OS desktop notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {})
  }
}

/**
 * Starts an inaudible audio keep-alive carrier while a shared timer is running.
 * This instructs Chromium and Windows to classify the tab as an Active Media Tab,
 * preventing timer freezing and background audio lockout when the window is minimized or tab is switched.
 */
export function startAudioKeepAlive() {
  if (typeof window === 'undefined') return
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) audioCtx = new AudioContextClass()
    }

    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {})
      }

      if (!keepAliveOscillator) {
        // Frequency of 40Hz at 0.00001 gain: inaudible, but maintains an active audio hardware stream
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.frequency.value = 40
        gain.gain.value = 0.00001
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start()
        keepAliveOscillator = osc
        keepAliveGain = gain
      }
    }
  } catch (e) {
    console.warn('Audio keep-alive startup error:', e)
  }
}

/**
 * Stops the silent keep-alive carrier.
 */
export function stopAudioKeepAlive() {
  if (keepAliveOscillator) {
    try {
      keepAliveOscillator.stop()
      keepAliveOscillator.disconnect()
    } catch {}
    keepAliveOscillator = null
  }
  if (keepAliveGain) {
    try {
      keepAliveGain.disconnect()
    } catch {}
    keepAliveGain = null
  }
}

/**
 * Plays the alarm sound continuously using Web Audio API buffer (with HTML5 Audio fallback).
 * Works reliably even when the tab has been minimized or inactive for hours.
 */
export function playSharedTimerAlarm(soundKey: string = 'vibe') {
  if (typeof window === 'undefined') return
  if (isCurrentlyRinging) return
  isCurrentlyRinging = true

  const soundUrl = SHARED_TIMER_SOUNDS[soundKey] || SHARED_TIMER_SOUNDS.vibe
  let webAudioStarted = false

  // 1. Play via Web Audio API Buffer (bypasses HTMLMediaElement background autoplay block)
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) audioCtx = new AudioContextClass()
    }

    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {})
      }

      const cachedBuffer = bufferCache.get(soundKey)
      if (cachedBuffer) {
        const source = audioCtx.createBufferSource()
        source.buffer = cachedBuffer
        source.loop = true
        const gain = audioCtx.createGain()
        gain.gain.value = 0.95
        source.connect(gain)
        gain.connect(audioCtx.destination)
        source.start(0)
        activeSourceNode = source
        webAudioStarted = true
      } else {
        // Fetch and decode immediately if not yet in cache
        fetch(soundUrl)
          .then((res) => res.arrayBuffer())
          .then((buf) => audioCtx!.decodeAudioData(buf))
          .then((decoded) => {
            bufferCache.set(soundKey, decoded)
            if (isCurrentlyRinging && !activeSourceNode) {
              const source = audioCtx!.createBufferSource()
              source.buffer = decoded
              source.loop = true
              const gain = audioCtx!.createGain()
              gain.gain.value = 0.95
              source.connect(gain)
              gain.connect(audioCtx!.destination)
              source.start(0)
              activeSourceNode = source
            }
          })
          .catch(() => {})
      }
    }
  } catch (e) {
    console.warn('Web Audio alarm playback failed:', e)
  }

  // 2. Play via HTML5 Audio fallback simultaneously
  try {
    if (!fallbackAudioEl) {
      fallbackAudioEl = new Audio(soundUrl)
    } else {
      if (!fallbackAudioEl.src.includes(soundUrl)) {
        fallbackAudioEl.src = soundUrl
      }
    }
    fallbackAudioEl.loop = true
    fallbackAudioEl.volume = 0.95
    fallbackAudioEl.play().catch((err) => {
      if (!webAudioStarted) {
        console.warn('HTML5 Audio playback blocked:', err)
      }
    })
  } catch (e) {
    console.warn('HTML5 Audio fallback error:', e)
  }
}

/**
 * Stops any actively playing shared timer alarm audio.
 */
export function stopSharedTimerAlarm() {
  isCurrentlyRinging = false

  if (activeSourceNode) {
    try {
      activeSourceNode.stop()
      activeSourceNode.disconnect()
    } catch {}
    activeSourceNode = null
  }

  if (fallbackAudioEl) {
    try {
      fallbackAudioEl.pause()
      fallbackAudioEl.currentTime = 0
    } catch {}
  }

  stopAudioKeepAlive()
}

/**
 * Fires a native OS desktop notification with click-to-focus and requireInteraction.
 */
export function sendSharedTimerNotification(title: string, body: string, tag: string = 'shared-timer') {
  if (typeof window === 'undefined' || !('Notification' in window)) return

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/icon.png',
        tag: `cao-${tag}`,
        requireInteraction: true,
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

/**
 * Flashes the browser tab title between alert messages to visually notify the user in taskbar.
 */
export function startTitleAlert(timerTitle: string) {
  if (typeof document === 'undefined') return
  if (!originalTitle) {
    originalTitle = document.title
  }
  if (titleInterval) clearInterval(titleInterval)

  let toggle = false
  titleInterval = setInterval(() => {
    document.title = toggle
      ? `🔔 00:00 TIME'S UP! — ${timerTitle}`
      : `⚠️ FINISHED! — ${timerTitle}`
    toggle = !toggle
  }, 900)
}

/**
 * Restores the original browser tab title.
 */
export function stopTitleAlert() {
  if (titleInterval) {
    clearInterval(titleInterval)
    titleInterval = null
  }
  if (originalTitle && typeof document !== 'undefined') {
    document.title = originalTitle
  }
}

