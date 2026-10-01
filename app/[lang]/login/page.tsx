"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useLocale();
  const t = dict.auth;
  const h = useHref();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(h("/dashboard"));
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0d2b5e] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10">
          <img src="/z-global-logo.png" alt="ZGlobal" className="h-7 w-auto" />
        </div>
        <div className="relative z-10">
          <h1 className="text-white text-4xl font-light leading-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {t.panelSignInTitle1}
            <br />
            <span className="italic text-[#c49a3a]">{t.panelSignInTitle2}</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            {t.panelSignInText}
          </p>
        </div>
        <div className="relative z-10 flex gap-6 text-white/30 text-xs uppercase tracking-wider">
          <span>{t.statBrands}</span>
          <span>{t.statRegion}</span>
          <span>{t.statTerms}</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <div className="bg-[#0d2b5e] rounded-md px-5 py-3 inline-flex">
              <img src="/z-global-logo.png" alt="ZGlobal" className="h-6 w-auto" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-[#0d2b5e] mb-1">{t.signInHeading}</h2>
          <p className="text-sm text-slate-500 mb-8">{t.signInIntro}</p>

          {error && (
            <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{t.email}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e] transition-colors" placeholder={t.emailPlaceholder} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{t.password}</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e] transition-colors" placeholder={t.passwordPlaceholder} />
            </div>

            <div className="text-right -mt-2">
              <Link href={h("/forgot-password")} className="text-xs text-[#0d2b5e] hover:underline">{t.forgotPassword}</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60">
              {loading ? t.signingIn : t.signIn}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            {t.noAccount}{" "}
            <Link href={h("/signup")} className="text-[#0d2b5e] font-medium hover:underline">{t.requestAccess}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}