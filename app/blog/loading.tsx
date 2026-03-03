export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[var(--nb-background)] text-[var(--nb-foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-6 h-10 w-56 animate-pulse border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]" />
        <div className="mb-3 h-6 w-3/4 animate-pulse bg-[var(--nb-surface-alt)]" />
        <div className="h-6 w-1/2 animate-pulse bg-[var(--nb-surface-alt)]" />
      </div>
    </div>
  );
}
