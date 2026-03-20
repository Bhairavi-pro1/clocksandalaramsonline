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

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 md:bottom-6 left-0 md:left-6 z-[60] p-6 w-full md:max-w-md">
      <div className="bg-card/95 backdrop-blur-2xl border border-card-border p-6 rounded-3xl shadow-3xl animate-in fade-in slide-in-from-left duration-700">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-accent/20 rounded-2xl text-accent shrink-0">
            <Cookie size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Cookie Privacy</h3>
            <p className="text-sm text-muted font-bold leading-relaxed mb-6">
              We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. By clicking accept, you're helping us keep these tools free.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleAccept}
                className="flex-1 bg-accent text-background text-sm font-black py-3 rounded-xl hover:scale-105 transition-transform"
              >
                ACCEPT ALL
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="px-6 bg-secondary text-muted text-sm font-bold rounded-xl hover:text-foreground transition-colors"
                title="Decline Non-Essential"
              >
                SETTINGS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
