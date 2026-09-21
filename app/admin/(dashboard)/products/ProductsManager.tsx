"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminProduct, BrandOption } from "@/lib/adminData";
import {
  createProduct,
  updateProduct,
  setProductVisible,
  deleteProduct,
  type ProductFormValues,
} from "./actions";

const empty = (brandId: string): ProductFormValues => ({
  brand_id: brandId,
  name: "",
  sku: "",
  category: "",
  description: "",
  image_url: "",
  moq: "",
  retail_price: "",
  wholesale_price: "",
  stock: "",
  visible: true,
});

function toForm(p: AdminProduct): ProductFormValues {
  return {
    brand_id: p.brand_id,
    name: p.name ?? "",
    sku: p.sku ?? "",
    category: p.category ?? "",
    description: p.description ?? "",
    image_url: p.image_url ?? "",
    moq: p.moq?.toString() ?? "",
    retail_price: p.retail_price?.toString() ?? "",
    wholesale_price: p.wholesale_price?.toString() ?? "",
    stock: p.stock?.toString() ?? "",
    visible: p.visible !== false,
  };
}

export default function ProductsManager({
  products,
  brands,
}: {
  products: AdminProduct[];
  brands: BrandOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const brandName = useMemo(() => {
    const map = new Map(brands.map((b) => [b.id, b.name]));
    return (id: string) => map.get(id) || "—";
  }, [brands]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(q.toLowerCase()) ||
      brandName(p.brand_id).toLowerCase().includes(q.toLowerCase())
  );

  function refresh() {
    startTransition(() => router.refresh());
  }

  function toggleVisible(p: AdminProduct) {
    setError(null);
    setBusyId(p.id);
    startTransition(async () => {
      const res = await setProductVisible(p.id, p.visible === false);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function remove(p: AdminProduct) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setError(null);
    setBusyId(p.id);
    startTransition(async () => {
      const res = await deleteProduct(p.id);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  const noBrands = brands.length === 0;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0d2b5e]">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} total · {products.filter((p) => p.visible === false).length} hidden
          </p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setAdding(true);
          }}
          disabled={noBrands}
          className="bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-sm hover:bg-[#d4a94a] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          + Add product
        </button>
      </div>

      {noBrands && (
        <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Add at least one brand first — products must belong to a brand.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by product, SKU or brand…"
        className="w-full max-w-md border border-slate-200 rounded-md px-4 py-2.5 text-sm mb-5 bg-white focus:outline-none focus:border-[#0d2b5e]"
      />

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Product</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Brand</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">SKU</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Stock</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Wholesale</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-center">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[#0d2b5e] font-medium max-w-xs truncate">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500">{brandName(p.brand_id)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.sku || "—"}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{p.stock ?? 0}</td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {p.wholesale_price != null ? `€${p.wholesale_price}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.visible === false ? (
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
                            setEditing(p);
                          }}
                          className="text-[11px] uppercase tracking-wider text-[#0d2b5e] border border-slate-200 px-2.5 py-1.5 rounded hover:border-[#0d2b5e]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleVisible(p)}
                          disabled={pending && busyId === p.id}
                          className="text-[11px] uppercase tracking-wider text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded hover:border-slate-400 disabled:opacity-50"
                        >
                          {p.visible === false ? "Show" : "Hide"}
                        </button>
                        <button
                          onClick={() => remove(p)}
                          disabled={pending && busyId === p.id}
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
        <ProductModal
          brands={brands}
          product={editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSaved={() => {
            setAdding(false);
            setEditing(null);
            refresh();
          }}
        />
      )}
    </>
  );
}

function ProductModal({
  brands,
  product,
  onClose,
  onSaved,
}: {
  brands: BrandOption[];
  product: AdminProduct | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(
    product ? toForm(product) : empty(brands[0]?.id ?? "")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    const res = product
      ? await updateProduct(product.id, values)
      : await createProduct(values);
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
            {product ? "Edit product" : "Add product"}
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

          <div>
            <label className={label}>Name *</label>
            <input className={input} value={values.name} onChange={(e) => set("name", e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Brand *</label>
              <select className={input} value={values.brand_id} onChange={(e) => set("brand_id", e.target.value)}>
                <option value="">Select brand…</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>SKU</label>
              <input className={input} value={values.sku} onChange={(e) => set("sku", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={label}>Category</label>
            <input className={input} value={values.category} onChange={(e) => set("category", e.target.value)} />
          </div>

          <div>
            <label className={label}>Image URL</label>
            <input className={input} value={values.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://…" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={label}>Stock</label>
              <input className={input} type="number" value={values.stock} onChange={(e) => set("stock", e.target.value)} />
            </div>
            <div>
              <label className={label}>MOQ</label>
              <input className={input} type="number" value={values.moq} onChange={(e) => set("moq", e.target.value)} />
            </div>
            <div>
              <label className={label}>Wholesale €</label>
              <input className={input} type="number" step="0.01" value={values.wholesale_price} onChange={(e) => set("wholesale_price", e.target.value)} />
            </div>
            <div>
              <label className={label}>Retail €</label>
              <input className={input} type="number" step="0.01" value={values.retail_price} onChange={(e) => set("retail_price", e.target.value)} />
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
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>
    </div>
  );
}
