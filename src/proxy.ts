import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 "proxy"-Konvention (Nachfolger der `middleware`-Datei).
 * Läuft vor jedem passenden Request und erneuert die Supabase-Session.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Alle Pfade außer:
     * - _next/static (Build-Assets)
     * - _next/image (Bild-Optimierung)
     * - favicon.ico und gängige statische Dateien
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
