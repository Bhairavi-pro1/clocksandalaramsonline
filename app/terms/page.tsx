import { FileText, ShieldAlert, Scale, Globe, Terminal } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-6 py-4 sm:py-12 md:py-16 space-y-4 sm:space-y-8 md:space-y-10 w-full">
      {/* Hero Section */}
      <section className="text-center space-y-3 sm:space-y-6">
        <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2">
          Usage Agreement
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter italic">Terms of Service</h1>
        <p className="text-xs sm:text-sm text-muted font-medium">Last Updated: March 20, 2026</p>
      </section>

      {/* 1. Acceptance */}
      <section className="bg-card border border-card-border p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] space-y-3 sm:space-y-5">
        <h2 className="text-lg sm:text-2xl font-black text-foreground uppercase tracking-tight italic flex items-center gap-2 sm:gap-3">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0" /> 1. Acceptance of Terms
        </h2>
        <p className="text-xs sm:text-base text-muted leading-relaxed font-medium">
          By accessing and using Clocks and Alarms Online (the "Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      {/* 2. License & Intellectual Property */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <div className="p-4 sm:p-6 md:p-8 bg-card border border-card-border rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-1 sm:mb-2">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <h3 className="text-base sm:text-xl font-black text-foreground uppercase tracking-tight italic">Use License</h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
            Permission is granted to temporarily use our tools (clocks, alarms, timers) for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
        </div>
        <div className="p-4 sm:p-6 md:p-8 bg-card border border-card-border rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-1 sm:mb-2">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <h3 className="text-base sm:text-xl font-black text-foreground uppercase tracking-tight italic">Restrictions</h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
            You may not decompile or reverse engineer any software contained on the Website, or remove any copyright or other proprietary notations from the materials.
          </p>
        </div>
      </section>

      {/* 3. Disclaimer (The "Flight" Warning) */}
      <section className="p-4 sm:p-8 md:p-10 bg-red-500/5 border border-red-500/20 rounded-2xl sm:rounded-[2.5rem] space-y-3 sm:space-y-5">
        <h2 className="text-lg sm:text-2xl font-black text-red-500 uppercase tracking-tight italic flex items-center gap-2 sm:gap-3">
          <ShieldAlert className="w-5 h-5 sm:w-7 sm:h-7 shrink-0" /> Critical Warning & Disclaimer
        </h2>
        <p className="text-xs sm:text-base text-muted leading-relaxed font-medium">
          The materials on the Website are provided on an 'as is' basis. Clocks and Alarms Online makes no warranties, expressed or implied. 
        </p>
        <div className="bg-red-500/10 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-red-500/20">
          <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 font-bold italic leading-relaxed">
            IMPORTANT: Our alarms and timers are browser-based. Relying on them for critical wake-ups (e.g., catching a flight, medical administration) is done at your own risk. Device battery, browser sleep settings, and software updates can interfere with playback. We are not responsible for any missed events.
          </p>
        </div>
      </section>

      {/* 4. Global Governing Law */}
      <section className="bg-card border border-card-border p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] space-y-3 sm:space-y-5">
        <h2 className="text-lg sm:text-2xl font-black text-foreground uppercase tracking-tight italic flex items-center gap-2 sm:gap-3">
          <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" /> Governing Law & Jurisdiction
        </h2>
        <p className="text-xs sm:text-base text-muted leading-relaxed font-medium">
          These terms and conditions are governed by and construed in accordance with international commercial laws. You irrevocably submit to the exclusive jurisdiction of the courts in your local territory for any dispute arising out of your use of the Website.
        </p>
        <p className="text-xs sm:text-base text-muted leading-relaxed font-medium">
          Our tools are designed to respect the local time and regulations of users globally. If you use this site from a territory where such digital tools are restricted, you do so at your own initiative and are responsible for compliance with local laws.
        </p>
      </section>

      {/* 5. Limitations */}
      <section className="p-4 sm:p-6 bg-card border border-card-border rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
        <h2 className="text-base sm:text-xl font-black text-foreground uppercase tracking-tight italic flex items-center gap-2">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" /> Limitation of Liability
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
          In no event shall Clocks and Alarms Online or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our Website.
        </p>
      </section>

      {/* Footer Note */}
      <section className="pt-6 sm:pt-10 border-t border-card-border text-center">
        <p className="text-xs sm:text-sm text-muted font-medium italic">
          We reserve the right to revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms.
        </p>
      </section>
    </div>
  )
}

