import Link from 'next/link'

const TOOLS = [
  { name: 'Timer', href: '/timer' },
  { name: 'Alarm Clock', href: '/alarm-clock' },
  { name: 'Stopwatch', href: '/stopwatch' },
  { name: 'World Clock', href: '/world-clock' },
  { name: 'Meeting Planner', href: '/meeting-planner' },
  { name: 'DST Tracker', href: '/dst-tracker' },
]

export default function InternalLinks() {
  return (
    <div className="py-12 border-t border-card-border">
      <h3 className="text-xl font-bold mb-6 text-accent">Explore More Tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {TOOLS.map((tool) => (
          <Link 
            key={tool.href}
            href={tool.href}
            className="p-4 bg-secondary/20 rounded-xl border border-card-border hover:border-accent/40 transition-all text-center font-bold text-sm"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
