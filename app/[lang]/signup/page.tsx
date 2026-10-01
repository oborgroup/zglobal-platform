"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

export default function SignupPage() {
  const supabase = createClient();
  const { dict } = useLocale();
  const t = dict.auth;
  const h = useHref();

  const [form, setForm] = useState({
    email: "", password: "", firstName: "", lastName: "", company: "",
    vat: "", phone: "", address: "", address2: "", country: "", city: "", postcode: "",
  });
  const [consent, setConsent] = useState(false);
  const [license, setLicense] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          company_name: form.company,
          first_name: form.firstName,
          last_name: form.lastName,
          vat: form.vat,
          phone: form.phone,
          address: form.address,
          address2: form.address2,
          country: form.country,
          city: form.city,
          postcode: form.postcode,
          marketing_consent: consent,
        },
      },
    });

    if (signErr) {
      setError(signErr.message);
      setLoading(false);
      return;
    }

    if (license && data.user) {
      const ext = license.name.split(".").pop();
      const path = `${data.user.id}/license.${ext}`;
      await supabase.storage.from("business-licenses").upload(path, license, { upsert: true });
    }

    setLoading(false);
    setSuccess(true);
  }

  const inputClass = "w-full border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e] transition-colors";
  const labelClass = "block text-xs uppercase tracking-wider text-slate-500 mb-2";

  return (
    <div className="min-h-screen flex items-stretch">
      <div className="hidden lg:flex lg:w-2/5 bg-[#0d2b5e] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10">
          <img src="/z-global-logo.png" alt="ZGlobal" className="h-7 w-auto" />
        </div>
        <div className="relative z-10">
          <h1 className="text-white text-4xl font-light leading-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {t.panelSignupTitle1}<br /><span className="italic text-[#c49a3a]">{t.panelSignupTitle2}</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            {t.panelSignupText}
          </p>
        </div>
        <div className="relative z-10 flex gap-6 text-white/30 text-xs uppercase tracking-wider">
          <span>{t.statBrands}</span><span>{t.statRegion}</span><span>{t.statTerms}</span>
        </div>
      </div>

      <div className="w-full lg:w-3/5 flex items-start justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-xl py-8">
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="bg-[#0d2b5e] rounded-md px-5 py-3 inline-flex">
              <img src="/z-global-logo.png" alt="ZGlobal" className="h-6 w-auto" />
            </div>
          </div>

          {success ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5 text-green-600 text-xl">✓</div>
              <h2 className="text-2xl font-semibold text-[#0d2b5e] mb-2">{t.applicationReceived}</h2>
              <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                {t.applicationThanks.replace("{name}", form.firstName)}
              </p>
              <Link href={h("/login")} className="text-[#0d2b5e] font-medium hover:underline text-sm">{t.backToSignIn}</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-[#0d2b5e] mb-1">{t.signupHeading}</h2>
              <p className="text-sm text-slate-500 mb-8">{t.signupRequiredNote}</p>

              {error && <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className={labelClass}>{t.email} <span className="text-red-500">*</span></label>
                  <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder={t.emailPlaceholder} />
                </div>

                <div>
                  <label className={labelClass}>{t.password} <span className="text-red-500">*</span></label>
                  <input type="password" required minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)} className={inputClass} placeholder={t.passwordMin} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.firstName} <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} placeholder={t.firstName} />
                  </div>
                  <div>
                    <label className={labelClass}>{t.lastName} <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} placeholder={t.lastName} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t.companyName} <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} placeholder={t.yourCompany} />
                </div>

                <div>
                  <label className={labelClass}>{t.vat} <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.vat} onChange={(e) => update("vat", e.target.value)} className={inputClass} placeholder={t.vatPlaceholder} />
                </div>

                <div>
                  <label className={labelClass}>{t.phone} <span className="text-red-500">*</span></label>
                  <input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder={t.phonePlaceholder} />
                </div>

                <div>
                  <label className={labelClass}>{t.street} <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} placeholder={t.street} />
                </div>

                <div>
                  <label className={labelClass}>{t.address2}</label>
                  <input type="text" value={form.address2} onChange={(e) => update("address2", e.target.value)} className={inputClass} placeholder={t.address2Placeholder} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.country} <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.country} onChange={(e) => update("country", e.target.value)} className={inputClass} placeholder={t.country} />
                  </div>
                  <div>
                    <label className={labelClass}>{t.city} <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} placeholder={t.city} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t.postcode} <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.postcode} onChange={(e) => update("postcode", e.target.value)} className={inputClass} placeholder={t.postcode} />
                </div>

                <div>
                  <label className={labelClass}>{t.businessLicense} <span className="text-red-500">*</span></label>
                  <input type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setLicense(e.target.files?.[0] || null)} className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:uppercase file:tracking-wider file:bg-[#0d2b5e] file:text-white hover:file:bg-[#163d80] file:cursor-pointer border border-slate-200 rounded-md p-2" />
                  <p className="text-[11px] text-slate-400 mt-1.5">{t.licenseHint}</p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    {t.consent}
                  </span>
                </label>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.privacyNote}
                </p>

                <button type="submit" disabled={loading} className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3.5 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60">
                  {loading ? t.submitting : t.submitApplication}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-8">
                {t.haveAccount}{" "}
                <Link href={h("/login")} className="text-[#0d2b5e] font-medium hover:underline">{t.signIn}</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}