import { Zap, Shield, Globe, Clock, Cpu, Layout } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-6 py-4 sm:py-12 md:py-24 space-y-8 sm:space-y-16 md:space-y-24 w-full">
      {/* 1. Hero Section */}
      <section className="text-center space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2">
          Precision Timekeeping Solutions
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 sm:mb-8 text-foreground tracking-tighter italic">
          Our Commitment to <span className="text-primary italic">Accuracy</span>
        </h1>
        
        <p className="text-base sm:text-xl md:text-2xl text-center text-muted max-w-4xl mx-auto leading-relaxed font-medium">
          Clocks and Alarms Online was developed to provide users with reliable, high-precision time management tools. Our focus is on delivering accuracy and clarity through a streamlined, professional interface.
        </p>
      </section>

      {/* 2. Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 not-prose">
        <div className="p-5 sm:p-8 bg-card border border-card-border rounded-2xl sm:rounded-[2.5rem] group hover:border-primary/30 transition-all duration-500">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-primary/30">
            <Zap className="text-primary" size={22} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 sm:mb-4 uppercase tracking-tight italic">Technical Precision</h3>
          <p className="text-xs sm:text-sm text-muted font-medium sm:font-bold leading-relaxed">
            Our systems synchronize directly with local hardware clocks and are optimized to minimize layout shifts, ensuring consistent performance during critical tasks.
          </p>
        </div>

        <div className="p-5 sm:p-8 bg-card border border-card-border rounded-2xl sm:rounded-[2.5rem] group hover:border-accent/30 transition-all duration-500">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-accent/30">
            <Shield className="text-accent" size={22} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 sm:mb-4 uppercase tracking-tight italic">Operational Reliability</h3>
          <p className="text-xs sm:text-sm text-muted font-medium sm:font-bold leading-relaxed">
            We leverage the <strong>Wake Lock API</strong> to prevent screen dimming during active use, while <strong>persistent state management</strong> ensures your preferences remain saved across sessions.
          </p>
        </div>

        <div className="p-5 sm:p-8 bg-card border border-card-border rounded-2xl sm:rounded-[2.5rem] group hover:border-green-500/30 transition-all duration-500">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-green-500/30">
            <Globe className="text-green-500" size={22} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 sm:mb-4 uppercase tracking-tight italic">Global Connectivity</h3>
          <p className="text-xs sm:text-sm text-muted font-medium sm:font-bold leading-relaxed">
            By integrating real-time synchronization protocols, we provide accurate time tracking for users across all major global time zones.
          </p>
        </div>
      </div>

      {/* 3. Detailed Technical Section */}
      <section className="bg-card border border-card-border p-5 sm:p-10 md:p-12 rounded-2xl sm:rounded-[3.5rem]">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight italic">The Importance of Accurate Timing</h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed font-medium">
            In a globally connected environment, precise time management is essential. Whether coordinating international team meetings, managing study intervals, or tracking time for professional projects, reliable tools make a measurable difference.
          </p>
          <p className="text-sm sm:text-base text-muted leading-relaxed font-medium">
            Our platform is designed to be a clean, distraction-free environment. We prioritize performance and usability, removing unnecessary elements to focus on the core functionality users require.
          </p>
          <div className="flex flex-wrap gap-2.5 sm:gap-4 pt-2 sm:pt-4">
            <div className="flex items-center gap-2 bg-secondary/50 dark:bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-card-border">
              <Clock size={16} className="text-primary" />
              <span className="text-xs font-bold text-foreground/90">Real-Time Accuracy</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 dark:bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-card-border">
              <Cpu size={16} className="text-accent" />
              <span className="text-xs font-bold text-foreground/90">Hardware Integration</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 dark:bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-card-border">
              <Layout size={16} className="text-green-500" />
              <span className="text-xs font-bold text-foreground/90">Optimized Performance</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Expertise & Authorship */}
      <section className="bg-primary/5 border border-primary/20 p-5 sm:p-10 md:p-12 rounded-2xl sm:rounded-[3.5rem] mt-8 sm:mt-12 md:mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight uppercase italic mb-3 sm:mb-6 text-center">Engineered for Precision & Reliability</h2>
        <p className="text-sm sm:text-lg text-muted leading-relaxed font-medium text-center">
          Built with modern web technologies and a dedicated focus on performance, Clocks and Alarms Online was created to offer fast, dependable, and accessible time management utilities. We focus on responsive design, smooth synchronization, and clean, distraction-free functionality across all your devices.
        </p>
      </section>

      {/* 5. Vision Section */}
      <section className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight uppercase italic">Developed for Productivity</h2>
        <p className="text-sm sm:text-lg text-muted leading-relaxed font-medium">
          What began as an effort to build better study tools has evolved into a resource used by individuals and teams worldwide. We are committed to maintaining a high-quality, free service that supports professional and personal time management needs.
        </p>
        <p className="text-sm sm:text-lg text-muted leading-relaxed font-medium">
          We continue to refine our tools based on user feedback and evolving web standards, ensuring that Clocks and Alarms Online remains a dependable utility for all.
        </p>
      </section>

      {/* 5. Ad Banner Placeholder */}
      <AdBanner />
    </div>
  )
}


