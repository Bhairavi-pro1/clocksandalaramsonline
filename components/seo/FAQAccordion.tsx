'use client'

import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQAccordionProps {
  faqs: { q: string, a: string }[]
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [activeMobileFaq, setActiveMobileFaq] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
      {faqs.map((faq, i) => (
        <div key={i} className="w-auto sm:w-full bg-white dark:bg-[#1a0b36]/40 border border-x-0 sm:border border-slate-200 dark:border-white/10 p-4 sm:p-6 md:p-8 rounded-none sm:rounded-[1.5rem] md:rounded-[2rem] hover:bg-slate-50 dark:hover:bg-white/[0.08] -mx-4 sm:mx-0 transition-all group flex flex-col justify-start">
          <div 
            className="flex items-center justify-between gap-3 sm:gap-4 w-full cursor-pointer md:cursor-default select-none"
            onClick={() => setActiveMobileFaq(activeMobileFaq === i ? null : i)}
          >
            <div className="flex gap-3 sm:gap-4 items-center">
              <HelpCircle className="text-primary group-hover:scale-110 transition-transform shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-tight leading-snug">{faq.q}</h3>
            </div>
            <ChevronDown className={cn("w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-muted transition-transform duration-300 md:hidden shrink-0", activeMobileFaq === i && "rotate-180")} />
          </div>
          
          <div className={cn(
            "grid transition-all duration-300 ease-in-out",
            activeMobileFaq === i ? "grid-rows-[1fr] opacity-100 mt-3 sm:mt-4" : "grid-rows-[0fr] opacity-0 md:grid-rows-[1fr] md:opacity-100 md:mt-4"
          )}>
            <div className="overflow-hidden">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed font-medium pl-0 md:pl-10 text-justify">
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
