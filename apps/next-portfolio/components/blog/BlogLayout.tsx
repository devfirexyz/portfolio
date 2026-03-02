"use client";

import React from "react";
import Link from "next/link";

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

export function BlogLayout({
  children,
  showBackButton = false,
}: BlogLayoutProps) {
  return (
    <div className="min-h-screen text-white flex flex-col bg-[#0f0f23]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f23]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <Link
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
                Back to Portfolio
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-auto bg-[#0f0f23]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-white/50">
            © 2024 Piyush Raj. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
