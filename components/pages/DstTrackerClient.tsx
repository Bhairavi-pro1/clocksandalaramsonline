'use client'
import { useState, useMemo, useEffect } from 'react'
import { 
  ArrowRight, 
  Info, 
  Globe, 
  ArrowUpRight, 
  Timer, 
  Search, 
  X, 
  Sparkles, 
  History,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DSTChange, getUpcomingDSTChanges } from '@/lib/dst'

interface Props {
  initialChanges: DSTChange[]
}

export default function DstTrackerClient({ initialChanges }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleGroups, setVisibleGroups] = useState(5)
  const [allChanges, setAllChanges] = useState<DSTChange[]>(initialChanges)
  useEffect(() => {
    setAllChanges(getUpcomingDSTChanges())
  }, [])

  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 1) return []
    const lSearch = searchTerm.toLowerCase()
    
    const countryMatches = new Set<string>()
    const cityMatches = new Set<string>()
    
    allChanges.forEach(item => {
      const city = item.zone.split('/').pop()?.replace(/_/g, ' ') || ''
      if (item.country.toLowerCase().includes(lSearch)) {
        countryMatches.add(item.country)
      }
      if (city.toLowerCase().includes(lSearch)) {
        cityMatches.add(city)
      }
    })
    
    const results: { type: 'country' | 'city', label: string, value: string }[] = []
    
    // Add country matches first
    Array.from(countryMatches).slice(0, 3).forEach(c => {
      results.push({ type: 'country', label: c, value: c })
    })
    
    // Add city matches
    Array.from(cityMatches).slice(0, 4).forEach(c => {
      results.push({ type: 'city', label: c, value: c })
    })
    
    return results.slice(0, 6)
  }, [allChanges, searchTerm])

  useEffect(() => {
    setVisibleGroups(5)
  }, [searchTerm])

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

  const nextWaveDays = useMemo(() => {
    if (allChanges.length === 0) return 0
    return allChanges[0]?.daysRemaining || 0
  }, [allChanges])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-16">
      {/* Hero Summary Section */}
      <div className="relative p-5 md:p-16 rounded-none border-x-0 md:border md:rounded-[3rem] bg-slate-100 dark:bg-gradient-to-br dark:from-[#1a0b36] dark:via-[#120227] dark:to-black border-slate-200 dark:border-white/10 overflow-visible shadow-none md:shadow-2xl w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-auto">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-32 -mt-32" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] -ml-20 -mb-20" />
         
         <div className="relative z-10 space-y-4 md:space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
               <div className="flex-1 space-y-3 md:space-y-6 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                     <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                       Global Schedule
                     </div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h2 className="text-2xl md:text-6xl font-black text-white tracking-tight leading-none italic">
                     Upcoming <span className="text-primary not-italic">Clock Changes</span>
                  </h2>
                  <p className="text-xs md:text-lg text-white/40 font-medium max-w-xl">
                     A comprehensive live directory of every scheduled Daylight Saving Time transition across the globe for the next 12 months.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-2 md:gap-4 w-full md:w-auto">
                  <div className="p-2.5 md:p-6 rounded-xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform duration-500">
                     <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-0.5 md:mb-1">Total Changes</p>
                     <p className="text-base sm:text-lg md:text-3xl font-black text-white">{allChanges.length}</p>
                  </div>
                  <div className="p-2.5 md:p-6 rounded-xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner">
                     <p className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-widest mb-0.5 md:mb-1">Next Wave</p>
                     <p className="text-base sm:text-lg md:text-3xl font-black text-white">{nextWaveDays}<span className="text-[10px] md:text-sm ml-0.5 md:ml-1 opacity-40 font-bold">days</span></p>
                  </div>
               </div>
            </div>

            {/* Filter Search Bar */}
            <div className="relative max-w-2xl mx-auto w-full group">
               <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
               <div className="relative flex items-center bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 h-10 md:h-14 backdrop-blur-xl focus-within:border-primary/50 transition-all">
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 dark:text-white/20 mr-2.5 md:mr-4" />
                  <input 
                    type="text"
                    placeholder="Search by country or city name..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white font-bold text-xs md:text-base placeholder:text-slate-400 dark:placeholder:text-white/20"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-slate-300/50 dark:hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-4 h-4 text-slate-400 dark:text-white/40" />
                    </button>
                  )}
               </div>

               {/* Suggestions Dropdown */}
               {searchTerm && suggestions.length > 0 && showSuggestions && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-slate-100 dark:bg-[#1a0b36]/95 border border-slate-200 dark:border-white/10 rounded-xl z-50 overflow-hidden divide-y divide-slate-200/50 dark:divide-white/5 backdrop-blur-xl">
                   {suggestions.map((s, idx) => (
                     <div
                       key={idx}
                       onMouseDown={() => {
                         setSearchTerm(s.value)
                         setShowSuggestions(false)
                       }}
                       className="px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer text-slate-800 dark:text-white flex items-center justify-between text-xs md:text-sm font-bold"
                     >
                       <div className="flex items-center gap-2">
                         {s.type === 'country' ? (
                           <Globe className="w-3.5 h-3.5 text-primary/60" />
                         ) : (
                           <MapPin className="w-3.5 h-3.5 text-accent/60" />
                         )}
                         <span>{s.label}</span>
                       </div>
                       <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/30 font-black">
                         {s.type}
                       </span>
                     </div>
                   ))}
                 </div>
               )}
            </div>
         </div>
      </div>
      {/* Changes Timeline */}
      <div className="space-y-8 md:space-y-12">
        {groupedChanges.slice(0, visibleGroups).map((group, gIdx) => (
          <div key={group.date} className="space-y-4 md:space-y-8">
            <div className="flex items-center gap-3 md:gap-6 group">
              <div className="flex items-baseline gap-1.5 md:gap-2">
                <h2 className="text-base sm:text-lg md:text-3xl font-black text-white tracking-tight">{group.date}</h2>
                <span className="text-primary font-black uppercase text-[9px] sm:text-xs tracking-widest whitespace-nowrap">
                  <span className="hidden sm:inline">({group.daysRemaining} days remaining)</span>
                  <span className="inline sm:hidden">({group.daysRemaining}d left)</span>
                </span>
              </div>
              <div className="h-px bg-white/10 flex-1 group-hover:bg-primary/20 transition-colors" />
            </div>

            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </div>
              ))}
            </div>

            {/* Mobile Compact List Layout (Full-Width, High Density) */}
            <div className="block md:hidden w-[calc(100%+2rem)] -mx-4 border-y border-slate-200 dark:border-white/10 bg-[#1a0b2e]/40 divide-y divide-slate-200 dark:divide-white/10">
              {group.items.map((item, iIdx) => (
                <div 
                  key={`${item.zone}-${iIdx}-mobile`}
                  className={cn(
                    "flex flex-col p-4 relative overflow-hidden",
                    item.isLordHowe || item.isHistorical 
                      ? "bg-amber-500/[0.03]" 
                      : ""
                  )}
                >
                   {/* Top Row: Badge, Time + GMT change, Days countdown */}
                   <div className="flex items-center justify-between gap-2 mb-1.5">
                     <div className="flex items-center gap-1.5 min-w-0">
                       <span className={cn(
                         "px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-wider border flex-shrink-0",
                         item.isLordHowe || item.isHistorical ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                         item.type === 'Spring Forward' 
                           ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                           : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                       )}>
                         {item.isLordHowe ? '±30m' : item.type === 'Spring Forward' ? '+1h' : item.type === 'Fall Back' ? '-1h' : 'Shift'}
                       </span>
                       <span className="text-white font-bold text-xs tabular-nums flex-shrink-0">
                         {item.time}
                       </span>
                       <span className="text-white/20 text-[10px] font-medium flex-shrink-0">|</span>
                       <span className="text-white/60 text-xs font-bold tabular-nums truncate">
                         GMT {item.offsetBefore >= 0 ? '+' : ''}{item.offsetBefore} → {item.offsetAfter >= 0 ? '+' : ''}{item.offsetAfter}
                       </span>
                     </div>
                     <span className="text-primary text-[10px] font-black uppercase tracking-wider flex-shrink-0">
                       {item.daysRemaining}d left
                     </span>
                   </div>

                   {/* Bottom Row: Location (City, Country), Type Label */}
                   <div className="flex items-baseline justify-between gap-4">
                     <div className="flex items-center gap-1.5 min-w-0">
                       <span className="text-white font-black text-sm truncate">
                         {item.zone.split('/').pop()?.replace('_', ' ')}
                       </span>
                       <span className="text-white/40 text-[10px] font-medium truncate">
                         ({item.country})
                       </span>
                     </div>
                     <span className="text-white/30 text-[9px] font-black uppercase tracking-wider flex-shrink-0">
                       {item.type}
                     </span>
                   </div>

                   {/* Description (Optional) */}
                   {item.description && (
                     <div className="mt-1.5 flex gap-1.5 items-start">
                       {item.isLordHowe ? (
                         <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                       ) : (
                         <History className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                       )}
                       <p className="text-[9px] font-bold text-white/40 leading-normal italic">
                         {item.description}
                       </p>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {groupedChanges.length > visibleGroups && (
          <div className="flex justify-center pt-4 pb-8">
            <button 
              onClick={() => setVisibleGroups(prev => prev + 10)}
              className="px-6 py-3 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              Load More Dates
            </button>
          </div>
        )}

        {groupedChanges.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
             <Timer size={48} className="mx-auto text-white/10 mb-6" />
             <h3 className="text-xl font-black text-white italic">No changes found</h3>
             <p className="text-white/40 font-medium">Try adjusting your search or check back later for new updates.</p>
          </div>
        )}
      </div>

      {/* Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-10 sm:pt-16 border-t border-white/5">
        <div className="p-4 sm:p-8 bg-[#1a0b36]/40 border border-white/10 rounded-2xl sm:rounded-[2.5rem] space-y-3 sm:space-y-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20 shrink-0">
            <Info className="text-primary" size={20} />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Why do we use DST?</h4>
          <p className="text-xs sm:text-base text-white/50 leading-relaxed text-justify font-medium">
            Daylight Saving Time (DST) is the practice of advancing clocks during warmer months so that darkness falls at a later clock time. The main purpose is to make better use of daylight by having the sun rise and set later. This practice is observed by over 70 countries worldwide.
          </p>
        </div>
        <div className="p-4 sm:p-8 bg-[#1a0b36]/40 border border-white/10 rounded-2xl sm:rounded-[2.5rem] space-y-3 sm:space-y-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-amber-500/20 shrink-0">
            <Sparkles className="text-amber-500" size={20} />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">The 30-Minute Exception</h4>
          <p className="text-xs sm:text-base text-white/50 leading-relaxed text-justify font-medium">
            While standard DST transitions are exactly 60 minutes, Lord Howe Island (Australia) uses a unique 30-minute shift. This rare adjustment makes it one of the most interesting time zones for horologists and researchers.
          </p>
        </div>
      </div>
    </div>
  )
}
