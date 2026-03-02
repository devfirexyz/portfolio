import type React from "react";
import Script from "next/script";
import "./globals.css";

import { LazyMusicPlayer } from "@/components/LazyMusicPlayer";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Piyush Raj | Systems Engineer",
  description:
    "Portfolio of Piyush Raj: production software systems, AI-enabled products, and performance-first frontend architecture.",
  keywords:
    "Piyush Raj, Software Engineer, Full Stack Developer, React, TypeScript, Node.js, AI, portfolio",
  authors: [{ name: "Piyush Raj" }],
  icons: {
    icon: "/favicon.svg",
  },
};

const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
      return;
    }

    document.documentElement.setAttribute("data-theme", "dark");
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ThemeProvider defaultTheme="dark">
          {children}
          <LazyMusicPlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}
