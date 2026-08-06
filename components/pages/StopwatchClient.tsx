'use client'
import { useState, useRef, useEffect } from 'react'
import { useStopwatch } from '@/hooks/useStopwatch'
import { Timer as StopwatchIcon, Maximize2, Minimize2, RotateCcw, Clock, X, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdBanner from '@/components/ui/AdBanner'

export default function StopwatchClient() {
  const { time, setTime, isRunning, laps, setLaps, start, pause, reset, lap, formatTime } = useStopwatch()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [history, setHistory] = useState<{id: string, time: number, laps: number[], date: string}[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (isRunning) {
      setLoadedSessionId(null)
    }
  }, [isRunning])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsExportOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const exportPDF = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head>
          <title>Stopwatch Lap Times</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1a0b2e; }
            h1 { font-size: 24px; font-weight: 800; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; margin-bottom: 5px; color: #7c3aed; }
            .meta { font-size: 12px; color: #666; margin-bottom: 30px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
            th { background-color: #f5f3ff; color: #7c3aed; font-weight: 700; }
            td.mono { font-family: monospace; font-weight: 600; }
          </style>
        </head>
        <body>
          <h1>Stopwatch Lap Times</h1>
          <div class="meta">
            Generated on: ${new Date().toLocaleString()}<br>
            Source: <a href="https://clocksandalarmsonline.com/stopwatch" target="_blank" style="color: #7c3aed; text-decoration: none; font-weight: bold;">clocksandalarmsonline.com/stopwatch</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Lap</th>
                <th>Lap Time</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              ${laps.map((lTime, index) => {
                const diff = index < laps.length - 1 ? `+${formatTime(lTime - laps[index + 1])}` : formatTime(lTime);
                return `
                  <tr>
                    <td>Lap ${laps.length - index}</td>
                    <td class="mono">${formatTime(lTime)}</td>
                    <td class="mono">${diff}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const exportExcel = () => {
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Stopwatch Laps</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8">
        <style>
          table {
            border-collapse: collapse;
            font-family: 'Segoe UI', Arial, sans-serif;
          }
          .title {
            font-size: 16pt;
            font-weight: bold;
            color: #7c3aed;
            padding-bottom: 4px;
          }
          .subtitle {
            font-size: 9pt;
            color: #64748b;
            padding-bottom: 15px;
          }
          th {
            background-color: #7c3aed;
            color: #ffffff;
            font-size: 11pt;
            font-weight: bold;
            border: 1px solid #6d28d9;
            padding: 10px 15px;
            text-align: left;
          }
          td {
            font-size: 10pt;
            border: 1px solid #e2e8f0;
            padding: 8px 15px;
            color: #1e1b4b;
          }
          .odd-row {
            background-color: #fcfbfe;
          }
          .even-row {
            background-color: #ffffff;
          }
          .mono {
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
          }
          .link-cell {
            padding-top: 15px;
            font-size: 9.5pt;
            color: #64748b;
          }
          .link {
            color: #7c3aed;
            font-weight: bold;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <table>
          <colgroup>
            <col width="100">
            <col width="180">
            <col width="180">
          </colgroup>
          <tr>
            <td colspan="3" class="title" style="border: none;">Stopwatch Lap Times</td>
          </tr>
          <tr>
            <td colspan="3" class="subtitle" style="border: none;">Generated via Clocks and Alarms Online on ${new Date().toLocaleString()}</td>
          </tr>
          <tr>
            <th>Lap</th>
            <th>Time</th>
            <th>Difference</th>
          </tr>
          ${laps.map((lTime, index) => {
            const diff = index < laps.length - 1 ? `+${formatTime(lTime - laps[index + 1])}` : formatTime(lTime);
            const rowClass = index % 2 === 0 ? 'even-row' : 'odd-row';
            return `
              <tr class="${rowClass}">
                <td>Lap ${laps.length - index}</td>
                <td class="mono">${formatTime(lTime)}</td>
                <td class="mono">${diff}</td>
              </tr>
            `;
          }).join('')}
          <tr>
            <td colspan="3" style="border: none; height: 10px;"></td>
          </tr>
          <tr>
            <td colspan="3" class="link-cell" style="border: none;">
              Source: <a href="https://clocksandalarmsonline.com/stopwatch" class="link">clocksandalarmsonline.com/stopwatch</a>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `stopwatch_laps_${Date.now()}.xls`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportTXT = () => {
    const txtLines = [
      "STOPWATCH LAP TIMES",
      `Generated on: ${new Date().toLocaleString()}`,
      "Source: https://clocksandalarmsonline.com/stopwatch",
      "==========================",
      ""
    ]
    laps.forEach((lTime, index) => {
      const diff = index < laps.length - 1 ? `+${formatTime(lTime - laps[index + 1])}` : formatTime(lTime)
      txtLines.push(`Lap ${laps.length - index}: ${formatTime(lTime)} (Diff: ${diff})`)
    })
    const txtContent = txtLines.join("\n")
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `stopwatch_laps_${Date.now()}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Load history from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('stopwatch_history')
    if (saved) setHistory(JSON.parse(saved))
    setIsLoaded(true)
  }, [])

  // Save history to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('stopwatch_history', JSON.stringify(history.slice(0, 10))) // Keep last 10
    }
  }, [history, isLoaded])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cardRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleReset = () => {
    if (time > 0 && !loadedSessionId) {
      const newSession = {
        id: Date.now().toString(),
        time,
        laps: [...laps],
        date: new Date().toLocaleString()
      }
      setHistory(prev => [newSession, ...prev])
    }
    reset()
    setLoadedSessionId(null)
  }

  const loadSession = (session: {id: string, time: number, laps: number[], date: string}) => {
    pause()
    setTime(session.time)
    setLaps(session.laps)
    setLoadedSessionId(session.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setHistory(prev => prev.filter(s => s.id !== id))
  }

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
      {/* Main Stopwatch Card */}
      <div 
        ref={cardRef}
        className={cn(
          "bg-[#1a0b2e]/60 border border-violet-500/20 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden group transition-all duration-500 flex flex-col items-center justify-center",
          isFullscreen ? "h-screen rounded-none border-none p-4 sm:p-0 bg-background" : "p-4 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[350px] md:min-h-[400px]"
        )}
      >
        {/* Fullscreen Button */}
        <button 
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 z-20"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white/50 group-hover:text-white" />}
        </button>

        <div className={cn(
          "flex flex-col items-center w-full relative z-10",
          isFullscreen && "pb-8 sm:pb-32"
        )}>
          {/* Timer Display */}
          <div className={cn(
            "font-mono font-black tracking-tighter text-white tabular-nums flex items-center justify-center drop-shadow-[0_0_50px_rgba(124,58,237,0.3)] mb-4 sm:mb-6 md:mb-8 select-none",
            isFullscreen ? "text-5xl sm:text-9xl md:text-[14rem] lg:text-[18rem]" : "text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black"
          )}>
            {formatTime(time).split('').map((char, i) => (
              <span key={i} className={cn(char === ':' || char === '.' ? "mx-0.5 sm:mx-1 opacity-40" : "w-[0.6em] md:w-[0.65em] inline-block text-center")}>
                {char}
              </span>
            ))}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full max-w-md px-2 sm:px-6">
            {!isRunning ? (
              <button 
                onClick={start}
                className="w-full py-2.5 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-primary text-white font-black text-xs sm:text-sm md:text-base shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                Start
              </button>
            ) : (
              <button 
                onClick={pause}
                className="w-full py-2.5 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-white/10 text-white font-black text-xs sm:text-sm md:text-base border border-white/10 hover:bg-white/20 transition-all"
              >
                Pause
              </button>
            )}
            
            <button 
              onClick={lap}
              disabled={!isRunning && time === 0}
              className="w-full py-2.5 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-[#2d1b4e] text-white font-black text-xs sm:text-sm md:text-base border border-violet-500/20 hover:bg-[#3d2b5e] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Lap
            </button>

            <button 
              onClick={handleReset}
              className="w-full py-2.5 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-[#ff2e88] text-white font-black text-xs sm:text-sm md:text-base shadow-[0_0_20px_rgba(255,46,136,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Ad Space Inside Card */}
        <AdBanner />

        {/* Lap Times inside card after AdBanner */}
        {laps.length > 0 && (
          <div className="w-full max-w-md mt-4 border-t border-white/10 pt-4 relative z-10">
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Flag className="w-3.5 h-3.5 text-primary" /> Lap Times ({laps.length})
              </h4>
              
              {/* Export Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="text-[10px] text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all uppercase font-black flex items-center gap-1 cursor-pointer"
                >
                  Export
                </button>
                {isExportOpen && (
                  <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-[#1a0b2e] border border-slate-200 dark:border-violet-500/20 rounded-lg shadow-xl py-1 z-30 animate-in fade-in duration-100">
                    <button 
                      onClick={() => { exportPDF(); setIsExportOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase font-bold cursor-pointer"
                    >
                      PDF
                    </button>
                    <button 
                      onClick={() => { exportExcel(); setIsExportOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase font-bold cursor-pointer"
                    >
                      Excel
                    </button>
                    <button 
                      onClick={() => { exportTXT(); setIsExportOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase font-bold cursor-pointer"
                    >
                      TXT
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="max-h-[160px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {laps.map((lTime, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-white/5 hover:bg-primary/10 rounded-xl border border-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      Lap {laps.length - index}
                    </span>
                    <span className="font-mono font-bold text-base text-white tabular-nums">
                      {formatTime(lTime)}
                    </span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-[9px] text-white/40 uppercase tracking-tighter">
                      Diff
                    </span>
                    <span className="text-xs font-bold text-white/60 font-mono">
                      {index < laps.length - 1 ? `+${formatTime(lTime - laps[index + 1])}` : formatTime(lTime)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Usage History Section */}
      {!isFullscreen && (
        <div className="bg-[#1a0b2e]/40 border border-violet-500/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">Usage History</h2>
            <button 
              onClick={() => setHistory([])}
              className="text-[10px] text-white/30 hover:text-danger px-3 py-1 rounded-full border border-white/5 hover:border-danger/30 transition-all uppercase font-black"
            >
              Clear History
            </button>
          </div>
          
          {history.length === 0 ? (
            <div className="py-12 sm:py-20 text-center space-y-4 opacity-20 border-2 border-dashed border-white/5 rounded-[1.5rem] sm:rounded-[2rem]">
              <RotateCcw className="w-12 h-12 mx-auto" />
              <p className="font-bold text-sm uppercase tracking-widest">No sessions saved in history</p>
            </div>
          ) : (
            <div className="flex flex-col w-full divide-y divide-slate-200/50 dark:divide-white/10 border-t border-b border-slate-200/50 dark:border-white/10">
              {history.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className="group flex items-center justify-between gap-2 sm:gap-6 py-3 sm:py-4 transition-all hover:bg-slate-100/30 dark:hover:bg-white/5 cursor-pointer w-full text-left px-1 sm:px-3"
                >
                  {/* Date and Time */}
                  <div className="flex-1 min-w-0">
                    {session.date.includes(', ') ? (
                      <>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-white/40 truncate">
                          {session.date.split(', ')[0]}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-white/30 truncate mt-0.5">
                          {session.date.split(', ')[1]}
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-white/40 truncate">
                        {session.date}
                      </p>
                    )}
                  </div>

                  {/* Total Run Time */}
                  <div className="flex-1 text-center">
                    <p className="text-sm sm:text-lg font-mono font-black text-slate-800 dark:text-white tabular-nums">
                      {formatTime(session.time)}
                    </p>
                  </div>

                  {/* Laps */}
                  <div className="flex-1 text-center">
                    <p className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider">
                      {session.laps.length} Laps
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Load / Clock Button */}
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-primary group-hover:border-primary/50 transition-all cursor-pointer" title="Load Session">
                       <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-white/50 group-hover:text-white" />
                    </div>

                    {/* Circle Remove Button */}
                    <button 
                      onClick={(e) => removeSession(e, session.id)}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-danger/10 dark:hover:bg-danger/20 flex items-center justify-center border border-slate-200 dark:border-white/10 hover:border-danger/30 transition-all z-20 cursor-pointer"
                      title="Remove session"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-white/40 group-hover:text-danger" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
