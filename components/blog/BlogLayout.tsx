import React from "react";
import Link from "next/link";

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

export function BlogLayout({ children, showBackButton = false }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--nb-background)] text-[var(--nb-foreground)]">
      <header className="border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href={showBackButton ? "/blog" : "/"}
            className="inline-flex items-center gap-2 border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {showBackButton ? "Back to Blog" : "Back to Portfolio"}
          </Link>

          <div className="hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-2 text-[13px] font-bold uppercase tracking-[0.13em] text-[var(--nb-foreground-muted)] sm:block">
            blogs archive
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
