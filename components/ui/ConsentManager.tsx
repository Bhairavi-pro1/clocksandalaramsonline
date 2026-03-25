'use client'
import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'

export default function ConsentManager() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('consent-accepted')
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('consent-accepted', 'true')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('consent-accepted', 'false')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 md:bottom-8 left-0 md:left-8 z-[100] p-6 w-full md:max-w-md animate-in slide-in-from-bottom-5 duration-700">
      <div className="bg-card/95 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Cookie size={120} />
        </div>

        <button 
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <Cookie size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Trust & Cookies</h3>
          </div>
          
          <p className="text-sm text-muted font-medium leading-relaxed">
            We use high-precision tools to deliver your world time and alarms. 
            By clicking accept, you're helping us keep these tools free and high-performing. 
            We use cookies to personalize content and analyze traffic.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              type="button"
              onClick={handleAccept}
              className="flex-1 bg-primary text-white text-sm font-black py-4 rounded-2xl hover:scale-[1.03] transition-all hover:shadow-xl hover:shadow-primary/20"
            >
              ACCEPT ALL
            </button>
            <button 
              type="button"
              onClick={handleDecline}
              className="px-8 bg-white/5 border border-white/10 text-white/70 text-sm font-black py-4 rounded-2xl hover:bg-white/10 transition-all hover:text-white"
            >
              DECLINE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
