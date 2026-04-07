import { Zap, Shield, Globe, Clock, Cpu, Layout } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 space-y-24">
      {/* 1. Hero Section */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
          Precision Timekeeping Solutions
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tighter italic">
          Our Commitment to <span className="text-primary italic">Accuracy</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
          Clocks and Alarms Online was developed to provide users with reliable, high-precision time management tools. Our focus is on delivering accuracy and clarity through a streamlined, professional interface.
        </p>
      </section>

      {/* 2. Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose">
        <div className="p-8 bg-[#1a0b2e]/40 border border-violet-500/10 rounded-[2.5rem] group hover:border-primary/30 transition-all duration-500">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30">
            <Zap className="text-primary" size={24} />
          </div>
          <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight italic">Technical Precision</h3>
          <p className="text-sm text-muted-foreground font-bold leading-relaxed">
            Our systems synchronize directly with local hardware clocks and are optimized to minimize layout shifts, ensuring consistent performance during critical tasks.
          </p>
        </div>

        <div className="p-8 bg-[#1a0b2e]/40 border border-violet-500/10 rounded-[2.5rem] group hover:border-accent/30 transition-all duration-500">
          <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 border border-accent/30">
            <Shield className="text-accent" size={24} />
          </div>
          <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight italic">Operational Reliability</h3>
          <p className="text-sm text-muted-foreground font-bold leading-relaxed">
            We leverage the <strong>Wake Lock API</strong> to prevent screen dimming during active use, while <strong>persistent state management</strong> ensures your preferences remain saved across sessions.
          </p>
        </div>

        <div className="p-8 bg-[#1a0b2e]/40 border border-violet-500/10 rounded-[2.5rem] group hover:border-green-500/30 transition-all duration-500">
          <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 border border-green-500/30">
            <Globe className="text-green-500" size={24} />
          </div>
          <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight italic">Global Connectivity</h3>
          <p className="text-sm text-muted-foreground font-bold leading-relaxed">
            By integrating real-time synchronization protocols, we provide accurate time tracking for users across all major global time zones.
          </p>
        </div>
      </div>

      {/* 3. Detailed Technical Section */}
      <section className="bg-gradient-to-br from-card/40 via-card/20 to-transparent border border-white/5 p-12 rounded-[3.5rem]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">The Importance of Accurate Timing</h2>
            <p className="text-muted-foreground leading-relaxed font-medium">
              In a globally connected environment, precise time management is essential. Whether coordinating international team meetings, managing study intervals, or tracking time for professional projects, reliable tools make a measurable difference.
            </p>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Our platform is designed to be a clean, distraction-free environment. We prioritize performance and usability, removing unnecessary elements to focus on the core functionality users require.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Clock size={16} className="text-primary" />
                <span className="text-xs font-bold text-white/80">Real-Time Accuracy</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Cpu size={16} className="text-accent" />
                <span className="text-xs font-bold text-white/80">Hardware Integration</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Layout size={16} className="text-green-500" />
                <span className="text-xs font-bold text-white/80">Optimized Performance</span>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-1 rounded-[3rem] overflow-hidden">
               <div className="p-8 space-y-6 bg-gradient-to-b from-white/5 to-transparent rounded-[2.8rem]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">System Metrics</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white/40">Drift Variance</p>
                    <p className="text-2xl font-black text-white">± 0.0ms</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white/40">Sync Status</p>
                    <p className="text-lg font-bold text-accent italic">Optimal</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Expertise & Authorship */}
      <section className="bg-primary/5 border border-primary/20 p-12 rounded-[3.5rem] mt-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-6 text-center">Developed by Technical Experts</h2>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium text-center">
          With over 15 years of experience in utility software and high-precision systems, our senior technical team established Clocks and Alarms Online to set the gold standard in web-based timekeeping. We ensure every clock, timer, and alarm operates with atomic synchronization and uncompromised accuracy.
        </p>
      </section>

      {/* 5. Vision Section */}
      <section className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Developed for Productivity</h2>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
          What began as an effort to build better study tools has evolved into a resource used by individuals and teams worldwide. We are committed to maintaining a high-quality, free service that supports professional and personal time management needs.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
          We continue to refine our tools based on user feedback and evolving web standards, ensuring that Clocks and Alarms Online remains a dependable utility for all.
        </p>
      </section>

      {/* 5. Ad Banner Placeholder */}
      <AdBanner />
    </div>
  )
}


