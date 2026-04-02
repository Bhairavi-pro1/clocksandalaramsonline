'use client'
import { useState, useEffect } from 'react'
import { Bell, CheckCircle2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SharedAlarm, SharedAlarmResponse, respondToAlarm } from '@/lib/sharedAlarmLogic'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useSession } from '@/hooks/useSession'

interface SharedAlarmPreviewProps {
  alarmId: string
}

export default function SharedAlarmPreview({ alarmId }: SharedAlarmPreviewProps) {
  const { sessionId } = useSession()
  const router = useRouter()
  
  const [alarm, setAlarm] = useState<SharedAlarm | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [existingResponse, setExistingResponse] = useState<string | null>(null)
  const [handling, setHandling] = useState(false)

  useEffect(() => {
    if (!sessionId) return;

    const fetchPreviewData = async () => {
      try {
        const alarmRef = doc(db, 'sharedAlarms', alarmId);
        const alarmSnap = await getDoc(alarmRef);
        
        if (!alarmSnap.exists()) {
           setErrorStatus("This alarm is no longer available.");
           return;
        }

        const alarmData = alarmSnap.data() as SharedAlarm;
        
        // Check expiration
        const now = new Date();
        const alarmTime = new Date(alarmData.alarmDateTime);
        if (now > alarmTime) {
           setErrorStatus("This alarm has already expired.");
           return;
        }

        // Check if creator
        if (alarmData.createdBy === sessionId) {
           setErrorStatus("This is your own shared alarm.");
           setAlarm(alarmData); // Still show the card, but no buttons
           return;
        }

        // Check if already responded
        const responseRef = doc(db, 'sharedAlarms', alarmId, 'responses', sessionId);
        const responseSnap = await getDoc(responseRef);
        
        if (responseSnap.exists()) {
           const resData = responseSnap.data() as SharedAlarmResponse;
           setExistingResponse(resData.status);
        }

        setAlarm(alarmData);
      } catch (err) {
         setErrorStatus("Error loading alarm data.");
      } finally {
         setLoading(false);
      }
    };

    fetchPreviewData();
  }, [alarmId, sessionId]);

  const handleResponse = async (status: 'accepted' | 'declined') => {
     if (!sessionId) return;
     setHandling(true);
     await respondToAlarm(alarmId, sessionId, status);
     
     if (status === 'accepted') {
        router.push('/shared-alarm/');
     } else {
        setExistingResponse('declined');
        setHandling(false);
     }
  };

  if (loading || !sessionId) {
     return (
       <div className="flex justify-center items-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
       </div>
     );
  }

  // Error state (expired, not found)
  if (!alarm && errorStatus) {
     return (
        <div className="flex justify-center items-center py-20 px-4">
           <div className="bg-[#1a0b36]/60 border border-red-500/30 rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl">
              <XCircle className="w-12 h-12 text-red-500/80 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white tracking-tight">{errorStatus}</h2>
              <button 
                 onClick={() => router.push('/shared-alarm/')}
                 className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-bold transition-all"
              >
                 Go to My Alarms
              </button>
           </div>
        </div>
     );
  }

  if (!alarm) return null;

  const alarmDate = new Date(alarm.alarmDateTime);
  const timeString = alarmDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = alarmDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-md bg-[#110624] border border-violet-500/30 rounded-[2.5rem] p-8 relative shadow-[0_0_50px_rgba(168,85,247,0.15)] animate-in zoom-in-95 duration-500">
         
         <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
            <Bell className="w-8 h-8 text-primary animate-pulse" />
         </div>

         <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight mb-2">
               Alarm Shared With You
            </h1>
            <p className="text-sm text-white/50 font-medium px-4">
               Someone shared an upcoming alarm with you.
            </p>
         </div>

         <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="mb-4">
               <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Title</div>
               <div className="text-white font-bold">{alarm.title}</div>
            </div>
            {alarm.description && (
               <div className="mb-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Note</div>
                  <div className="text-white/80 text-sm">{alarm.description}</div>
               </div>
            )}
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Time</div>
               <div className="text-primary font-bold text-xl tracking-tight">
                  {timeString} <span className="text-sm text-white/50 ml-1 block sm:inline">{dateString}</span>
               </div>
            </div>
         </div>

         {errorStatus === "This is your own shared alarm." && (
            <div className="text-center">
               <span className="inline-block px-4 py-2 bg-white/10 rounded-xl text-sm font-bold text-white/70">
                  {errorStatus}
               </span>
               <button 
                  onClick={() => router.push('/shared-alarm/')}
                  className="mt-4 w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl font-bold transition-all"
               >
                  Back to Dashboard
               </button>
            </div>
         )}

         {existingResponse === 'declined' && (
            <div className="text-center space-y-4">
               <div className="flex items-center justify-center gap-2 text-red-400 font-bold">
                  <XCircle size={20} /> You have declined this alarm.
               </div>
               <button 
                  onClick={() => router.push('/shared-alarm/')}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
               >
                  Go to Dashboard
               </button>
            </div>
         )}
         
         {existingResponse === 'accepted' && (
            <div className="text-center space-y-4">
               <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
                  <CheckCircle2 size={20} /> You have accepted this alarm.
               </div>
               <button 
                  onClick={() => router.push('/shared-alarm/')}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold transition-all"
               >
                  View My Alarms
               </button>
            </div>
         )}

         {!errorStatus && !existingResponse && (
            <div className="grid grid-cols-2 gap-3">
               <button 
                  disabled={handling}
                  onClick={() => handleResponse('accepted')}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
               >
                  <CheckCircle2 size={18} /> Accept
               </button>
               <button 
                  disabled={handling}
                  onClick={() => handleResponse('declined')}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 py-4 rounded-xl font-black transition-all border border-white/10 hover:border-red-500/30 disabled:opacity-50"
               >
                  <XCircle size={18} /> Decline
               </button>
            </div>
         )}

      </div>
    </div>
  )
}
