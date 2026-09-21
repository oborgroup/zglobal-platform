"use client";

import { useState } from "react";
import type { ApplicationRow } from "./page";

function fmtDate(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">{label}</div>
      <div className="text-sm text-slate-700 break-words">{value || "—"}</div>
    </div>
  );
}

export default function ApplicationsView({ rows }: { rows: ApplicationRow[] }) {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = rows.filter((r) => {
    const hay = `${r.company} ${r.firstName} ${r.lastName} ${r.email ?? ""} ${r.vat}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const withLicense = rows.filter((r) => r.license).length;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0d2b5e]">Buyer applications</h1>
        <p className="text-sm text-slate-500 mt-1">
          {rows.length} buyer account{rows.length === 1 ? "" : "s"} · {withLicense} with a business license on file
        </p>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by company, name, email or VAT…"
        className="w-full max-w-md border border-slate-200 rounded-md px-4 py-2.5 text-sm mb-5 bg-white focus:outline-none focus:border-[#0d2b5e]"
      />

      {rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 text-sm">
          No buyer applications yet. Signups from <span className="font-mono">/signup</span> will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const name = `${r.firstName} ${r.lastName}`.trim() || "—";
            const open = openId === r.id;
            return (
              <div key={r.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] text-[#0d2b5e] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {(r.company || name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[#0d2b5e] truncate">{r.company || name}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {name} · {r.email ?? "—"}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    {r.emailConfirmedAt ? (
                      <span className="text-[10px] uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded">Verified</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">Unverified</span>
                    )}
                    {r.license ? (
                      <span className="text-[10px] uppercase tracking-wider text-[#0d2b5e] bg-[#eaf1fb] px-2 py-1 rounded">License</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">No license</span>
                    )}
                  </div>
                  <span className="text-slate-300 flex-shrink-0">{open ? "▲" : "▼"}</span>
                </button>

                {open && (
                  <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                      <Field label="Company" value={r.company} />
                      <Field label="Contact name" value={name} />
                      <Field label="Email" value={r.email ?? ""} />
                      <Field label="VAT / Partita IVA" value={r.vat} />
                      <Field label="Phone" value={r.phone} />
                      <Field label="Marketing consent" value={r.marketingConsent ? "Yes" : "No"} />
                      <Field label="Street address" value={r.address} />
                      <Field label="Address line 2" value={r.address2} />
                      <Field label="City" value={r.city} />
                      <Field label="Postcode" value={r.postcode} />
                      <Field label="Country" value={r.country} />
                      <Field label="Applied" value={fmtDate(r.createdAt)} />
                      <Field label="Email verified" value={fmtDate(r.emailConfirmedAt)} />
                    </div>

                    <div className="mt-5 pt-5 border-t border-slate-200">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Business license</div>
                      {r.license ? (
                        <a
                          href={r.license.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-4 py-2.5 rounded-md hover:bg-[#163d80] transition-colors"
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                          </svg>
                          View license ({r.license.name})
                        </a>
                      ) : (
                        <p className="text-sm text-slate-400">No business license file was uploaded.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 text-sm">
              No applications match your search.
            </div>
          )}
        </div>
      )}
    </>
  );
}
