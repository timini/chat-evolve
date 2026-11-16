import { useEffect } from "react";
import { useTheme } from "../theme";
import type { Provider, ProviderId, ValidationResult } from "../types";
import { ProviderGrid } from "./ProviderGrid";

export interface SettingsModalProps {
  keys: Partial<Record<ProviderId, string>>;
  preferredModels: Partial<Record<ProviderId, string>>;
  onSetKey: (provider: ProviderId, key: string) => void;
  onSetModel: (provider: ProviderId, model: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  onVerify?: (provider: Provider, key: string) => Promise<ValidationResult>;
}

/** Overlay for managing provider keys + default models mid-session. */
export function SettingsModal({
  keys,
  preferredModels,
  onSetKey,
  onSetModel,
  onClearAll,
  onClose,
  onVerify,
}: SettingsModalProps) {
  const t = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.32)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Provider keys and sessions"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1080,
          maxHeight: "100%",
          background: t.paper,
          border: `1px solid ${t.border}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: t.panel,
          }}
        >
          <div>
            <div className="ce-mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: t.muted }}>
              SETTINGS · PROVIDERS & KEYS
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 2 }}>
              Keys &amp; sessions
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={onClearAll}
              style={{
                border: `1px solid ${t.border}`,
                background: "transparent",
                color: t.ink,
                padding: "6px 12px",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 10.5,
                letterSpacing: "0.16em",
              }}
            >
              CLEAR ALL
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              style={{
                border: `1px solid ${t.border}`,
                background: t.ink,
                color: t.paper,
                padding: "6px 12px",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 10.5,
                letterSpacing: "0.16em",
              }}
            >
              CLOSE ✕
            </button>
          </div>
        </div>
        <div style={{ padding: 14, overflow: "auto", minHeight: 0 }}>
          <ProviderGrid
            keys={keys}
            preferredModels={preferredModels}
            onSetKey={onSetKey}
            onSetModel={onSetModel}
            {...(onVerify ? { onVerify } : {})}
            compact
          />
        </div>
      </div>
    </div>
  );
}
