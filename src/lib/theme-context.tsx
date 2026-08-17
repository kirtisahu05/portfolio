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
    const stored = window.localStorage.getItem("theme-mode") as ThemeMode | null;
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
      window.localStorage.setItem("theme-mode", next);
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
