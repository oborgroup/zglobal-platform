import { listBuyerApplications, getLicenseFor, type LicenseFile } from "@/lib/adminData";
import ApplicationsView from "./ApplicationsView";

export const dynamic = "force-dynamic";

export type ApplicationRow = Awaited<ReturnType<typeof listBuyerApplications>>[number] & {
  license: LicenseFile;
};

export default async function AdminApplicationsPage() {
  const buyers = await listBuyerApplications();
  const licenses = await Promise.all(buyers.map((b) => getLicenseFor(b.id)));
  const rows: ApplicationRow[] = buyers.map((b, i) => ({ ...b, license: licenses[i] }));

  return <ApplicationsView rows={rows} />;
}
