"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminBrand } from "@/lib/adminData";
import {
  createBrand,
  updateBrand,
  setBrandVisible,
  deleteBrand,
  type BrandFormValues,
} from "./actions";

const empty: BrandFormValues = {
  name: "",
  slug: "",
  category: "",
  description: "",
  website: "",
  payment_terms: "",
  status: "active",
  sku_count: "",
  sort_order: "",
  visible: true,
};

function toForm(b: AdminBrand): BrandFormValues {
  return {
    name: b.name ?? "",
    slug: b.slug ?? "",
    category: b.category ?? "",
    description: b.description ?? "",
    website: b.website ?? "",
    payment_terms: b.payment_terms ?? "",
    status: b.status ?? "",
    sku_count: b.sku_count?.toString() ?? "",
    sort_order: b.sort_order?.toString() ?? "",
    visible: b.visible !== false,
  };
}

export default function BrandsManager({ brands }: { brands: AdminBrand[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(q.toLowerCase()) ||
      (b.category || "").toLowerCase().includes(q.toLowerCase())
  );

  function toggleVisible(b: AdminBrand) {
    setError(null);
    setBusyId(b.id);
    startTransition(async () => {
      const res = await setBrandVisible(b.id, b.visible === false);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function remove(b: AdminBrand) {
    if (!confirm(`Delete brand "${b.name}"? This cannot be undone.`)) return;
    setError(null);
    setBusyId(b.id);
    startTransition(async () => {
      const res = await deleteBrand(b.id);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0d2b5e]">Brands</h1>
          <p className="text-sm text-slate-500 mt-1">
            {brands.length} total · {brands.filter((b) => b.visible === false).length} hidden
          </p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setAdding(true);
          }}
          className="bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-sm hover:bg-[#d4a94a] transition-colors whitespace-nowrap"
        >
          + Add brand
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search brands…"
        className="w-full max-w-md border border-slate-200 rounded-md px-4 py-2.5 text-sm mb-5 bg-white focus:outline-none focus:border-[#0d2b5e]"
      />

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Brand</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Category</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Slug</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">SKUs</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-center">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No brands found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[#0d2b5e] font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-slate-500">{b.category || "—"}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{b.slug}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{b.sku_count ?? 0}</td>
                    <td className="px-4 py-3 text-center">
                      {b.visible === false ? (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded">Hidden</span>
                      ) : (
                        <span className="text-[11px] text-green-600 bg-green-50 px-2 py-1 rounded">Visible</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setError(null);
                            setEditing(b);
                          }}
                          className="text-[11px] uppercase tracking-wider text-[#0d2b5e] border border-slate-200 px-2.5 py-1.5 rounded hover:border-[#0d2b5e]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleVisible(b)}
                          disabled={pending && busyId === b.id}
                          className="text-[11px] uppercase tracking-wider text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded hover:border-slate-400 disabled:opacity-50"
                        >
                          {b.visible === false ? "Show" : "Hide"}
                        </button>
                        <button
                          onClick={() => remove(b)}
                          disabled={pending && busyId === b.id}
                          className="text-[11px] uppercase tracking-wider text-red-600 border border-red-200 px-2.5 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(adding || editing) && (
        <BrandModal
          brand={editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSaved={() => {
            setAdding(false);
            setEditing(null);
            startTransition(() => router.refresh());
          }}
        />
      )}
    </>
  );
}

function BrandModal({
  brand,
  onClose,
  onSaved,
}: {
  brand: AdminBrand | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<BrandFormValues>(brand ? toForm(brand) : empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BrandFormValues>(key: K, val: BrandFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    const res = brand ? await updateBrand(brand.id, values) : await createBrand(values);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onSaved();
  }

  const input =
    "w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e]";
  const label = "block text-xs uppercase tracking-wider text-slate-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl my-8 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-[#0d2b5e]">
            {brand ? "Edit brand" : "Add brand"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Name *</label>
              <input className={input} value={values.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={label}>Slug</label>
              <input className={input} value={values.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Category *</label>
              <input className={input} value={values.category} onChange={(e) => set("category", e.target.value)} placeholder="Outdoor, Home…" />
            </div>
            <div>
              <label className={label}>Website</label>
              <input className={input} value={values.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={label}>Payment terms</label>
              <input className={input} value={values.payment_terms} onChange={(e) => set("payment_terms", e.target.value)} placeholder="NET 60" />
            </div>
            <div>
              <label className={label}>Status</label>
              <input className={input} value={values.status} onChange={(e) => set("status", e.target.value)} placeholder="active" />
            </div>
            <div>
              <label className={label}>SKU count</label>
              <input className={input} type="number" value={values.sku_count} onChange={(e) => set("sku_count", e.target.value)} />
            </div>
            <div>
              <label className={label}>Sort order</label>
              <input className={input} type="number" value={values.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea className={`${input} min-h-[80px]`} value={values.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={values.visible} onChange={(e) => set("visible", e.target.checked)} />
            <span className="text-sm text-slate-600">Visible on the storefront</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="text-sm text-slate-500 px-4 py-2 hover:text-slate-800">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-6 py-2.5 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : brand ? "Save changes" : "Create brand"}
          </button>
        </div>
      </div>
    </div>
  );
}
