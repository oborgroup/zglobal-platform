"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

export type BuyerState =
  | "loading"
  | "guest"
  | "pending"
  | "approved"
  | "rejected"
  | "admin";

/** Current buyer's approval state, for gating wholesale pricing and ordering. */
export function useBuyer() {
  const [state, setState] = useState<BuyerState>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;
      setUser(user);
      if (!user) return setState("guest");
      if (user.app_metadata?.is_admin === true) return setState("admin");
      const s = user.app_metadata?.status;
      setState(s === "approved" ? "approved" : s === "rejected" ? "rejected" : "pending");
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    user,
    state,
    loading: state === "loading",
    isGuest: state === "guest",
    isApproved: state === "approved" || state === "admin",
    isPending: state === "pending",
    isRejected: state === "rejected",
  };
}
