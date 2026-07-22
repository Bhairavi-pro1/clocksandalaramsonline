'use client'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import InternalLinks from '@/components/ui/InternalLinks'
import BookmarkModal from '@/components/ui/BookmarkModal'
import Ad160x600 from '@/components/ads/Ad160x600'
import { cn } from '@/lib/utils'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isStudio = pathname.startsWith('/studio')

  // Sanity Studio has its own full-page UI — render children only
  if (isStudio) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {!isHomePage ? <Sidebar /> : <Header />}
      <main className={cn(
        "flex-1 min-w-0 flex flex-col min-h-screen",
        !isHomePage ? "md:ml-72 p-4 lg:p-10 pt-20 md:pt-10" : "w-full"
      )}>
        <div className="flex-1 flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {children}
          </div>
          {!isHomePage && <Ad160x600 />}
        </div>
        
        <div className={cn(
          "w-full",
          !isHomePage ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto px-6"
        )}>
          <InternalLinks />
        </div>

        <Footer />
      </main>
      <BookmarkModal />
    </div>
  );
}
