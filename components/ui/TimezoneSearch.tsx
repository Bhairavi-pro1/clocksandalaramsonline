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
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto my-2">
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
          <Search className="w-4 h-4 sm:w-5 h-5 text-muted/50 group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          list="timezone-options"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search timezone by country or city..."
          autoComplete="off"
          className="w-full bg-[#1a0b2e]/60 border border-violet-500/20 text-foreground pl-10 pr-4 py-2.5 sm:pl-14 sm:pr-6 sm:py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all placeholder:text-[10px] sm:placeholder:text-sm text-xs sm:text-sm shadow-lg shadow-primary/5 hover:border-violet-500/30"
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
