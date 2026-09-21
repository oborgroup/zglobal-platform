import { listAdminBrands } from "@/lib/adminData";
import BrandsManager from "./BrandsManager";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await listAdminBrands();
  return <BrandsManager brands={brands} />;
}
