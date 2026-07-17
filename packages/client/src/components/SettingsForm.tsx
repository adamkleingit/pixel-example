"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THEME, FONT_OPTIONS, type ThemeSettings } from "@kanban/shared";
import { useTheme } from "./ThemeProvider";

const COLOR_FIELDS: { key: keyof ThemeSettings; label: string }[] = [
  { key: "primaryColor", label: "Primary" },
  { key: "accentColor", label: "Accent" },
  { key: "backgroundColor", label: "Background" },
  { key: "surfaceColor", label: "Surface" },
  { key: "textColor", label: "Text" },
];

export function SettingsForm() {
  const { theme, setThemeLocal, saveTheme, loading } = useTheme();
  const [draft, setDraft] = useState<ThemeSettings>(theme);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(theme);
  }, [theme]);

  function updateDraft<K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setThemeLocal(next);
    setStatus(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveTheme(draft);
      setStatus("Theme saved to the server.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save theme");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setDraft(DEFAULT_THEME);
    setThemeLocal(DEFAULT_THEME);
    setStatus(null);
  }

  if (loading) {
    return <div className="status-banner">Loading settings…</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Tune the board theme. Changes persist in Postgres.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset defaults
          </button>
          <button type="button" className="btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save theme"}
          </button>
        </div>
      </div>

      {status ? <div className="status-banner">{status}</div> : null}
      {error ? <div className="status-banner error-banner">{error}</div> : null}

      <div className="settings-layout">
        <section className="settings-panel">
          <h2>Theme tokens</h2>
          <div className="form-grid">
            {COLOR_FIELDS.map((field) => (
              <div className="field" key={field.key}>
                <label htmlFor={field.key}>{field.label}</label>
                <div className="color-row">
                  <input
                    id={field.key}
                    value={String(draft[field.key])}
                    onChange={(event) =>
                      updateDraft(field.key, event.target.value as ThemeSettings[typeof field.key])
                    }
                  />
                  <input
                    type="color"
                    aria-label={`${field.label} color picker`}
                    value={String(draft[field.key])}
                    onChange={(event) =>
                      updateDraft(field.key, event.target.value as ThemeSettings[typeof field.key])
                    }
                  />
                </div>
              </div>
            ))}

            <div className="field">
              <label htmlFor="fontFamily">Font family</label>
              <select
                id="fontFamily"
                value={draft.fontFamily}
                onChange={(event) => updateDraft("fontFamily", event.target.value)}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="borderRadius">Border radius ({draft.borderRadius}px)</label>
              <input
                id="borderRadius"
                type="range"
                min={0}
                max={24}
                value={draft.borderRadius}
                onChange={(event) => updateDraft("borderRadius", Number(event.target.value))}
              />
            </div>
          </div>
        </section>

        <section className="preview-panel">
          <h2>Live preview</h2>
          <div className="preview-swatch">
            <div className="preview-card">
              <h3>Sample card</h3>
              <p>Primary and accent colors drive the board chrome and tags.</p>
              <div className="tag-row">
                <span className="tag">design</span>
                <span className="tag">api</span>
              </div>
              <div className="task-actions">
                <button type="button" className="btn">
                  Primary action
                </button>
                <button type="button" className="btn btn-secondary">
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
