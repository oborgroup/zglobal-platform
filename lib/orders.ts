import { createAdminSupabase } from "./supabaseAdmin";
import type { OrderStatus } from "./orderStatus";

export type { OrderStatus } from "./orderStatus";
export { ORDER_STATUSES, STATUS_LABEL, STATUS_STYLE } from "./orderStatus";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  sku: string | null;
  name: string | null;
  variant: string | null;
  qty: number;
  unit_price: number | null;
  line_total: number | null;
};

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  contact_name: string | null;
  contact_email: string | null;
  company: string | null;
  phone: string | null;
  vat: string | null;
  ship_address: string | null;
  ship_address2: string | null;
  ship_city: string | null;
  ship_postcode: string | null;
  ship_country: string | null;
  notes: string | null;
  subtotal: number | null;
  currency: string | null;
  admin_note: string | null;
  created_at: string;
};

export type OrderWithItems = Order & { items: OrderItem[] };

/** All orders with their items, newest first (admin — service role). */
export async function listAllOrders(): Promise<OrderWithItems[]> {
  const admin = createAdminSupabase();
  const [{ data: orders }, { data: items }] = await Promise.all([
    admin.from("orders").select("*").order("created_at", { ascending: false }),
    admin.from("order_items").select("*"),
  ]);
  const byOrder = new Map<string, OrderItem[]>();
  for (const it of (items as OrderItem[]) || []) {
    if (!byOrder.has(it.order_id)) byOrder.set(it.order_id, []);
    byOrder.get(it.order_id)!.push(it);
  }
  return ((orders as Order[]) || []).map((o) => ({ ...o, items: byOrder.get(o.id) || [] }));
}

export async function getOrderStats(): Promise<{ total: number; pending: number }> {
  const admin = createAdminSupabase();
  const { data } = await admin.from("orders").select("status");
  const rows = (data as { status: OrderStatus }[]) || [];
  return { total: rows.length, pending: rows.filter((r) => r.status === "pending").length };
}
