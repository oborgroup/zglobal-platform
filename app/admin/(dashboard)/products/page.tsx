import { listAdminProducts } from "@/lib/adminData";
import ProductsManager from "./ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { products, brands } = await listAdminProducts();
  return <ProductsManager products={products} brands={brands} />;
}
