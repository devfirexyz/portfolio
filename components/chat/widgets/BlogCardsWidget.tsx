import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogWidgetItem {
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  meta: {
    publishedAt: string;
    readingTime: number;
    category: string | null;
    featured?: boolean;
  };
}

function formatDate(input: string): string {
  try {
    return new Date(input).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return input;
  }
}

export function BlogCardsWidget({ items }: { items: BlogWidgetItem[] }) {
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
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {item.meta.category ? (
              <span className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                {item.meta.category}
              </span>
            ) : null}
            {item.meta.featured ? (
              <span className="border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                Featured
              </span>
            ) : null}
          </div>

          <h4 className="text-sm font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)]">
            {item.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-[var(--nb-foreground-muted)]">{item.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t-2 border-[var(--nb-border)] pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
            <span>{formatDate(item.meta.publishedAt)}</span>
            <span>•</span>
            <span>{item.meta.readingTime} min read</span>
            {item.tags[0] ? (
              <>
                <span>•</span>
                <span>#{item.tags[0]}</span>
              </>
            ) : null}
          </div>

          <Link
            href={item.href}
            className="mt-3 inline-flex items-center gap-1 border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-accent-ink)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--nb-shadow-color)]"
          >
            Read blog
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </article>
      ))}
    </div>
  );
}
