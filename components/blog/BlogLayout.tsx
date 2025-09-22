import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const dottedBackgroundStyle = {
  backgroundImage: `radial-gradient(circle, rgba(168, 85, 247, 0.4) 1px, transparent 1px)`,
  backgroundSize: "60px 60px",
  backgroundPosition: "center center",
};

export function BlogLayout({
  children,
  showBackButton = false,
}: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-white flex flex-col" style={dottedBackgroundStyle}>
      {/* Clean Minimal Header */}
      <header>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <Link
                href="/blog"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Blog
              </Link>
            ) : (
              <Link
                href="/"
                className="flex shrink-0 items-center justify-center gap-3"
              >
                <span className="text-xl font-bold">Piyush Raj</span>
              </Link>
            )}
          </div>

          <div className="flex items-center sm:gap-4">
            <nav className="hidden items-center gap-4 text-sm sm:flex sm:gap-6">
              {/* Navigation items can be added here */}
            </nav>

            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href="/">
                Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative flex-1">{children}</main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 Piyush Raj. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}