"use server";

import { assertApprovedBuyer } from "@/lib/adminAuth";
import { createAdminSupabase } from "@/lib/supabaseAdmin";

export type CheckoutItem = { productId: string; variant: string | null; qty: number };

export type CheckoutInput = {
  contact_name: string;
  contact_email: string;
  company: string;
  phone: string;
  vat: string;
  ship_address: string;
  ship_address2: string;
  ship_city: string;
  ship_postcode: string;
  ship_country: string;
  notes: string;
  items: CheckoutItem[];
};

export type CheckoutResult = { ok: true; orderId: string } | { ok: false; error: string };

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  let user;
  try {
    user = await assertApprovedBuyer();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Not authorized." };
  }

  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  if (!input.contact_name.trim() || !input.ship_address.trim() || !input.ship_city.trim() || !input.ship_country.trim()) {
    return { ok: false, error: "Please complete the required delivery fields." };
  }

  const admin = createAdminSupabase();

  // Authoritative product data (never trust client prices).
  const ids = [...new Set(input.items.map((i) => i.productId))];
  const { data: products } = await admin
    .from("products")
    .select("id, name, sku, wholesale_price")
    .in("id", ids);
  const pmap = new Map(
    (products as { id: string; name: string; sku: string | null; wholesale_price: number | null }[] | null || []).map(
      (p) => [p.id, p]
    )
  );

  let subtotal = 0;
  const items = input.items.map((i) => {
    const p = pmap.get(i.productId);
    const qty = Math.max(1, Math.floor(i.qty) || 1);
    const unit = p?.wholesale_price ?? null;
    const line = unit != null ? Number((unit * qty).toFixed(2)) : null;
    if (line != null) subtotal += line;
    return {
      product_id: i.productId,
      sku: p?.sku ?? null,
      name: p?.name ?? "Unknown item",
      variant: i.variant || null,
      qty,
      unit_price: unit,
      line_total: line,
    };
  });

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      contact_name: input.contact_name.trim(),
      contact_email: (input.contact_email || user.email || "").trim(),
      company: input.company.trim() || null,
      phone: input.phone.trim() || null,
      vat: input.vat.trim() || null,
      ship_address: input.ship_address.trim(),
      ship_address2: input.ship_address2.trim() || null,
      ship_city: input.ship_city.trim(),
      ship_postcode: input.ship_postcode.trim() || null,
      ship_country: input.ship_country.trim(),
      notes: input.notes.trim() || null,
      subtotal: Number(subtotal.toFixed(2)),
      currency: "EUR",
    })
    .select("id")
    .single();

  if (error || !order) {
    return { ok: false, error: error?.message || "Could not create the order." };
  }

  const { error: e2 } = await admin
    .from("order_items")
    .insert(items.map((it) => ({ ...it, order_id: (order as { id: string }).id })));
  if (e2) return { ok: false, error: e2.message };

  return { ok: true, orderId: (order as { id: string }).id };
}
