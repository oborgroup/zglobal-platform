"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      setLoggedIn(!!user);
    }
    check();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div className="bg-[#163d80] text-white/60 text-[11px]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-1.5 flex justify-between items-center tracking-wider">
          <span className="truncate">
            <span className="hidden sm:inline">B2B Wholesale Platform&nbsp;·&nbsp;</span>Italy &amp; EU
          </span>
          <div className="flex gap-3 md:gap-4 whitespace-nowrap">
            <a href="#" className="hover:text-white">Support</a>
            <a href="#" className="hover:text-white">IT / EN</a>
          </div>
        </div>
      </div>

      <div className="bg-[#0d2b5e] sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 h-[60px] flex items-center">
          <a href="/" className="flex items-center flex-shrink-0 mr-8">
            <img src="/z-global-logo.png" alt="ZGlobal" className="h-[26px] w-auto" />
          </a>

          <nav className="hidden lg:flex items-stretch flex-1">
            <a href="/catalog" className="flex items-center px-4 text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white border-b-2 border-transparent hover:border-[#c49a3a] transition-colors">All Products</a>
            <a href="/catalog" className="flex items-center px-4 text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white border-b-2 border-transparent hover:border-[#c49a3a] transition-colors">Brands</a>
            <a href="/catalog" className="flex items-center px-4 text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white border-b-2 border-transparent hover:border-[#c49a3a] transition-colors">Catalog</a>
          </nav>

          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {loggedIn ? (
              <>
                <a href="/dashboard" className="text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white px-3 py-2">Dashboard</a>
                <button onClick={handleLogout} className="bg-[#c49a3a] text-[#0d2b5e] text-[11px] uppercase tracking-wider font-semibold px-5 py-2 rounded-sm hover:bg-[#d4a94a] transition-colors">Log out</button>
              </>
            ) : (
              <>
                <a href="/login" className="text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white px-3 py-2">Sign in</a>
                <a href="/signup" className="bg-[#c49a3a] text-[#0d2b5e] text-[11px] uppercase tracking-wider font-semibold px-5 py-2 rounded-sm hover:bg-[#d4a94a] transition-colors">Request access</a>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden ml-auto flex flex-col gap-[5px] p-2" aria-label="Menu">
            <span className="w-6 h-0.5 bg-white rounded"></span>
            <span className="w-6 h-0.5 bg-white rounded"></span>
            <span className="w-6 h-0.5 bg-white rounded"></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#0d2b5e] border-b border-white/10 px-5 py-4 sticky top-[60px] z-40">
          <a href="/catalog" className="block text-white/85 text-sm py-2.5 border-b border-white/10">All Products</a>
          <a href="/catalog" className="block text-white/85 text-sm py-2.5 border-b border-white/10">Catalog</a>
          {loggedIn ? (
            <>
              <a href="/dashboard" className="block text-white/85 text-sm py-2.5 border-b border-white/10">Dashboard</a>
              <button onClick={handleLogout} className="w-full mt-3 bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold py-3 rounded-sm">Log out</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-3">
              <a href="/login" className="text-center border border-white/25 text-white text-xs uppercase tracking-wider py-3 rounded-sm">Sign in</a>
              <a href="/signup" className="text-center bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold py-3 rounded-sm">Request access</a>
            </div>
          )}
        </div>
      )}
    </>
  );
}