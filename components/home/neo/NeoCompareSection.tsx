import { NEO_COMPARE } from "@/lib/data/neo-home";

export function NeoCompareSection() {
  return (
    <section id="compare" className="border-b-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-4 py-20 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row">
        <div className="lg:w-[340px]">
          <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl">
            {NEO_COMPARE.leftTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--nb-foreground-muted)]">{NEO_COMPARE.leftText}</p>
        </div>

        <div className="grid flex-1 grid-cols-1 border-2 border-[var(--nb-border)] shadow-[10px_10px_0px_0px_var(--nb-shadow-color)] md:grid-cols-2">
          <article className="border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-8 md:border-b-0 md:border-r-2">
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--nb-foreground-muted)]">NOISE</p>
            <h3 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em]">Typical Portfolio</h3>
            <ul className="mt-8 space-y-3 text-sm">
              {NEO_COMPARE.rival.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-black text-[var(--nb-danger)]">x</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-[var(--nb-surface-strong)] p-8 text-[var(--nb-foreground-inverse)]">
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--nb-accent-ink-inverse)]">SIGNAL</p>
            <h3 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] text-[var(--nb-accent-ink-inverse)]">
              This Portfolio
            </h3>
            <ul className="mt-8 space-y-3 text-sm">
              {NEO_COMPARE.solution.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-black text-[var(--nb-success)]">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
