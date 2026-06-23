import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Neues Passwort setzen",
  description: "Lege ein neues Passwort für dein TAS-Webworks-Konto fest.",
  robots: { index: false, follow: false },
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Seite zum Setzen eines neuen Passworts. Sie wird über den Recovery-Link in
 * der E-Mail erreicht: Die Verify-Route (/auth/confirm) löst zuvor den Token
 * ein und setzt die Session. Ohne gültige Session zeigen wir einen Hinweis,
 * statt ein Formular, das ohnehin scheitern würde.
 */
export default async function ResetPasswordPage() {
  let hasSession = false;
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasSession = !!user;
  }

  if (!hasSession) {
    return (
      <AuthShell
        badge="Kundenportal"
        title="Link ungültig"
        subtitle="Dieser Link ist abgelaufen oder wurde bereits verwendet."
        footer={
          <>
            Zurück zur{" "}
            <Link href="/login" className="font-semibold text-[#09ed2d] hover:underline">
              Anmeldung
            </Link>
          </>
        }
      >
        <p className="text-center text-sm leading-relaxed text-white/70">
          Bitte fordere einen neuen Link zum Zurücksetzen an.
        </p>
        <Link
          href="/passwort-vergessen"
          className="mt-2 flex w-full items-center justify-center rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
        >
          Neuen Link anfordern
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Kundenportal"
      title="Neues Passwort setzen"
      subtitle="Wähle ein sicheres Passwort mit mindestens 8 Zeichen."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
