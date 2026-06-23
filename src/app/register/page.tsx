import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registrieren",
  description: "Erstelle dein kostenloses TAS-Webworks-Konto und verwalte deine Projekte.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthShell
      badge="Kostenlos starten"
      title="Konto erstellen"
      subtitle="Erstelle dein Konto und behalte Angebote sowie Projekte im Blick."
      footer={
        <>
          Bereits registriert?{" "}
          <Link href="/login" className="font-semibold text-[#09ed2d] hover:underline">
            Jetzt anmelden
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
