import { NEO_FEATURES } from "@/lib/data/neo-home";

export function NeoFeatureGrid() {
  return (
    <section id="features" className="border-y-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {NEO_FEATURES.map((feature, index) => (
          <article
            key={feature.id}
            className={`group scan-lines flex min-h-[260px] flex-col border-[var(--nb-border)] p-8 transition-colors duration-150 hover:bg-[var(--nb-accent-light)] ${
              index < NEO_FEATURES.length - 1 ? "xl:border-r-2" : ""
            } ${index % 2 === 0 ? "md:border-r-2 xl:border-r-2" : ""} ${
              index < 2 ? "md:border-b-2 xl:border-b-0" : ""
            }`}
          >
            <p className="mb-8 text-xs font-bold tracking-[0.18em] text-[var(--nb-foreground-subtle)] group-hover:text-[var(--nb-accent-ink)]">
              /{feature.id}
            </p>
            <h3 className="text-3xl font-black uppercase leading-none tracking-[-0.03em] text-[var(--nb-foreground)]">
              {feature.title}
            </h3>
            <p className="mt-auto pt-6 text-sm font-medium leading-relaxed text-[var(--nb-foreground-muted)]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
