'use client'
import { useState, useEffect } from 'react'
import { X, Clock } from 'lucide-react'
import { SharedAlarm } from '@/lib/sharedAlarmLogic'

interface SharedAlarmModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string, description: string, alarmDateTime: string }) => void
  initialData?: SharedAlarm | null
}

export default function SharedAlarmModal({ isOpen, onClose, onSave, initialData }: SharedAlarmModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  // Default to 1 hour from now
  const defaultDate = new Date(Date.now() + 60 * 60 * 1000)
  
  const [dateStr, setDateStr] = useState(defaultDate.toISOString().split('T')[0])
  
  const hours = String(defaultDate.getHours()).padStart(2, '0')
  const minutes = String(defaultDate.getMinutes()).padStart(2, '0')
  const [timeStr, setTimeStr] = useState(`${hours}:${minutes}`)

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      const dt = new Date(initialData.alarmDateTime)
      setDateStr(dt.toISOString().split('T')[0])
      setTimeStr(`${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`)
    } else if (isOpen && !initialData) {
       // Reset on open if new
       setTitle('')
       setDescription('')
       const d = new Date(Date.now() + 60 * 60 * 1000)
       setDateStr(d.toISOString().split('T')[0])
       setTimeStr(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dateStr || !timeStr) return

    // Combine date and time into ISO
    const combined = new Date(`${dateStr}T${timeStr}:00`);
    onSave({
      title,
      description,
      alarmDateTime: combined.toISOString()
    });
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-[#110624] border border-white/10 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <Clock className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {initialData ? "Edit Shared Alarm" : "New Shared Alarm"}
            </h2>
            <p className="text-sm text-white/50 font-medium">Configure time and details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Title</label>
            <input 
               autoFocus
               required
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Morning Meeting"
               className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Description (Optional)</label>
            <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Don't forget to join the Zoom call..."
               className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium resize-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Date</label>
               <input 
                  required
                  type="date"
                  value={dateStr}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium [color-scheme:dark]"
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Time</label>
               <input 
                  required
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium [color-scheme:dark]"
               />
             </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white py-4 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-2"
          >
            {initialData ? "Save Changes" : "Create Alarm"}
          </button>
        </form>
      </div>
    </div>
  )
}
