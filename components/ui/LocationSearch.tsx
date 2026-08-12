'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown, Globe } from 'lucide-react'
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
  dropdownAlign?: 'left' | 'center' | 'right'
}

export default function LocationSearch({ 
  value, 
  onChange, 
  placeholder, 
  className,
  dropdownAlign = 'center'
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const locations = useMemo(() => {
    const list: Location[] = []
    
    // Add countries from manual list
    Object.entries(countryToZone).forEach(([country, zone]) => {
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
    if (!value) return null
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
    <div className={cn("relative min-w-0", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-2.5 py-2 md:px-5 md:py-4 text-[10px] md:text-sm font-bold text-slate-800 dark:text-white flex items-center justify-between hover:bg-slate-200/55 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 group min-w-0"
      >
        <div className="flex items-center gap-1.5 md:gap-3 min-w-0 flex-1">
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 dark:text-white/40 group-hover:text-primary transition-colors flex-shrink-0" />
          <span className="truncate text-left">{selectedLocation ? selectedLocation.label : (placeholder || 'Select Location')}</span>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 dark:text-white/20 transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute top-full mt-2 w-[220px] md:w-full bg-white dark:bg-[#120227] border border-slate-200 dark:border-white/10 rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200",
          dropdownAlign === 'left' && "left-0 md:left-0 md:translate-x-0",
          dropdownAlign === 'right' && "right-0 left-auto md:left-0 md:translate-x-0",
          dropdownAlign === 'center' && "left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0"
        )}>
          <div className="p-3 border-b border-slate-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#120227]/80 backdrop-blur-md z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20" />
              <input
                autoFocus
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
          <div className="max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar p-2">
            {value !== 'local' && (
              <button
                key="local"
                onClick={() => {
                  onChange('local')
                  setIsOpen(false)
                  setSearchTerm('')
                }}
                className="w-full flex flex-col items-start px-4 py-2 md:py-3 rounded-xl hover:bg-primary/10 transition-colors group text-left mb-1"
              >
                <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Local Time</span>
                <span className="text-[9px] md:text-[10px] text-slate-400 dark:text-white/20 font-medium">Auto-detected</span>
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
                    "w-full flex flex-col items-start px-4 py-2 md:py-3 rounded-xl transition-colors group text-left mb-1",
                    value === loc.value ? "bg-primary/20" : "hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "text-xs md:text-sm font-bold transition-colors",
                    value === loc.value ? "text-primary" : "text-slate-800 dark:text-white group-hover:text-primary"
                  )}>{loc.label}</span>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs md:text-sm text-slate-400 dark:text-white/20 font-medium tracking-tight">No results found...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
