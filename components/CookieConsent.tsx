"use client";

import { useEffect, useState } from "react";

const KEY = "zg_cookie_consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      // storage blocked — don't nag
    }
  }, []);

  function choose(value: "all" | "essential") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // ignore
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-3 sm:p-5" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-lg rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-600 leading-relaxed flex-1">
          We use essential cookies to run this site (sign-in and your cart). With your consent we may
          also use optional cookies. See our{" "}
          <a href="/legal/cookies" className="text-[#0d2b5e] font-medium hover:underline">Cookie Policy</a>.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => choose("essential")}
            className="text-xs uppercase tracking-wider border border-slate-300 text-slate-600 px-4 py-2.5 rounded-md hover:border-slate-400"
          >
            Essential only
          </button>
          <button
            onClick={() => choose("all")}
            className="text-xs uppercase tracking-wider bg-[#0d2b5e] text-white px-5 py-2.5 rounded-md hover:bg-[#163d80]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
