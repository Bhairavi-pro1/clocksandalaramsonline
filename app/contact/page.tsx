'use client'
import { Mail, MessageCircle, HelpCircle } from 'lucide-react'
import AdBanner from '@/components/ui/AdBanner'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-black text-center mb-16 text-white uppercase tracking-tighter italic">Get in Touch</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-card border border-card-border rounded-3xl text-center group hover:border-accent/40 transition-all">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent group-hover:scale-110 transition-transform">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Support</h3>
          <p className="text-xs text-muted font-bold mb-4 leading-relaxed">Trouble with your alarms? We're here to help you sync.</p>
          <a href="mailto:support@clocksandalarmsonline.com" className="text-accent font-black text-sm">Email Us</a>
        </div>

        <div className="p-8 bg-card border border-card-border rounded-3xl text-center group hover:border-accent/40 transition-all">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent group-hover:scale-110 transition-transform">
            <MessageCircle size={32} />
          </div>
          <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Feedback</h3>
          <p className="text-xs text-muted font-bold mb-4 leading-relaxed">Have a feature request? Let us know what to build next.</p>
          <a href="mailto:feedback@clocksandalarmsonline.com" className="text-accent font-black text-sm">Send Idea</a>
        </div>

        <div className="p-8 bg-card border border-card-border rounded-3xl text-center group hover:border-accent/40 transition-all">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent group-hover:scale-110 transition-transform">
            <HelpCircle size={32} />
          </div>
          <h3 className="text-xl font-black mb-2 uppercase tracking-tight">F.A.Q</h3>
          <p className="text-xs text-muted font-bold mb-4 leading-relaxed">Need quick answers? View our frequent questions.</p>
          <a href="#" className="text-accent font-black text-sm">View FAQ</a>
        </div>
      </div>

      <div className="mt-24 p-12 bg-secondary/10 border border-card-border rounded-3xl text-center">
        <h2 className="text-2xl font-black mb-4 uppercase tracking-tight italic">Commercial Inquiries</h2>
        <p className="text-muted font-bold max-w-xl mx-auto">
          For advertising opportunities please reach out to our partnerships team directly.
        </p>
      </div>

      {/* SEO Optimized Paragraph */}
      <section className="mt-20 max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Support & Feedback</h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          At Clocks and Alarms Online, we are dedicated to providing the most accurate and user-friendly timekeeping experience on the web. 
          Whether you're experiencing a technical sync issue or have a brilliant idea for a new feature, your input is what helps us grow. 
          Our team monitors all inquiries to ensure our high-precision tools remain the gold standard for users worldwide.
        </p>
        <p className="text-muted-foreground leading-relaxed font-medium">
          For immediate assistance, bug reports, or partnership proposals, you can reach us directly at:
          <br />
          <span className="text-primary font-black text-lg block mt-2 tracking-tight">Bhairavi.co@gmail.com</span>
        </p>
        <p className="text-sm text-muted-foreground/60 italic font-medium">
          We typically respond to all legitimate inquiries within 24-48 business hours. Thank you for being part of our global community.
        </p>
      </section>
      <AdBanner />
    </div>
  )
}

