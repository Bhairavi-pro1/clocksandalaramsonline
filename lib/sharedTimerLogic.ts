import { db } from './firebase';
import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  getDoc, getDocs, onSnapshot, Unsubscribe
} from 'firebase/firestore';

export interface SharedTimer {
  id: string;               // Room code, e.g. "k9x2m4"
  title: string;            // e.g. "15 Min Sprint"
  description?: string;     // optional description / agenda
  durationSeconds: number;  // total planned seconds (e.g. 900 for 15m)
  sound: string;            // audio preset: "vibe" | "bell" | "digital" | "marimba" | "radar" | "synthwave"
  hostToken: string;        // secret host authentication token
  status: 'waiting' | 'running' | 'paused' | 'completed';
  createdAt: number;        // Epoch timestamp (ms)
  startedAt: number | null; // Epoch timestamp (ms) when host clicked START
  endsAt: number | null;    // startedAt + (durationSeconds * 1000)
  pausedAt?: number | null; // Epoch ms if host pauses
  remainingWhenPaused?: number | null; // Seconds left when paused
  expireAt?: string | null; // ISO string 5 minutes after endsAt for auto-cleanup
  participantCount?: number;
}

export interface Participant {
  sessionId: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

// ---------------------------------------------------------
// Local Storage & Session Helpers
// ---------------------------------------------------------

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem('shared_timer_session_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('shared_timer_session_id', id);
  }
  return id;
}

export function getSavedUserName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('shared_timer_username') || '';
}

export function saveUserName(name: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shared_timer_username', name.trim());
  }
}

export function getMyCreatedTimers(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('my_created_shared_timers');
  return stored ? JSON.parse(stored) : [];
}

export function saveCreatedTimer(timerId: string, hostToken: string): void {
  if (typeof window === 'undefined') return;
  const list = getMyCreatedTimers();
  if (!list.includes(timerId)) {
    list.unshift(timerId);
    localStorage.setItem('my_created_shared_timers', JSON.stringify(list.slice(0, 50)));
  }
  localStorage.setItem(`host_token_${timerId}`, hostToken);
}

export function getHostToken(timerId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`host_token_${timerId}`);
}

export function isHostOfTimer(timerId: string, remoteHostToken?: string): boolean {
  const local = getHostToken(timerId);
  if (!local) return false;
  if (remoteHostToken) return local === remoteHostToken;
  return true;
}

export function getMyJoinedTimers(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('my_joined_shared_timers');
  return stored ? JSON.parse(stored) : [];
}

export function saveJoinedTimer(timerId: string): void {
  if (typeof window === 'undefined') return;
  const list = getMyJoinedTimers();
  if (!list.includes(timerId)) {
    list.unshift(timerId);
    localStorage.setItem('my_joined_shared_timers', JSON.stringify(list.slice(0, 50)));
  }
}

export function removeLocalTimerReference(timerId: string): void {
  if (typeof window === 'undefined') return;
  const created = getMyCreatedTimers().filter(id => id !== timerId);
  localStorage.setItem('my_created_shared_timers', JSON.stringify(created));
  
  const joined = getMyJoinedTimers().filter(id => id !== timerId);
  localStorage.setItem('my_joined_shared_timers', JSON.stringify(joined));

  localStorage.removeItem(`host_token_${timerId}`);
}

// ---------------------------------------------------------
// ID & Room Generation
// ---------------------------------------------------------

