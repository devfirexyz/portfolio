"use client";

import * as React from "react";

const THEME_STORAGE_KEY = "portfolio-theme";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialTheme(defaultTheme: Theme | "system"): Theme {
  if (typeof document === "undefined") {
    return defaultTheme === "system" ? "light" : defaultTheme;
  }

  const attributeTheme = document.documentElement.getAttribute("data-theme");
  if (attributeTheme === "dark" || attributeTheme === "light") {
    return attributeTheme;
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return defaultTheme === "system" ? getSystemTheme() : defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme | "system";
}) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setThemeState] = React.useState<Theme>("light");

  React.useEffect(() => {
    const initial = getInitialTheme(defaultTheme);
    setThemeState(initial);
    setMounted(true);
  }, [defaultTheme]);

  React.useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [mounted, theme]);

  const setTheme = React.useCallback((value: Theme) => {
    setThemeState(value);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme, mounted }),
    [mounted, setTheme, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
