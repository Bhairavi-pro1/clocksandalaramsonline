import { HelpCircle, CheckCircle2, Lightbulb, Wrench, ShieldCheck, Zap, Users, GraduationCap, Briefcase } from 'lucide-react'

interface ToolSEOProps {
  toolName: string
  introTag: string
  introHeading: string
  introParagraph: string | React.ReactNode
  howToSteps: { title: string, text: string }[]
  proTips: string[]
  useCases: { title: string, text: string, icon: any }[]
  whyChooseUs: string
  troubleshooting: string
  faqs: { q: string, a: string }[]
}

export default function ToolSEO({
  toolName,
  introTag,
  introHeading,
  introParagraph,
  howToSteps,
  proTips,
  useCases,
  whyChooseUs,
  troubleshooting,
  faqs
}: ToolSEOProps) {
  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-32">
      
      {/* 1. Introduction (Thin Content Fix) */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 mt-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
          {introTag}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
          {introHeading.split(' ').map((word, i, arr) => 
            i > arr.length - 3 ? <span key={i} className="text-primary/80">{word} </span> : <span key={i}>{word} </span>
          )}
        </h2>
        <p className="text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90 whitespace-pre-line">
          {introParagraph}
        </p>
      </section>

      {/* 2. Comprehensive How to Use */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">How to Use the <span className="text-primary">{toolName}</span></h2>
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howToSteps.map((item, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-[#1a0b36]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/40 transition-colors">
                <span className="text-white font-black text-xl">{i + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-muted/80 leading-relaxed font-medium">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        {proTips.length > 0 && (
          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-6">
              <Lightbulb className="text-primary" /> Pro Tips for Maximum Efficiency
            </h3>
            <ul className="space-y-4">
              {proTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-muted/90 font-medium leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3. Popular Use Cases */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Popular Use Cases for <span className="text-primary">{toolName}</span></h2>
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          <p className="text-muted text-lg max-w-2xl mx-auto">Discover how people around the world optimize their daily routines using our comprehensive timing suite.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => {
            const Icon = uc.icon
            return (
              <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Icon className="w-8 h-8 text-sky-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{uc.title}</h3>
                <p className="text-muted/80 leading-relaxed">{uc.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Why Choose Our Tool */}
      <section className="bg-gradient-to-br from-[#1a0b36]/60 to-transparent border border-violet-500/20 rounded-[3rem] p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ShieldCheck size={200} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-8">Why Choose Our <span className="text-primary">{toolName}</span>?</h2>
          <p className="text-lg text-muted/90 leading-relaxed mb-8 whitespace-pre-line">
            {whyChooseUs}
          </p>
        </div>
      </section>

      {/* 5. Troubleshooting */}
      <section className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Wrench className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-black text-white tracking-tight">Troubleshooting Guide</h2>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8">
          <p className="text-muted/90 leading-relaxed whitespace-pre-line text-lg">
            {troubleshooting}
          </p>
        </div>
      </section>

      {/* 6. Extensive FAQ */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Frequently Asked <span className="text-primary italic">Questions</span></h2>
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
              <div className="flex gap-4 mb-4">
                <HelpCircle className="text-primary group-hover:scale-110 transition-transform shrink-0" />
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{faq.q}</h3>
              </div>
              <p className="text-sm text-muted/70 leading-relaxed font-medium pl-10">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
