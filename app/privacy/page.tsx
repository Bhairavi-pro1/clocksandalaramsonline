import { ShieldCheck, Info, Mail, Cookie } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
          Your Data, Your Control
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Privacy Policy</h1>
        <p className="text-muted-foreground font-medium">Effective Date: March 20, 2026</p>
      </section>

      {/* Intro */}
      <section className="bg-[#1a0b2e]/40 border border-white/5 p-8 md:p-12 rounded-[2.5rem] space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
          <Info size={24} className="text-primary" /> Introduction
        </h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          At Clocks and Alarms Online, we value your privacy above all else. This policy outlines our commitment to protecting your personal information and describes how we collect, use, and safeguard any data when you interact with our global timekeeping tools.
        </p>
        <p className="text-muted-foreground leading-relaxed font-medium">
          Whether you are accessing our site from Europe, the United States, Asia, or anywhere else in the world, we strive to maintain the highest standards of data protection and transparency.
        </p>
      </section>

      {/* 1. Information We Collect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 bg-card border border-card-border rounded-3xl space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Personal Data</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            We do not require user registration. We do not collect names, email addresses (unless you contact us directly), or physical locations. Your preferences are stored locally in your browser.
          </p>
        </section>
        <section className="p-8 bg-card border border-card-border rounded-3xl space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Usage Data</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            We may collect anonymous technical data such as browser type, device info, and time spent on pages to improve our technical performance and site reliability.
          </p>
        </section>
      </div>

      {/* 2. Global Compliance (GDPR/CCPA) */}
      <section className="bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20 p-8 md:p-12 rounded-[2.5rem] space-y-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
          <ShieldCheck size={28} className="text-primary" /> Global Compliance
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest text-[11px] opacity-60">GDPR (European Union)</h4>
            <p className="text-muted-foreground font-medium leading-relaxed">
              For residents of the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). You have the right to access, correct, or delete any data we hold about you. Since we store mostly local data, you can exercise these rights by clearing your browser cache.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest text-[11px] opacity-60">CCPA (California)</h4>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We respect your rights under the California Consumer Privacy Act (CCPA). We do not "sell" your personal information to third parties. Our advertising partners may use cookies as described in the section below.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest text-[11px] opacity-60">LGPD (Brazil) / VCDPA (Virginia)</h4>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We are committed to international standards of privacy, ensuring users from Brazil, Australia, and various US states are protected according to their specific local regulations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Cookies and Advertising */}
      <section className="bg-card border border-card-border p-8 md:p-12 rounded-[2.5rem] space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
          <Cookie size={24} className="text-accent" /> Cookies & Third-Party Ads
        </h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          We use Google AdSense to serve advertisements. These ads help keep our site free for everyone. Google and its partners use cookies to serve ads based on your visit to this and other websites.
        </p>
        <div className="p-6 bg-secondary/10 border border-card-border rounded-2xl">
          <p className="text-xs text-muted-foreground font-bold italic">
            You may opt out of personalized advertising by visiting Google's Ads Settings or by using an industry-standard opt-out tool like <a href="https://aboutads.info" className="text-primary hover:underline">AboutAds.info</a>.
          </p>
        </div>
      </section>

      {/* 4. Data Security */}
      <section className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Data Security</h2>
        <p className="text-muted-foreground leading-relaxed font-medium">
          We implement rigorous security measures to protect against unauthorized access, alteration, or disclosure of data. Our site is delivered over secure HTTPS protocols to ensure your connection is always encrypted.
        </p>
      </section>

      {/* 5. Contact */}
      <section className="p-12 bg-primary/5 border border-primary/10 rounded-[2.5rem] text-center space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Privacy Inquiries</h2>
        <p className="text-muted-foreground max-w-xl mx-auto font-medium">
          If you have any questions or concerns regarding this Privacy Policy, please reach out to our data privacy officer at:
        </p>
        <div className="flex items-center justify-center gap-3 text-primary font-black text-lg italic tracking-tight underline">
           <Mail size={20} /> Bhairavi.co@gmail.com
        </div>
      </section>
    </div>
  )
}

