'use client'
import { Search } from 'lucide-react'
import { countryToZone } from '@/lib/timezoneData'
import { useState, useMemo, useEffect } from 'react'

interface TimezoneSearchProps {
  onAdd: (zone: { country: string, city: string, timezone: string }) => void
}

export default function TimezoneSearch({ onAdd }: TimezoneSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Registry for Friendly Name -> IANA Zone
  const searchRegistry = useMemo(() => {
    const registry: Record<string, string> = { ...countryToZone }
    
    // Add Cities
    if (typeof Intl !== 'undefined' && (Intl as any).supportedValuesOf) {
      const allZones = (Intl as any).supportedValuesOf('timeZone') as string[]
      allZones.forEach(z => {
        const city = z.split('/').pop()?.replace(/_/g, ' ')
        if (city && !registry[city]) {
          registry[city] = z
        }
      })
    }
    return registry
  }, [])

  const suggestions = useMemo(() => {
    return Object.keys(searchRegistry).sort()
  }, [searchRegistry])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    
    // Check if the input matches a valid suggestion
    if (searchRegistry[val]) {
      const timezone = searchRegistry[val]
      const isCountry = !!(countryToZone as any)[val]
      
      onAdd({
        country: isCountry ? val : (timezone.split('/')[0].replace(/_/g, ' ') || 'Global'),
        city: isCountry ? (timezone.split('/').pop()?.replace(/_/g, ' ') || val) : val,
        timezone
      })
      setSearchTerm('')
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 w-full">
      <h2 className="text-2xl md:text-[1.75rem] font-medium font-display text-white opacity-95">Global Time Zones</h2>
      <div className="relative w-full max-w-sm group">
        <input 
          type="text" 
          list="timezone-options"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search time zone by country & add clock"
          className="w-full bg-[#1a0b2e]/40 border border-violet-500/20 text-foreground px-5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all placeholder:text-muted/60 text-[13px] tracking-tight"
        />
        <datalist id="timezone-options">
          {isMounted && suggestions.map(s => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  )
}
