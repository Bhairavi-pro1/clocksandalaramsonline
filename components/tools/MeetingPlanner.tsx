'use client'
import { useState, useEffect } from 'react'
import { Users, Calendar, ArrowRight, Share2, Plus, Info, X, Clock, ChevronDown } from 'lucide-react'
import { DateTime } from 'luxon'
import { cn } from '@/lib/utils'
import { countryToZone } from '@/lib/timezoneData'
import LocationSearch from '@/components/ui/LocationSearch'

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const PERIODS = ['AM', 'PM']

export default function MeetingPlanner() {
  const [tz1, setTz1] = useState('local')
  const [targetZones, setTargetZones] = useState<string[]>(['America/New_York'])
  
  // Time state for input
  const [inputHour, setInputHour] = useState('09')
  const [inputMinute, setInputMinute] = useState('00')
  const [inputPeriod, setInputPeriod] = useState('AM')
  
  const [selectedDate, setSelectedDate] = useState<string>(DateTime.now().toISODate() || '')
  const [mounted, setMounted] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedTz1 = localStorage.getItem('mp_tz1')
    const savedTargetZones = localStorage.getItem('mp_targetZones')
    const savedDate = localStorage.getItem('mp_selectedDate')
    const savedHour = localStorage.getItem('mp_hour')
    const savedMinute = localStorage.getItem('mp_minute')
    const savedPeriod = localStorage.getItem('mp_period')

    if (savedTz1) setTz1(savedTz1)
    if (savedTargetZones) setTargetZones(JSON.parse(savedTargetZones))
    if (savedDate) setSelectedDate(savedDate)
    if (savedHour) setInputHour(savedHour)
    if (savedMinute) setInputMinute(savedMinute)
    if (savedPeriod) setInputPeriod(savedPeriod)
    
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
    <div className="w-full max-w-5xl mx-auto p-8 bg-card/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5">
              <Users className="text-primary w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white mb-1">Meeting Planner</h2>
              <p className="text-white/40 text-sm font-medium">Coordinate across time zones seamlessly</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 bg-emerald-500 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Working Hours</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 bg-indigo-500/50 rounded-md" />
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Normal</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 bg-red-500/30 rounded-md" />
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Sleep / Night</span>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Origin Section */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Origin Zone</label>
                <LocationSearch 
                  value={tz1}
                  onChange={setTz1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Select Date</label>
                <div className="relative group">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#1a0b36]/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-white/10 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Set Time</label>
                <div className="flex bg-[#1a0b36]/40 border border-white/10 rounded-2xl p-1.5 gap-2">
                  <div className="relative group">
                    <select 
                      value={inputHour}
                      onChange={(e) => setInputHour(e.target.value)}
                      className="bg-transparent text-xl font-bold text-white px-3 py-2 focus:outline-none appearance-none cursor-pointer"
                    >
                      {HOURS.map(h => <option key={h} value={h} className="bg-[#1a0b36]">{h}</option>)}
                    </select>
                  </div>
                  <span className="text-xl font-bold text-white/40 self-center">:</span>
                  <div className="relative group">
                    <select 
                      value={inputMinute}
                      onChange={(e) => setInputMinute(e.target.value)}
                      className="bg-transparent text-xl font-bold text-white px-3 py-2 focus:outline-none appearance-none cursor-pointer"
                    >
                      {MINUTES.map(m => <option key={m} value={m} className="bg-[#1a0b36]">{m}</option>)}
                    </select>
                  </div>
                  <div className="relative group">
                    <select 
                      value={inputPeriod}
                      onChange={(e) => setInputPeriod(e.target.value)}
                      className="bg-primary/20 text-primary text-sm font-black px-4 py-2 rounded-xl focus:outline-none appearance-none cursor-pointer hover:bg-primary/30 transition-colors"
                    >
                      {PERIODS.map(p => <option key={p} value={p} className="bg-[#1a0b36]">{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Zones Configuration */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 pl-4">Target Timezones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {targetZones.map((tz, index) => (
                <div key={`${tz}-${index}`} className="relative group transition-all duration-500 animate-in fade-in zoom-in-95">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group-hover:bg-white/[0.07] group-hover:border-white/10 transition-all">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest opacity-50">Zone #{index + 1}</span>
                          <button 
                            onClick={() => removeTargetZone(index)}
                            className="text-white/20 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                      </div>
                      <LocationSearch 
                          value={tz}
                          onChange={(val) => updateTargetZone(index, val)}
                          className="w-full"
                        />
                    </div>
                </div>
              ))}
              
              <button 
                onClick={addTargetZone}
                className="min-h-[140px] rounded-3xl border border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/5 transition-all group flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-accent/20 transition-colors text-white/20 group-hover:text-accent">
                  <Plus size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-accent transition-colors">Add Zone</span>
              </button>
            </div>
          </div>

          {/* Results Grid - Always shown now that there's always an input time */}
          <div className="mt-16 overflow-hidden">
            <div className="bg-gradient-to-br from-white/10 to-transparent p-1 rounded-[2.5rem] border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.4rem] p-8 md:p-10">
                  <div className="flex flex-col gap-10">
                    <div className="flex items-center gap-6">
                      <div className="px-4 py-2 bg-primary/20 text-primary text-[11px] font-black rounded-full uppercase tracking-[0.2em] border border-primary/20 shadow-sm">
                        Meeting Sync Results
                      </div>
                      <div className="h-px bg-white/5 flex-1" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {/* Origin Zone Result Card */}
                      <div className="flex flex-col justify-between p-6 bg-primary/10 rounded-3xl border border-primary/20 group hover:border-primary/40 transition-all shadow-lg shadow-primary/5 min-h-[160px]">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-primary/60 font-black uppercase text-[10px] tracking-widest">{getTzLabel(tz1)}</span>
                          <div className="px-2 py-0.5 rounded-full bg-primary/20 text-[8px] font-black text-primary uppercase">Origin</div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white/30 uppercase mb-1">{originDateTime.toFormat('ccc, MMM dd')}</span>
                          <span className="text-4xl font-black text-white tracking-tight leading-none mb-2">
                            {originDateTime.toFormat('hh:mm')}
                          </span>
                          <span className="text-sm font-bold text-primary uppercase">
                            {originDateTime.toFormat('a')}
                          </span>
                        </div>
                      </div>

                      {/* Target Zone Result Cards */}
                      {targetZones.map((tz, i) => {
                        const dtN = originDateTime.setZone(tz)
                        const isDifferentDay = dtN.toISODate() !== originDateTime.toISODate()
                        const isWorking = isWorkingHour(dtN)
                        const isNight = isNightHour(dtN)

                        return (
                          <div key={i} className="flex flex-col justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 hover:border-white/10 transition-all min-h-[160px]">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-white/40 font-black uppercase text-[10px] tracking-widest truncate mr-2" title={getTzLabel(tz)}>
                                {getTzLabel(tz)}
                              </span>
                              {isWorking ? (
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                              ) : isNight ? (
                                <div className="w-2.5 h-2.5 bg-red-500/50 rounded-full" />
                              ) : (
                                <div className="w-2.5 h-2.5 bg-indigo-500/40 rounded-full" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-[10px] font-bold uppercase mb-1",
                                isDifferentDay ? "text-accent" : "text-white/30"
                              )}>{dtN.toFormat('ccc, MMM dd')}</span>
                              <span className="text-4xl font-black text-white tracking-tight leading-none mb-2">
                                {dtN.toFormat('hh:mm')}
                              </span>
                              <span className={cn(
                                "text-sm font-bold uppercase",
                                isWorking ? "text-emerald-400" : isNight ? "text-red-400/60" : "text-white/40"
                              )}>
                                {dtN.toFormat('a')}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-white/40 text-xs font-bold">
                        <Info className="w-4 h-4 text-primary/40" />
                        <span>Coordinate your global team with a single calendar invite</span>
                      </div>
                      <a 
                        href={generateGoogleCalendarLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2.5 bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-black hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-500 active:scale-95 shadow-xl shadow-primary/10 group w-full sm:w-auto"
                      >
                        <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
