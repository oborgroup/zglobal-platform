import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LINKS = [
  { href: "/legal/imprint", label: "Legal notice" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/cookies", label: "Cookie Policy" },
];

const BODY =
  "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[#0d2b5e] [&_h2]:mt-8 [&_h2]:mb-2 " +
  "[&_p]:text-sm [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p]:mb-3 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-slate-600 [&_ul]:space-y-1 [&_ul]:mb-3 " +
  "[&_li]:leading-relaxed [&_a]:text-[#0d2b5e] [&_a]:underline [&_strong]:text-slate-800";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 md:px-14 py-12">
        <div className="grid md:grid-cols-[220px_1fr] gap-10">
          <aside className="md:sticky md:top-24 self-start">
            <div className="text-[10px] uppercase tracking-[0.15em] text-[#c49a3a] mb-3">Legal</div>
            <nav className="space-y-1">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className="block text-sm text-slate-600 hover:text-[#0d2b5e] py-1">{l.label}</a>
              ))}
            </nav>
          </aside>
          <article>
            <h1 className="text-3xl text-[#0d2b5e] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{title}</h1>
            {updated && <p className="text-xs text-slate-400 mb-6">Last updated: {updated}</p>}
            <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
              Draft — pending legal review. Bracketed fields such as [KvK number] will be completed with ZGlobal B.V.&apos;s registered details.
            </div>
            <div className={BODY}>{children}</div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
