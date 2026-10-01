"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { cartCount } from "@/lib/cart";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useLocale();
  const h = useHref();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      setLoggedIn(!!user);
      setIsAdmin(user?.app_metadata?.is_admin === true);
    }
    check();
    setCount(cartCount());
    const onUpdate = () => setCount(cartCount());
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push(h("/"));
    router.refresh();
  }

  const nav = [
    { href: "/catalog", label: dict.nav.allProducts },
    { href: "/beauty", label: dict.nav.beauty },
    { href: "/category/outdoor", label: dict.nav.outdoor },
    { href: "/category/home", label: dict.nav.home },
    { href: "/inventory", label: dict.nav.inventory },
    { href: "/promotions", label: dict.nav.promotions },
  ];

  return (
    <>
      <div className="bg-[#163d80] text-white/60 text-[11px]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-1.5 flex justify-between items-center tracking-wider">
          <span className="truncate"><span className="hidden sm:inline">{dict.header.tagline}&nbsp;·&nbsp;</span>{dict.header.region}</span>
          <div className="flex gap-3 md:gap-4 whitespace-nowrap items-center">
            <a href={h("/support")} className="hover:text-white">{dict.common.support}</a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="bg-[#0d2b5e] sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 h-[60px] flex items-center">
          <a href={h("/")} className="flex items-center flex-shrink-0 mr-8">
            <img src="/z-global-logo.png" alt="ZGlobal" className="h-[26px] w-auto" />
          </a>

          <nav className="hidden lg:flex items-stretch flex-1">
            {nav.map((item) => (
              <a key={item.href} href={h(item.href)} className="flex items-center px-4 text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white border-b-2 border-transparent hover:border-[#c49a3a] transition-colors">{item.label}</a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <a href={h("/cart")} className="relative text-white/85 hover:text-white px-3 py-2 flex items-center gap-1.5">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <span className="text-[11px] uppercase tracking-wider">{dict.common.cart}</span>
              {count > 0 && <span className="absolute -top-0.5 right-1 bg-[#c49a3a] text-[#0d2b5e] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
            </a>
            {loggedIn ? (
              <>
                <a href={isAdmin ? "/admin" : h("/dashboard")} className="text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white px-3 py-2">{isAdmin ? dict.common.admin : dict.common.dashboard}</a>
                <button onClick={handleLogout} className="bg-[#c49a3a] text-[#0d2b5e] text-[11px] uppercase tracking-wider font-semibold px-5 py-2 rounded-sm hover:bg-[#d4a94a] transition-colors">{dict.common.signOut}</button>
              </>
            ) : (
              <>
                <a href={h("/login")} className="text-[11.5px] uppercase tracking-wider text-white/85 hover:text-white px-3 py-2">{dict.common.signIn}</a>
                <a href={h("/signup")} className="bg-[#c49a3a] text-[#0d2b5e] text-[11px] uppercase tracking-wider font-semibold px-5 py-2 rounded-sm hover:bg-[#d4a94a] transition-colors">{dict.common.requestAccess}</a>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden ml-auto flex flex-col gap-[5px] p-2" aria-label="Menu">
            <span className="w-6 h-0.5 bg-white rounded"></span><span className="w-6 h-0.5 bg-white rounded"></span><span className="w-6 h-0.5 bg-white rounded"></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#0d2b5e] border-b border-white/10 px-5 py-4 sticky top-[60px] z-40">
          {nav.map((item) => (
            <a key={item.href} href={h(item.href)} className="block text-white/85 text-sm py-2.5 border-b border-white/10">{item.label}</a>
          ))}
          <a href={h("/cart")} className="block text-white/85 text-sm py-2.5 border-b border-white/10">{dict.common.cart} {count > 0 && `(${count})`}</a>
          <a href={h("/support")} className="block text-white/85 text-sm py-2.5 border-b border-white/10">{dict.common.support}</a>
          {loggedIn ? (
            <>
              <a href={isAdmin ? "/admin" : h("/dashboard")} className="block text-white/85 text-sm py-2.5 border-b border-white/10">{isAdmin ? dict.common.admin : dict.common.dashboard}</a>
              <button onClick={handleLogout} className="w-full mt-3 bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold py-3 rounded-sm">{dict.common.signOut}</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-3">
              <a href={h("/login")} className="text-center border border-white/25 text-white text-xs uppercase tracking-wider py-3 rounded-sm">{dict.common.signIn}</a>
              <a href={h("/signup")} className="text-center bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold py-3 rounded-sm">{dict.common.requestAccess}</a>
            </div>
          )}
          <div className="pt-4 text-white/50 text-sm"><LanguageSwitcher /></div>
        </div>
      )}
    </>
  );
}
