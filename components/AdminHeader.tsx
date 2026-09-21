"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/applications", label: "Applications" },
];

export default function AdminHeader({ email }: { email: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <div className="bg-[#163d80] text-white/60 text-[11px]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-1.5 flex justify-between items-center tracking-wider">
          <span className="truncate">
            <span className="hidden sm:inline">Admin Console&nbsp;·&nbsp;</span>ZGlobal Platform
          </span>
          <a href="/" className="hover:text-white">View storefront →</a>
        </div>
      </div>

      <div className="bg-[#0d2b5e] sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 h-[60px] flex items-center">
          <a href="/admin" className="flex items-center flex-shrink-0 mr-3">
            <img src="/z-global-logo.png" alt="ZGlobal" className="h-[26px] w-auto" />
          </a>
          <span className="hidden sm:inline-flex items-center text-[9px] uppercase tracking-[0.18em] font-semibold text-[#0d2b5e] bg-[#c49a3a] rounded-sm px-2 py-0.5 mr-6">
            Admin
          </span>

          <nav className="hidden lg:flex items-stretch flex-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 text-[11.5px] uppercase tracking-wider border-b-2 transition-colors ${
                  isActive(item.href)
                    ? "text-white border-[#c49a3a]"
                    : "text-white/85 hover:text-white border-transparent hover:border-[#c49a3a]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <span className="text-[11px] text-white/50 max-w-[200px] truncate">{email}</span>
            <button
              onClick={handleLogout}
              className="bg-[#c49a3a] text-[#0d2b5e] text-[11px] uppercase tracking-wider font-semibold px-5 py-2 rounded-sm hover:bg-[#d4a94a] transition-colors"
            >
              Log out
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden ml-auto flex flex-col gap-[5px] p-2"
            aria-label="Menu"
          >
            <span className="w-6 h-0.5 bg-white rounded"></span>
            <span className="w-6 h-0.5 bg-white rounded"></span>
            <span className="w-6 h-0.5 bg-white rounded"></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#0d2b5e] border-b border-white/10 px-5 py-4 sticky top-[60px] z-40">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block text-sm py-2.5 border-b border-white/10 ${
                isActive(item.href) ? "text-[#c49a3a]" : "text-white/85"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="text-[11px] text-white/40 pt-3 pb-2 truncate">{email}</div>
          <button
            onClick={handleLogout}
            className="w-full mt-1 bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold py-3 rounded-sm"
          >
            Log out
          </button>
        </div>
      )}
    </>
  );
}
