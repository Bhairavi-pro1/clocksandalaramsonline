'use client'
import { useEffect, useState } from 'react'

export function useBookmarkTracker() {
  // Default to true during SSR / initial client hydration to avoid modal flickering
  const [isBookmarked, setIsBookmarked] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    const savedBookmarked = localStorage.getItem('is_bookmarked') === 'true'

    if (ref === 'bookmark') {
      localStorage.setItem('is_bookmarked', 'true')
      localStorage.setItem('non_bookmark_visits', '0')
      setIsBookmarked(true)
    } else {
      if (savedBookmarked) {
        const sessionCounted = sessionStorage.getItem('bookmark_session_counted') === 'true'
        if (!sessionCounted) {
          sessionStorage.setItem('bookmark_session_counted', 'true')
          const visits = parseInt(localStorage.getItem('non_bookmark_visits') || '0', 10)
          const nextVisits = visits + 1
          
          if (nextVisits >= 3) {
            localStorage.setItem('is_bookmarked', 'false')
            localStorage.setItem('non_bookmark_visits', '0')
            setIsBookmarked(false)
          } else {
            localStorage.setItem('non_bookmark_visits', nextVisits.toString())
            setIsBookmarked(true)
          }
        } else {
          setIsBookmarked(true)
        }
      } else {
        setIsBookmarked(false)
      }
    }
  }, [])

  const markAsBookmarked = () => {
    localStorage.setItem('is_bookmarked', 'true')
    localStorage.setItem('non_bookmark_visits', '0')
    setIsBookmarked(true)
  }

  return { isBookmarked, markAsBookmarked }
}
