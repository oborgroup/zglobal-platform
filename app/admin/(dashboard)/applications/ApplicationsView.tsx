"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ApplicationRow } from "./page";
import { setBuyerStatus } from "./actions";

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

const STATUS_STYLE: Record<string, string> = {
  pending: "text-amber-700 bg-amber-50",
  approved: "text-green-700 bg-green-50",
  rejected: "text-red-700 bg-red-50",
};

export default function ApplicationsView({ rows }: { rows: ApplicationRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    const hay = `${r.company} ${r.firstName} ${r.lastName} ${r.email ?? ""} ${r.vat}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };

  function decide(id: string, status: "approved" | "rejected" | "pending") {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await setBuyerStatus(id, status);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0d2b5e]">Buyer applications</h1>
        <p className="text-sm text-slate-500 mt-1">
          {rows.length} account{rows.length === 1 ? "" : "s"} · {counts.pending} pending · {counts.approved} approved · {counts.rejected} rejected
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by company, name, email or VAT…"
          className="w-full sm:max-w-md border border-slate-200 rounded-md px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0d2b5e]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="border border-slate-200 rounded-md px-3 py-2.5 text-sm bg-white text-slate-600 focus:outline-none focus:border-[#0d2b5e] sm:ml-auto"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 text-sm">
          No buyer applications yet. Signups from <span className="font-mono">/signup</span> will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const name = `${r.firstName} ${r.lastName}`.trim() || "—";
            const open = openId === r.id;
            const busy = pending && busyId === r.id;
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
                    <div className="text-xs text-slate-400 truncate">{name} · {r.email ?? "—"}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${STATUS_STYLE[r.status]}`}>{r.status}</span>
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
                    </div>

                    <div className="mt-5 pt-5 border-t border-slate-200 flex flex-wrap items-center gap-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 mr-1">Decision</div>
                      <button
                        onClick={() => decide(r.id, "approved")}
                        disabled={busy || r.status === "approved"}
                        className="text-[11px] uppercase tracking-wider bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => decide(r.id, "rejected")}
                        disabled={busy || r.status === "rejected"}
                        className="text-[11px] uppercase tracking-wider border border-red-300 text-red-600 px-4 py-2 rounded hover:bg-red-50 disabled:opacity-40"
                      >
                        Reject
                      </button>
                      {r.status !== "pending" && (
                        <button
                          onClick={() => decide(r.id, "pending")}
                          disabled={busy}
                          className="text-[11px] uppercase tracking-wider text-slate-500 px-3 py-2 hover:text-slate-800 disabled:opacity-40"
                        >
                          Reset to pending
                        </button>
                      )}
                      {r.license ? (
                        <a
                          href={r.license.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#0d2b5e] border border-slate-200 px-4 py-2 rounded hover:border-[#0d2b5e]"
                        >
                          View license
                        </a>
                      ) : (
                        <span className="ml-auto text-[11px] text-slate-400">No license uploaded</span>
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
