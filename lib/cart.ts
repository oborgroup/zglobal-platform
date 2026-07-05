"use client";

export type CartItem = {
  productId: string;
  name: string;
  image: string | null;
  brandName: string;
  variant: string | null;
  price: number;
  qty: number;
};

const KEY = "zglobal_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const key = item.productId + (item.variant || "");
  const existing = cart.find((c) => c.productId + (c.variant || "") === key);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function updateQty(productId: string, variant: string | null, qty: number) {
  const cart = getCart();
  const item = cart.find((c) => c.productId === productId && c.variant === variant);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

export function removeFromCart(productId: string, variant: string | null) {
  const cart = getCart().filter((c) => !(c.productId === productId && c.variant === variant));
  saveCart(cart);
}

export function cartCount(): number {
  return getCart().reduce((n, c) => n + c.qty, 0);
}

export function cartTotal(): number {
  return getCart().reduce((sum, c) => sum + c.price * c.qty, 0);
}