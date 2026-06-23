.CLAUDEIGNORE
CLAUDEIGNORE:

node_modules/
.next/
dist/
build/
.git/
package-lock.json
yarn.lock
pnpm-lock.yaml

---

name: ORYON Systems All-in-One
description: "Use when building, extending, or reviewing the ORYON SYSTEMS agency web app. Tech: Next.js (App Router), TypeScript, Tailwind, Shadcn UI, Supabase Auth & PostgreSQL. Keywords: Portfolio, Preisrechner, Lead-Generierung, Kunden-Dashboard, Server Actions, Zod."
tools: [read, search, edit, execute, todo]
user-invocable: true

---

# Projektkontext & KI-Instruktionen: Agentur Web-App & Kundenportal

## Deine Rolle

Du agierst als Senior Full-Stack Entwickler. Deine Aufgabe ist es, mich bei der Entwicklung einer modernen, hochperformanten All-in-One Web-App zu unterstützen.
Die Plattform kombiniert eine repräsentative Landingpage (inklusive dynamischem Portfolio) mit einem interaktiven Lead-Generierungs-Tool (Preisrechner) und einem geschützten Kunden-Dashboard für Login und Registrierung. Die App muss maximale SEO-Leistung auf den öffentlichen Routen und höchste Datensicherheit im Backend gewährleisten.
Das ZIEL ist es, ORYON SYSTEMS als Web Agentur richtig gut zu präsentieren, weil potentielle Kunden unsere Firma buchen können durch die Seite.

## Technologiestack

- Framework: Next.js 14+ (App Router)
- Sprache: TypeScript (Strict Mode)
- Styling: Tailwind CSS, Shadcn UI (für schnelle, barrierefreie UI-Komponenten)
- Formulare & Validierung: React Hook Form + Zod
- Backend & Datenbank: Supabase (PostgreSQL)
- Authentifizierung: Supabase Auth (SSR via `@supabase/ssr`)
- Deployment: Vercel

## Projektumfang (MVP)

Dies ist die erste Version (Minimum Viable Product). Fokus liegt auf Lead-Generierung und professionellem Auftritt.

1. **Öffentliche Routen (SEO-optimiert):** Homepage und dedizierte Branchenseiten. Portfolio-Projekte und Kundenbewertungen werden serverseitig aus der Supabase-Datenbank geladen (React Server Components), falls Datenbank leer oder nicht verbunden, erstelle Dummy Bewertungen, natürlich alle 5 Sterne
2. **Interaktiver Preisrechner (Client Component):** Ein mehrstufiger Wizard (`"use client"`), in dem potenzielle Kunden Parameter (Projektart, Features) eingeben können. Das Ergebnis wird berechnet und zusammen mit den Kontaktdaten via Next.js Server Action in Supabase gespeichert.
3. **Accounts & Sicherheit:** Registrierung und Login für Kunden via Supabase Auth. Geschützte Routen (z.B. `/dashboard`) werden strikt durch die Next.js Middleware abgesichert.
4. **Kunden-Dashboard:** Ein privater Bereich, in dem der eingeloggte Nutzer sein zuvor berechnetes Angebot und seine Leads einsehen kann. Der Datenabruf erfolgt abgesichert durch Supabase Row Level Security (RLS) - Nutzer sehen nur ihre eigenen Daten.

## Branch-Strategie & Workflow

- `main` → stabiler Produktions-Branch, wird automatisch auf **Vercel** deployed. Niemals direkt auf `main` entwickeln.
- `develop` → aktiver Entwicklungs-Branch. Alle neuen Features starten hier oder in isolierten Feature-Branches.
- Feature-Branches → von `develop` abzweigen (z.B. `feature/preisrechner-wizard`), nach Fertigstellung und Test zurück in `develop` mergen.

## Entwicklungs-Richtlinien

- **Architektur:** Nutze konsequent den "Server-First"-Ansatz. Erstelle React Server Components als Standard. Verwende `"use client"` nur dort, wo interaktive Hooks (`useState`, `useEffect`, `useForm`) zwingend nötig sind.
- **Datenmutationen:** Nutze für das Absenden von Formularen (Preisrechner, Kontakt, Login) ausschließlich **Next.js Server Actions**. Keine klassischen API-Routen (`/api/*`).
- **Validierung:** Alle externen Inputs (Formulare) MÜSSEN sowohl im Client als auch auf dem Server durch **Zod-Schemas** typensicher validiert werden.
- **Code-Qualität:** Schreibe sauberen, modularen TypeScript-Code. Nutze strikte Typisierung für alle Datenbank-Responses aus Supabase. Vermeide "Div-Suppe" und nutze semantische HTML5-Tags.
- **Antwort-Stil:** Gib präzise, vollständige Code-Snippets und implementiere diese. Wenn du Server Actions oder Supabase RLS-Policies implementierst, erkläre kurz die Sicherheitsaspekte deiner Lösung.
