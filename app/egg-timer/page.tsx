import { Metadata } from 'next'
import EggTimerClient from '@/components/pages/EggTimerClient'
import AdBanner from '@/components/ui/AdBanner'

export const metadata: Metadata = {
  title: 'Interactive Egg Timer Online | Perfect Soft, Medium & Hard Boiled Eggs',
  description: 'Free interactive egg boiling timer. Adjust for egg size, room or fridge temp, and see precise visual guides for perfectly soft, medium, or hard boiled eggs.',
  keywords: 'egg timer, boiled egg timer, how long to boil eggs, perfect hard boiled eggs, ramen egg timer, soft boiled egg time',
  openGraph: {
    title: 'Interactive Egg Timer Online | Perfect Boiled Eggs',
    description: 'Calculate the exact time needed for the perfect soft, medium, or hard boiled egg. Adjust for size and temperature with our free visual egg timer.',
    type: 'website',
  }
}

const tableSchema = {
  "@context": "https://schema.org",
  "@type": "Table",
  "about": "Egg Boiling Times Chart",
  "keywords": "egg boiling times, soft boiled time, medium boiled time, hard boiled time"
}

export default function EggTimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema) }}
      />
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Perfect <span className="text-primary italic">Egg Timer</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mx-auto">
              Select your desired doneness with our interactive guide. Adjust for egg size and starting temperature to boil the perfect egg every time.
            </p>
          </div>

          {/* <div className="py-2 mb-8">
            <AdBanner dataAdSlot="egg_timer_top" />
          </div> */}

          {/* The Interactive Client Component */}
          <EggTimerClient />

          {/* SEO Content & Tables */}
          <section className="mt-20 max-w-4xl mx-auto space-y-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white">The Ultimate Egg Boiling Times Chart</h2>
              <p className="text-white/60 leading-relaxed text-lg">
                Whether you're making gooey ramen eggs or firm eggs for a salad, keeping track of exactly how long to boil your eggs is crucial. Refer to our reference chart below based on standard large eggs starting in boiling water.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  <thead>
                    <tr className="bg-primary/20 text-primary border-b border-primary/20">
                      <th className="p-5 font-black uppercase text-sm tracking-wider">Egg Size</th>
                      <th className="p-5 font-black uppercase text-sm tracking-wider">Soft Boiled</th>
                      <th className="p-5 font-black uppercase text-sm tracking-wider">Medium Boiled</th>
                      <th className="p-5 font-black uppercase text-sm tracking-wider">Hard Boiled</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-5 font-bold">Small (S)</td>
                      <td className="p-5">3-4 minutes</td>
                      <td className="p-5">5-6 minutes</td>
                      <td className="p-5">8-9 minutes</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-5 font-bold text-white">Large (L) - Standard</td>
                      <td className="p-5">5-6 minutes</td>
                      <td className="p-5">7-8 minutes</td>
                      <td className="p-5">10-12 minutes</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-5 font-bold">Extra Large (XL)</td>
                      <td className="p-5">6-7 minutes</td>
                      <td className="p-5">8-9 minutes</td>
                      <td className="p-5">12-14 minutes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-primary/70 italic">* Times may vary slightly based on altitude, amount of water, and starting water temperature (always start counting when water returns to a rolling boil).</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
              <div className="grid gap-6">
                <div className="bg-[#110624] p-8 rounded-[2rem] border border-white/5">
                  <h4 className="text-xl font-bold text-primary mb-3">Should I start with cold or boiling water?</h4>
                  <p className="text-white/60 leading-relaxed">
                    Most chefs agree that gently lowering eggs into already <strong>boiling water</strong> makes peeling them significantly easier afterward. The sudden heat shock prevents the egg white from bonding to the inner membrane.
                  </p>
                </div>
                <div className="bg-[#110624] p-8 rounded-[2rem] border border-white/5">
                  <h4 className="text-xl font-bold text-primary mb-3">What is an ice bath and why is it important?</h4>
                  <p className="text-white/60 leading-relaxed">
                    An ice bath is a bowl filled with cold water and ice cubes. The moment your timer goes off, transfer your cooked eggs immediately into the ice bath. This stops the cooking process instantly (preventing the dreaded gray ring around the yolk) and shrinks the egg inside the shell, making peeling a breeze.
                  </p>
                </div>
              </div>
            </div>
            
          </section>
        </main>
      </div>
      <div className="py-2 mb-8">
        <AdBanner />
      </div>
    </div>
  )
}
