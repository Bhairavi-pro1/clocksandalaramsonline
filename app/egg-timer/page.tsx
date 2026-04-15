import { Metadata } from 'next'
import EggTimerClient from '@/components/pages/EggTimerClient'
import AdBanner from '@/components/ui/AdBanner'
import ToolSEO from '@/components/seo/ToolSEO'
import { Utensils, Timer, Thermometer, ShoppingCart, Info } from 'lucide-react'
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
          <div className="mt-20">
            <ToolSEO
              toolName="Interactive Egg Timer"
              introTag="Culinary Precision"
              introHeading="Achieve the Perfect Boil Every Single Time"
              introParagraph="Boiling an egg seems simple until you're faced with an overcooked, chalky yolk or an undercooked, runny white. Our interactive Egg Timer removes the guesswork from breakfast. By dynamically calculating the specific boiling time based on your egg's exact size and starting temperature, our algorithm ensures a flawless culinary result. Whether you prefer a liquid center for ramen or a firm hard-boil for egg salad, perfect consistency is just a click away."
              howToSteps={[
                { title: "Select Egg Size", text: "Are you using Medium, Large, or Extra Large eggs? The thermal mass of the egg dictates how fast heat penetrates to the yolk." },
                { title: "Choose Starting Temp", text: "Did you pull the egg directly from a 38°F fridge, or has it been resting at room temperature? This drastically changes the required boiling time." },
                { title: "Pick Desired Doneness", text: "Slide the visual selector to choose between a soft, gooey yolk, a jammy medium boil, or a firm hard boil." },
                { title: "Start the Timer", text: "Once your water reaches a rolling boil, gently lower the eggs into the pot and simultaneously click the 'Start' button." }
              ]}
              proTips={[
                "Always prepare an 'Ice Bath' (a bowl of cold water and ice cubes) before your timer finishes. Dropping the eggs into the ice bath immediately stops the cooking process.",
                "Slightly older eggs are significantly easier to peel than farm-fresh eggs. If you are making deviled eggs, buy them a week in advance.",
                "Using a push-pin to poke a microscopic hole in the wide base of the egg before boiling allows trapped air to escape, preventing the shell from cracking in the water."
              ]}
              useCases={[
                { icon: Utensils, title: "For Ramen Enthusiasts", text: "The perfect Ajitsuke Tamago (Ramen Egg) requires a highly precise 6.5-minute medium-soft boil to achieve that signature custard-like consistency." },
                { icon: Thermometer, title: "For Meal Preppers", text: "Meal preppers making huge batches of hard-boiled eggs need exact timing to avoid the ugly, sulfuric green-gray ring from forming around overcooked yolks." },
                { icon: ShoppingCart, title: "For Home Cooks", text: "No more guessing if the eggs are done. The visual interface allows home cooks to confidently deliver the exact style of egg requested by picky family members." },
                { icon: Timer, title: "For Professional Kitchens", text: "Line cooks running multiple stations use our digital timer to ensure the breakfast service eggs are consistently perfect across hundreds of orders." },
                { icon: Info, title: "For Culinary Students", text: "Learning the science of thermal transfer in proteins is critical. The timer demonstrates exactly how size and starting temp affect coagulation." }
              ]}
              whyChooseUs={`Generic cooking charts only give you a rough estimate, usually ignoring whether your eggs are coming from the fridge or the counter. In a delicate protein like an egg, a 40°F starting difference translates to a full minute of required boiling time. 
              
              Our interactive tool uses a calibrated algorithmic model to calculate the necessary thermal curve. Combined with a piercing audio alert that can be heard over the sound of a running exhaust fan, Clocks and Alarms Online offers the most reliable culinary timer on the web.`}
              troubleshooting={`Timer finished but eggs are wrong?
              
              1. False Boil: Ensure the water is at a "rolling boil" (large, violent bubbles) before dropping the eggs in. Simmering water will result in undercooked eggs.
              2. Altitude Sickness: Water boils at lower temperatures at high altitudes (like Denver, CO). If you live in the mountains, you must manually add 1-2 extra minutes to the timer to compensate.
              3. Overcrowding: Dropping 12 cold eggs into a small pot immediately kills the water temperature. Ensure you have enough boiling water to maintain a rapid boil after adding the eggs.`}
              faqs={[
                { q: "Should I start with cold or boiling water?", a: "Most chefs agree that gently lowering eggs into already BOILING water makes peeling them significantly easier. The sudden heat shock prevents the egg white's proteins from bonding to the inner shell membrane." },
                { q: "What is an ice bath and why is it important?", a: "An ice bath is simply a bowl filled with cold water and ice. Transferring cooked eggs immediately into an ice bath stops the internal cooking process instantly, preventing overcooked, gray yolks and making peeling a breeze." },
                { q: "How long is a soft boiled egg?", a: "For a standard Large egg straight from the fridge dropped into boiling water, a perfect soft-boil (runny yolk, set whites) takes exactly 6 minutes." },
                { q: "How long is a hard boiled egg?", a: "For a firm, fully cooked hard-boiled egg ideal for salads or deviled eggs, you should boil a Large fridge-cold egg for 10 to 12 minutes." },
                { q: "Why is the yolk green/gray?", a: "The dreaded green ring is caused by overcooking. Iron from the yolk reacts with hydrogen sulfide from the white to form ferrous sulfide. Using our exact timer prevents this." },
                { q: "Do brown eggs take longer to cook than white eggs?", a: "No. The color of the shell is determined purely by the breed of the chicken and has absolutely zero impact on cooking times, shell thickness, or nutritional value." },
                { q: "Does the timer work on my phone in the kitchen?", a: "Yes! Our interface is fully mobile responsive, meaning you can prop your phone up on the counter while cooking without the screen sleeping." }
              ]}
            />
          </div>

          <section className="mt-16 max-w-4xl mx-auto space-y-16">
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
          </section>
        </main>
      </div>
      <div className="py-2 mb-8">
        <AdBanner />
      </div>
    </div>
  )
}
