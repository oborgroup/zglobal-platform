"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useLocale();
  const t = dict.auth;
  const h = useHref();

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
      setError(t.errPwMin);
      return;
    }
    if (password !== confirm) {
      setError(t.errPwMatch);
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

  const continueHref = isAdmin ? "/admin" : h("/dashboard");
  const signInHref = isAdmin ? "/admin/login" : h("/login");

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
            <p className="text-sm text-slate-400 text-center">{t.verifyingLink}</p>
          ) : done ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5 text-green-600 text-xl">
                ✓
              </div>
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-2">{t.passwordSetHeading}</h2>
              <p className="text-sm text-slate-500 mb-6">
                {t.passwordSetText}
              </p>
              <button
                onClick={() => {
                  router.push(continueHref);
                  router.refresh();
                }}
                className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3 rounded-md hover:bg-[#163d80] transition-colors"
              >
                {isAdmin ? t.goToAdmin : t.goToDashboard}
              </button>
            </div>
          ) : !hasSession ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-2">{t.linkInvalidHeading}</h2>
              <p className="text-sm text-slate-500 mb-6">
                {t.linkInvalidText}
              </p>
              <a href={h("/forgot-password")} className="text-[#0d2b5e] font-medium hover:underline text-sm">
                {t.requestNewLink}
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#0d2b5e] mb-1">{t.setNewPasswordHeading}</h2>
              <p className="text-sm text-slate-500 mb-6">
                {email ? <>{t.newPasswordFor.split("{email}")[0]}<span className="font-medium">{email}</span>{t.newPasswordFor.split("{email}")[1]}</> : t.chooseNewPassword}
              </p>

              {error && (
                <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{t.newPassword}</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]"
                    placeholder={t.passwordMin}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{t.confirmPassword}</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]"
                    placeholder={t.reenterPassword}
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60"
                >
                  {saving ? t.saving : t.setPassword}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-6">
                <a href={signInHref} className="hover:underline">{t.backToSignIn}</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
