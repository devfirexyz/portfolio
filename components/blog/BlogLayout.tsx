import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const modernBackgroundStyle = {
  background: `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)`,
};

export function BlogLayout({
  children,
  showBackButton = false,
}: BlogLayoutProps) {
  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden" style={modernBackgroundStyle}>
      {/* Modern Gradient Background */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs for depth */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tl from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-[100px]" />
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-[80px]" />
        </div>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      {/* Modern Glass Header */}
      <header className="relative z-10 border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <Link
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200"
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
                <span className="text-xl font-semibold text-white tracking-tight">Piyush Raj</span>
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
              className="bg-white/[0.08] hover:bg-white/[0.12] text-white border-white/[0.12] hover:border-white/[0.2] backdrop-blur-sm transition-all duration-200"
            >
              <Link href="/">
                Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative flex-1 z-10">{children}</main>

      {/* Modern Glass Footer */}
      <footer className="border-t border-white/[0.08] mt-auto relative z-10 bg-white/[0.02] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-white/50">
            © 2024 Piyush Raj. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}