import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProjectWidgetItem {
  id: string;
  title: string;
  description: string;
  href: string | null;
  tags: string[];
  meta: {
    impact: string;
    impactMetric: string;
    status: string;
    liveUnavailable?: boolean;
  };
}

export function ProjectCardsWidget({ items }: { items: ProjectWidgetItem[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-3 grid gap-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-4 shadow-[6px_6px_0px_0px_var(--nb-shadow-color)]"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <h4 className="text-sm font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)]">
              {item.title}
            </h4>
            <span className="shrink-0 border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
              {item.meta.impactMetric}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[var(--nb-foreground-muted)]">{item.description}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--nb-foreground)]">
            <span className="font-bold uppercase tracking-[0.12em] text-[var(--nb-accent-ink)]">
              Impact:
            </span>{" "}
            {item.meta.impact}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={`${item.id}-${tag}`}
                className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {item.href && !item.meta.liveUnavailable ? (
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-2.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[4px_4px_0px_0px_var(--nb-shadow-accent)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--nb-shadow-accent)]"
            >
              Live Preview
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="mt-3 inline-flex border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-subtle)]">
              Preview unavailable
            </span>
          )}
        </article>
      ))}
    </div>
  );
}
