"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="bg-[#0d2b5e] text-white">
          <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-20">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">About ZGlobal</div>
            <h1 className="text-4xl md:text-5xl font-light leading-tight max-w-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Connecting brands with <em className="text-[#c49a3a]">international markets.</em>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-2xl mt-6">
              We are a globally oriented trade service provider dedicated to helping brands seamlessly connect with international markets.
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                By combining market insights, strategic planning, and execution, we bridge the gap between businesses and global opportunities. Rooted in extensive market knowledge and strong personal relationships, we evaluate the objectives of all parties involved to ensure flawless and profitable transactions.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Through innovation, sustainability, and collaboration, we strive to create an interconnected trade ecosystem that transcends borders and promotes equitable growth for businesses seeking to unlock their international potential. With a comprehensive network spanning logistics, strategic partnerships, and market insights, we offer unparalleled capabilities that ensure seamless cross-border transactions and long-term success.
              </p>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-8">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">Our Mission</div>
              <p className="text-[#0d2b5e] leading-relaxed font-medium">
                To foster cross-border trade, promote sustainable business practices, and drive mutual growth with our partners.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc] border-y border-slate-200">
          <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16">
            <div className="max-w-2xl mb-10">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">Our Business</div>
              <h2 className="text-3xl font-light text-[#0d2b5e] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Empowering businesses to achieve <em>global success.</em>
              </h2>
              <p className="text-slate-600 leading-relaxed">
                At ZGlobal, we provide tailored solutions that drive growth, innovation, and sustainability — helping businesses across diverse industries navigate the complexities of today&apos;s global economy.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Beauty", desc: "Enabling beauty brands to thrive in international markets." },
                { title: "Energy", desc: "Advancing the global green energy transition." },
                { title: "Trade", desc: "Facilitating seamless cross-border trade." },
                { title: "Logistics", desc: "Optimizing supply chains end to end." },
                { title: "Integrated Services", desc: "Comprehensive business support for global operations." },
                { title: "Partnership", desc: "Your trusted partner in unlocking new opportunities worldwide." },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#0d2b5e] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] flex items-center justify-center mb-4 text-[#0d2b5e]">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>
                  </div>
                  <h3 className="text-[#0d2b5e] font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-20 text-center">
          <h2 className="text-3xl font-light text-[#0d2b5e] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to unlock your <em>international potential?</em>
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            Join our wholesale platform and connect with global brands across outdoor, home, and vacuum categories.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/signup" className="bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors">Request access</a>
            <a href="/catalog" className="border border-slate-300 text-[#0d2b5e] text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:border-[#0d2b5e] transition-colors">Browse catalog</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}