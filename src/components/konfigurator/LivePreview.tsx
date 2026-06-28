"use client";

import { useState } from "react";
import type { BriefData } from "@/lib/brief";

/**
 * Live-Designvorschau des Konfigurators (nur Desktop).
 *
 * Baut – rein als Design-Mockup – eine simple, cleane Beispiel-Website auf, die
 * sich an der aktuellen Auswahl orientiert: je nach gewählten Seiten und
 * Funktionen faden passende Sections sanft ein (Hero, Portfolio, echter Shop,
 * Terminbuchung, Preise …). Umschaltbar zwischen Hell- und Dunkelmodus.
 * Keine echten Inhalte, kein Routing – nur ein Eindruck, „wie es aussehen könnte".
 */

type Tokens = {
  dark: boolean;
  /** Akzentfarbe – im Hellmodus bewusst dezenter (kein Neongrün auf Weiß). */
  accent: string;
  accentText: string;
  accentSoft: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  heading: string;
  muted: string;
  card: string;
  border: string;
  block: string;
};

function tokensFor(dark: boolean): Tokens {
  return dark
    ? {
        dark,
        accent: "#09ed2d",
        accentText: "#000000",
        accentSoft: "rgba(9,237,45,0.15)",
        surface: "bg-neutral-950",
        surfaceAlt: "bg-neutral-900",
        text: "text-white/70",
        heading: "text-white",
        muted: "text-white/40",
        card: "bg-white/[0.04] border-white/10",
        border: "border-white/10",
        block: "bg-white/10",
      }
    : {
        dark,
        accent: "#15803d", // emerald-700 – ruhig & hochwertig auf Hell
        accentText: "#ffffff",
        accentSoft: "rgba(21,128,61,0.10)",
        surface: "bg-[#fbfbfa]",
        surfaceAlt: "bg-[#f3f4f2]",
        text: "text-neutral-600",
        heading: "text-neutral-900",
        muted: "text-neutral-400",
        card: "bg-white border-neutral-200",
        border: "border-neutral-200",
        block: "bg-neutral-200",
      };
}

function asArray(v: BriefData[string] | undefined): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

export function LivePreview({ data }: { data: BriefData }) {
  const [dark, setDark] = useState(true);
  const t = tokensFor(dark);

  const pages = asArray(data.pages);
  const features = asArray(data.features);
  const integrations = asArray(data.integrations);
  const hasMap = features.includes("Karte / Anfahrt") || integrations.includes("Google Maps");
  const hasLogin = features.includes("Mitgliederbereich / Login");
  const hasLang = features.includes("Mehrsprachigkeit");
  const hasChat = features.includes("Live-Chat");
  const brand =
    (typeof data.brandName === "string" && data.brandName.trim()) ||
    (typeof data.companyName === "string" && data.companyName.trim()) ||
    "Deine Marke";

  // Reihenfolge der Sections wie auf einer echten Seite.
  const sections: string[] = ["hero"];
  if (pages.includes("Über uns")) sections.push("about");
  if (pages.includes("Leistungen / Produkte")) sections.push("services");
  if (features.includes("Onlineshop")) sections.push("shop");
  if (pages.includes("Portfolio / Referenzen")) sections.push("portfolio");
  if (features.includes("Terminbuchung")) sections.push("booking");
  if (features.includes("Bewertungen")) sections.push("testimonials");
  if (pages.includes("Team")) sections.push("team");
  if (pages.includes("Preise")) sections.push("pricing");
  if (features.includes("Blog / CMS")) sections.push("blog");
  if (features.includes("Newsletter-Anmeldung")) sections.push("newsletter");
  if (features.includes("Downloadbereich")) sections.push("download");
  if (pages.includes("FAQ")) sections.push("faq");
  if (pages.includes("Kontakt") || features.includes("Kontaktformular")) sections.push("contact");
  sections.push("footer");

  const navLinks = [
    pages.includes("Über uns") && "Über uns",
    pages.includes("Leistungen / Produkte") && "Leistungen",
    features.includes("Onlineshop") && "Shop",
    pages.includes("Portfolio / Referenzen") && "Portfolio",
    pages.includes("Preise") && "Preise",
    (pages.includes("Kontakt") || features.includes("Kontaktformular")) && "Kontakt",
  ].filter(Boolean) as string[];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.95)]">
      {/* Browser-Leiste */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/60 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <span className="truncate rounded-md bg-white/5 px-2.5 py-0.5 text-[11px] text-white/40">
            {typeof data.domain === "string" && data.domain.trim()
              ? data.domain.trim()
              : "deine-domain.de"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60 transition hover:text-white"
          aria-label="Hell-/Dunkelmodus der Vorschau umschalten"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
          {dark ? "Hell" : "Dunkel"}
        </button>
      </div>

      {/* Gerenderte „Seite" */}
      <div className={`relative max-h-[620px] overflow-y-auto ${t.surface} transition-colors duration-300`}>
        {/* Navbar */}
        <div className={`sticky top-0 z-10 flex items-center justify-between border-b ${t.border} ${t.surface}/95 px-4 py-2.5 backdrop-blur`}>
          <span className={`text-xs font-bold ${t.heading}`}>{brand}</span>
          <div className="flex items-center gap-2.5">
            {navLinks.slice(0, 4).map((l) => (
              <span key={l} className={`hidden text-[10px] sm:inline ${t.text}`}>
                {l}
              </span>
            ))}
            {hasLang && (
              <span className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold ${t.border} ${t.text}`}>
                DE ▾
              </span>
            )}
            {hasLogin && (
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${t.border} ${t.text}`}>
                Login
              </span>
            )}
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: t.accent, color: t.accentText }}
            >
              {features.includes("Onlineshop") ? "Warenkorb" : "Anfragen"}
            </span>
          </div>
        </div>

        {sections.map((s, i) => (
          <div
            key={s}
            className="animate-detail-in"
            style={{ animationDelay: `${Math.min(i * 55, 360)}ms`, animationFillMode: "backwards" }}
          >
            {renderSection(s, t, brand, hasMap)}
          </div>
        ))}

        {/* Live-Chat-Bubble */}
        {hasChat && (
          <div
            className="sticky bottom-3 z-20 ml-auto mr-3 flex h-9 w-9 items-center justify-center rounded-full shadow-lg"
            style={{ backgroundColor: t.accent, color: t.accentText }}
            aria-hidden="true"
          >
            <ChatIcon />
          </div>
        )}
      </div>
    </div>
  );
}

