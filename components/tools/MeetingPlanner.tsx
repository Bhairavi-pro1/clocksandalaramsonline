'use client'
import { useState, useEffect } from 'react'
import { Users, Calendar, Plus, Info, X } from 'lucide-react'
import { DateTime } from 'luxon'
import { cn } from '@/lib/utils'
import { countryToZone } from '@/lib/timezoneData'
import LocationSearch from '@/components/ui/LocationSearch'
import { useStore } from '@/hooks/useStore'
import { useClock } from '@/hooks/useClock'

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const PERIODS = ['AM', 'PM']

export default function MeetingPlanner() {
  const is24Hour = useStore((state) => state.is24Hour)
  const clock = useClock(is24Hour)

  const [tz1, setTz1] = useState('local')
  const [targetZones, setTargetZones] = useState<string[]>(['America/New_York'])
  
  // Time state for input
  const [inputHour, setInputHour] = useState('09')
  const [inputMinute, setInputMinute] = useState('00')
  const [inputPeriod, setInputPeriod] = useState('AM')
  
  const [selectedDate, setSelectedDate] = useState<string>(DateTime.now().toISODate() || '')
  const [mounted, setMounted] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedTz1 = localStorage.getItem('mp_tz1')
    const savedTargetZones = localStorage.getItem('mp_targetZones')
    const savedDate = localStorage.getItem('mp_selectedDate')
    const savedHour = localStorage.getItem('mp_hour')
    const savedMinute = localStorage.getItem('mp_minute')
    const savedPeriod = localStorage.getItem('mp_period')

    const now = DateTime.now()

    if (savedTz1) setTz1(savedTz1)
    if (savedTargetZones) setTargetZones(JSON.parse(savedTargetZones))
    
    if (savedDate) {
      setSelectedDate(savedDate)
    } else {
      setSelectedDate(now.toISODate() || '')
    }

    if (savedHour) {
      setInputHour(savedHour)
      if (savedPeriod) setInputPeriod(savedPeriod)
    } else {
      let h = now.hour
      const p = h >= 12 ? 'PM' : 'AM'
      if (h === 0) h = 12
      else if (h > 12) h -= 12
      setInputHour(String(h).padStart(2, '0'))
      setInputPeriod(p)
    }

    if (savedMinute) {
      setInputMinute(savedMinute)
    } else {
      setInputMinute(String(now.minute).padStart(2, '0'))
    }
    
    setMounted(true)
  }, [])

  // Save state to localStorage on change
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('mp_tz1', tz1)
    localStorage.setItem('mp_targetZones', JSON.stringify(targetZones))
    localStorage.setItem('mp_selectedDate', selectedDate)
    localStorage.setItem('mp_hour', inputHour)
    localStorage.setItem('mp_minute', inputMinute)
    localStorage.setItem('mp_period', inputPeriod)
  }, [tz1, targetZones, selectedDate, inputHour, inputMinute, inputPeriod, mounted])
  
  const getTzLabel = (tz: string) => {
    if (tz === 'local') return 'Local Time'
    const country = Object.keys(countryToZone).find(key => countryToZone[key] === tz)
    if (country) return country
    const parts = tz.split('/')
    return parts[parts.length - 1].replace(/_/g, ' ')
  }

  // Get current DateTime object for the origin based on inputs
  const getOriginDateTime = () => {
    let h = parseInt(inputHour)
    if (inputPeriod === 'PM' && h < 12) h += 12
    if (inputPeriod === 'AM' && h === 12) h = 0
    
    return DateTime.fromISO(selectedDate, { 
      zone: tz1 === 'local' ? undefined : tz1 
    }).set({
      hour: h,
      minute: parseInt(inputMinute),
      second: 0,
      millisecond: 0
    })
  }

  const originDateTime = getOriginDateTime()

  const isWorkingHour = (dt: DateTime) => dt.hour >= 9 && dt.hour <= 17
  const isNightHour = (dt: DateTime) => dt.hour >= 22 || dt.hour <= 6

  const addTargetZone = () => {
    setTargetZones([...targetZones, 'Europe/London'])
  }

  const removeTargetZone = (index: number) => {
    setTargetZones(targetZones.filter((_, i) => i !== index))
  }

  const updateTargetZone = (index: number, val: string) => {
    const newZones = [...targetZones]
    newZones[index] = val
    setTargetZones(newZones)
  }

  const generateGoogleCalendarLink = () => {
    const start = originDateTime
    const end = start.plus({ hours: 1 })
    const fmt = "yyyyMMdd'T'HHmmss'Z'"
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=Meeting&dates=${start.toUTC().toFormat(fmt)}/${end.toUTC().toFormat(fmt)}`
  }

  if (!mounted) return null

  return (
    <div className="w-[calc(100%+2rem)] -mx-4 md:mx-auto md:w-full max-w-5xl p-2.5 md:p-8 bg-card/30 backdrop-blur-xl border-x-0 md:border border-slate-200 dark:border-white/10 rounded-none md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-12 gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5">
              <Users className="text-primary w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-lg md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-0.5">Meeting Planner</h2>
              <p className="text-slate-500 dark:text-white/40 text-[10px] md:text-sm font-medium">Coordinate across time zones seamlessly</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 md:gap-6 p-2 md:p-4 bg-slate-100 dark:bg-white/5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <span className="text-[8px] md:text-[11px] font-bold text-slate-600 dark:text-white/60 uppercase tracking-wider md:tracking-widest">Work</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-indigo-500/50 rounded" />
              <span className="text-[8px] md:text-[11px] font-bold text-slate-600 dark:text-white/60 uppercase tracking-wider md:tracking-widest">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500/30 rounded" />
              <span className="text-[8px] md:text-[11px] font-bold text-slate-600 dark:text-white/60 uppercase tracking-wider md:tracking-widest">Sleep</span>
            </div>
          </div>
        </div>

        {/* Local Time Display Bar */}
        <div className="bg-slate-100/70 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200/80 dark:border-white/5 p-3 sm:p-5 rounded-2xl flex flex-row items-center justify-between gap-4 mb-4 md:mb-8 shadow-sm">
          {/* Left Side: Label & Digital Clock */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 text-primary mb-0.5 sm:mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/45">Local Time</span>
            </div>
            <div className="font-mono text-xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tabular-nums flex items-baseline gap-0.5 drop-shadow-sm">
              <span>{clock.hours}</span>
              <span className="text-primary/80 animate-pulse mx-0.5">:</span>
              <span>{clock.minutes}</span>
              <span className="text-primary/80 animate-pulse mx-0.5">:</span>
              <span className="text-base sm:text-xl md:text-2xl text-slate-700 dark:text-white/90">{clock.seconds}</span>
              {!is24Hour && (
                <span className="text-[10px] sm:text-xs md:text-sm font-normal text-slate-500 dark:text-white/40 ml-1.5 tracking-tighter uppercase">{clock.period}</span>
              )}
            </div>
          </div>

          {/* Right Side: Current Date & Timezone */}
          <div className="flex flex-col items-end text-right">
            <div className="text-slate-800 dark:text-white/85 font-bold text-[11px] sm:text-sm md:text-base tracking-tight">
              {clock.date}
            </div>
            <div className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 dark:text-white/35 uppercase font-black tracking-wider mt-0.5">
              {clock.timezone}
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-12">
          {/* Origin Section */}
          <div className="bg-slate-50/50 dark:bg-white/5 p-2.5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-200/60 dark:border-white/5 space-y-4 md:space-y-8">
            <div className="grid grid-cols-3 gap-1.5 md:gap-8 items-end">
              <div className="space-y-1.5 md:space-y-3 min-w-0">
                <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-primary/60 ml-0.5 block truncate">Origin Zone</label>
                <LocationSearch 
                  value={tz1}
                  onChange={setTz1}
                  className="w-full"
                  dropdownAlign="left"
                />
              </div>

              <div className="space-y-1.5 md:space-y-3 min-w-0">
                <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-primary/60 ml-0.5 block truncate">Select Date</label>
                <div className="relative group">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-[#1a0b36]/40 border border-slate-200 dark:border-white/10 rounded-2xl px-2 py-2 md:px-5 md:py-4 text-[10px] md:text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 dark:[color-scheme:dark] min-w-0"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-3 min-w-0">
                <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-primary/60 ml-0.5 block truncate">Set Time</label>
                <div className="flex bg-slate-100 dark:bg-[#1a0b36]/40 border border-slate-200 dark:border-white/10 rounded-2xl p-0.5 md:p-1.5 gap-0.5 md:gap-2 justify-between min-w-0">
                  <div className="relative group flex-1">
                    <select 
                      value={inputHour}
                      onChange={(e) => setInputHour(e.target.value)}
                      className="bg-transparent text-xs md:text-xl font-bold text-slate-800 dark:text-white py-1 md:py-2 focus:outline-none appearance-none cursor-pointer w-full text-center"
                    >
                      {HOURS.map(h => <option key={h} value={h} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{h}</option>)}
                    </select>
                  </div>
                  <span className="text-xs md:text-xl font-bold text-slate-800/40 dark:text-white/40 self-center">:</span>
                  <div className="relative group flex-1">
                    <select 
                      value={inputMinute}
                      onChange={(e) => setInputMinute(e.target.value)}
                      className="bg-transparent text-xs md:text-xl font-bold text-slate-800 dark:text-white py-1 md:py-2 focus:outline-none appearance-none cursor-pointer w-full text-center"
                    >
                      {MINUTES.map(m => <option key={m} value={m} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{m}</option>)}
                    </select>
                  </div>
                  <div className="relative group flex-shrink-0">
                    <select 
                      value={inputPeriod}
                      onChange={(e) => setInputPeriod(e.target.value)}
                      className="bg-primary/20 text-primary text-[9px] md:text-sm font-black px-1 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl focus:outline-none appearance-none cursor-pointer hover:bg-primary/30 transition-colors"
                    >
                      {PERIODS.map(p => <option key={p} value={p} className="bg-white dark:bg-[#1a0b36] text-slate-800 dark:text-white">{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Zones Configuration */}
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5 mb-2.5">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500 dark:text-white/20 pl-1">Target Timezones</h3>
              <button
                onClick={() => setIsSearching(prev => !prev)}
                className="flex items-center justify-center bg-primary text-white p-1.5 md:p-2 rounded-full hover:scale-105 transition-transform"
                aria-label="Add Timezone"
              >
                <Plus size={14} className="md:w-4 md:h-4" />
              </button>
            </div>

            {isSearching && (
              <div className="bg-slate-50/50 dark:bg-white/5 p-2 md:p-2.5 rounded-2xl border border-slate-200/60 dark:border-white/5 mb-3 max-w-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-1 min-w-0">
                  <LocationSearch 
                    value=""
                    onChange={(val) => {
                      if (val && val !== 'local') {
                        setTargetZones([...targetZones, val])
                        setIsSearching(false)
                      }
                    }}
                    placeholder="Search country to add..."
                    dropdownAlign="left"
                  />
                </div>
                <button
                  onClick={() => setIsSearching(false)}
                  className="text-slate-400 dark:text-white/20 hover:text-red-500 transition-colors p-1"
                  aria-label="Cancel search"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-1.5 md:gap-6">
              {targetZones.map((tz, index) => (
                <div key={`${tz}-${index}`} className="relative group transition-all duration-500 animate-in fade-in zoom-in-95 min-w-0">
                    <div className="bg-slate-50/50 dark:bg-white/5 p-1.5 md:p-6 rounded-xl md:rounded-3xl border border-slate-200/60 dark:border-white/5 group-hover:bg-slate-100/50 dark:group-hover:bg-white/[0.07] group-hover:border-slate-300 dark:group-hover:border-white/10 transition-all min-w-0">
                      <div className="flex justify-between items-center mb-1.5 md:mb-3 min-w-0">
                          <span className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-widest opacity-50 truncate mr-1">Zone #{index + 1}</span>
                          <button 
                            onClick={() => removeTargetZone(index)}
                            className="text-slate-400 dark:text-white/20 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <X size={12} className="md:w-4 md:h-4" />
                          </button>
                      </div>
                      <LocationSearch 
                          value={tz}
                          onChange={(val) => updateTargetZone(index, val)}
                          className="w-full"
                          dropdownAlign={index % 3 === 0 ? 'left' : index % 3 === 2 ? 'right' : 'center'}
                        />
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="mt-6 md:mt-16 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-200 to-transparent dark:from-white/10 dark:to-transparent p-0.5 md:p-1 rounded-2xl md:rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[0.9rem] md:rounded-[2.4rem] p-2.5 md:p-10">
                  <div className="flex flex-col gap-4 md:gap-10">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 md:px-4 md:py-2 bg-primary/20 text-primary text-[9px] md:text-[11px] font-black rounded-full uppercase tracking-[0.2em] border border-primary/20 shadow-sm">
                        Meeting Sync Results
                      </div>
                      <div className="h-px bg-slate-200 dark:bg-white/5 flex-1" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1.5 md:gap-5">
                      {/* Origin Zone Result Card */}
                      <div className="flex flex-col justify-start gap-1.5 md:gap-4 p-2 md:p-6 bg-primary/10 rounded-2xl md:rounded-3xl border border-primary/20 group hover:border-primary/40 transition-all shadow-lg shadow-primary/5 min-h-[90px] md:min-h-[135px]">
                        <div className="flex items-center justify-between mb-2 md:mb-4 min-w-0">
                          <span className="text-primary/60 font-black uppercase text-[8px] md:text-[10px] tracking-widest truncate mr-1" title={getTzLabel(tz1)}>{getTzLabel(tz1)}</span>
                          <div className="px-1 py-0.5 rounded-full bg-primary/20 text-[6px] md:text-[8px] font-black text-primary uppercase flex-shrink-0">Org</div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase mb-0.5 md:mb-1 leading-none">{originDateTime.toFormat('ccc, MMM dd')}</span>
                          <span className="text-lg md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-0.5 md:mb-2">
                            {originDateTime.toFormat(mounted && is24Hour ? 'HH:mm' : 'hh:mm')}
                          </span>
                          {(!mounted || !is24Hour) && (
                            <span className="text-[9px] md:text-sm font-bold text-primary uppercase leading-none">
                              {originDateTime.toFormat('a')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Target Zone Result Cards */}
                      {targetZones.map((tz, i) => {
                        const dtN = originDateTime.setZone(tz)
                        const isDifferentDay = dtN.toISODate() !== originDateTime.toISODate()
                        const isWorking = isWorkingHour(dtN)
                        const isNight = isNightHour(dtN)

                        return (
                          <div key={i} className="flex flex-col justify-start gap-1.5 md:gap-4 p-2 md:p-6 bg-slate-50 dark:bg-white/5 rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-white/5 group hover:bg-slate-100/50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10 transition-all min-h-[90px] md:min-h-[135px]">
                            <div className="flex items-center justify-between mb-2 md:mb-4 min-w-0">
                              <span className="text-slate-500 dark:text-white/40 font-black uppercase text-[8px] md:text-[10px] tracking-widest truncate mr-1" title={getTzLabel(tz)}>
                                {getTzLabel(tz)}
                              </span>
                              {isWorking ? (
                                <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0" />
                              ) : isNight ? (
                                <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-red-500/50 rounded-full flex-shrink-0" />
                              ) : (
                                <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-indigo-500/40 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-[7px] md:text-[10px] font-bold uppercase mb-0.5 md:mb-1 leading-none",
                                isDifferentDay ? "text-accent" : "text-slate-400 dark:text-white/30"
                              )}>{dtN.toFormat('ccc, MMM dd')}</span>
                              <span className="text-lg md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-0.5 md:mb-2">
                                {dtN.toFormat(mounted && is24Hour ? 'HH:mm' : 'hh:mm')}
                              </span>
                              {(!mounted || !is24Hour) && (
                                <span className={cn(
                                  "text-[9px] md:text-sm font-bold uppercase leading-none",
                                  isWorking ? "text-emerald-400" : isNight ? "text-red-400/60" : "text-slate-500 dark:text-white/40"
                                )}>
                                  {dtN.toFormat('a')}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 pt-4 md:pt-6 border-t border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-white/60 text-[10px] md:text-xs font-bold">
                        <Info className="w-4 h-4 text-primary dark:text-primary/60 flex-shrink-0" />
                        <span>Coordinate your global team with a single calendar invite</span>
                      </div>
                      <a 
                        href={generateGoogleCalendarLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-black transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10 w-full sm:w-auto"
                      >
                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        Schedule Meeting
                      </a>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
