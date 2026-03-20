import { FileText, ShieldAlert, Scale, Globe, Terminal } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-2">
          Usage Agreement
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Terms of Service</h1>
        <p className="text-muted-foreground font-medium">Last Updated: March 20, 2026</p>
      </section>

      {/* 1. Acceptance */}
      <section className="bg-[#1a0b2e]/40 border border-white/5 p-8 md:p-12 rounded-[2.5rem] space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
          <FileText size={24} className="text-accent" /> 1. Acceptance of Terms
        </h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          By accessing and using Clocks and Alarms Online (the "Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      {/* 2. License & Intellectual Property */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-card-border rounded-3xl space-y-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-2">
            <Terminal size={20} className="text-primary" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Use License</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Permission is granted to temporarily use our tools (clocks, alarms, timers) for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
        </div>
        <div className="p-8 bg-card border border-card-border rounded-3xl space-y-4">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-2">
            <ShieldAlert size={20} className="text-accent" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Restrictions</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            You may not decompile or reverse engineer any software contained on the Website, or remove any copyright or other proprietary notations from the materials.
          </p>
        </div>
      </section>

      {/* 3. Disclaimer (The "Flight" Warning) */}
      <section className="p-8 md:p-12 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] space-y-6">
        <h2 className="text-2xl font-black text-red-500 uppercase tracking-tight italic flex items-center gap-3">
          <ShieldAlert size={28} /> Critical Warning & Disclaimer
        </h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          The materials on the Website are provided on an 'as is' basis. Clocks and Alarms Online makes no warranties, expressed or implied. 
        </p>
        <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
          <p className="text-sm text-red-400 font-bold italic leading-relaxed">
            IMPORTANT: Our alarms and timers are browser-based. Relying on them for critical wake-ups (e.g., catching a flight, medical administration) is done at your own risk. Device battery, browser sleep settings, and software updates can interfere with playback. we are not responsible for any missed events.
          </p>
        </div>
      </section>

      {/* 4. Global Governing Law */}
      <section className="bg-card border border-card-border p-8 md:p-12 rounded-[2.5rem] space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
          <Scale size={24} className="text-primary" /> Governing Law & Jurisdiction
        </h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          These terms and conditions are governed by and construed in accordance with international commercial laws. You irrevocably submit to the exclusive jurisdiction of the courts in your local territory for any dispute arising out of your use of the Website.
        </p>
        <p className="text-muted-foreground leading-relaxed font-medium">
          Our tools are designed to respect the local time and regulations of users globally. If you use this site from a territory where such digital tools are restricted, you do so at your own initiative and are responsible for compliance with local laws.
        </p>
      </section>

      {/* 5. Limitations */}
      <section className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-black text-white uppercase tracking-tight italic flex items-center gap-2">
          <Globe size={20} className="text-primary" /> Limitation of Liability
        </h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          In no event shall Clocks and Alarms Online or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our Website.
        </p>
      </section>

      {/* Footer Note */}
      <section className="pt-12 border-t border-white/5 text-center">
        <p className="text-sm text-muted-foreground font-medium italic">
          We reserve the right to revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms.
        </p>
      </section>
    </div>
  )
}

