import { requireAdmin } from "@/lib/adminAuth";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AdminHeader email={user.email || ""} />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
