import { listAllOrders } from "@/lib/orders";
import OrdersManager from "./OrdersManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listAllOrders();
  return <OrdersManager orders={orders} />;
}
