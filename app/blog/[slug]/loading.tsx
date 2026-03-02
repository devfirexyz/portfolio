export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[var(--nb-background)] text-[var(--nb-foreground)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-4 h-10 w-5/6 animate-pulse bg-[var(--nb-surface-alt)]" />
        <div className="mb-8 h-6 w-2/3 animate-pulse bg-[var(--nb-surface-alt)]" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse bg-[var(--nb-surface-alt)]" />
          <div className="h-4 w-11/12 animate-pulse bg-[var(--nb-surface-alt)]" />
          <div className="h-4 w-10/12 animate-pulse bg-[var(--nb-surface-alt)]" />
          <div className="h-4 w-9/12 animate-pulse bg-[var(--nb-surface-alt)]" />
        </div>
      </div>
    </div>
  );
}
