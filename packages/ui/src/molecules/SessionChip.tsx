import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme";
import { PROVIDERS, PROVIDER_ORDER } from "../content";
import type { ProviderId, Session } from "../types";

export interface SessionChipProps {
  session: Session;
  /** Provider ids that currently have a key configured. */
  configured: ProviderId[];
  onSwitch: (provider: ProviderId, model: string) => void;
  onOpenSettings: () => void;
}

/** Chrome chip: shows the active provider/model, opens a session switcher. */
export function SessionChip({ session, configured, onSwitch, onOpenSettings }: SessionChipProps) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!session.provider) return null;
  const p = PROVIDERS[session.provider];
  const m = p.models.find((mm) => mm.id === session.model) ?? p.models[0]!;

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "stretch" }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 12px",
          border: `1px solid ${t.border}`,
          background: open ? t.ink : "transparent",
          color: open ? t.paper : t.ink,
          cursor: "pointer",
          fontFamily: "'IBM Plex Sans', sans-serif",
          height: 28,
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 1 }}>{p.glyph}</span>
        <span className="ce-mono" style={{ fontSize: 10, letterSpacing: "0.14em", opacity: 0.7, lineHeight: 1 }}>
          SESSION
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1, whiteSpace: "nowrap" }}>
          {p.name} · {m.label}
        </span>
        <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>▾</span>
      </button>
      <button
        type="button"
        onClick={onOpenSettings}
        title="Manage keys"
        style={{
          border: `1px solid ${t.border}`,
          borderLeft: "none",
          background: "transparent",
          color: t.ink,
          padding: "0 10px",
          cursor: "pointer",
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: 10,
          letterSpacing: "0.14em",
          height: 28,
        }}
      >
        KEYS
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: 30,
            right: 0,
            zIndex: 40,
            background: t.panel,
            border: `1px solid ${t.border}`,
            boxShadow: "0 14px 36px rgba(0,0,0,0.22)",
            minWidth: 320,
            maxHeight: 460,
            overflow: "auto",
          }}
        >
          <div
            className="ce-mono"
            style={{
              padding: "8px 12px",
              fontSize: 9.5,
              letterSpacing: "0.16em",
              color: t.muted,
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            SWITCH SESSION
          </div>
          {PROVIDER_ORDER.map((pid) => {
            const pp = PROVIDERS[pid];
            const isConfigured = configured.includes(pid);
            return (
              <div key={pid} style={{ borderBottom: `1px solid ${t.hairline}` }}>
                <div
                  style={{
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    opacity: isConfigured ? 1 : 0.55,
                    background: session.provider === pid ? t.dominantFill : "transparent",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{pp.glyph}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{pp.name}</span>
                  <span className="ce-mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: t.muted }}>
                    {isConfigured ? "◼ KEY SET" : "◻ NO KEY"}
                  </span>
                </div>
                <div>
                  {pp.models.map((mm) => {
                    const active = session.provider === pid && session.model === mm.id;
                    return (
                      <button
                        key={mm.id}
                        type="button"
                        role="menuitem"
                        disabled={!isConfigured}
                        onClick={() => {
                          onSwitch(pid, mm.id);
                          setOpen(false);
                        }}
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 12px 6px 30px",
                          border: "none",
                          background: active ? t.ink : "transparent",
                          color: active ? t.paper : t.ink,
                          cursor: isConfigured ? "pointer" : "not-allowed",
                          textAlign: "left",
                          fontFamily: "inherit",
                        }}
                      >
                        <span style={{ fontSize: 12 }}>{active ? "◼" : "◻"}</span>
                        <span style={{ fontSize: 12.5, flex: 1 }}>{mm.label}</span>
                        <span className="ce-mono" style={{ fontSize: 9, letterSpacing: "0.14em", opacity: 0.7 }}>
                          {mm.tier}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenSettings();
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "transparent",
              border: "none",
              borderTop: `1px solid ${t.border}`,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textAlign: "left",
              color: t.ink,
            }}
          >
            + MANAGE KEYS & PROVIDERS
          </button>
        </div>
      )}
    </div>
  );
}
