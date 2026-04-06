'use client'
import { useState, useEffect } from 'react'
import { Link2, Trash2, Edit2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SharedAlarm, SharedAlarmResponse, deleteSharedAlarm } from '@/lib/sharedAlarmLogic'
import { db } from '@/lib/firebase'
import { collection, doc, onSnapshot } from 'firebase/firestore'

interface SharedAlarmCardProps {
  alarm: SharedAlarm
  isCreator: boolean
  onEdit?: (alarm: SharedAlarm) => void
  onRemoveFromUI: (id: string) => void
  onAlarmRinging?: (alarm: SharedAlarm) => void
}

export default function SharedAlarmCard({ alarm, isCreator, onEdit, onRemoveFromUI, onAlarmRinging }: SharedAlarmCardProps) {
  const [responses, setResponses] = useState<SharedAlarmResponse[]>([])
  const [copying, setCopying] = useState(false)
  const [currentAlarm, setCurrentAlarm] = useState<SharedAlarm>(alarm)

  // Update initial state if prop changes
  useEffect(() => {
    setCurrentAlarm(alarm)
  }, [alarm])

  // Creator listener: listen to responses sub-collection
  useEffect(() => {
    if (!isCreator || !alarm.alarmId) return;
    
    const responsesRef = collection(db, 'sharedAlarms', alarm.alarmId, 'responses');
    const unsub = onSnapshot(responsesRef, 
      (snap) => {
        const res: SharedAlarmResponse[] = [];
        snap.forEach(doc => {
          res.push(doc.data() as SharedAlarmResponse);
        });
        setResponses(res);
      },
      (err) => {
        console.warn("Could not load responses (rules or permission):", err.message);
      }
    );
    
    return () => unsub();
  }, [alarm.alarmId, isCreator]);

  // Main document listener: live sync for edits and deletion
  useEffect(() => {
    if (!alarm.alarmId) return;

    const docRef = doc(db, 'sharedAlarms', alarm.alarmId);
    const unsub = onSnapshot(docRef, 
      (snap) => {
        if (!snap.exists()) {
          onRemoveFromUI(alarm.alarmId);
        } else {
          setCurrentAlarm(snap.data() as SharedAlarm);
        }
      },
      (err) => {
        console.warn("Could not sync alarm updates:", err.message);
      }
    );

    return () => unsub();
  }, [alarm.alarmId, onRemoveFromUI]);

  // Auto-remove if time passed
  useEffect(() => {
    const checkExpiration = setInterval(() => {
      const now = new Date();
      const alarmTime = new Date(currentAlarm.alarmDateTime);
      if (now > alarmTime) {
        
        // Trigger ringing if the expiration was recent (within 60s)
        if (now.getTime() - alarmTime.getTime() < 60000) {
           onAlarmRinging?.(currentAlarm)
        }

        if (isCreator) {
          deleteSharedAlarm(currentAlarm.alarmId);
        } else {
          onRemoveFromUI(currentAlarm.alarmId);
        }
      }
    }, 1000); // Check every second for exact trigger
    
    // Initial check (prevent old alarms from ringing if user opens page late)
    if (new Date() > new Date(currentAlarm.alarmDateTime)) {
       if (isCreator) deleteSharedAlarm(currentAlarm.alarmId);
       else onRemoveFromUI(currentAlarm.alarmId);
    }
    
    return () => clearInterval(checkExpiration);
  }, [currentAlarm, isCreator, onRemoveFromUI, onAlarmRinging]);

  const handleCopyLink = () => {
    setCopying(true)
    const url = `${window.location.origin}/shared-alarm/?id=${currentAlarm.alarmId}`
    navigator.clipboard.writeText(url)
    setTimeout(() => setCopying(false), 2000)
  }

  const handleDelete = () => {
    if (window.confirm("Deleting this alarm will remove it for everyone it was shared with.\nContinue?")) {
      deleteSharedAlarm(currentAlarm.alarmId);
      onRemoveFromUI(currentAlarm.alarmId);
    }
  }

  const alarmDate = new Date(currentAlarm.alarmDateTime);
  const timeString = alarmDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = alarmDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

  // Calculate Badge text
  let badgeText = "⏳ Awaiting response";
  if (responses.length > 0) {
    const accepted = responses.filter(r => r.status === 'accepted').length;
    const declined = responses.filter(r => r.status === 'declined').length;
    
    if (accepted > 0 && declined === 0) badgeText = `✅ ${accepted} accepted`;
    else if (declined > 0 && accepted === 0) badgeText = `⚠️ Someone declined this alarm`;
    else badgeText = `✅ ${accepted} accepted · ⚠️ ${declined} declined`;
  }

  return (
    <div className="w-full bg-[#1a0b36]/60 border border-violet-500/20 rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl transition-all duration-300 hover:border-primary/40">
      
      {!isCreator && (
        <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl border-b border-l border-primary/20">
          📨 Shared Alarm
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
            {isCreator ? "My Shared Alarm" : "Received Alarm"}
          </div>
          <div className="text-white font-bold text-lg leading-tight break-words pr-2">
            {currentAlarm.title}
          </div>
          {currentAlarm.description && (
            <div className="text-sm text-white/60 mt-1 mb-2 line-clamp-2">
              {currentAlarm.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6 mb-6 border-y border-white/5">
        <div className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-white tabular-nums transition-all flex items-baseline gap-2 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
           {timeString.replace(/AM|PM/i, '').trim()}
           <span className="text-xl md:text-2xl opacity-40 font-black tracking-widest">
             {timeString.match(/AM|PM/i)?.[0]}
           </span>
        </div>
        <div className="mt-2 text-primary font-bold tracking-widest uppercase text-xs">
          {dateString}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {isCreator && (
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-white/70">
            {badgeText}
          </div>
        )}
      </div>

      {isCreator && (
         <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
            <button 
               onClick={handleCopyLink}
               className="flex-1 flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-colors relative"
            >
               <Link2 size={16} /> 
               {copying ? "Copied!" : "Share Link"}
            </button>
            <button 
               onClick={() => onEdit?.(currentAlarm)}
               className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70"
            >
               <Edit2 size={18} />
            </button>
            <button 
               onClick={handleDelete}
               className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500/70"
            >
               <Trash2 size={18} />
            </button>
         </div>
      )}
    </div>
  )
}
