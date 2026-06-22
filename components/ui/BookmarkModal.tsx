'use client'
import { useState, useEffect } from 'react'
import { Star, X, Bookmark, Check, Copy } from 'lucide-react'
import { useExitIntent } from '@/hooks/useExitIntent'
import { useBookmarkTracker } from '@/hooks/useBookmarkTracker'

export default function BookmarkModal() {
  const { isBookmarked, markAsBookmarked } = useBookmarkTracker()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'intro' | 'instructions'>('intro')
  const [platform, setPlatform] = useState<'mac' | 'windows' | 'mobile'>('windows')
  const [copied, setCopied] = useState(false)

  // Detect OS client-side
  useEffect(() => {
    if (typeof window === 'undefined') return
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod|android/i.test(userAgent)) {
      setPlatform('mobile')
    } else if (userAgent.includes('mac')) {
      setPlatform('mac')
    } else {
      setPlatform('windows')
    }
  }, [])

  // Check sessionStorage to make sure we don't spam the user in the current session
  const [sessionDismissed, setSessionDismissed] = useState(true)
  useEffect(() => {
    const dismissed = sessionStorage.getItem('bookmark_modal_dismissed') === 'true'
    setSessionDismissed(dismissed)
  }, [])

  const handleExitIntent = () => {
    // Only show if:
    // 1. Not already bookmarked (according to our tracker)
    // 2. Not dismissed in the current session
    // 3. Not currently open
    if (!isBookmarked && !sessionDismissed && !isOpen) {
      // Append ref=bookmark to URL so if they bookmark it, the ref tag is saved
      const url = new URL(window.location.href)
      url.searchParams.set('ref', 'bookmark')
      window.history.replaceState(null, '', url.pathname + url.search)
      
      setIsOpen(true)
      setStep('intro')
    }
  }

  // Trigger exit intent hook
  useExitIntent(!isBookmarked && !sessionDismissed && !isOpen, handleExitIntent)

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('bookmark_modal_dismissed', 'true')
    setSessionDismissed(true)

    // Remove the ref=bookmark parameter from URL so the address bar is clean again
    const url = new URL(window.location.href)
    url.searchParams.delete('ref')
    const newUrl = url.search ? url.pathname + url.search : url.pathname
    window.history.replaceState(null, '', newUrl)
  }

  const handleConfirmBookmark = () => {
    markAsBookmarked()
    handleClose()
  }

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.set('ref', 'bookmark')
    navigator.clipboard.writeText(url.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-md bg-[#1a0b36] border border-primary/30 rounded-[3rem] shadow-[0_0_100px_rgba(124,58,237,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 ring-2 ring-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="p-8 sm:p-10 relative z-10 flex flex-col items-center text-center">
          {/* Close icon button top-right */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/30 shadow-2xl shadow-primary/40 animate-pulse">
            <Star size={38} className="text-white fill-white animate-bounce" />
          </div>

          {step === 'intro' ? (
            <>
              <div className="space-y-3 mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                  Need these tools later?
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mt-4">
                  Save this page to your bookmarks for instant, one-click access to all our clocks, alarms, timers, and stopwatches next time!
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => setStep('instructions')}
                  className="w-full bg-white text-primary font-black py-4 rounded-[1.2rem] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95 group cursor-pointer"
                >
                  <Bookmark size={20} className="fill-current text-primary" />
                  BOOKMARK THIS PAGE
                </button>
                <button 
                  onClick={handleClose}
                  className="w-full text-white/40 hover:text-white/60 font-bold py-2 text-sm tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3 mb-6 w-full">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                  How to Bookmark
                </h2>
                
                {platform === 'mac' && (
                  <div className="py-6 px-4 bg-primary/10 border border-primary/20 rounded-[2rem] my-6 space-y-3">
                    <p className="text-white/90 font-medium text-sm">Press the keyboard shortcut:</p>
                    <div className="flex justify-center items-center gap-2">
                      <kbd className="px-3 py-2 bg-white/10 rounded-lg text-white font-mono font-bold text-lg border border-white/20">⌘ Cmd</kbd>
                      <span className="text-white/60 text-2xl font-bold">+</span>
                      <kbd className="px-3 py-2 bg-white/10 rounded-lg text-white font-mono font-bold text-lg border border-white/20">D</kbd>
                    </div>
                  </div>
                )}

                {platform === 'windows' && (
                  <div className="py-6 px-4 bg-primary/10 border border-primary/20 rounded-[2rem] my-6 space-y-3">
                    <p className="text-white/90 font-medium text-sm">Press the keyboard shortcut:</p>
                    <div className="flex justify-center items-center gap-2">
                      <kbd className="px-3 py-2 bg-white/10 rounded-lg text-white font-mono font-bold text-lg border border-white/20">Ctrl</kbd>
                      <span className="text-white/60 text-2xl font-bold">+</span>
                      <kbd className="px-3 py-2 bg-white/10 rounded-lg text-white font-mono font-bold text-lg border border-white/20">D</kbd>
                    </div>
                  </div>
                )}

                {platform === 'mobile' && (
                  <div className="py-4 px-4 bg-primary/10 border border-primary/20 rounded-[2rem] my-6 text-left">
                    <p className="text-white/90 font-semibold text-xs text-center uppercase tracking-wider mb-2">Instructions:</p>
                    <ol className="text-white/70 text-xs space-y-1.5 list-decimal list-inside font-medium">
                      <li>Tap the menu button (<span className="font-bold">⋮</span> or Safari share icon <span className="font-bold">⎙</span>)</li>
                      <li>Select <span className="text-white font-semibold">"Add to Bookmarks"</span> or <span className="text-white font-semibold">"Add to Home Screen"</span></li>
                    </ol>
                  </div>
                )}

                <div className="space-y-2 text-left w-full mt-4">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Or copy the bookmark link:</p>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
                    <span className="text-white/50 text-xs font-mono truncate flex-1 select-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?ref=bookmark` : ''}
                    </span>
                    <button 
                      onClick={handleCopyLink}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Copy URL to clipboard"
                    >
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={handleConfirmBookmark}
                  className="w-full bg-white text-primary font-black py-4 rounded-[1.2rem] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Check size={20} />
                  DONE, BOOKMARKED!
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
