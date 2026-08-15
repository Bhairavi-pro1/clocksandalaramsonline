'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Calendar, Clock, Globe, ArrowRight, ChevronDown, Check, Loader2 } from 'lucide-react';
import countriesData from '@/data/countries.json';
import { FormattedHoliday } from '@/lib/getHolidaysServer';
import { cn } from '@/lib/utils';

interface Props {
  countryCode: string;
  countryName: string;
  initialYear: number;
  initialHolidays: FormattedHoliday[];
}

export default function CountryHolidayClient({ countryCode, countryName, initialYear, initialHolidays }: Props) {
  const router = useRouter();
  
  // Year selector state
  const [year, setYear] = useState<number>(initialYear);
  const [holidays, setHolidays] = useState<FormattedHoliday[]>(initialHolidays);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Status filter state (All, Upcoming, Passed)
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'passed'>('all');
  
  // Category filter state (All, Hinduism, Christian, National, etc.)
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Track if filters have been restored from sessionStorage
  const [isRestored, setIsRestored] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Year selector manual change handler that resets filters
  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  // Load state from sessionStorage on mount or when countryCode changes
  useEffect(() => {
    setIsRestored(false);
    try {
      const saved = sessionStorage.getItem(`holiday_filters_${countryCode}`);
      if (saved) {
        const { savedYear, savedStatus, savedCategory } = JSON.parse(saved);
        if (savedYear) setYear(savedYear);
        if (savedStatus) setStatusFilter(savedStatus);
        if (savedCategory) setCategoryFilter(savedCategory);
      } else {
        // Reset to defaults for the new country
        setYear(initialYear);
        setStatusFilter('all');
        setCategoryFilter('all');
      }
    } catch (e) {
      console.error('Failed to load filters from sessionStorage:', e);
    }
    setIsRestored(true);
  }, [countryCode, initialYear]);

  // Save state to sessionStorage when filters change
  useEffect(() => {
    if (!isRestored) return;
    try {
      sessionStorage.setItem(`holiday_filters_${countryCode}`, JSON.stringify({
        savedYear: year,
        savedStatus: statusFilter,
        savedCategory: categoryFilter
      }));
    } catch (e) {
      console.error('Failed to save filters to sessionStorage:', e);
    }
  }, [year, statusFilter, categoryFilter, countryCode, isRestored]);

  // Extract unique holiday categories dynamically from the loaded holidays
  const uniqueCategories = Array.from(new Set(
    holidays.flatMap(h => h.type)
  )).sort();

  // Filter holidays based on passed/upcoming status and category selection
  const filteredHolidays = holidays.filter(holiday => {
    const targetDate = new Date(holiday.date);
    const now = new Date();
    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const isUpcoming = d2.getTime() >= d1.getTime();
    
    const matchesStatus = statusFilter === 'upcoming' 
      ? isUpcoming 
      : statusFilter === 'passed' 
        ? !isUpcoming 
        : true;
        
    const matchesCategory = categoryFilter === 'all'
      ? true
      : holiday.type.includes(categoryFilter);
      
    return matchesStatus && matchesCategory;
  });

  // Filter countries matching search query
  const filteredCountries = searchQuery.trim() === ''
    ? []
    : countriesData.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.code.toLowerCase() === searchQuery.toLowerCase()
      ).slice(0, 8); // Limit suggestions to 8 items

  // Load holidays when year changes
  useEffect(() => {
    // Skip initial fetch since we have initialHolidays
    if (year === initialYear) {
      setHolidays(initialHolidays);
      setError(null);
      return;
    }

    async function fetchHolidays() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/holidays?country=${countryCode}&year=${year}`);
        if (!res.ok) {
          throw new Error('Failed to load holidays');
        }
        const data = await res.json();
        setHolidays(data.holidays || []);
      } catch (err: any) {
        console.error(err);
        setError('Unable to fetch holidays for this year. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchHolidays();
  }, [year, countryCode, initialYear, initialHolidays]);

  // Click outside to close search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle autocomplete item selection
  const selectCountry = (code: string) => {
    setSearchQuery('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    router.push(`/countdown/${code.toLowerCase()}`);
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCountries.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
        selectCountry(filteredCountries[highlightedIndex].code);
      } else if (filteredCountries.length > 0) {
        selectCountry(filteredCountries[0].code);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Calculate days remaining client-side
  const getDaysRemainingText = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const now = new Date();
    
    // Normalize to midnight for accurate day calculations
    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Passed', isUpcoming: false, days: diffDays };
    } else if (diffDays === 0) {
      return { text: 'Today!', isUpcoming: true, days: 0 };
    } else if (diffDays === 1) {
      return { text: '1 day left', isUpcoming: true, days: 1 };
    } else {
      return { text: `${diffDays} days left`, isUpcoming: true, days: diffDays };
    }
  };

  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const upcomingCount = holidays.filter(h => {
    const tDate = new Date(h.date);
    const d2 = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
    return d2.getTime() >= todayMs;
  }).length;
  const passedCount = holidays.length - upcomingCount;

  return (
    <div className="w-full">
      {/* Search and Year filter section (Sticky) */}
      <div className="sticky top-20 md:top-6 z-30 bg-background/90 backdrop-blur-md py-2.5 max-w-7xl mx-auto px-4 border-b border-slate-900/5 dark:border-white/5 transition-all duration-300">
        <div className="relative z-20 flex flex-col gap-3 md:gap-4 bg-slate-900/[0.03] dark:bg-[#1a0b36]/30 border border-slate-900/10 dark:border-white/5 rounded-2xl md:rounded-3xl p-3 md:p-5 backdrop-blur-md shadow-xl transition-all duration-300">
          
          {/* Row 1: Actions & Selection */}
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between w-full">
            {/* Autocomplete Search input */}
            <div ref={searchContainerRef} className="relative w-full lg:max-w-md">
              <label className="block text-[9px] md:text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-1 ml-1">
                Select Another Country
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search country..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-primary/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none transition-all duration-300 font-medium text-xs focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Suggestions Overlay */}
              {showSuggestions && filteredCountries.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-white dark:bg-[#100624] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {filteredCountries.map((country, idx) => (
                    <div
                      key={country.code}
                      onClick={() => selectCountry(country.code)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={cn(
                        "px-4 py-2 flex items-center justify-between cursor-pointer transition-colors duration-150 text-xs font-medium",
                        idx === highlightedIndex 
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-white" 
                          : "text-slate-800 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-primary/70 shrink-0" />
                        <span>{country.name}</span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-white/40 uppercase font-mono">{country.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Selection details - Desktop */}
            <div className="hidden md:flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-0.5">
                Active Selection
              </span>
              <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-white flex items-center gap-2 justify-center lg:justify-start">
                <Globe className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                <span className="leading-tight">
                  {countryName} <span className="text-primary font-serif italic ml-1">({countryCode})</span>
                </span>
              </h2>
            </div>

            {/* Current Selection details - Mobile */}
            <div className="flex flex-row items-center justify-between w-full md:hidden pt-2 border-t border-slate-200 dark:border-white/5">
              <span className="text-[9px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest">
                Active Selection:
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" />
                {countryName} <span className="text-primary font-serif italic">({countryCode})</span>
              </span>
            </div>

            {/* Year selector - Desktop only */}
            <div className="hidden md:flex flex-col items-center lg:items-start w-full lg:w-auto">
              <label className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-1.5 ml-1">
                Target Year
              </label>
              <div className="flex gap-1.5">
                {[2026, 2027].map((y) => (
                  <button
                    key={y}
                    onClick={() => handleYearChange(y)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold tracking-tight border transition-all duration-300",
                      year === y 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-900/5 dark:border-white/5 hover:border-slate-900/20 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Status & Category Filters (Desktop only) */}
          <div className="hidden md:flex flex-col gap-2.5 border-t border-slate-200 dark:border-white/10 pt-3 w-full">
            {/* Status Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 w-full text-center lg:text-left">
              <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mr-1 sm:w-24 shrink-0">
                Filter Status:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                {[
                  { id: 'all', label: `All (${holidays.length})` },
                  { id: 'upcoming', label: `Upcoming (${upcomingCount})` },
                  { id: 'passed', label: `Passed (${passedCount})` }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id as any)}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-200 border",
                      statusFilter === filter.id
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {uniqueCategories.length > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 w-full text-center lg:text-left border-t border-slate-200/40 dark:border-white/5 pt-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mr-1 sm:w-24 shrink-0">
                  Categories:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-200 border",
                      categoryFilter === 'all'
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    All Categories ({holidays.length})
                  </button>
                  {uniqueCategories.map((cat) => {
                    const count = holidays.filter(h => h.type.includes(cat)).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={cn(
                          "px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-200 border",
                          categoryFilter === cat
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Row 3: Dropdowns for Mobile Viewports */}
          <div className={cn("grid gap-2 md:hidden w-full border-t border-slate-200 dark:border-white/10 pt-2.5", uniqueCategories.length > 1 ? "grid-cols-3" : "grid-cols-2")}>
            {/* Year Select Dropdown */}
            <div className="flex flex-col w-full">
              <label className="text-[9px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-1 ml-1">
                Year
              </label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="w-full bg-slate-950/20 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white/90 focus:outline-none appearance-none cursor-pointer pr-7"
                >
                  {[2026, 2027].map((y) => (
                    <option key={y} value={y} className="bg-slate-100 dark:bg-[#1a0b36] text-slate-800 dark:text-white">
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Status Select Dropdown */}
            <div className="flex flex-col w-full">
              <label className="text-[9px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-1 ml-1">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-slate-950/20 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white/90 focus:outline-none appearance-none cursor-pointer pr-7"
                >
                  <option value="all" className="bg-slate-100 dark:bg-[#1a0b36] text-slate-800 dark:text-white">All ({holidays.length})</option>
                  <option value="upcoming" className="bg-slate-100 dark:bg-[#1a0b36] text-slate-800 dark:text-white">Upcoming ({upcomingCount})</option>
                  <option value="passed" className="bg-slate-100 dark:bg-[#1a0b36] text-slate-800 dark:text-white">Passed ({passedCount})</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Category Select Dropdown */}
            {uniqueCategories.length > 1 && (
              <div className="flex flex-col w-full">
                <label className="text-[9px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-1 ml-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-slate-950/20 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white/90 focus:outline-none appearance-none cursor-pointer pr-7"
                  >
                    <option value="all" className="bg-slate-100 dark:bg-[#1a0b36] text-slate-800 dark:text-white">All ({holidays.length})</option>
                    {uniqueCategories.map((cat) => {
                      const count = holidays.filter(h => h.type.includes(cat)).length;
                      return (
                        <option key={cat} value={cat} className="bg-slate-100 dark:bg-[#1a0b36] text-slate-800 dark:text-white">
                          {cat} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-white/40 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-30 animate-in fade-in duration-300 rounded-[2.5rem]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-white/60 font-medium tracking-wide">Loading holidays for {year}...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-[2rem] p-8 text-center max-w-xl mx-auto space-y-4">
            <h3 className="text-xl font-bold">Failed to load holidays</h3>
            <p className="text-sm opacity-80">{error}</p>
            <button 
              onClick={() => setYear(year)}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredHolidays.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-12 text-center max-w-xl mx-auto">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Holidays Found</h3>
            <p className="text-sm text-white/50">
              No holiday observances match your selected filters for {countryName} in {year}.
            </p>
          </div>
        )}

        {!error && filteredHolidays.length > 0 && (
          <>
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHolidays.map((holiday, i) => {
                const slug = holiday.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                const { text: daysText, isUpcoming } = getDaysRemainingText(holiday.date);
                
                // Find tag color based on type
                const isNational = holiday.type.some(t => t.toLowerCase() === 'national');
                const isReligious = holiday.type.some(t => t.toLowerCase() === 'religious');
                
                return (
                  <Link
                    key={`${holiday.name}-${holiday.date}-${i}`}
                    href={`/countdown/${countryCode.toLowerCase()}/${slug}`}
                    prefetch={false}
                    className="group relative bg-slate-900/[0.02] dark:bg-[#1a0b2e]/40 border border-slate-900/5 dark:border-white/5 rounded-[2.5rem] p-8 hover:border-primary/40 dark:hover:border-primary/40 hover:bg-slate-900/[0.04] transition-all duration-500 flex flex-col justify-between overflow-hidden min-h-[260px] shadow-lg"
                  >
                    {/* Background graphic */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
                      <Clock size={140} className="text-slate-900 dark:text-white" />
                    </div>

                    <div className="space-y-4">
                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                          isUpcoming 
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary' 
                            : 'bg-slate-900/5 dark:bg-white/10 text-slate-500 dark:text-white/40'
                        )}>
                          {daysText}
                        </span>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                          isNational 
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/20" 
                            : isReligious 
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          {holiday.type[0]}
                        </span>
                      </div>

                      {/* Holiday Title */}
                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors duration-300">
                          {holiday.name}
                        </h3>
                        {holiday.description && (
                          <p className="text-xs text-slate-600 dark:text-white/50 leading-relaxed font-medium">
                            {holiday.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date and CTA */}
                    <div className="pt-6 border-t border-slate-900/5 dark:border-white/5 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-white/60 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(holiday.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-900/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Compact List Layout (DST Tracker pattern) */}
            <div className="block md:hidden w-[calc(100%+2rem)] -mx-4 border-y border-slate-200 dark:border-white/10 bg-slate-900/[0.02] dark:bg-[#1a0b2e]/40 divide-y divide-slate-200 dark:divide-white/10">
              {filteredHolidays.map((holiday, i) => {
                const slug = holiday.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                const { text: daysText, isUpcoming } = getDaysRemainingText(holiday.date);
                
                // Find tag color based on type
                const isNational = holiday.type.some(t => t.toLowerCase() === 'national');
                const isReligious = holiday.type.some(t => t.toLowerCase() === 'religious');
                
                return (
                  <Link
                    key={`${holiday.name}-${holiday.date}-${i}-mobile`}
                    href={`/countdown/${countryCode.toLowerCase()}/${slug}`}
                    prefetch={false}
                    className="flex flex-col p-4 relative overflow-hidden text-left hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.02] active:bg-slate-900/[0.08] dark:active:bg-white/[0.04] transition-colors"
                  >
                    {/* Top Row: Days countdown, Formatted Date, Category tag */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-wider border flex-shrink-0",
                          isUpcoming 
                            ? 'bg-primary/10 border-primary/20 text-primary' 
                            : 'bg-slate-900/5 dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40'
                        )}>
                          {daysText}
                        </span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs tabular-nums flex-shrink-0">
                          {new Date(holiday.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-slate-300 dark:text-white/20 text-[10px] font-medium flex-shrink-0">|</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider border flex-shrink-0",
                          isNational 
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/20" 
                            : isReligious 
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          {holiday.type[0]}
                        </span>
                      </div>
                      <span className="text-primary text-[10px] font-black uppercase tracking-wider flex-shrink-0 flex items-center gap-0.5">
                        View <ArrowRight className="w-3 h-3 text-primary/70 shrink-0" />
                      </span>
                    </div>

                    {/* Bottom Row: Holiday Title */}
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-slate-900 dark:text-white font-black text-sm truncate">
                          {holiday.name}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {holiday.description && (
                      <p className="mt-1 text-[10px] text-slate-600 dark:text-white/50 leading-relaxed font-medium">
                        {holiday.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
