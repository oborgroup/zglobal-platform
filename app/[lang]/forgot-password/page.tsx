"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function ForgotPasswordForm() {
  const supabase = createClient();
  const params = useSearchParams();
  // Where the "back to sign in" link points; admins arrive with ?admin=1.
  const isAdminContext = params.get("admin") === "1";
  const signInHref = isAdminContext ? "/admin/login" : "/login";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // The reset link lands on /reset-password (via /auth/confirm for the
    // token_hash email template). window.location.origin keeps it correct on
    // both localhost and production.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    // Don't reveal whether the email is registered — always show success.
    if (error && !/rate|limit/i.test(error.message)) {
      // Only surface hard errors (e.g. rate limiting) generically.
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-[#0d2b5e] rounded-md px-4 py-2.5 inline-flex items-center gap-2">
            <img src="/z-global-logo.png" alt="ZGlobal" className="h-6 w-auto" />
            {isAdminContext && (
              <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#0d2b5e] bg-[#c49a3a] rounded-sm px-2 py-0.5">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5 text-green-600 text-xl">
                ✓
              </div>
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                If an account exists for <span className="font-medium">{email}</span>, we&apos;ve sent
                a link to reset the password. The link expires in 1 hour.
              </p>
              <a href={signInHref} className="text-[#0d2b5e] font-medium hover:underline text-sm">
                Back to sign in
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-1">Reset your password</h2>
              <p className="text-sm text-slate-500 mb-6">
                Enter your account email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e]"
                    placeholder="you@company.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-8">
                Remembered it?{" "}
                <a href={signInHref} className="text-[#0d2b5e] font-medium hover:underline">
                  Back to sign in
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
