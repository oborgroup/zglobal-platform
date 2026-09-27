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
            <a href="/support" className="block text-[12.5px] py-1 hover:text-white transition-colors">Help Center</a>
            <a href="/contact" className="block text-[12.5px] py-1 hover:text-white transition-colors">Contact</a>
            <a href="/support" className="block text-[12.5px] py-1 hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px] text-white/30">
          <span>© 2026 ZGlobal B.V. All rights reserved.</span>
          <div className="flex gap-4 flex-wrap">
            <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/legal/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/legal/cookies" className="hover:text-white transition-colors">Cookies</a>
            <a href="/legal/imprint" className="hover:text-white transition-colors">Legal notice</a>
          </div>
          <span>EU · B2B wholesale only</span>
        </div>
      </div>
    </footer>
  );
}