import type { CSSProperties } from "react";
import type { ThemeSettings } from "@kanban/shared";

const FONT_STACKS: Record<string, string> = {
  Figtree: '"Figtree", "Segoe UI", sans-serif',
  "Bricolage Grotesque": '"Bricolage Grotesque", "Avenir Next", sans-serif',
  "Source Sans 3": '"Source Sans 3", "Segoe UI", sans-serif',
  "IBM Plex Sans": '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  Literata: '"Literata", "Georgia", serif',
};

export function themeToCssVars(theme: ThemeSettings): CSSProperties {
  return {
    ["--color-primary" as string]: theme.primaryColor,
    ["--color-accent" as string]: theme.accentColor,
    ["--color-bg" as string]: theme.backgroundColor,
    ["--color-surface" as string]: theme.surfaceColor,
    ["--color-text" as string]: theme.textColor,
    ["--font-body" as string]: FONT_STACKS[theme.fontFamily] ?? FONT_STACKS.Figtree,
    ["--radius" as string]: `${theme.borderRadius}px`,
  };
}

export function fontHref(fontFamily: string): string {
  const map: Record<string, string> = {
    Figtree: "Figtree:wght@400;500;600;700",
    "Bricolage Grotesque": "Bricolage+Grotesque:wght@500;600;700",
    "Source Sans 3": "Source+Sans+3:wght@400;500;600;700",
    "IBM Plex Sans": "IBM+Plex+Sans:wght@400;500;600;700",
    Literata: "Literata:wght@400;500;600;700",
  };
  const family = map[fontFamily] ?? map.Figtree;
  return `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
}
