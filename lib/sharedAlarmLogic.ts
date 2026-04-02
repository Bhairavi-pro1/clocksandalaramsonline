import { db } from './firebase';
import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  getDoc, getDocs, onSnapshot, query, QuerySnapshot 
} from 'firebase/firestore';

export interface SharedAlarm {
  alarmId: string;
  title: string;
  description: string;
  alarmDateTime: string; // ISO 8601
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface SharedAlarmResponse {
  sessionId: string;
  status: 'accepted' | 'declined';
  respondedAt: string;
}

// LocalStorage helpers
export const getMyCreatedAlarms = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('myCreatedAlarms');
  return stored ? JSON.parse(stored) : [];
}

export const setMyCreatedAlarms = (alarms: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('myCreatedAlarms', JSON.stringify(alarms));
  }
}

export const getMyReceivedAlarms = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('myReceivedAlarms');
  return stored ? JSON.parse(stored) : [];
}

export const setMyReceivedAlarms = (alarms: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('myReceivedAlarms', JSON.stringify(alarms));
  }
}

function generateRandomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// ---------------------------------------------------------
// FIRESTORE CRUD
// ---------------------------------------------------------

export async function createSharedAlarm(
  title: string, 
  description: string, 
  alarmDateTime: string, 
  sessionId: string
): Promise<string> {
  const alarmId = generateRandomId();
  const newAlarm: SharedAlarm = {
    alarmId,
    title,
    description,
    alarmDateTime,
    createdBy: sessionId,
    createdAt: new Date().toISOString(),
    isActive: true
  };

  const alarmDocRef = doc(db, 'sharedAlarms', alarmId);
  await setDoc(alarmDocRef, newAlarm);

  const myCreated = getMyCreatedAlarms();
  if (!myCreated.includes(alarmId)) {
    myCreated.push(alarmId);
    setMyCreatedAlarms(myCreated);
  }

  return alarmId;
}

export async function updateSharedAlarm(
  alarmId: string,
  title: string,
  description: string,
  alarmDateTime: string
) {
  const alarmDocRef = doc(db, 'sharedAlarms', alarmId);
  await updateDoc(alarmDocRef, {
    title,
    description,
    alarmDateTime
  });
}

// Follows specific 5-step deletion order to prevent orphan data
export async function deleteSharedAlarm(alarmId: string) {
  const alarmDocRef = doc(db, 'sharedAlarms', alarmId);
  const responsesCollRef = collection(alarmDocRef, 'responses');
  
  try {
    // Step 1: Query all documents in responses sub-collection
    const responsesSnapshot = await getDocs(responsesCollRef);
    
    // Step 2: Delete each response document one by one
    const deletePromises = responsesSnapshot.docs.map(resDoc => deleteDoc(resDoc.ref));
    await Promise.all(deletePromises);
    
    // Step 3: Delete parent document
    await deleteDoc(alarmDocRef);
    
    // Step 4: Remove from localStorage
    const myCreated = getMyCreatedAlarms().filter(id => id !== alarmId);
    setMyCreatedAlarms(myCreated);
    
    // UI removal happens via state/listener
  } catch (error) {
    console.error("Error deleting shared alarm", error);
  }
}

export async function respondToAlarm(
  alarmId: string, 
  sessionId: string, 
  status: 'accepted' | 'declined'
) {
  const responseDocRef = doc(db, 'sharedAlarms', alarmId, 'responses', sessionId);
  await setDoc(responseDocRef, {
    sessionId,
    status,
    respondedAt: new Date().toISOString()
  });

  if (status === 'accepted') {
    const myReceived = getMyReceivedAlarms();
    if (!myReceived.includes(alarmId)) {
      myReceived.push(alarmId);
      setMyReceivedAlarms(myReceived);
    }
  }
}
