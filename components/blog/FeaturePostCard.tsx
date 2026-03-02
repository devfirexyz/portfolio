import Link from "next/link";
import type { BlogPost } from "@/types/blog";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-8 shadow-[8px_8px_0px_0px_var(--nb-shadow-color)] transition-all duration-150 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[6px_6px_0px_0px_var(--nb-shadow-color)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {post.category && (
                <span className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2.5 py-1 text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                  {post.category}
                </span>
              )}
              {post.featured && (
                <span className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-2.5 py-1 text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-inverse)]">
                  Featured
                </span>
              )}
            </div>

            <div className="text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
              {post.readingTime} min read
            </div>
          </div>

          <h3 className="mb-4 text-2xl font-black uppercase leading-tight tracking-tight text-[var(--nb-foreground)] sm:text-3xl">
            {post.title}
          </h3>

          <p className="mb-6 line-clamp-2 text-base leading-relaxed text-[var(--nb-foreground-muted)]">
            {post.description}
          </p>

          <div className="flex items-center justify-between border-t-2 border-[var(--nb-border)] pt-4">
            <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--nb-foreground-muted)]">
              <span>{formatDate(post.publishedAt)}</span>
              {post.tags && post.tags.length > 0 && <span>#{post.tags[0]}</span>}
            </div>

            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[var(--nb-accent-ink)]">
              <span>Read</span>
              <svg className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
