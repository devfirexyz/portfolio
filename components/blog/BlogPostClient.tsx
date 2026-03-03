import Link from "next/link";

import MarkdownContent from "@/components/blog/MarkdownContent";
import TableOfContentsClient from "@/components/blog/TableOfContentsClient";
import { parseMarkdown } from "@/lib/blog-markdown";
import type { BlogPost } from "@/types/blog";

interface BlogPostClientProps {
  post: BlogPost;
  allPosts: BlogPost[];
  author?: {
    name: string;
    bio?: string;
  } | null;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostNavigation({ post, allPosts }: { post: BlogPost; allPosts: BlogPost[] }) {
  const sortedPosts = allPosts
    .filter((entry) => !entry.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const currentIndex = sortedPosts.findIndex((entry) => entry.slug === post.slug);
  const previousPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="group border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-3 transition-colors duration-150 hover:bg-[var(--nb-surface-alt)]"
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs text-[var(--nb-foreground-muted)]">Previous</span>
          </div>
          <div className="line-clamp-2 text-sm font-medium leading-tight text-[var(--nb-foreground)] transition-colors group-hover:text-[var(--nb-accent-ink)]">
            {previousPost.title}
          </div>
        </Link>
      ) : (
        <div className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] p-3 opacity-60">
          <div className="mb-1 text-xs text-[var(--nb-foreground-subtle)]">Previous</div>
          <div className="text-sm text-[var(--nb-foreground-subtle)]">Oldest post</div>
        </div>
      )}

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-3 text-right transition-colors duration-150 hover:bg-[var(--nb-surface-alt)]"
        >
          <div className="mb-1 text-xs text-[var(--nb-foreground-muted)]">Next</div>
          <div className="line-clamp-2 text-sm font-medium leading-tight text-[var(--nb-foreground)] transition-colors group-hover:text-[var(--nb-accent-ink)]">
            {nextPost.title}
          </div>
        </Link>
      ) : (
        <div className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] p-3 text-right opacity-60">
          <div className="mb-1 text-xs text-[var(--nb-foreground-subtle)]">Next</div>
          <div className="text-sm text-[var(--nb-foreground-subtle)]">Newest post</div>
        </div>
      )}
    </div>
  );
}

export default function BlogPostClient({ post, allPosts, author }: BlogPostClientProps) {
  const parsedMarkdown = parseMarkdown(post.rawContent || "");
  const authorName = author?.name || post.author || "Piyush Raj";

  return (
    <div className="xl:mx-auto xl:max-w-6xl xl:px-6 xl:py-8">
      <div className="xl:grid xl:grid-cols-[250px_1fr] xl:gap-8">
        <aside className="hidden xl:block">
          <div className="sticky top-8">
            <TableOfContentsClient items={parsedMarkdown.tocItems} />
          </div>
        </aside>

        <main className="mx-auto max-w-3xl px-4 py-8 xl:max-w-none xl:px-0 xl:py-0">
          <article>
            <header className="mb-8 sm:mb-12">
              {post.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-inverse)] sm:text-sm">
                    {post.category}
                  </span>
                </div>
              )}

              <h1 className="mb-4 text-2xl font-bold leading-tight text-[var(--nb-foreground)] sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mb-6 text-lg leading-relaxed text-[var(--nb-foreground-muted)] sm:mb-8 sm:text-xl">
                {post.description}
              </p>

              <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] text-sm font-bold text-[var(--nb-foreground-inverse)] sm:h-10 sm:w-10">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-[var(--nb-foreground)]">{authorName}</div>
                    <div className="text-sm text-[var(--nb-foreground-muted)]">
                      {formatDate(post.publishedAt)} • {post.readingTime} min read
                    </div>
                  </div>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-1 text-xs font-medium text-[var(--nb-foreground-muted)] sm:text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <PostNavigation post={post} allPosts={allPosts} />

            <div className="max-w-none">
              <MarkdownContent parsed={parsedMarkdown} />
            </div>

            {author && (
              <div className="mt-12 border-t-2 border-[var(--nb-border)] pt-6 sm:mt-16 sm:pt-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] font-bold text-[var(--nb-foreground-inverse)] sm:h-16 sm:w-16 sm:text-xl">
                    {author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-[var(--nb-foreground)] sm:text-xl">
                      {author.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-[var(--nb-foreground-muted)] sm:text-base">
                      {author.bio ||
                        "Building modern web applications with React, TypeScript, and performance-first architecture."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </article>
        </main>
      </div>
    </div>
  );
}
