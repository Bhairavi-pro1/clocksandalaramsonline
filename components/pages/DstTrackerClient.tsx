'use client'
import { useState, useMemo } from 'react'
import { 
  ArrowRight, 
  Info, 
  Globe, 
  ArrowUpRight, 
  Timer, 
  Search, 
  X, 
  Sparkles, 
  History 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DSTChange } from '@/lib/dst'

interface Props {
  initialChanges: DSTChange[]
}

export default function DstTrackerClient({ initialChanges }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const allChanges = initialChanges

  const filteredChanges = useMemo(() => {
    if (!searchTerm) return allChanges
    const lSearch = searchTerm.toLowerCase()
    return allChanges.filter(c => 
      c.country.toLowerCase().includes(lSearch) || 
      c.zone.toLowerCase().includes(lSearch)
    )
  }, [allChanges, searchTerm])

  const groupedChanges = useMemo(() => {
    const groups: { [date: string]: DSTChange[] } = {}
    filteredChanges.forEach(change => {
      if (!groups[change.date]) groups[change.date] = []
      groups[change.date].push(change)
    })
    return Object.entries(groups).map(([date, items]) => ({
      date,
      daysRemaining: items[0].daysRemaining,
      items
    }))
  }, [filteredChanges])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16">
      {/* Hero Summary Section */}
      <div className="relative p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-[#1a0b36] via-[#120227] to-black border border-white/10 overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-32 -mt-32" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] -ml-20 -mb-20" />
         
         <div className="relative z-10 space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                     <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                       Global Schedule
                     </div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none italic">
                    Upcoming <span className="text-primary not-italic">Clock Changes</span>
                  </h2>
                  <p className="text-lg text-white/40 font-medium max-w-xl">
                    A comprehensive live directory of every scheduled Daylight Saving Time transition across the globe for the next 12 months.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform duration-500">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total Changes</p>
                     <p className="text-3xl font-black text-white">{allChanges.length}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner">
                     <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Next Wave</p>
                     <p className="text-3xl font-black text-white">{groupedChanges[0]?.daysRemaining || 0}<span className="text-sm ml-1 opacity-40">days</span></p>
                  </div>
               </div>
            </div>

            {/* Filter Search Bar */}
            <div className="relative max-w-2xl mx-auto w-full group">
               <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
               <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-xl focus-within:border-primary/50 transition-all">
                  <Search className="w-5 h-5 text-white/20 mr-4" />
                  <input 
                    type="text"
                    placeholder="Search by country or city name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white font-bold placeholder:text-white/20"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-4 h-4 text-white/40" />
                    </button>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Changes Timeline */}
      <div className="space-y-12">
        {groupedChanges.map((group, gIdx) => (
          <div key={group.date} className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-black text-white tracking-tight">{group.date}</h2>
                <span className="text-primary font-black uppercase text-xs tracking-widest">
                  ({group.daysRemaining} days remaining)
                </span>
              </div>
              <div className="h-px bg-white/10 flex-1 group-hover:bg-primary/20 transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((item, iIdx) => (
                <div 
                  key={`${item.zone}-${iIdx}`}
                  className={cn(
                    "group relative bg-[#1a0b2e]/40 hover:bg-[#1a0b2e]/60 border p-8 rounded-[2rem] transition-all duration-500 shadow-xl hover:-translate-y-1 overflow-hidden",
                    item.isLordHowe || item.isHistorical 
                      ? "border-amber-500/30 bg-amber-500/[0.03] shadow-amber-500/5" 
                      : "border-white/5 hover:border-primary/30"
                  )}
                >
                   {(item.isLordHowe || item.isHistorical) && (
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                   )}
                   
                   <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.country}</span>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight truncate max-w-[180px]">
                          {item.zone.split('/').pop()?.replace('_', ' ')}
                        </h3>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        item.isLordHowe || item.isHistorical ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                        item.type === 'Spring Forward' 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                      )}>
                        {item.isLordHowe ? '±30m' : item.type === 'Spring Forward' ? '+1h' : item.type === 'Fall Back' ? '-1h' : 'Shift'}
                      </div>
                   </div>

                   <div className="space-y-4">
                      {item.description && (
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex gap-3">
                           {item.isLordHowe ? <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> : <History className="w-4 h-4 text-amber-500 shrink-0" />}
                           <p className="text-[11px] font-bold text-white/50 leading-relaxed italic">
                              {item.description}
                           </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs font-bold text-white/30 border-b border-white/5 pb-4">
                        <span>Time of Change</span>
                        <span className="text-white/80">{item.time}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-white/20 uppercase mb-1">Current</span>
                          <span className="text-sm font-black text-white/60 tabular-nums">GMT {item.offsetBefore >= 0 ? '+' : ''}{item.offsetBefore}</span>
                        </div>
                        <ArrowRight className={cn("text-primary/40", (item.isLordHowe || item.isHistorical) && "text-amber-500/40")} size={16} />
                        <div className="flex flex-col text-right">
                          <span className={cn("text-[9px] font-black uppercase mb-1", (item.isLordHowe || item.isHistorical) ? "text-amber-500/60" : "text-primary/60")}>Target</span>
                          <span className={cn("text-sm font-black tabular-nums", (item.isLordHowe || item.isHistorical) ? "text-amber-500" : "text-primary")}>GMT {item.offsetAfter >= 0 ? '+' : ''}{item.offsetAfter}</span>
                        </div>
                      </div>
                   </div>

                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="text-primary/40 w-5 h-5" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {groupedChanges.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
             <Timer size={48} className="mx-auto text-white/10 mb-6" />
             <h3 className="text-xl font-black text-white italic">No changes found</h3>
             <p className="text-white/40 font-medium">Try adjusting your search or check back later for new updates.</p>
          </div>
        )}
      </div>

      {/* Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-16 border-t border-white/5">
        <div className="p-10 bg-[#1a0b36]/40 border border-white/10 rounded-[2.5rem] space-y-6">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
            <Info className="text-primary" size={24} />
          </div>
          <h4 className="text-xl font-black text-white uppercase tracking-tight">Why do we use DST?</h4>
          <p className="text-base text-white/50 leading-relaxed font-medium">
            Daylight Saving Time (DST) is the practice of advancing clocks during warmer months so that darkness falls at a later clock time. The main purpose is to make better use of daylight by having the sun rise and set later. This practice is observed by over 70 countries worldwide.
          </p>
        </div>
        <div className="p-10 bg-[#1a0b36]/40 border border-white/10 rounded-[2.5rem] space-y-6">
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/20">
            <Sparkles className="text-amber-500" size={24} />
          </div>
          <h4 className="text-xl font-black text-white uppercase tracking-tight">The 30-Minute Exception</h4>
          <p className="text-base text-white/50 leading-relaxed font-medium">
            While standard DST transitions are exactly 60 minutes, Lord Howe Island (Australia) uses a unique 30-minute shift. This rare adjustment makes it one of the most interesting time zones for horologists and researchers.
          </p>
        </div>
      </div>
    </div>
  )
}
