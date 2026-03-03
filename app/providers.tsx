"use client";

import type React from "react";
import { ProgressProvider } from "@bprogress/next/app";

import { LazyMusicPlayer } from "@/components/LazyMusicPlayer";
import { ThemeProvider } from "@/components/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      color="var(--nb-accent)"
      height="3px"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <ThemeProvider defaultTheme="dark">
        {children}
        <LazyMusicPlayer />
      </ThemeProvider>
    </ProgressProvider>
  );
}
