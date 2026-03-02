import { BlogLayout } from "@/components/blog/BlogLayout";
import FeaturedPostCard from "@/components/blog/FeaturePostCard";
import RegularPostCard from "@/components/blog/RegularPostCard";
import type { BlogPost } from "@/types/blog";
import { getAllPosts } from "@/lib/blog";

export default async function BlogIndex() {
  const posts = await getAllPosts();

  const sortedPosts = posts
    .filter((post: BlogPost) => !post.draft)
    .sort(
      (a: BlogPost, b: BlogPost) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const postsByYear = sortedPosts.reduce((acc: Record<number, BlogPost[]>, post: BlogPost) => {
    const year = new Date(post.publishedAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <BlogLayout>
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center gap-2 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
            <div className="h-2 w-2 bg-[var(--nb-success)]" />
            Personal Blog Archive
          </div>
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-[var(--nb-foreground)] sm:text-6xl lg:text-7xl">
            Engineering
            <span className="block bg-gradient-to-r from-[var(--nb-accent-ink)] to-[var(--nb-foreground)] bg-clip-text text-transparent">
              Blogs
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--nb-foreground-muted)] sm:text-lg">
            Build logs, technical breakdowns, and lessons from shipping product systems in real conditions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        {years.map((year) => {
          const yearPosts = postsByYear[year];
          const featuredPosts = yearPosts.filter((post: BlogPost) => post.featured);
          const regularPosts = yearPosts.filter((post: BlogPost) => !post.featured);

          return (
            <div key={year} className="mb-20">
              <div className="mb-10 flex items-center gap-4">
                <h2 className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-4 py-2 text-2xl font-black text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
                  {year}
                </h2>
                <div className="h-0.5 flex-1 bg-[var(--nb-border)]" />
              </div>

              {featuredPosts.length > 0 && (
                <div className="mb-12 space-y-6">
                  {featuredPosts.map((post: BlogPost) => (
                    <FeaturedPostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}

              <div className="grid gap-5">
                {regularPosts.map((post: BlogPost) => (
                  <RegularPostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          );
        })}

        {sortedPosts.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-12 shadow-[8px_8px_0px_0px_var(--nb-shadow-color)]">
              <h3 className="mb-3 text-xl font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)]">
                No posts yet
              </h3>
              <p className="leading-relaxed text-[var(--nb-foreground-muted)]">
                New writeups will land here with architecture notes and implementation insights.
              </p>
            </div>
          </div>
        )}
      </div>
    </BlogLayout>
  );
}
