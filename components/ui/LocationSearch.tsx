'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown, MapPin, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { countryToZone } from '@/lib/timezoneData'

interface Location {
  label: string
  sublabel?: string
  value: string
}

interface LocationSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function LocationSearch({ value, onChange, placeholder, className }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const locations = useMemo(() => {
    const list: Location[] = []
    
    // Add countries from manual list
    Object.entries(countryToZone).forEach(([country, zone]) => {
      // Extract a simplified sublabel (e.g., from Asia/Kolkata -> Asia)
      const parts = zone.split('/')
      const region = parts[0]
      list.push({ label: country, sublabel: region, value: zone })
    })

    return list.sort((a, b) => a.label.localeCompare(b.label))
  }, [])

  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations.slice(0, 50)
    const lowerSearch = searchTerm.toLowerCase()
    return locations.filter(l => {
      const combined = `${l.label} ${l.sublabel || ''}`.toLowerCase()
      return combined.includes(lowerSearch)
    }).slice(0, 50)
  }, [locations, searchTerm])

  const selectedLocation = useMemo(() => {
    if (value === 'local') return { label: 'Local Time', value: 'local' }
    return locations.find(l => l.value === value) || { label: value, value }
  }, [locations, value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white flex items-center justify-between hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 group"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
          <span className="truncate">{selectedLocation.label}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-white/20 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#120227] border border-white/10 rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-white/5 sticky top-0 bg-[#120227]/80 backdrop-blur-md z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                autoFocus
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
            {value !== 'local' && (
               <button
                 key="local"
                 onClick={() => {
                   onChange('local')
                   setIsOpen(false)
                   setSearchTerm('')
                 }}
                 className="w-full flex flex-col items-start px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors group text-left mb-1"
               >
                 <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Local Time</span>
                 <span className="text-[10px] text-white/20 font-medium">Auto-detected</span>
               </button>
            )}
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc, i) => (
                <button
                  key={`${loc.value}-${i}`}
                  onClick={() => {
                    onChange(loc.value)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={cn(
                    "w-full flex flex-col items-start px-4 py-3 rounded-xl transition-colors group text-left mb-1",
                    value === loc.value ? "bg-primary/20" : "hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    value === loc.value ? "text-primary" : "text-white group-hover:text-primary"
                  )}>{loc.label}</span>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-white/20 font-medium tracking-tight">No results found...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