function renderSection(kind: string, t: Tokens, brand: string, hasMap: boolean) {
  switch (kind) {
    case "hero":
      return <Hero t={t} brand={brand} />;
    case "about":
      return <About t={t} />;
    case "services":
      return <Services t={t} />;
    case "shop":
      return <Shop t={t} />;
    case "portfolio":
      return <Portfolio t={t} />;
    case "booking":
      return <Booking t={t} />;
    case "testimonials":
      return <Testimonials t={t} />;
    case "team":
      return <Team t={t} />;
    case "pricing":
      return <Pricing t={t} />;
    case "blog":
      return <Blog t={t} />;
    case "newsletter":
      return <Newsletter t={t} />;
    case "download":
      return <Download t={t} />;
    case "faq":
      return <Faq t={t} />;
    case "contact":
      return <Contact t={t} hasMap={hasMap} />;
    case "footer":
      return <Footer t={t} brand={brand} />;
    default:
      return null;
  }
}

// --- Bausteine -------------------------------------------------------------

function SectionLabel({ t, children }: { t: Tokens; children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: t.accent }}>
      {children}
    </span>
  );
}

function Bar({ w, t, strong }: { w: string; t: Tokens; strong?: boolean }) {
  return (
    <span
      className={`block h-2 rounded-full ${strong ? (t.dark ? "bg-white/25" : "bg-neutral-300") : t.dark ? "bg-white/10" : "bg-neutral-200"}`}
      style={{ width: w }}
    />
  );
}

