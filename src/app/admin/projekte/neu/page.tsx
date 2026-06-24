import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getCustomers } from "@/lib/admin/customers";

export default async function NewProjectPage() {
  const customers = await getCustomers();

  return (
    <>
      <PageHeader title="Neues Projekt" subtitle="Lege ein Projekt für einen Kunden an." />
      <Link href="/admin/projekte" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück zu den Projekten
      </Link>
      <Card className="max-w-2xl">
        {customers.length === 0 ? (
          <p className="text-sm text-white/50">
            Es sind noch keine Kunden registriert. Sobald sich ein Kunde registriert, kannst du ihm
            ein Projekt zuweisen.
          </p>
        ) : (
          <ProjectForm customers={customers} />
        )}
      </Card>
    </>
  );
}
