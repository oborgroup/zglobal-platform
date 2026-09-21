import { getAdminStats } from "@/lib/adminData";

export const dynamic = "force-dynamic";

function StatCard({
  value,
  label,
  note,
  accent,
}: {
  value: string | number;
  label: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className={`text-2xl font-semibold ${accent ? "text-[#c49a3a]" : "text-[#0d2b5e]"}`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{label}</div>
      {note && <div className="text-[11px] text-slate-400 mt-1">{note}</div>}
    </div>
  );
}

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const cards = [
    { href: "/admin/products", title: "Products", desc: "Add, edit, hide or remove catalog items." },
    { href: "/admin/brands", title: "Brands", desc: "Manage the brands products belong to." },
    { href: "/admin/applications", title: "Applications", desc: "Review buyer signups & licenses." },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2b5e] to-[#163d80] rounded-xl p-8 mb-8 text-white">
        <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-1">
          Admin Console
        </div>
        <h1 className="text-2xl font-semibold">Platform overview</h1>
        <p className="text-sm text-white/60 mt-1">
          Manage the catalog and review wholesale applications.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <StatCard value={stats.productTotal} label="Products" note="All items" />
        <StatCard value={stats.productHidden} label="Hidden" note="Products off catalog" />
        <StatCard value={stats.productOutOfStock} label="Out of stock" note="Zero / backorder" />
        <StatCard value={stats.brandTotal} label="Brands" note="All brands" />
        <StatCard value={stats.brandHidden} label="Hidden brands" note="Off catalog" />
        <StatCard value={stats.buyerCount} label="Buyers" note="Applications" accent />
      </div>

      <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Manage</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#0d2b5e] hover:shadow-md transition-all"
          >
            <div className="text-[#0d2b5e] font-medium mb-1">{c.title}</div>
            <div className="text-xs text-slate-500">{c.desc}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#c49a3a] mt-3">Open →</div>
          </a>
        ))}
      </div>
    </>
  );
}
