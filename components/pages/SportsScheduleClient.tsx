'use client'

import { useState, useEffect, useMemo } from 'react'
import { DateTime } from 'luxon'
import { Trophy, CalendarDays, MapPin, Clock, Search, Zap, Flame, Bell, Info, Sparkles, Filter } from 'lucide-react'
import LocationSearch from '@/components/ui/LocationSearch'
import { cn } from '@/lib/utils'
import { countryToZone } from '@/lib/timezoneData'

interface SportMatch {
  id: string
  sport: 'football' | 'football-fifa' | 'basketball' | 'cricket' | 'tennis' | 'formula1'
  title: string
  tournament: string
  utcTime: string
  venue: string
  status: 'upcoming' | 'live' | 'finished'
  homeTeam?: string
  awayTeam?: string
}

const QUICK_COUNTRIES = [
  { label: 'My Local Time', value: 'local' },
  { label: 'India', value: 'Asia/Kolkata' },
  { label: 'United Kingdom', value: 'Europe/London' },
  { label: 'United States (NY)', value: 'America/New_York' },
  { label: 'Australia (Syd)', value: 'Australia/Sydney' },
  { label: 'Japan', value: 'Asia/Tokyo' }
]

const SPORT_COLORS = {
  'football-fifa': { bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', hover: 'group-hover:border-indigo-500/40' },
  football: { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', hover: 'group-hover:border-emerald-500/40' },
  basketball: { bg: 'bg-orange-500/10 border-orange-500/20 text-orange-400', hover: 'group-hover:border-orange-500/40' },
  cricket: { bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400', hover: 'group-hover:border-sky-500/40' },
  tennis: { bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', hover: 'group-hover:border-yellow-500/40' },
  formula1: { bg: 'bg-red-500/10 border-red-500/20 text-red-400', hover: 'group-hover:border-red-500/40' }
}

const SPORT_LABELS: Record<SportMatch['sport'], string> = {
  'football-fifa': 'FIFA 2026',
  football: 'Club Football',
  basketball: 'Basketball',
  cricket: 'Cricket',
  tennis: 'Tennis',
  formula1: 'Formula 1'
}

export default function SportsScheduleClient() {
  const [matches, setMatches] = useState<SportMatch[]>([])
  const [selectedTimezone, setSelectedTimezone] = useState<string>('local')
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('football-fifa')
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [loading, setLoading] = useState<boolean>(true)
  const [updateAlert, setUpdateAlert] = useState<boolean>(false)
  const [resolvedTimezone, setResolvedTimezone] = useState<string>('UTC')

  // Resolve timezone string display name
  const timezoneDisplayName = useMemo(() => {
    if (selectedTimezone === 'local') {
      return resolvedTimezone
    }
    return selectedTimezone
  }, [selectedTimezone, resolvedTimezone])

  // Get active local offsets
  const localOffsetInfo = useMemo(() => {
    const tz = selectedTimezone === 'local' ? resolvedTimezone : selectedTimezone
    const now = DateTime.now()
    const targetTime = now.setZone(tz)
    const localTime = now.toLocal()
    
    const diffMinutes = targetTime.offset - localTime.offset
    const diffHours = diffMinutes / 60
    
    const formattedOffset = targetTime.toFormat('ZZZZ') // e.g., GMT+5:30
    
    if (diffHours === 0) {
      return { diffText: 'Matches your system time', offsetText: formattedOffset }
    } else {
      const absHours = Math.abs(diffHours)
      const hours = Math.floor(absHours)
      const mins = Math.round((absHours - hours) * 60)
      const timeDiffStr = `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`
      const direction = diffHours > 0 ? 'ahead of' : 'behind'
      return { 
        diffText: `${timeDiffStr} ${direction} your local time`, 
        offsetText: formattedOffset 
      }
    }
  }, [selectedTimezone, resolvedTimezone])

  // 1. Initial Mount: Local Storage Cache and Timezone Detection
  useEffect(() => {
    // Detect system local timezone
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    setResolvedTimezone(localZone)

    // Load from cache first
    const cached = localStorage.getItem('sports_schedule_cached')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMatches(parsed)
          setLoading(false)
        }
      } catch (e) {
        console.error('Failed to parse cached schedule:', e)
      }
    }

    // 2. Fetch Latest from Server API (Background Update)
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/sports', { cache: 'no-store' })
        if (!res.ok) throw new Error('API fetch failed')
        const data = await res.json()
        
        if (data && Array.isArray(data.matches)) {
          // Compare with cached to see if changes occurred
          const freshString = JSON.stringify(data.matches)
          const cachedString = cached || ''
          
          if (freshString !== cachedString) {
            setMatches(data.matches)
            localStorage.setItem('sports_schedule_cached', freshString)
            if (cached) {
              // Only alert if they already had cached data and it changed
              setUpdateAlert(true)
              setTimeout(() => setUpdateAlert(false), 5000)
            }
          }
        }
      } catch (err) {
        console.error('Failed to sync sports schedule:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatest()
  }, [])

  // 3. Keep running clock in the selected timezone
  useEffect(() => {
    const updateTime = () => {
      const tz = selectedTimezone === 'local' ? resolvedTimezone : selectedTimezone
      setCurrentTimeStr(DateTime.now().setZone(tz).toFormat('hh:mm:ss a (ZZZZ)'))
    }
    
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [selectedTimezone, resolvedTimezone])

  // 4. Filtering and Searching matches
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // Category filter
      if (activeCategory !== 'all' && match.sport !== activeCategory) {
        return false
      }
      
      // Status filter
      if (activeStatus !== 'all' && match.status !== activeStatus) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const titleMatch = match.title.toLowerCase().includes(query)
        const tourMatch = match.tournament.toLowerCase().includes(query)
        const venueMatch = match.venue.toLowerCase().includes(query)
        return titleMatch || tourMatch || venueMatch
      }

      return true
    })
  }, [matches, activeCategory, activeStatus, searchQuery])

  // Quick timezone select helper
  const handleQuickSelect = (tz: string) => {
    setSelectedTimezone(tz)
  }

  // Format timezone string to country label for displays
  const selectedCountryLabel = useMemo(() => {
    if (selectedTimezone === 'local') return 'My Local Time'
    const quick = QUICK_COUNTRIES.find(c => c.value === selectedTimezone)
    if (quick) return quick.label
    
    // Find in countryToZone mapping
    const entry = Object.entries(countryToZone).find(([_, zone]) => zone === selectedTimezone)
    return entry ? entry[0] : selectedTimezone.split('/').pop()?.replace(/_/g, ' ') || selectedTimezone
  }, [selectedTimezone])

  return (
    <div className="w-full space-y-10 pb-12">
      {/* Dynamic Toast/Update Alert */}
      {updateAlert && (
        <div className="fixed bottom-8 right-8 z-[200] bg-primary border border-white/20 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500 text-white">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          <div className="text-sm font-bold">Timetable updated in real-time!</div>
        </div>
      )}

      {/* Timezone Selector Glassmorphic Dashboard */}
      <section className="bg-card border border-card-border/40 rounded-[2rem] p-6 md:p-8 relative group shadow-2xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 transition-transform duration-1000 ease-out z-0">
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/30 blur-[100px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/30 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left panel: Info and current time in selected country */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Timezone Sync Engine</span>
            </div>
            
            <h3 className="text-3xl font-black text-white tracking-tight font-display">
              Displaying Times in <span className="text-primary italic">{selectedCountryLabel}</span>
            </h3>
            
            <p className="text-muted/80 text-sm max-w-xl font-medium leading-relaxed">
              Timetable matches will automatically convert to the timezone of your selected country. 
              Search for any country below to shift the schedule dynamically.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {QUICK_COUNTRIES.map((country) => {
                const isActive = selectedTimezone === country.value
                return (
                  <button
                    key={country.value}
                    onClick={() => handleQuickSelect(country.value)}
                    className={cn(
                      "text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-full border transition-all active:scale-95",
                      isActive
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    {country.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right panel: Selector widget and active clock */}
          <div className="lg:col-span-5 bg-white/5 border border-white/5 p-6 rounded-3xl space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Search Country</label>
              <LocationSearch 
                value={selectedTimezone} 
                onChange={setSelectedTimezone} 
                className="w-full"
              />
            </div>

            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-white/40">Current Clock</span>
                <span className="text-lg font-black text-white font-tabular leading-tight block mt-1">
                  {currentTimeStr || 'Loading...'}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black uppercase tracking-widest text-white/40">Offset Info</span>
                <span className="text-xs font-bold text-primary block mt-1">
                  {localOffsetInfo.diffText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Timetable Display Section */}
      <div className="space-y-6">
        {/* Timetable Toolbar (Search, Sport Categories, Status) */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
          {/* Sport Selection Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
            {[
              { id: 'football-fifa', label: 'FIFA World Cup 2026', icon: Trophy },
              { id: 'football', label: 'Club Football', icon: Flame },
              { id: 'basketball', label: 'Basketball', icon: Zap },
              { id: 'cricket', label: 'Cricket', icon: Trophy },
              { id: 'tennis', label: 'Tennis', icon: Trophy },
              { id: 'formula1', label: 'Formula 1', icon: Zap }
            ].map((sport) => {
              const isActive = activeCategory === sport.id
              return (
                <button
                  key={sport.id}
                  onClick={() => setActiveCategory(sport.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20 border border-primary/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <sport.icon className="w-3.5 h-3.5" />
                  <span>{sport.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search and Status Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search matches or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
              />
            </div>

            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all"
            >
              <option value="all" className="bg-[#120227]">All Status</option>
              <option value="upcoming" className="bg-[#120227]">Upcoming</option>
              <option value="live" className="bg-[#120227]">Live</option>
              <option value="finished" className="bg-[#120227]">Finished</option>
            </select>
          </div>
        </div>

        {/* Timetable Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[2rem] space-y-4">
            <Clock className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-muted/60 text-sm font-bold uppercase tracking-wider">Syncing matches from server cache...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="bg-card border border-card-border/40 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-500">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/50">
                    <th className="py-4 px-6">Sport</th>
                    <th className="py-4 px-6">Tournament</th>
                    <th className="py-4 px-6">Match</th>
                    <th className="py-4 px-6">Local Start Time</th>
                    <th className="py-4 px-6">Venue</th>
                    <th className="py-4 px-6 text-center">Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredMatches.map((match) => {
                    const tz = selectedTimezone === 'local' ? resolvedTimezone : selectedTimezone
                    const matchDT = DateTime.fromISO(match.utcTime).setZone(tz)
                    
                    const matchDateStr = matchDT.toFormat('EEE, MMM dd, yyyy')
                    const matchTimeStr = matchDT.toFormat('hh:mm a')
                    const matchZoneStr = matchDT.toFormat('ZZZZ')
                    
                    const sportStyle = SPORT_COLORS[match.sport] || { bg: 'bg-white/5 border-white/10 text-white' }
                    const isToday = DateTime.now().setZone(tz).hasSame(matchDT, 'day')

                    return (
                      <tr key={match.id} className="hover:bg-white/[0.03] transition-colors group">
                        {/* Sport Badge */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border", sportStyle.bg)}>
                            {SPORT_LABELS[match.sport] || match.sport}
                          </span>
                        </td>
                        
                        {/* Tournament */}
                        <td className="py-4 px-6 text-[10px] font-black text-primary uppercase tracking-wider whitespace-nowrap max-w-[200px] truncate" title={match.tournament}>
                          {match.tournament}
                        </td>
                        
                        {/* Match Title */}
                        <td className="py-4 px-6 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            {isToday && (
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            )}
                            <span className="font-bold text-white group-hover:text-primary transition-colors text-sm">
                              {match.title}
                            </span>
                          </div>
                        </td>
                        
                        {/* Converted Local Time */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-tabular font-black text-white text-sm">
                            {matchTimeStr}
                          </div>
                          <div className="text-[10px] text-white/40 font-bold mt-0.5">
                            {matchDateStr} ({matchZoneStr})
                          </div>
                        </td>
                        
                        {/* Venue */}
                        <td className="py-4 px-6 text-xs text-white/50 font-semibold whitespace-nowrap max-w-[200px] truncate" title={match.venue}>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-white/20" />
                            <span className="truncate">{match.venue}</span>
                          </div>
                        </td>
                        
                        {/* Action Button */}
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => alert(`Setting a browser alarm alert for: ${match.title} scheduled at ${matchTimeStr} (${selectedCountryLabel} time).`)}
                            className="p-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-xl text-white/50 hover:text-primary transition-all active:scale-90"
                            title="Set Alert Notification"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[2rem] space-y-4">
            <Info className="w-10 h-10 text-white/20 mx-auto" />
            <h4 className="text-lg font-bold text-white leading-none">No Matches Found</h4>
            <p className="text-muted/60 text-sm max-w-sm mx-auto font-medium">
              We couldn't find any matches matching your filters or search query. Try broadening your criteria.
            </p>
          </div>
        )}
      </div>

      {/* SEO Guidelines and Caching explanations */}
      <section className="bg-gradient-to-br from-[#1a0b36]/40 to-transparent border border-violet-500/10 rounded-[2.5rem] p-8 space-y-4">
        <h4 className="text-lg font-black text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <span>How Global Time Conversion Works</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted/80 leading-relaxed font-medium">
          <p>
            Sports events happen globally and are scheduled in Coordinate Universal Time (UTC). When you look at standard calendars, you often have to manually convert these times in your head. 
            This tool resolves this by fetching official event timestamps in UTC from <strong>TheSportsDB</strong> and doing calculations locally in your browser.
          </p>
          <p>
            When you search and select a country, the page instantly converts the UTC timestamp into that country's local time zone using standard IANA data records. 
            This handles Daylight Saving Time (DST) changes automatically so you know exactly when the match begins, regardless of your location.
          </p>
        </div>
      </section>
    </div>
  )
}
