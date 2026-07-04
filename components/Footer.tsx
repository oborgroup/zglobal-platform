export default function Footer() {
  return (
    <footer className="bg-[#07122a] text-white/50 mt-auto">
      <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <img src="/z-global-logo.png" alt="ZGlobal" className="h-6 w-auto opacity-60 mb-3" />
            <p className="text-[12px] leading-relaxed text-white/30 max-w-[240px]">
              B2B wholesale platform for outdoor, home &amp; vacuum brands. Italy-first, EU-ready.
            </p>
          </div>
          <div>
            <div className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mb-3">Platform</div>
            <a href="/catalog" className="block text-[12.5px] py-1 hover:text-white transition-colors">Catalog</a>
            <a href="/catalog" className="block text-[12.5px] py-1 hover:text-white transition-colors">Brands</a>
            <a href="/signup" className="block text-[12.5px] py-1 hover:text-white transition-colors">Request Access</a>
          </div>
          <div>
            <div className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mb-3">Account</div>
            <a href="/login" className="block text-[12.5px] py-1 hover:text-white transition-colors">Sign In</a>
            <a href="/dashboard" className="block text-[12.5px] py-1 hover:text-white transition-colors">Dashboard</a>
          </div>
          <div>
            <div className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mb-3">Support</div>
            <a href="#" className="block text-[12.5px] py-1 hover:text-white transition-colors">Help Center</a>
            <a href="#" className="block text-[12.5px] py-1 hover:text-white transition-colors">Contact</a>
            <a href="#" className="block text-[12.5px] py-1 hover:text-white transition-colors">Shipping</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-white/30">
          <span>© 2026 ZGlobal. All rights reserved.</span>
          <span>Italy &amp; EU · B2B wholesale only</span>
        </div>
      </div>
    </footer>
  );
}