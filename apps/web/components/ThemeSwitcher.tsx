"use client";

import { THEME_NAMES, THEMES, useTheme, type ThemeName } from "@chat-evolve/ui";

export interface ThemeSwitcherProps {
  value: ThemeName;
  onChange: (theme: ThemeName) => void;
}

/** A compact floating palette switcher — the design's "Tweaks · Theme" control. */
export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  const t = useTheme();
  return (
    <div
      className="ce-mono"
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px",
        background: t.panel,
        border: `1px solid ${t.border}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
      }}
    >
      <span style={{ fontSize: 9, letterSpacing: "0.14em", color: t.muted }}>THEME</span>
      {THEME_NAMES.map((name) => {
        const swatch = THEMES[name];
        const active = name === value;
        return (
          <button
            key={name}
            type="button"
            aria-label={`theme ${name}`}
            aria-pressed={active}
            title={swatch.name}
            onClick={() => onChange(name)}
            style={{
              width: 18,
              height: 18,
              padding: 0,
              cursor: "pointer",
              background: swatch.paper,
              border: `2px solid ${active ? t.ink : t.hairline}`,
              outline: active ? `1px solid ${t.ink}` : "none",
              outlineOffset: 1,
              position: "relative",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 3,
                background: swatch.dominant,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
