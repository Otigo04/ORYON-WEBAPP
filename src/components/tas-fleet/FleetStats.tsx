import { FLEET_STATS } from "@/lib/tas-fleet";

/** Kennzahlen-Leiste direkt unter dem Hero. Reine Server Component. */
export function FleetStats() {
  return (
    <section className="relative border-y border-white/10 bg-white/[0.02] px-6 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
        {FLEET_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-sm text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
