import WorldClock from '@/components/tools/WorldClock'
import AdBanner from '@/components/ui/AdBanner'
import CityCloud from '@/components/ui/CityCloud'

export default function WorldClockPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-black text-center mb-16">World Clock — Current Local Time Worldwide</h1>
      <WorldClock />
      
      <div className="mt-20 prose prose-invert max-w-none bg-card/50 p-8 rounded-3xl border border-card-border">
        <h2>Global Time Tracking Made Simple</h2>
        <p>Keep track of the local time in any city around the world. Our world clock supports all major timezones and adjusts automatically for daylight savings time.</p>
        <ul>
          <li><strong>Real-time Updates:</strong> Every clock is synced to the second.</li>
          <li><strong>Customizable:</strong> Add your favorite cities for quick reference.</li>
          <li><strong>International Context:</strong> See the current day and date for each location.</li>
        </ul>
      </div>

      <div className="mt-16 w-full max-w-6xl mx-auto mb-20">
        <AdBanner />
      </div>

      <div className="w-full border-t border-white/5 pt-12">
        <CityCloud />
      </div>
    </div>
  )
}
