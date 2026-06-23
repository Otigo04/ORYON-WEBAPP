import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melde dich in deinem OTIGO-Digital-Kundenportal an.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      badge="Kundenportal"
      title="Willkommen zurück"
      subtitle="Melde dich an, um deine Angebote und Projekte zu sehen."
      footer={
        <>
          Noch kein Konto?{" "}
          <Link href="/register" className="font-semibold text-[#09ed2d] hover:underline">
            Jetzt registrieren
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