function AccentBtn({ t, children, soft }: { t: Tokens; children: React.ReactNode; soft?: boolean }) {
  if (soft) {
    return (
      <span
        className="rounded-full px-3 py-1 text-[10px] font-semibold"
        style={{ backgroundColor: t.accentSoft, color: t.accent }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className="rounded-full px-3 py-1 text-[10px] font-semibold"
      style={{ backgroundColor: t.accent, color: t.accentText }}
    >
      {children}
    </span>
  );
}

// --- Sections (reine Mockups) ---------------------------------------------

function Hero({ t, brand }: { t: Tokens; brand: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 px-6 py-11 text-center ${t.surface}`}>
      <SectionLabel t={t}>Willkommen</SectionLabel>
      <h3 className={`max-w-md text-xl font-bold leading-tight ${t.heading}`}>
        {brand} – modern, schnell, überzeugend.
      </h3>
      <p className={`max-w-sm text-[11px] leading-relaxed ${t.muted}`}>
        Klare Botschaft, starker erster Eindruck und ein deutlicher Call-to-Action,
        der Besucher zu Kunden macht.
      </p>
      <div className="flex gap-2">
        <AccentBtn t={t}>Jetzt starten</AccentBtn>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${t.border} ${t.text}`}>
          Mehr erfahren
        </span>
      </div>
    </div>
  );
}

function About({ t }: { t: Tokens }) {
  return (
    <div className={`grid grid-cols-2 gap-5 px-6 py-9 ${t.surfaceAlt}`}>
      <div className={`h-28 rounded-xl border ${t.card}`} />
      <div className="flex flex-col justify-center gap-2.5">
        <SectionLabel t={t}>Über uns</SectionLabel>
        <Bar w="80%" t={t} strong />
        <Bar w="100%" t={t} />
        <Bar w="92%" t={t} />
        <Bar w="60%" t={t} />
      </div>
    </div>
  );
}

function Services({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surface}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Leistungen</SectionLabel>
        <Bar w="160px" t={t} strong />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`flex flex-col gap-2 rounded-xl border p-4 ${t.card}`}>
            <span className="h-7 w-7 rounded-lg" style={{ backgroundColor: t.accentSoft }} />
            <Bar w="70%" t={t} strong />
            <Bar w="100%" t={t} />
            <Bar w="85%" t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Shop({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surfaceAlt}`}>
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel t={t}>Online-Shop</SectionLabel>
        <span
          className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: t.accent, color: t.accentText }}
        >
          <CartIcon /> 3
        </span>
      </div>
      {/* Such- & Kategorieleiste */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-7 flex-1 rounded-lg ${t.block}`} />
        {["Alle", "Neu", "Sale"].map((c, i) => (
          <span
            key={c}
            className="rounded-full px-2.5 py-1 text-[10px] font-medium"
            style={
              i === 0
                ? { backgroundColor: t.accentSoft, color: t.accent }
                : undefined
            }
          >
            <span className={i === 0 ? "" : t.text}>{c}</span>
          </span>
        ))}
      </div>
      {/* Produktraster */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex flex-col gap-2 rounded-xl border p-2.5 ${t.card}`}>
            <span className={`relative block h-16 rounded-lg ${t.block}`}>
              {i % 3 === 0 && (
                <span
                  className="absolute left-1 top-1 rounded px-1 py-0.5 text-[8px] font-bold"
                  style={{ backgroundColor: t.accent, color: t.accentText }}
                >
                  NEU
                </span>
              )}
            </span>
            <Bar w="80%" t={t} strong />
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold ${t.heading}`}>€{19 + i * 10}</span>
            </div>
            <span
              className="rounded-md py-1 text-center text-[9px] font-semibold"
              style={{ backgroundColor: t.accent, color: t.accentText }}
            >
              In den Warenkorb
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Portfolio({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surface}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Portfolio</SectionLabel>
        <Bar w="180px" t={t} strong />
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`block rounded-xl ${t.block} ${i % 4 === 0 ? "h-24" : "h-20"}`} />
        ))}
      </div>
    </div>
  );
}

