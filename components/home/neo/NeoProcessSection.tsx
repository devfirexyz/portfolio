import { NEO_PROCESS } from "@/lib/data/neo-home";
import { NeoCard } from "@/components/neo/NeoCard";

export function NeoProcessSection() {
  return (
    <section
      id="process"
      className="border-b-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] px-4 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-3 text-center text-4xl font-black uppercase leading-none tracking-[-0.05em] sm:text-6xl">
          Execution Protocol
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-[var(--nb-foreground-muted)] sm:text-base">
          Built for teams that value clarity, speed, and stable production behavior.
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {NEO_PROCESS.map((item) => (
            <NeoCard
              key={item.step}
              className="transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_var(--nb-shadow-color)]"
            >
              <div className="flex items-end justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-5 py-4 text-[var(--nb-foreground-inverse)]">
                <span className="text-5xl font-black leading-none">{item.step}</span>
                <span className="text-xs font-bold tracking-[0.18em] text-[var(--nb-accent-ink-inverse)]">STEP</span>
              </div>

              <div className="p-6">
                <h3 className="text-3xl font-black uppercase tracking-[-0.03em] text-[var(--nb-accent-ink)]">
                  {item.action}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--nb-foreground-muted)]">
                  {item.description}
                </p>
              </div>
            </NeoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
