import Link from "next/link";
import { BlogPost } from "@/types/blog";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RegularPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-6 shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] transition-all duration-150 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              {post.category && (
                <div className="mb-3 inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                  {post.category}
                </div>
              )}

              <h3 className="mb-2 text-xl font-black uppercase leading-tight text-[var(--nb-foreground)]">
                {post.title}
              </h3>

              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--nb-foreground-muted)]">
                {post.description}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent-light)] text-sm font-bold text-[var(--nb-foreground-inverse)]">
              {post.title.charAt(0)}
            </div>
          </div>

          <div className="flex items-center justify-between border-t-2 border-[var(--nb-border)] pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--nb-foreground-muted)]">
            <div className="flex items-center gap-2">
              <span>{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{post.readingTime} min</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <span>#{post.tags[0]}</span>
                </>
              )}
            </div>

            <svg className="h-4 w-4 text-[var(--nb-accent-ink)] transition-all duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
