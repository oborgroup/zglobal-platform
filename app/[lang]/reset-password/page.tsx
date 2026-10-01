"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;

    function applyUser(user: User | null) {
      if (!mounted) return;
      setHasSession(!!user);
      setEmail(user?.email || "");
      setIsAdmin(user?.app_metadata?.is_admin === true);
    }

    // The recovery session can arrive via cookies (token_hash flow through
    // /auth/confirm) or asynchronously from the URL (implicit flow), so listen
    // for auth changes in addition to the initial check.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        applyUser(session.user);
        setChecking(false);
      }
    });

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      applyUser(user);
      if (mounted) setChecking(false);
    })();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  const continueHref = isAdmin ? "/admin" : "/dashboard";
  const signInHref = isAdmin ? "/admin/login" : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-[#0d2b5e] rounded-md px-4 py-2.5 inline-flex items-center gap-2">
            <img src="/z-global-logo.png" alt="ZGlobal" className="h-6 w-auto" />
            {isAdmin && (
              <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#0d2b5e] bg-[#c49a3a] rounded-sm px-2 py-0.5">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8">
          {checking ? (
            <p className="text-sm text-slate-400 text-center">Verifying link…</p>
          ) : done ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5 text-green-600 text-xl">
                ✓
              </div>
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-2">Password set</h2>
              <p className="text-sm text-slate-500 mb-6">
                You can now sign in with your new password.
              </p>
              <button
                onClick={() => {
                  router.push(continueHref);
                  router.refresh();
                }}
                className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3 rounded-md hover:bg-[#163d80] transition-colors"
              >
                {isAdmin ? "Go to admin console" : "Go to your dashboard"}
              </button>
            </div>
          ) : !hasSession ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-2">Link expired or invalid</h2>
              <p className="text-sm text-slate-500 mb-6">
                This password link is no longer valid. Request a new one.
              </p>
              <a href="/forgot-password" className="text-[#0d2b5e] font-medium hover:underline text-sm">
                Request a new link
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-1">Set a new password</h2>
              <p className="text-sm text-slate-500 mb-6">
                {email ? <>For <span className="font-medium">{email}</span></> : "Choose a new password."}
              </p>

              {error && (
                <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">New password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Confirm password</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]"
                    placeholder="Re-enter password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Set password"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-6">
                <a href={signInHref} className="hover:underline">Back to sign in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
