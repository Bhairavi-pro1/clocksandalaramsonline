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
import { useStore } from '@/hooks/useStore'

export default function SharedAlarmDashboard() {
  const { sessionId } = useSession()
  const is24Hour = useStore((state) => state.is24Hour)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [createdAlarms, setCreatedAlarms] = useState<SharedAlarm[]>([])
  const [receivedAlarms, setReceivedAlarms] = useState<SharedAlarm[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAlarm, setEditingAlarm] = useState<SharedAlarm | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      <section className="w-full bg-transparent md:bg-white/5 p-0 md:p-8 rounded-none md:rounded-[2.5rem] border-none md:border md:border-white/5 space-y-6">
         <div className="flex justify-between items-center gap-4 pb-4 border-b border-white/5 w-full">
            <div className="space-y-0.5 text-left">
               <h3 className="text-lg md:text-2xl font-black text-white leading-tight">My Shared Alarms</h3>
               <p className="text-[11px] md:text-sm text-muted font-medium">Alarms you created and shared with others</p>
            </div>
            <button 
               onClick={() => {
                  setEditingAlarm(null);
                  setIsModalOpen(true);
               }}
               className="flex items-center justify-center bg-primary text-white p-3 md:px-8 md:py-4 rounded-full md:rounded-[1.25rem] font-bold hover:scale-[1.03] transition-transform shadow-lg shadow-primary/20"
               aria-label="Create Shared Alarm"
            >
               <Plus size={20} className="md:w-5 md:h-5" />
               <span className="hidden md:inline ml-2 text-sm font-black">Create Shared Alarm</span>
            </button>
         </div>

         {createdAlarms.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
               <p className="text-white/40 text-xs md:text-sm font-medium">
                  click the + plus button for creating new alarm and share it.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                  />
               ))}
            </div>
         )}
      </section>

      {/* SECTION B: Received Alarms */}
      <section className="w-full space-y-6">
         <div className="flex justify-between items-center gap-4 pb-4 border-b border-white/5 w-full">
            <div className="space-y-0.5 text-left">
               <h3 className="text-lg md:text-2xl font-black text-white leading-tight">Received Alarms</h3>
               <p className="text-[11px] md:text-sm text-muted font-medium">Alarms shared with you that you accepted</p>
            </div>
         </div>

         {receivedAlarms.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
               <p className="text-white/40 text-xs md:text-sm font-medium">
                  no accepted alarms yet.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {receivedAlarms.map((alarm) => (
                  <SharedAlarmCard 
                     key={alarm.alarmId}
                     alarm={alarm}
                     isCreator={false}
                     onRemoveFromUI={handleRemoveReceivedUI}
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
    </div>
  )
}