export function generateRoomId(): string {
  // Generates clean 7-character lowercase room code e.g. "k7m2x9p"
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ---------------------------------------------------------
// Global Server Time Synchronization (NTP-style)
// ---------------------------------------------------------

let serverTimeOffset: number = 0;
let isSyncingTime: boolean = false;
let lastSyncTime: number = 0;

/**
 * Synchronizes client clock with authoritative server time via /api/time.
 * Computes round-trip latency and compensates for client device manual clock drift.
 */
export async function syncServerTime(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  if (isSyncingTime) return serverTimeOffset;

  const now = Date.now();
  // Don't re-sync if synced within last 30 seconds
  if (lastSyncTime > 0 && now - lastSyncTime < 30000) {
    return serverTimeOffset;
  }

  isSyncingTime = true;
  try {
    const t0 = Date.now();
    const res = await fetch('/api/time', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Time sync response status ${res.status}`);
    const data = await res.json();
    const t1 = Date.now();

    const roundTrip = Math.max(0, (t1 - t0) / 2);
    // Calculated offset: trueServerTime = clientTime + serverTimeOffset
    serverTimeOffset = (data.serverTime + roundTrip) - t1;
    lastSyncTime = Date.now();
  } catch (err) {
    console.warn('Server time synchronization fallback:', err);
  } finally {
    isSyncingTime = false;
  }

  return serverTimeOffset;
}

/**
 * Returns current timestamp (epoch ms) corrected for client device clock drift.
 */
export function getSynchronizedNow(): number {
  return Date.now() + serverTimeOffset;
}

// Auto-trigger time sync on client initialization
if (typeof window !== 'undefined') {
  syncServerTime();
  window.addEventListener('focus', () => {
    syncServerTime();
  });
}

// ---------------------------------------------------------
// Time Calculation & Synchronization
// ---------------------------------------------------------

export function calculateTimerState(
  timer: SharedTimer, 
  customOffset?: number
): {
  secondsLeft: number;
  progress: number; // 0 to 1
  isDone: boolean;
  displayStatus: 'waiting' | 'running' | 'paused' | 'completed' | 'expired';
} {
  const total = timer.durationSeconds || 1;

  if (timer.status === 'waiting') {
    return {
      secondsLeft: timer.durationSeconds,
      progress: 0,
      isDone: false,
      displayStatus: 'waiting'
    };
  }

  if (timer.status === 'paused') {
    const remaining = Math.max(0, timer.remainingWhenPaused ?? timer.durationSeconds);
    const progress = Math.min(1, Math.max(0, (total - remaining) / total));
    return {
      secondsLeft: remaining,
      progress,
      isDone: remaining <= 0,
      displayStatus: 'paused'
    };
  }

  if (timer.status === 'completed' || !timer.endsAt) {
    return {
      secondsLeft: 0,
      progress: 1,
      isDone: true,
      displayStatus: 'completed'
    };
  }

  // Running state: calculate against synchronized server time
  const now = customOffset !== undefined ? Date.now() + customOffset : getSynchronizedNow();
  const diffMs = timer.endsAt - now;
  const secondsLeft = Math.max(0, Math.ceil(diffMs / 1000));
  const elapsed = total - secondsLeft;
  const progress = Math.min(1, Math.max(0, elapsed / total));

  // Check if 5 minutes have elapsed since endsAt (expired)
  const fiveMinutesMs = 5 * 60 * 1000;
  if (now > timer.endsAt + fiveMinutesMs) {
    return {
      secondsLeft: 0,
      progress: 1,
      isDone: true,
      displayStatus: 'expired'
    };
  }

  if (secondsLeft <= 0) {
    return {
      secondsLeft: 0,
      progress: 1,
      isDone: true,
      displayStatus: 'completed'
    };
  }

  return {
    secondsLeft,
    progress,
    isDone: false,
    displayStatus: 'running'
  };
}

// ---------------------------------------------------------
// Firestore CRUD & Real-Time Sync
// ---------------------------------------------------------

/**
 * Creates a brand-new Shared Timer in Firestore
 */
export async function createSharedTimer(
  title: string,
  durationSeconds: number,
  sound: string = 'vibe',
  description: string = ''
): Promise<{ timerId: string; hostToken: string }> {
  const timerId = generateRoomId();
  const hostToken = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : 'token_' + Math.random().toString(36).substring(2, 12);

  const now = Date.now();
  const newTimer: SharedTimer = {
    id: timerId,
    title: title.trim() || 'Shared Timer',
    description: description.trim(),
    durationSeconds: Math.max(1, durationSeconds),
    sound,
    hostToken,
    status: 'waiting',
    createdAt: now,
    startedAt: null,
    endsAt: null,
    pausedAt: null,
    remainingWhenPaused: null,
    expireAt: null,
    participantCount: 1
  };

  const timerDocRef = doc(db, 'sharedTimers', timerId);
  await setDoc(timerDocRef, newTimer);

  // Save in local storage
  saveCreatedTimer(timerId, hostToken);

  // Add host as the first participant
  const sessionId = getSessionId();
  const hostName = getSavedUserName() || 'Host';
  const participantRef = doc(db, 'sharedTimers', timerId, 'participants', sessionId);
  await setDoc(participantRef, {
    sessionId,
    name: hostName,
    isHost: true,
    joinedAt: now
  });

  return { timerId, hostToken };
}

/**
 * Subscribes to real-time timer updates via Firestore onSnapshot
 */
export function subscribeToSharedTimer(
  timerId: string,
  onUpdate: (timer: SharedTimer | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const timerDocRef = doc(db, 'sharedTimers', timerId);
  return onSnapshot(timerDocRef, (snap) => {
    if (!snap.exists()) {
      onUpdate(null);
      return;
    }
    const data = snap.data() as SharedTimer;
    onUpdate({ ...data, id: snap.id });
  }, (err) => {
    console.error(`Error subscribing to shared timer ${timerId}:`, err);
    if (onError) onError(err);
  });
}

/**
 * Subscribes to real-time participant list
 */
export function subscribeToParticipants(
  timerId: string,
  onUpdate: (participants: Participant[]) => void
): Unsubscribe {
  const participantsColl = collection(db, 'sharedTimers', timerId, 'participants');
  return onSnapshot(participantsColl, (snap) => {
    const list: Participant[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Participant);
    });
    // Sort host first, then by joinedAt
    list.sort((a, b) => {
      if (a.isHost) return -1;
      if (b.isHost) return 1;
      return a.joinedAt - b.joinedAt;
    });
    onUpdate(list);
  }, (err) => {
    console.warn(`Could not listen to participants for ${timerId}:`, err);
  });
}

/**
 * Joins a shared timer room
 */
export async function joinSharedTimer(
  timerId: string,
  displayName: string
): Promise<boolean> {
  const cleanName = displayName.trim() || 'Guest';
  saveUserName(cleanName);
  const sessionId = getSessionId();

  try {
    const timerDocRef = doc(db, 'sharedTimers', timerId);
    const snap = await getDoc(timerDocRef);
    if (!snap.exists()) return false;

    const timer = snap.data() as SharedTimer;
    const isHost = isHostOfTimer(timerId, timer.hostToken);

    const participantRef = doc(db, 'sharedTimers', timerId, 'participants', sessionId);
    await setDoc(participantRef, {
      sessionId,
      name: cleanName,
      isHost,
      joinedAt: Date.now()
    }, { merge: true });

    saveJoinedTimer(timerId);
    return true;
  } catch (err) {
    console.error('Error joining shared timer:', err);
    return false;
  }
}

/**
 * Starts the shared timer (Host only)
 */
export async function startSharedTimer(
  timerId: string, 
  hostToken: string
): Promise<boolean> {
  try {
    const timerDocRef = doc(db, 'sharedTimers', timerId);
    const snap = await getDoc(timerDocRef);
    if (!snap.exists()) return false;
    const data = snap.data() as SharedTimer;

    if (data.hostToken !== hostToken) {
      console.error('Unauthorized: Invalid host token');
      return false;
    }

    const now = getSynchronizedNow();
    const endsAt = now + (data.durationSeconds * 1000);
    const expireAt = new Date(endsAt + (5 * 60 * 1000)).toISOString();

    await updateDoc(timerDocRef, {
      status: 'running',
      startedAt: now,
      endsAt,
      pausedAt: null,
      remainingWhenPaused: null,
      expireAt
    });

    return true;
  } catch (err) {
    console.error('Error starting shared timer:', err);
    return false;
  }
}

/**
 * Pauses the shared timer (Host only)
 */
export async function pauseSharedTimer(
  timerId: string,
  hostToken: string,
  secondsLeft: number
): Promise<boolean> {
  try {
    const timerDocRef = doc(db, 'sharedTimers', timerId);
    const snap = await getDoc(timerDocRef);
    if (!snap.exists()) return false;
    const data = snap.data() as SharedTimer;

    if (data.hostToken !== hostToken) return false;

    await updateDoc(timerDocRef, {
      status: 'paused',
      pausedAt: getSynchronizedNow(),
      remainingWhenPaused: Math.max(0, secondsLeft)
    });

    return true;
  } catch (err) {
    console.error('Error pausing shared timer:', err);
    return false;
  }
}

/**
 * Resumes the shared timer (Host only)
 */
export async function resumeSharedTimer(
  timerId: string,
  hostToken: string
): Promise<boolean> {
  try {
    const timerDocRef = doc(db, 'sharedTimers', timerId);
    const snap = await getDoc(timerDocRef);
    if (!snap.exists()) return false;
    const data = snap.data() as SharedTimer;

    if (data.hostToken !== hostToken) return false;

    const remaining = data.remainingWhenPaused ?? data.durationSeconds;
    const now = getSynchronizedNow();
    const newEndsAt = now + (remaining * 1000);
    const expireAt = new Date(newEndsAt + (5 * 60 * 1000)).toISOString();

    await updateDoc(timerDocRef, {
      status: 'running',
      startedAt: now,
      endsAt: newEndsAt,
      pausedAt: null,
      remainingWhenPaused: null,
      expireAt
    });

    return true;
  } catch (err) {
    console.error('Error resuming shared timer:', err);
    return false;
  }
}

/**
 * Resets the timer back to waiting state (Host only)
 */
export async function resetSharedTimer(
  timerId: string,
  hostToken: string
): Promise<boolean> {
  try {
    const timerDocRef = doc(db, 'sharedTimers', timerId);
    const snap = await getDoc(timerDocRef);
    if (!snap.exists()) return false;
    const data = snap.data() as SharedTimer;

    if (data.hostToken !== hostToken) return false;

    await updateDoc(timerDocRef, {
      status: 'waiting',
      startedAt: null,
      endsAt: null,
      pausedAt: null,
      remainingWhenPaused: null,
      expireAt: null
    });

    return true;
  } catch (err) {
    console.error('Error resetting shared timer:', err);
    return false;
  }
}

/**
 * Marks timer as completed
 */
export async function markSharedTimerCompleted(timerId: string): Promise<void> {
  try {
    const timerDocRef = doc(db, 'sharedTimers', timerId);
    const snap = await getDoc(timerDocRef);
    if (!snap.exists()) return;
    const data = snap.data() as SharedTimer;

    if (data.status !== 'completed') {
      const now = getSynchronizedNow();
      const expireAt = new Date(now + (5 * 60 * 1000)).toISOString();
      await updateDoc(timerDocRef, {
        status: 'completed',
        expireAt
      });
    }
  } catch (err) {
    console.warn(`Could not mark timer ${timerId} completed:`, err);
  }
}

/**
 * Deletes the shared timer and all participant subdocuments to free Firestore storage.
 * Authorized for host or system maintenance.
 */
export async function deleteSharedTimer(timerId: string, hostToken?: string): Promise<boolean> {
  try {
    const timerDocRef = doc(db, 'sharedTimers', timerId);

    // If host token check is possible, ensure token authenticity
    const token = hostToken || getHostToken(timerId);
    if (token) {
      const snap = await getDoc(timerDocRef);
      if (snap.exists()) {
        const data = snap.data() as SharedTimer;
        if (data.hostToken && data.hostToken !== token) {
          console.warn(`Unauthorized attempt to delete shared timer ${timerId}`);
          removeLocalTimerReference(timerId);
          return false;
        }
      }
    }

    // 1. Delete all participants in subcollection
    const participantsColl = collection(db, 'sharedTimers', timerId, 'participants');
    const partSnap = await getDocs(participantsColl);
    const deletePromises = partSnap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    // 2. Delete parent document
    await deleteDoc(timerDocRef);

    // 3. Clear local storage references
    removeLocalTimerReference(timerId);

    return true;
  } catch (err) {
    console.error(`Failed to delete shared timer ${timerId}:`, err);
    return false;
  }
}

/**
 * Checks if a timer has exceeded 5 minutes post-completion and prunes it.
 * 
 * CRITICAL CLOCK-DRIFT & GUEST PROTECTION:
 * 1. Uses getSynchronizedNow() (NTP server time) so device clock drift NEVER causes false expiration.
 * 2. Only the verified HOST can delete the Firestore document for everyone.
 * 3. Non-hosts (guests) ONLY remove the timer from their own local storage!
 */
export async function checkAndPruneExpiredTimer(timer: SharedTimer): Promise<boolean> {
  if (!timer.endsAt) return false;

  const now = getSynchronizedNow();
  const fiveMinutesMs = 5 * 60 * 1000;
  const isPastFiveMinutes = now > (timer.endsAt + fiveMinutesMs);

  if (!isPastFiveMinutes) return false;

  const isHost = isHostOfTimer(timer.id, timer.hostToken);

  if (isHost) {
    // Only verified host can permanently delete the Firestore document
    await deleteSharedTimer(timer.id, timer.hostToken);
    return true;
  } else {
    // Non-hosts (guests) ONLY remove the room reference from their local device storage!
    removeLocalTimerReference(timer.id);
    return false;
  }
}

