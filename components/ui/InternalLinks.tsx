import Link from 'next/link'

const TOOLS = [
  { name: 'Timer', href: '/timer' },
  { name: 'Alarm Clock', href: '/alarm-clock' },
  { name: 'Stopwatch', href: '/stopwatch' },
  { name: 'World Clock', href: '/world-clock' },
  { name: 'Meeting Planner', href: '/meeting-planner' },
  { name: 'DST Tracker', href: '/dst-tracker' },
  { name: 'Holiday Countdown', href: '/countdown' },
  { name: 'Shared Alarm', href: '/shared-alarm' },
  { name: 'Egg Timer', href: '/egg-timer' },
]

export default function InternalLinks() {
  return (
    <div className="py-12 border-t border-card-border">
      <h3 className="text-xl font-bold mb-6 text-accent">Explore More Tools</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        {TOOLS.map((tool) => (
          <Link 
            key={tool.href}
            href={tool.href}
            className="p-2 sm:p-4 bg-secondary/20 rounded-lg sm:rounded-xl border border-card-border hover:border-accent/40 transition-all text-center font-bold text-[10px] xs:text-xs sm:text-sm flex items-center justify-center min-h-[44px] sm:min-h-0"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
