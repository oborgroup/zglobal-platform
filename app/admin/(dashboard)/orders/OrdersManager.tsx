"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrderWithItems } from "@/lib/orders";
import { ORDER_STATUSES, STATUS_LABEL, STATUS_STYLE, type OrderStatus } from "@/lib/orderStatus";
import { updateOrderStatus, setOrderAdminNote } from "./actions";

function fmtDate(s: string) {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function OrdersManager({ orders }: { orders: OrderWithItems[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    const hay = `${o.company ?? ""} ${o.contact_name ?? ""} ${o.contact_email ?? ""} ${o.id}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  function changeStatus(id: string, status: OrderStatus) {
    setError(null);
    startTransition(async () => {
      const res = await updateOrderStatus(id, status);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }
  function saveNote(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await setOrderAdminNote(id, notes[id] ?? "");
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0d2b5e]">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">{orders.length} total · {pendingCount} pending review</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by company, name, email or order id…" className="w-full sm:max-w-md border border-slate-200 rounded-md px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0d2b5e]" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="border border-slate-200 rounded-md px-3 py-2.5 text-sm bg-white text-slate-600 focus:outline-none focus:border-[#0d2b5e] sm:ml-auto">
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 text-sm">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const open = openId === o.id;
            const qtyTotal = o.items.reduce((n, it) => n + (it.qty || 0), 0);
            return (
              <div key={o.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={() => setOpenId(open ? null : o.id)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[#0d2b5e] truncate">{o.company || o.contact_name || "—"} <span className="font-mono text-xs text-slate-400">#{o.id.slice(0, 8)}</span></div>
                    <div className="text-xs text-slate-400 truncate">{o.contact_email} · {fmtDate(o.created_at)} · {qtyTotal} items</div>
                  </div>
                  <div className="text-sm text-slate-700 whitespace-nowrap hidden sm:block">{o.subtotal != null ? `€${o.subtotal.toFixed(2)}` : "—"}</div>
                  <span className={`text-[11px] px-2 py-1 rounded ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                  <span className="text-slate-300">{open ? "▲" : "▼"}</span>
                </button>

                {open && (
                  <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/50">
                    <div className="grid md:grid-cols-2 gap-6 mb-5">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Contact</div>
                        <div className="text-sm text-slate-700 space-y-0.5">
                          <div>{o.contact_name}</div>
                          <div>{o.contact_email}</div>
                          {o.phone && <div>{o.phone}</div>}
                          {o.company && <div>{o.company}</div>}
                          {o.vat && <div className="text-slate-500">VAT {o.vat}</div>}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Delivery</div>
                        <div className="text-sm text-slate-700 space-y-0.5">
                          <div>{o.ship_address}</div>
                          {o.ship_address2 && <div>{o.ship_address2}</div>}
                          <div>{[o.ship_postcode, o.ship_city].filter(Boolean).join(" ")}</div>
                          <div>{o.ship_country}</div>
                        </div>
                        {o.notes && <div className="mt-2 text-sm text-slate-600"><span className="text-slate-400">Notes:</span> {o.notes}</div>}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-5">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-slate-50 border-b border-slate-200 text-left">
                          <th className="px-4 py-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">Product</th>
                          <th className="px-4 py-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">SKU</th>
                          <th className="px-4 py-2 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Qty</th>
                          <th className="px-4 py-2 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Unit</th>
                          <th className="px-4 py-2 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Line</th>
                        </tr></thead>
                        <tbody>
                          {o.items.map((it) => (
                            <tr key={it.id} className="border-b border-slate-100">
                              <td className="px-4 py-2 text-[#0d2b5e]">{it.name}{it.variant ? ` · ${it.variant}` : ""}</td>
                              <td className="px-4 py-2 text-slate-400 text-xs">{it.sku || "—"}</td>
                              <td className="px-4 py-2 text-right">{it.qty}</td>
                              <td className="px-4 py-2 text-right">{it.unit_price != null ? `€${it.unit_price}` : "—"}</td>
                              <td className="px-4 py-2 text-right">{it.line_total != null ? `€${it.line_total.toFixed(2)}` : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-wrap items-end gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Status</div>
                        <select value={o.status} disabled={pending} onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)} className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white">
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                        </select>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Internal note</div>
                        <div className="flex gap-2">
                          <input defaultValue={o.admin_note ?? ""} onChange={(e) => setNotes((n) => ({ ...n, [o.id]: e.target.value }))} className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm bg-white" placeholder="Shipping quote, reference…" />
                          <button onClick={() => saveNote(o.id)} disabled={pending} className="text-[11px] uppercase tracking-wider text-[#0d2b5e] border border-slate-200 px-3 py-2 rounded hover:border-[#0d2b5e] disabled:opacity-50">Save</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 text-sm">No orders match your filter.</div>}
        </div>
      )}
    </>
  );
}
