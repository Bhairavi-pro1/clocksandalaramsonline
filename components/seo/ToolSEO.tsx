import { HelpCircle, CheckCircle2, Lightbulb, Wrench, ShieldCheck, Zap, Users, GraduationCap, Briefcase, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import FAQAccordion from './FAQAccordion'

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

function parseTroubleshooting(rawText: string) {
  if (!rawText) return { intro: '', items: [] }

  const lines = rawText.trim().split('\n').map(l => l.trim()).filter(Boolean)
  let intro = ''
  const items: { number: number; title: string; description: string }[] = []
  let currentItem: { number: number; title: string; description: string } | null = null

  for (const line of lines) {
    const match = line.match(/^(\d+)[\.\)]\s*(.+)$/)
    if (match) {
      if (currentItem) {
        items.push(currentItem)
      }
      const num = parseInt(match[1], 10)
      const rest = match[2]
      const colonIdx = rest.indexOf(':')
      if (colonIdx > 0 && colonIdx < 50) {
        const title = rest.substring(0, colonIdx).trim()
        const desc = rest.substring(colonIdx + 1).trim()
        currentItem = { number: num, title, description: desc }
      } else {
        currentItem = { number: num, title: `Issue ${num}`, description: rest }
      }
    } else if (currentItem) {
      currentItem.description += ' ' + line
    } else {
      intro = intro ? `${intro} ${line}` : line
    }
  }

  if (currentItem) {
    items.push(currentItem)
  }

  return { intro, items }
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
  const troubleData = parseTroubleshooting(troubleshooting)
  return (
    <div className="max-w-6xl mx-auto pb-12 sm:pb-24 space-y-16 sm:space-y-32">
      
      {/* 1. Introduction (Thin Content Fix) */}
      <section className="text-center space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 mt-10 sm:mt-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2">
          {introTag}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight">
          {introHeading.split(' ').map((word, i, arr) => 
            i > arr.length - 3 ? <span key={i} className="text-primary/80">{word} </span> : <span key={i}>{word} </span>
          )}
        </h2>
        <p className="text-sm sm:text-lg md:text-xl text-muted leading-relaxed max-w-4xl mx-auto font-medium opacity-90 whitespace-pre-line text-justify">
          {introParagraph}
        </p>
      </section>

      {/* 2. Comprehensive How to Use */}
      <section className="space-y-8 sm:space-y-16">
        <div className="text-center space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">How to Use the <span className="text-primary">{toolName}</span></h2>
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
          {howToSteps.map((item, i) => (
            <div key={i} className="group p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-[#1a0b36]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500 flex flex-col md:flex-row items-start gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/40 transition-colors shrink-0">
                <span className="text-white font-black text-base sm:text-xl">{i + 1}</span>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted/80 leading-relaxed font-medium text-justify">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        {proTips.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-primary/5 border border-primary/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3 text-white mb-4 sm:mb-6">
              <Lightbulb className="text-primary w-5 h-5 sm:w-6 sm:h-6" /> Pro Tips for Maximum Efficiency
            </h3>
            <ul className="space-y-2.5 sm:space-y-4">
              {proTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-base text-muted/90 font-medium leading-relaxed text-justify">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3. Popular Use Cases */}
      <section className="space-y-8 sm:space-y-16">
        <div className="text-center space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">Popular Use Cases for <span className="text-primary">{toolName}</span></h2>
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          <p className="text-muted text-sm sm:text-lg max-w-2xl mx-auto">Discover how people around the world optimize their daily routines using our comprehensive timing suite.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {useCases.map((uc, i) => {
            const Icon = uc.icon
            return (
              <div key={i} className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary dark:text-sky-400 mb-4 sm:mb-6" />
                <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3">{uc.title}</h3>
                <p className="text-xs sm:text-base text-muted/80 leading-relaxed text-justify">{uc.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Why Choose Our Tool */}
      <section className="bg-transparent md:bg-gradient-to-br md:from-violet-500/5 md:to-transparent md:dark:from-[#1a0b36]/60 md:dark:to-transparent border-0 md:border border-violet-500/10 dark:border-violet-500/20 rounded-none md:rounded-[3rem] p-4 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="hidden md:block absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ShieldCheck size={200} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tight mb-4 sm:mb-8">Why Choose Our <span className="text-primary">{toolName}</span>?</h2>
          <p className="text-sm sm:text-lg text-muted/90 leading-relaxed mb-4 sm:mb-8 whitespace-pre-line text-left md:text-justify">
            {whyChooseUs}
          </p>
        </div>
      </section>

      {/* 5. Troubleshooting */}
      {troubleshooting && (
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Troubleshooting Guide</h2>
                <p className="text-xs sm:text-sm text-muted font-medium">Quick solutions to common questions & potential display issues</p>
              </div>
            </div>
          </div>

          {/* Intro statement banner */}
          {troubleData.intro && (
            <div className="flex items-start sm:items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 text-amber-900 dark:text-amber-200/90 text-xs sm:text-sm font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
              <span>{troubleData.intro}</span>
            </div>
          )}

          {/* List of organized troubleshooting items */}
          {troubleData.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {troubleData.items.map((item) => (
                <div 
                  key={item.number}
                  className="group p-5 sm:p-6 rounded-2xl bg-slate-100/50 dark:bg-[#1a0b36]/40 border border-slate-200/80 dark:border-white/5 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 shadow-sm flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs sm:text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    0{item.number}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-muted/90 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback for unformatted single paragraph */
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-100/50 dark:bg-[#1a0b36]/40 border border-slate-200/80 dark:border-white/5">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-muted/90 leading-relaxed">
                {troubleshooting}
              </p>
            </div>
          )}
        </section>
      )}

      {/* 6. Extensive FAQ */}
      <section className="space-y-8 sm:space-y-16">
        <div className="text-center space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight">Frequently Asked <span className="text-primary italic">Questions</span></h2>
          <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
        </div>

        <FAQAccordion faqs={faqs} />
      </section>

    </div>
  )
}
