'use client'
import { Mail, MessageCircle, HelpCircle } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-6 py-4 sm:py-12 md:py-16 space-y-4 sm:space-y-8 w-full">
      <h1 className="text-2xl sm:text-4xl font-black text-center mb-4 sm:mb-8 text-white uppercase tracking-tighter italic">
        Get in Touch
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="p-4 sm:p-6 bg-card/60 border border-card-border rounded-2xl sm:rounded-3xl text-center group hover:border-accent/40 transition-all flex flex-col items-center justify-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2.5 sm:mb-4 text-accent group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <h3 className="text-sm sm:text-lg font-black mb-1 uppercase tracking-tight text-white">Support</h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">Trouble with your alarms? We're here to help you sync.</p>
        </div>

        <div className="p-4 sm:p-6 bg-card/60 border border-card-border rounded-2xl sm:rounded-3xl text-center group hover:border-accent/40 transition-all flex flex-col items-center justify-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2.5 sm:mb-4 text-accent group-hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <h3 className="text-sm sm:text-lg font-black mb-1 uppercase tracking-tight text-white">Feedback</h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">Have a feature request? Let us know what to build next.</p>
        </div>

        <div className="p-4 sm:p-6 bg-card/60 border border-card-border rounded-2xl sm:rounded-3xl text-center group hover:border-accent/40 transition-all flex flex-col items-center justify-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2.5 sm:mb-4 text-accent group-hover:scale-105 transition-transform">
            <HelpCircle className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <h3 className="text-sm sm:text-lg font-black mb-1 uppercase tracking-tight text-white">F.A.Q</h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">Need quick answers? View our frequent questions in tool pages.</p>
        </div>
      </div>

      {/* SEO & Contact Info Section */}
      <section className="mt-6 sm:mt-12 max-w-4xl mx-auto space-y-3 sm:space-y-5 bg-card/40 border border-card-border p-4 sm:p-8 rounded-2xl sm:rounded-3xl">
        <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight italic">Support & Feedback</h2>
        <p className="text-xs sm:text-base text-muted-foreground leading-relaxed font-medium">
          At Clocks and Alarms Online, we are dedicated to providing the most accurate and user-friendly timekeeping experience on the web. 
          Whether you're experiencing a technical sync issue or have a brilliant idea for a new feature, your input helps us build better utilities.
        </p>
        <div className="pt-2">
          <p className="text-xs text-muted-foreground font-semibold">For inquiries, bug reports, and assistance:</p>
          <a 
            href="mailto:Bhairavi.co@gmail.com" 
            className="inline-flex items-center gap-2 text-primary font-black text-sm sm:text-lg mt-1 tracking-tight hover:underline"
          >
            <Mail size={16} />
            <span>Bhairavi.co@gmail.com</span>
          </a>
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground/60 italic font-medium">
          We typically respond to all legitimate inquiries within 24-48 business hours.
        </p>
      </section>

      <AdBanner />
    </div>
  )
}

