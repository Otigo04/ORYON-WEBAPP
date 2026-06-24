"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Abonniert per Supabase Realtime Änderungen an `projects` und `project_updates`
 * und lädt bei jedem Event die Server-Komponenten neu (router.refresh()).
 * So sieht der Kunde Fortschritt & Updates live, ohne die Seite neu zu laden.
 *
 * RLS gilt auch für Realtime: der Kunde empfängt nur Events zu eigenen Daten.
 */
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () =>
        router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_updates" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
