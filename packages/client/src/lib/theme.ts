import type { CSSProperties } from "react";
import type { ThemeSettings } from "@kanban/shared";

const FONT_STACKS: Record<string, string> = {
  Figtree: '"Figtree", "Segoe UI", sans-serif',
  "Bricolage Grotesque": '"Bricolage Grotesque", "Avenir Next", sans-serif',
  "Source Sans 3": '"Source Sans 3", "Segoe UI", sans-serif',
  "IBM Plex Sans": '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  Literata: '"Literata", "Georgia", serif',
};

/** Convert #RRGGBB to shadcn HSL components: "H S% L%" */
export function hexToHslComponents(hex: string): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      default:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function themeToCssVars(theme: ThemeSettings): CSSProperties {
  const primary = hexToHslComponents(theme.primaryColor);
  const accent = hexToHslComponents(theme.accentColor);
  const background = hexToHslComponents(theme.backgroundColor);
  const foreground = hexToHslComponents(theme.textColor);
  const card = hexToHslComponents(theme.surfaceColor);
  const fontStack = FONT_STACKS[theme.fontFamily] ?? FONT_STACKS.Figtree;

  return {
    ["--primary" as string]: primary,
    ["--accent" as string]: accent,
    ["--background" as string]: background,
    ["--foreground" as string]: foreground,
    ["--card" as string]: card,
    ["--color-primary" as string]: theme.primaryColor,
    ["--color-accent" as string]: theme.accentColor,
    ["--color-bg" as string]: theme.backgroundColor,
    ["--color-surface" as string]: theme.surfaceColor,
    ["--color-text" as string]: theme.textColor,
    ["--font-body" as string]: fontStack,
    ["--font-family-body" as string]: fontStack,
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