function Booking({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surfaceAlt}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Termin buchen</SectionLabel>
      </div>
      <div className={`grid grid-cols-[1fr_120px] gap-4 rounded-xl border p-4 ${t.card}`}>
        {/* Mini-Kalender */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="flex h-5 items-center justify-center rounded text-[8px] font-medium"
              style={
                i === 12
                  ? { backgroundColor: t.accent, color: t.accentText }
                  : undefined
              }
            >
              <span className={i === 12 ? "" : t.muted}>{i + 1}</span>
            </span>
          ))}
        </div>
        {/* Slots */}
        <div className="flex flex-col gap-1.5">
          {["09:00", "10:30", "14:00", "15:30"].map((time, i) => (
            <span
              key={time}
              className={`rounded-md border px-2 py-1 text-center text-[10px] ${t.border}`}
              style={i === 1 ? { backgroundColor: t.accentSoft, color: t.accent, borderColor: t.accent } : undefined}
            >
              <span className={i === 1 ? "" : t.text}>{time}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Testimonials({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surface}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Bewertungen</SectionLabel>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className={`flex flex-col gap-2 rounded-xl border p-4 ${t.card}`}>
            <span style={{ color: t.accent }} className="text-xs">
              ★★★★★
            </span>
            <Bar w="100%" t={t} />
            <Bar w="80%" t={t} />
            <div className="mt-1 flex items-center gap-2">
              <span className={`h-6 w-6 rounded-full ${t.block}`} />
              <Bar w="60px" t={t} strong />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Team({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surfaceAlt}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Team</SectionLabel>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className={`h-14 w-14 rounded-full ${t.block}`} />
            <Bar w="70%" t={t} strong />
            <Bar w="50%" t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surface}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Preise</SectionLabel>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex flex-col gap-2.5 rounded-xl border p-4 ${t.card}`}
            style={i === 1 ? { borderColor: t.accent, boxShadow: `0 0 0 1px ${t.accent}` } : undefined}
          >
            <Bar w="50%" t={t} />
            <span className={`text-lg font-bold ${t.heading}`}>€{(i + 1) * 19}</span>
            <Bar w="100%" t={t} />
            <Bar w="85%" t={t} />
            <span
              className="mt-1 rounded-full py-1 text-center text-[10px] font-semibold"
              style={
                i === 1
                  ? { backgroundColor: t.accent, color: t.accentText }
                  : { border: `1px solid ${t.dark ? "rgba(255,255,255,0.15)" : "#e5e5e5"}` }
              }
            >
              <span className={i === 1 ? "" : t.text}>Wählen</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Blog({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surfaceAlt}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Blog</SectionLabel>
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`flex items-center gap-3 rounded-xl border p-3 ${t.card}`}>
            <span className={`h-12 w-16 flex-none rounded-lg ${t.block}`} />
            <div className="flex flex-1 flex-col gap-1.5">
              <Bar w="70%" t={t} strong />
              <Bar w="100%" t={t} />
              <Bar w="40%" t={t} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Newsletter({ t }: { t: Tokens }) {
  return (
    <div className="px-6 py-9" style={{ backgroundColor: t.accentSoft }}>
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
        <SectionLabel t={t}>Newsletter</SectionLabel>
        <Bar w="200px" t={t} strong />
        <div className="flex w-full items-center gap-2">
          <span className={`h-8 flex-1 rounded-lg border ${t.card}`} />
          <span
            className="rounded-lg px-3 py-2 text-[10px] font-semibold"
            style={{ backgroundColor: t.accent, color: t.accentText }}
          >
            Abonnieren
          </span>
        </div>
      </div>
    </div>
  );
}

function Download({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surface}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>Downloads</SectionLabel>
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${t.card}`}>
            <div className="flex items-center gap-2">
              <span className={`h-6 w-5 rounded ${t.block}`} />
              <Bar w="120px" t={t} strong />
            </div>
            <span style={{ color: t.accent }}>
              <DownloadIcon />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Faq({ t }: { t: Tokens }) {
  return (
    <div className={`px-6 py-9 ${t.surfaceAlt}`}>
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <SectionLabel t={t}>FAQ</SectionLabel>
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`flex items-center justify-between rounded-lg border px-4 py-3 ${t.card}`}>
            <Bar w="60%" t={t} strong />
            <span className={t.muted}>+</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contact({ t, hasMap }: { t: Tokens; hasMap: boolean }) {
  return (
    <div className={`grid grid-cols-2 gap-5 px-6 py-9 ${t.surface}`}>
      <div className="flex flex-col justify-center gap-2.5">
        <SectionLabel t={t}>Kontakt</SectionLabel>
        {hasMap ? (
          <div className={`relative h-32 overflow-hidden rounded-xl border ${t.card}`}>
            <span className={`absolute inset-0 ${t.block} opacity-60`} />
            <span
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
              style={{ backgroundColor: t.accent }}
            />
          </div>
        ) : (
          <>
            <Bar w="80%" t={t} strong />
            <Bar w="100%" t={t} />
            <Bar w="70%" t={t} />
          </>
        )}
      </div>
      <div className={`flex flex-col gap-2 rounded-xl border p-4 ${t.card}`}>
        <span className={`h-7 rounded-md ${t.block}`} />
        <span className={`h-7 rounded-md ${t.block}`} />
        <span className={`h-14 rounded-md ${t.block}`} />
        <span
          className="mt-1 rounded-md py-1.5 text-center text-[11px] font-semibold"
          style={{ backgroundColor: t.accent, color: t.accentText }}
        >
          Senden
        </span>
      </div>
    </div>
  );
}

function Footer({ t, brand }: { t: Tokens; brand: string }) {
  return (
    <div className={`flex items-center justify-between border-t px-6 py-5 ${t.border} ${t.surfaceAlt}`}>
      <span className={`text-[11px] font-semibold ${t.heading}`}>{brand}</span>
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-5 w-5 rounded-full ${t.block}`} />
        ))}
      </div>
    </div>
  );
}

// --- Icons -----------------------------------------------------------------

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h3l2.5 13h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
