'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  className?: string
}

export default function ShareButton({ title, className }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof window === 'undefined') return
    
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <button
      onClick={handleShare}
      className={className || "absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 cursor-pointer"}
      aria-label="Share article"
    >
      <Share2 size={18} />
    </button>
  )
}
