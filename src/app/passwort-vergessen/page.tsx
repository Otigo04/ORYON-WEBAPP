import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen",
  description: "Fordere einen Link an, um dein TAS-Webworks-Passwort zurückzusetzen.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      badge="Kundenportal"
      title="Passwort vergessen?"
      subtitle="Gib deine E-Mail-Adresse ein – wir senden dir einen Link zum Zurücksetzen."
      footer={
        <>
          Wieder eingefallen?{" "}
          <Link href="/login" className="font-semibold text-[#09ed2d] hover:underline">
            Zur Anmeldung
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
