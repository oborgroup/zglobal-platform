"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContactMessage } from "@/lib/adminData";
import { setMessageHandled } from "./actions";

function fmt(s: string) {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MessagesView({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showHandled, setShowHandled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = messages.filter((m) => showHandled || !m.handled);
  const openCount = messages.filter((m) => !m.handled).length;

  function toggle(id: string, handled: boolean) {
    setError(null);
    startTransition(async () => {
      const res = await setMessageHandled(id, handled);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0d2b5e]">Messages</h1>
          <p className="text-sm text-slate-500 mt-1">{openCount} open · {messages.length} total (contact form)</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} /> Show handled
        </label>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 text-sm">No messages{showHandled ? "" : " to handle"}.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <div key={m.id} className={`bg-white border rounded-lg p-5 ${m.handled ? "border-slate-200 opacity-70" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#0d2b5e]">{m.name || "—"} {m.company && <span className="text-slate-400 font-normal">· {m.company}</span>}</div>
                  <div className="text-xs text-slate-400">
                    <a href={`mailto:${m.email}`} className="hover:underline">{m.email}</a> · {fmt(m.created_at)}
                  </div>
                </div>
                <button
                  onClick={() => toggle(m.id, !m.handled)}
                  disabled={pending}
                  className={`text-[11px] uppercase tracking-wider px-3 py-1.5 rounded border disabled:opacity-50 ${m.handled ? "border-slate-200 text-slate-500" : "border-green-300 text-green-700 hover:bg-green-50"}`}
                >
                  {m.handled ? "Reopen" : "Mark handled"}
                </button>
              </div>
              {m.subject && <div className="text-sm text-slate-700 font-medium mt-3">{m.subject}</div>}
              <p className="text-sm text-slate-600 leading-relaxed mt-1 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
