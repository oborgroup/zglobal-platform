"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCart, updateQty, removeFromCart, type CartItem } from "@/lib/cart";

function thumb(url: string | null): string {
  if (!url) return "";
  if (url.includes("cdn.shopify.com")) return url.replace(/(\.[a-zA-Z]+)(\?|$)/, "_200x$1$2");
  return url;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setMounted(true);
    const h = () => setItems(getCart());
    window.addEventListener("cart-updated", h);
    return () => window.removeEventListener("cart-updated", h);
  }, []);

  function changeQty(item: CartItem, delta: number) {
    updateQty(item.productId, item.variant, item.qty + delta);
    setItems(getCart());
  }
  function remove(item: CartItem) {
    removeFromCart(item.productId, item.variant);
    setItems(getCart());
  }

  const total = items.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <h1 className="text-2xl font-semibold text-[#0d2b5e] mb-1">Your Cart</h1>
        <p className="text-sm text-slate-500 mb-8">Review your items and request a quote for wholesale pricing.</p>

        {!mounted ? null : items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-16 text-center">
            <div className="text-slate-300 text-5xl mb-4">🛒</div>
            <p className="text-slate-500 mb-6">Your cart is empty.</p>
            <a href="/catalog" className="inline-block bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors">Browse catalog</a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image ? <img src={thumb(item.image)} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-slate-300 text-xs">No image</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] uppercase tracking-wider text-[#c49a3a]">{item.brandName}</div>
                    <div className="text-sm font-medium text-[#0d2b5e] truncate">{item.name}</div>
                    {item.variant && <div className="text-xs text-slate-400">{item.variant}</div>}
                    {item.price > 0 && <div className="text-sm text-slate-600 mt-1">€{item.price.toFixed(2)}</div>}
                  </div>
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button onClick={() => changeQty(item, -1)} className="px-3 py-1.5 text-slate-500 hover:text-[#0d2b5e]">−</button>
                    <span className="px-3 text-sm w-10 text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item, 1)} className="px-3 py-1.5 text-slate-500 hover:text-[#0d2b5e]">+</button>
                  </div>
                  <div className="text-right w-24">
                    {item.price > 0 && <div className="text-sm font-semibold text-[#0d2b5e]">€{(item.price * item.qty).toFixed(2)}</div>}
                    <button onClick={() => remove(item)} className="text-[11px] text-slate-400 hover:text-red-500 mt-1">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Order Summary</h2>
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-500">Items</span><span className="text-slate-700">{items.reduce((n, c) => n + c.qty, 0)}</span></div>
                <div className="flex justify-between text-sm mb-4"><span className="text-slate-500">Subtotal (RRP)</span><span className="text-slate-700">€{total.toFixed(2)}</span></div>
                <div className="border-t border-slate-100 pt-4 mb-4">
                  <p className="text-xs text-slate-400">Wholesale pricing is confirmed after you request a quote. Final prices may differ from RRP shown.</p>
                </div>
                <button className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3.5 rounded-md hover:bg-[#163d80] transition-colors mb-2">Request a Quote</button>
                <a href="/catalog" className="block text-center text-[#0d2b5e] text-sm py-2 hover:underline">Continue shopping</a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}