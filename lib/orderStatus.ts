// Client-safe order status constants (no server-only imports).

export type OrderStatus = "pending" | "approved" | "paid" | "completed" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = ["pending", "approved", "paid", "completed", "cancelled"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending review",
  approved: "Approved · awaiting payment",
  paid: "Paid",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "text-amber-700 bg-amber-50",
  approved: "text-blue-700 bg-blue-50",
  paid: "text-green-700 bg-green-50",
  completed: "text-slate-700 bg-slate-100",
  cancelled: "text-red-700 bg-red-50",
};

export function asOrderStatus(s: string | null | undefined): OrderStatus {
  return (ORDER_STATUSES as string[]).includes(s || "") ? (s as OrderStatus) : "pending";
}
