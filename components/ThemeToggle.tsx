"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
