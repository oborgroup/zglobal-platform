"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [joined, setJoined] = useState<string>("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
      setCompany((user.user_metadata?.company_name as string) || "Your company");
      if (user.created_at) {
        setJoined(new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0d2b5e] text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-[0.12em] uppercase">
            ZG<span className="text-[#c49a3a]">.</span>lobal
          </a>
          <div className="flex items-center gap-5">
            <a href="/catalog" className="text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors">Catalog</a>
            <button onClick={handleLogout} className="text-xs uppercase tracking-wider bg-white/10 border border-white/20 px-4 py-2 rounded-sm