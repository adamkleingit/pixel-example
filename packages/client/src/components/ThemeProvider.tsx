"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, type ThemeSettings } from "@kanban/shared";
import { api } from "@/lib/api";
import { fontHref, themeToCssVars } from "@/lib/theme";

interface ThemeContextValue {
  theme: ThemeSettings;
  loading: boolean;
  setThemeLocal: (theme: ThemeSettings) => void;
  saveTheme: (theme: ThemeSettings) => Promise<void>;
  refresh: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const settings = await api.getSettings();
      setTheme(settings.theme);
    } catch {
      setTheme(DEFAULT_THEME);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    const id = "theme-font-link";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = fontHref(theme.fontFamily);
  }, [theme.fontFamily]);

  async function saveTheme(next: ThemeSettings) {
    const saved = await api.saveSettings(next);
    setTheme(saved.theme);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loading,
        setThemeLocal: setTheme,
        saveTheme,
        refresh,
      }}
    >
      <div className="app-shell" style={themeToCssVars(theme)}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
