import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { launchFlags } from "@/lib/site";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Kundenportal. Solange `launchFlags.dashboard` aus ist, existiert die Route
 * nach außen nicht (404). Der Code bleibt vollständig erhalten.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!launchFlags.dashboard) notFound();
  return children;
}
