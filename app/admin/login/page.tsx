"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("forbidden") ? "That account is not an administrator." : null
  );
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signErr) {
      setLoading(false);
      setError(signErr.message);
      return;
    }

    const isAdmin = data.user?.app_metadata?.is_admin === true;
    if (!isAdmin) {
      // Don't leave a buyer session hanging around on the admin login.
      await supabase.auth.signOut();
      setLoading(false);
      setError("That account is not an administrator.");
      return;
    }

    router.push("/admin");
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
        <div className="relative z-10 flex items-center gap-3">
          <img src="/z-global-logo.png" alt="ZGlobal" className="h-7 w-auto" />
          <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#0d2b5e] bg-[#c49a3a] rounded-sm px-2 py-0.5">
            Admin
          </span>
        </div>
        <div className="relative z-10">
          <h1
            className="text-white text-4xl font-light leading-tight mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Platform
            <br />
            <span className="italic text-[#c49a3a]">administration.</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Manage products, brands and review wholesale applications. Authorized
            administrators only.
          </p>
        </div>
        <div className="relative z-10 flex gap-6 text-white/30 text-xs uppercase tracking-wider">
          <span>Products</span>
          <span>Brands</span>
          <span>Applications</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <div className="bg-[#0d2b5e] rounded-md px-5 py-3 inline-flex items-center gap-2">
              <img src="/z-global-logo.png" alt="ZGlobal" className="h-6 w-auto" />
              <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#0d2b5e] bg-[#c49a3a] rounded-sm px-2 py-0.5">
                Admin
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-[#0d2b5e] mb-1">Administrator sign in</h2>
          <p className="text-sm text-slate-500 mb-8">Restricted access. Admin credentials required.</p>

          {error && (
            <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e] transition-colors"
                placeholder="admin@zglobal.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in to admin"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8">
            Buyer account?{" "}
            <a href="/login" className="text-[#0d2b5e] font-medium hover:underline">
              Go to buyer sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
