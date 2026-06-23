/**
 * Trust-Bar – dezente Leiste mit ausgegrauten Tech-Stack-Logos direkt unter dem
 * Hero. Vermittelt Seriosität ("worauf wir bauen") ohne vom Hero abzulenken.
 * Reine Server Component; Logos als Inline-SVG, daher keine externen Assets.
 */
const stack = [
  {
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 180 36" className="h-5 w-auto" aria-hidden="true">
        <circle cx="18" cy="18" r="15" className="fill-none stroke-current" strokeWidth="2" />
        <path d="M12 11v14M24 11l-12 14" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" />
        <text x="42" y="24" className="fill-current text-[16px] font-semibold" fontFamily="inherit">
          Next.js
        </text>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    svg: (
      <svg viewBox="0 0 200 36" className="h-5 w-auto" aria-hidden="true">
        <rect x="3" y="3" width="30" height="30" rx="5" className="fill-none stroke-current" strokeWidth="2" />
        <text x="9" y="25" className="fill-current text-[15px] font-bold">TS</text>
        <text x="42" y="24" className="fill-current text-[16px] font-semibold">TypeScript</text>
      </svg>
    ),
  },
  {
    name: "Supabase",
    svg: (
      <svg viewBox="0 0 200 36" className="h-5 w-auto" aria-hidden="true">
        <path d="M17 3 7 19h9l-1 14 11-17h-9z" className="fill-current" />
        <text x="42" y="24" className="fill-current text-[16px] font-semibold">Supabase</text>
      </svg>
    ),
  },
  {
    name: "Vercel",
    svg: (
      <svg viewBox="0 0 170 36" className="h-5 w-auto" aria-hidden="true">
        <path d="M18 6 32 30H4z" className="fill-current" />
        <text x="42" y="24" className="fill-current text-[16px] font-semibold">Vercel</text>
      </svg>
    ),
  },
  {
    name: "Tailwind",
    svg: (
      <svg viewBox="0 0 190 36" className="h-5 w-auto" aria-hidden="true">
        <path
          d="M10 14c2-5 5-7 9-6 2.7.7 4 2.7 5 5 1.5 3.3 3.3 5 7 5 2 0 3.7-.7 5-2-2 5-5 7-9 6-2.7-.7-4-2.7-5-5-1.5-3.3-3.3-5-7-5-2 0-3.7.7-5 2z"
          className="fill-current"
        />
        <text x="44" y="24" className="fill-current text-[16px] font-semibold">Tailwind</text>
      </svg>
    ),
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Eingesetzte Technologien"
      className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#05130b] to-black px-6 py-8"
    >
      {/* Weicher grüner Schimmer als Übergang aus dem Hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-[40rem] rounded-full bg-[#09ed2d]/10 blur-[100px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/40">
          Gebaut auf moderner, bewährter Technologie
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-white/40">
          {stack.map((tech) => (
            <li
              key={tech.name}
              title={tech.name}
              className="grayscale transition duration-300 hover:text-white/70 hover:grayscale-0"
            >
              {tech.svg}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
