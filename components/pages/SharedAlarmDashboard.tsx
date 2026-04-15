'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { useSession } from '@/hooks/useSession'
import { 
   SharedAlarm, 
   getMyCreatedAlarms, 
   getMyReceivedAlarms, 
   createSharedAlarm, 
   updateSharedAlarm,
} from '@/lib/sharedAlarmLogic'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import SharedAlarmCard from '@/components/tools/SharedAlarmCard'
import SharedAlarmModal from '@/components/tools/SharedAlarmModal'
import AlarmTriggerModal from '@/components/ui/AlarmTriggerModal'

const SOUNDS: Record<string, string> = {
  vibe: '/sounds/vibe.mp3',
  editorial: '/sounds/editorial.mp3',
  guitar: '/sounds/guitar.mp3',
  riser: '/sounds/riser.mp3',
  birds: '/sounds/birds.mp3',
  fun: '/sounds/fun.mp3',
  synthwave: '/sounds/synthwave.mp3',
}

export default function SharedAlarmDashboard() {
  const { sessionId } = useSession()
  const [createdAlarms, setCreatedAlarms] = useState<SharedAlarm[]>([])
  const [receivedAlarms, setReceivedAlarms] = useState<SharedAlarm[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAlarm, setEditingAlarm] = useState<SharedAlarm | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [ringingAlarm, setRingingAlarm] = useState<SharedAlarm | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const loadAlarms = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    const createdIds = getMyCreatedAlarms();
    const receivedIds = getMyReceivedAlarms();

    const fetchAlarm = async (id: string) => {
      try {
        const snap = await getDoc(doc(db, 'sharedAlarms', id));
        if (snap.exists()) {
          return snap.data() as SharedAlarm;
        }
      } catch (err) {
        console.warn("Error fetching alarm doc:", err);
      }
      return null;
    };

    const cAlarms = (await Promise.all(createdIds.map(fetchAlarm))).filter(Boolean) as SharedAlarm[];
    const rAlarms = (await Promise.all(receivedIds.map(fetchAlarm))).filter(Boolean) as SharedAlarm[];

    setCreatedAlarms(cAlarms.sort((a,b) => new Date(a.alarmDateTime).getTime() - new Date(b.alarmDateTime).getTime()));
    setReceivedAlarms(rAlarms.sort((a,b) => new Date(a.alarmDateTime).getTime() - new Date(b.alarmDateTime).getTime()));
    setIsLoading(false);
  };

  useEffect(() => {
    if (sessionId) {
      loadAlarms();
    }
  }, [sessionId]);

  const handleSaveAlarm = async (data: {title: string, description: string, alarmDateTime: string, sound: string}) => {
    if (!sessionId) return;
    
    if (editingAlarm) {
       await updateSharedAlarm(editingAlarm.alarmId, data.title, data.description, data.alarmDateTime, data.sound);
    } else {
       await createSharedAlarm(data.title, data.description, data.alarmDateTime, data.sound, sessionId);
    }
    
    setEditingAlarm(null);
    loadAlarms(); // Reload to get fresh data
  };

  const handleRemoveCreatedUI = (id: string) => {
    setCreatedAlarms(prev => prev.filter(a => a.alarmId !== id));
  };

  const handleRemoveReceivedUI = (id: string) => {
    setReceivedAlarms(prev => prev.filter(a => a.alarmId !== id));
    // also remove from local storage if recipient card disappears
    if (typeof window !== 'undefined') {
       const stored = JSON.parse(localStorage.getItem('myReceivedAlarms') || '[]');
       const filtered = stored.filter((sId: string) => sId !== id);
       localStorage.setItem('myReceivedAlarms', JSON.stringify(filtered));
    }
  };

  const handleAlarmRing = (alarm: SharedAlarm) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audio = new Audio(SOUNDS[alarm.sound] || SOUNDS.vibe)
    audio.loop = true
    audio.volume = 0.8
    audio.play().catch(e => console.error('Alarm audio blocked:', e))
    audioRef.current = audio
    setRingingAlarm(alarm)

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('⏰ Shared Alarm!', { 
        body: alarm.title || `Your shared alarm is ringing.`,
        icon: '/icons/icon-192.png'
      })
    }
  };

  const stopRinging = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setRingingAlarm(null)
  }

  if (isLoading) {
    return (
       <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
       </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* SECTION A: My Shared Alarms */}
      <section className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <div className="space-y-1 text-center md:text-left">
               <h3 className="text-2xl font-black text-white">My Shared Alarms</h3>
               <p className="text-sm text-muted font-medium">Alarms you created and shared with others</p>
            </div>
            <button 
               onClick={() => {
                  setEditingAlarm(null);
                  setIsModalOpen(true);
               }}
               className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black hover:scale-[1.03] transition-transform shadow-2xl shadow-primary/30"
            >
               <Plus size={24} /> Create Shared Alarm
            </button>
         </div>

         {createdAlarms.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.03] rounded-[2.5rem] border border-dashed border-white/10">
               <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">No shared alarms created</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {createdAlarms.map((alarm) => (
                  <SharedAlarmCard 
                     key={alarm.alarmId}
                     alarm={alarm}
                     isCreator={true}
                     onEdit={(a) => {
                        setEditingAlarm(a);
                        setIsModalOpen(true);
                     }}
                     onRemoveFromUI={handleRemoveCreatedUI}
                     onAlarmRinging={handleAlarmRing}
                  />
               ))}
            </div>
         )}
      </section>

      {/* SECTION B: Received Alarms */}
      <section className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-2 border-b border-white/10">
            <div className="space-y-1 text-center md:text-left">
               <h3 className="text-2xl font-black text-white">Received Alarms</h3>
               <p className="text-sm text-muted font-medium">Alarms shared with you that you accepted</p>
            </div>
         </div>

         {receivedAlarms.length === 0 ? (
            <div className="text-center py-20 bg-[#1a0b36]/20 rounded-[2.5rem] border border-dashed border-white/5">
               <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">No accepted alarms yet</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {receivedAlarms.map((alarm) => (
                  <SharedAlarmCard 
                     key={alarm.alarmId}
                     alarm={alarm}
                     isCreator={false}
                     onRemoveFromUI={handleRemoveReceivedUI}
                     onAlarmRinging={handleAlarmRing}
                  />
               ))}
            </div>
         )}
      </section>

      <SharedAlarmModal 
        isOpen={isModalOpen}
        onClose={() => {
           setIsModalOpen(false);
           setEditingAlarm(null);
        }}
        onSave={handleSaveAlarm}
        initialData={editingAlarm}
      />

      <AlarmTriggerModal 
        isOpen={!!ringingAlarm}
        onClose={stopRinging}
        label={ringingAlarm?.title || 'Shared Alarm Ringing!'}
        type="alarm"
        timeText={ringingAlarm ? new Date(ringingAlarm.alarmDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      />
    </div>
  )
}
