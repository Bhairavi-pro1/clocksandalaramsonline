'use client'

import { useState, useEffect, useMemo } from 'react'
import { DateTime } from 'luxon'
import { Trophy, CalendarDays, MapPin, Clock, Search, Zap, Flame, Bell, ArrowLeft, Calendar, Sparkles, AlertCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import LocationSearch from '@/components/ui/LocationSearch'
import { cn } from '@/lib/utils'
import { countryToZone } from '@/lib/timezoneData'
import { SportMatch, getSportSlug } from '@/lib/sports'

const QUICK_COUNTRIES = [
  { label: 'My Local Time', value: 'local' },
  { label: 'India', value: 'Asia/Kolkata' },
  { label: 'United Kingdom', value: 'Europe/London' },
  { label: 'United States (NY)', value: 'America/New_York' },
  { label: 'Australia (Syd)', value: 'Australia/Sydney' },
  { label: 'Japan', value: 'Asia/Tokyo' }
]

const SPORT_COLORS = {
  'football-fifa': { bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', hover: 'group-hover:border-indigo-500/40', accent: 'text-indigo-400' },
  football: { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', hover: 'group-hover:border-emerald-500/40', accent: 'text-emerald-400' },
  basketball: { bg: 'bg-orange-500/10 border-orange-500/20 text-orange-400', hover: 'group-hover:border-orange-500/40', accent: 'text-orange-400' },
  cricket: { bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400', hover: 'group-hover:border-sky-500/40', accent: 'text-sky-400' },
  tennis: { bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', hover: 'group-hover:border-yellow-500/40', accent: 'text-yellow-400' },
  formula1: { bg: 'bg-red-500/10 border-red-500/20 text-red-400', hover: 'group-hover:border-red-500/40', accent: 'text-red-400' }
}

const SPORT_LABELS: Record<SportMatch['sport'], string> = {
  'football-fifa': 'FIFA World Cup 2026',
  football: 'Club Football',
  basketball: 'Basketball',
  cricket: 'Cricket',
  tennis: 'Tennis',
  formula1: 'Formula 1'
}

interface MatchDetailsClientProps {
  match: SportMatch
}

export default function MatchDetailsClient({ match }: MatchDetailsClientProps) {
  const [selectedTimezone, setSelectedTimezone] = useState<string>('local')
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('')
  const [resolvedTimezone, setResolvedTimezone] = useState<string>('UTC')
  const [hasMounted, setHasMounted] = useState<boolean>(false)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)

  useEffect(() => {
    setHasMounted(true)
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    setResolvedTimezone(localZone)
  }, [])

  // Resolve target timezone
  const tz = useMemo(() => {
    return !hasMounted ? 'UTC' : (selectedTimezone === 'local' ? resolvedTimezone : selectedTimezone)
  }, [selectedTimezone, resolvedTimezone, hasMounted])

  // Running clock in target timezone
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimeStr(DateTime.now().setZone(tz).toFormat('hh:mm:ss a (ZZZZ)'))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [tz])

  // Date and Time Calculations
  const matchDT = useMemo(() => {
    return DateTime.fromISO(match.utcTime).setZone(tz)
  }, [match.utcTime, tz])

  const matchDateStr = useMemo(() => matchDT.toFormat('EEEE, MMMM dd, yyyy'), [matchDT])
  const matchTimeStr = useMemo(() => matchDT.toFormat('hh:mm a'), [matchDT])
  const matchZoneStr = useMemo(() => matchDT.toFormat('ZZZZ'), [matchDT])
  const isToday = useMemo(() => {
    return hasMounted && DateTime.now().setZone(tz).hasSame(matchDT, 'day')
  }, [matchDT, tz, hasMounted])

  // Offset comparisons
  const localOffsetInfo = useMemo(() => {
    if (!hasMounted) {
      return { diffText: 'Loading offset...', offsetText: 'UTC' }
    }
    const now = DateTime.now()
    const targetTime = now.setZone(tz)
    const localTime = now.toLocal()
    
    const diffMinutes = targetTime.offset - localTime.offset
    const diffHours = diffMinutes / 60
    const formattedOffset = targetTime.toFormat('ZZZZ')
    
    if (diffHours === 0) {
      return { diffText: 'Matches your system timezone', offsetText: formattedOffset }
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
  }, [tz, hasMounted])

  const selectedCountryLabel = useMemo(() => {
    if (selectedTimezone === 'local') return 'My Local Time'
    const quick = QUICK_COUNTRIES.find(c => c.value === selectedTimezone)
    if (quick) return quick.label
    
    const entry = Object.entries(countryToZone).find(([_, zone]) => zone === selectedTimezone)
    return entry ? entry[0] : selectedTimezone.split('/').pop()?.replace(/_/g, ' ') || selectedTimezone
  }, [selectedTimezone])

  // Google Calendar Link generator
  const googleCalendarUrl = useMemo(() => {
    const start = DateTime.fromISO(match.utcTime).toFormat("yyyyLLdd'T'HHmmss'Z'")
    const end = DateTime.fromISO(match.utcTime).plus({ hours: 2 }).toFormat("yyyyLLdd'T'HHmmss'Z'")
    const text = encodeURIComponent(match.title)
    const details = encodeURIComponent(`${match.title} scheduled in ${match.tournament}. Converted via Clocks and Alarms Online.`)
    const location = encodeURIComponent(match.venue)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`
  }, [match])

  // ICS File Download generator
  const downloadIcsFile = () => {
    const start = DateTime.fromISO(match.utcTime).toFormat("yyyyLLdd'T'HHmmss'Z'")
    const end = DateTime.fromISO(match.utcTime).plus({ hours: 2 }).toFormat("yyyyLLdd'T'HHmmss'Z'")
    const now = DateTime.now().toFormat("yyyyLLdd'T'HHmmss'Z'")
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Clocks and Alarms Online//Sports Schedule Converter//EN",
      "BEGIN:VEVENT",
      `UID:${match.id}@clocksandalarmsonline.com`,
      `DTSTAMP:${now}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${match.title}`,
      `DESCRIPTION:${match.title} in the ${match.tournament}. Converted via Clocks and Alarms Online.`,
      `LOCATION:${match.venue}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${match.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const sportStyle = SPORT_COLORS[match.sport] || { bg: 'bg-white/5 border-white/10 text-white', hover: '', accent: 'text-white' }

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Breadcrumbs and navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href={`/sports-schedule/${getSportSlug(match.sport)}/`} 
          className="inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white hover:underline transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {SPORT_LABELS[match.sport] || 'FIFA World Cup 2026'}</span>
        </Link>

        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
          <span>Home</span>
          <span>/</span>
          <span>{SPORT_LABELS[match.sport] || 'FIFA World Cup 2026'}</span>
          <span>/</span>
          <span className="text-primary truncate max-w-[150px]">{match.title}</span>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Match Info */}
        <section className="lg:col-span-6 bg-card border border-card-border/40 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 transition-transform duration-1000 ease-out z-0">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/40 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/40 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border", sportStyle.bg)}>
                {SPORT_LABELS[match.sport] || match.sport}
              </span>
              
              <div className="flex items-center gap-2">
                {match.status === 'live' && (
                  <span className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    Live
                  </span>
                )}
                {match.status === 'upcoming' && (
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    Upcoming
                  </span>
                )}
                {match.status === 'finished' && (
                  <span className="bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    Finished
                  </span>
                )}
              </div>
            </div>

            {/* Title & Tournament */}
            <div className="space-y-4">
              <span className="text-xs md:text-sm font-black text-primary uppercase tracking-widest block">
                {match.tournament}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none font-display">
                {match.title}
              </h2>
            </div>

            {/* Venue info */}
            <div className="flex items-start gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
              <MapPin className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40">Host Venue</span>
                <span className="text-sm font-bold text-white/95 mt-1 block">{match.venue}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="relative z-10 pt-8 border-t border-white/5 flex flex-wrap gap-3 mt-8 lg:mt-12">
            <button
              onClick={copyShareLink}
              className={cn(
                "py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-95",
                match.status === 'upcoming' ? "flex-1" : "w-full"
              )}
            >
              <Share2 className="w-4 h-4 text-white/50" />
              <span>{copiedLink ? 'Copied Link!' : 'Share Match'}</span>
            </button>
            
            {match.status === 'upcoming' && (
              <button
                onClick={() => alert(`Setting notification reminder for: ${match.title} at kickoff time!`)}
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-2xl text-xs font-bold text-white hover:text-primary transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Bell className="w-4 h-4 text-white/50 group-hover:text-primary/70" />
                <span>Set Alert</span>
              </button>
            )}
          </div>
        </section>

        {/* Right Card: Timezone Sync dashboard */}
        <section className="lg:col-span-6 bg-card border border-card-border/40 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 transition-transform duration-1000 ease-out z-0">
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-accent/30 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Timezone search input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2.5">
                Convert to Target Country
              </label>
              <LocationSearch 
                value={selectedTimezone} 
                onChange={setSelectedTimezone} 
                className="w-full"
              />
              <div className="flex flex-wrap gap-1.5 pt-3">
                {QUICK_COUNTRIES.map((country) => {
                  const isActive = selectedTimezone === country.value
                  return (
                    <button
                      key={country.value}
                      onClick={() => setSelectedTimezone(country.value)}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all active:scale-95",
                        isActive
                          ? "bg-primary border-primary text-white"
                          : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {country.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Display converted kickoff time */}
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-white/40">Target Country / Timezone</span>
                  <span className="text-sm font-bold text-white mt-1 block">{selectedCountryLabel} ({matchZoneStr})</span>
                </div>
                {isToday && (
                  <span className="bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                    Today
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40">Kickoff Converted Time</span>
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter block font-display leading-tight">
                  {matchTimeStr}
                </span>
                <span className="text-xs font-semibold text-white/70 block">
                  {matchDateStr}
                </span>
              </div>
            </div>
            
            {/* Running Clock and Offset Info */}
            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40">Current Clock</span>
                <span className="text-xs font-bold text-white/95 mt-1 block font-tabular">
                  {currentTimeStr || 'Loading...'}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40">Offset Info</span>
                <span className="text-xs font-bold text-primary mt-1 block">
                  {localOffsetInfo.diffText}
                </span>
              </div>
            </div>
          </div>

          {/* Calendar integrations */}
          <div className="relative z-10 pt-6 border-t border-white/5 space-y-3 mt-6">
            <span className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 text-center sm:text-left">
              Calendar Integrations
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#4285F4]/15 hover:bg-[#4285F4]/30 border border-[#4285F4]/20 hover:border-[#4285F4]/40 rounded-2xl text-xs font-bold text-[#b4cdff] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#4285F4]" />
                <span>Add to Google Calendar</span>
              </a>
              <button
                onClick={downloadIcsFile}
                className="flex-1 py-3 px-4 bg-primary/10 hover:bg-primary/25 border border-primary/20 hover:border-primary/40 rounded-2xl text-xs font-bold text-[#f7d6ff] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CalendarDays className="w-4 h-4 text-primary" />
                <span>Download .ICS Invite</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Info Block */}
      <section className="bg-gradient-to-br from-[#1a0b36]/40 to-transparent border border-violet-500/10 rounded-[2.5rem] p-8 space-y-4">
        <h4 className="text-lg font-black text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          <span>Kickoff Times & Daylight Savings Time (DST)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted/80 leading-relaxed font-medium">
          <p>
            Kickoff and event start times are computed dynamically using actual database timestamps stored in UTC. 
            This timezone converter maps the selected target country to its relative IANA timezone identifier, which automatically resolves historical and future Daylight Saving Time adjustments for the exact date of this match.
          </p>
          <p>
            Verify that your device clock is synchronized with global network atomic time. If you experience discrepancies, try a hard refresh to invalidate local caches and re-sync the event offsets from our servers.
          </p>
        </div>
      </section>
    </div>
  )
}
