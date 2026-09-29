"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MULTI_UI_ENABLED } from "@/lib/feature-flags";

export type ThemeMode = "a" | "b";

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("a");

  useEffect(() => {
    if (!MULTI_UI_ENABLED) return;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem("theme-mode");
    } catch {
      // Storage blocked (privacy settings, some embedded browsers) — keep the default.
    }
    if (stored === "a" || stored === "b") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount is intentional
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggleTheme = () => {
    if (!MULTI_UI_ENABLED) return;
    setTheme((prev) => {
      const next: ThemeMode = prev === "a" ? "b" : "a";
      document.documentElement.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("theme-mode", next);
      } catch {
        // Storage blocked — the switch still applies for this visit.
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
