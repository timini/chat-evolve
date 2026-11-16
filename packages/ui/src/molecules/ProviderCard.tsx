import { useEffect, useState } from "react";
import { useTheme } from "../theme";
import { maskKey } from "../content";
import { validateKeyFormat, verifyApiKey } from "../validation";
import type { Provider, ValidationResult } from "../types";
import { StatusPill } from "../atoms/StatusPill";

export interface ProviderCardProps {
  provider: Provider;
  /** The currently stored key for this provider ("" if none). */
  apiKey: string;
  /** The preferred default model id for this provider. */
  preferredModel: string;
  onSetKey: (key: string) => void;
  onSetModel: (modelId: string) => void;
  /**
   * Live key verification (hits the provider). Injectable for tests/stories;
   * defaults to a real network check against the provider's models endpoint.
   */
  onVerify?: (provider: Provider, key: string) => Promise<ValidationResult>;
  compact?: boolean;
}

/** Per-provider config card: model picker + key input with live verification. */
export function ProviderCard({
  provider,
  apiKey,
  preferredModel,
  onSetKey,
  onSetModel,
  onVerify = verifyApiKey,
  compact = false,
}: ProviderCardProps) {
  const t = useTheme();
  const ok = !!apiKey;
  const [val, setVal] = useState(apiKey);
  const [revealed, setRevealed] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);

  useEffect(() => setVal(apiKey), [apiKey]);

  const trimmed = val.trim();
  const validation = validateKeyFormat(provider, val);
  const isDirty = val !== apiKey;
  // Surface format errors only while the user is editing; a freshly-loaded
  // stored key is left alone.
  const formatError = isDirty && validation.state === "invalid";
  const alertMessage = formatError ? validation.message : rejected;
  const canSave = validation.state === "valid" && !verifying;

  // Cheap blur handler: only clears a stored key when the field is emptied.
  // (Live verification is deliberately reserved for an explicit save.)
  const handleBlur = () => {
    if (isDirty && trimmed === "" && ok) onSetKey("");
  };

  const attemptSave = async () => {
    if (ok || validation.state !== "valid" || verifying) return;
    setVerifying(true);
    setRejected(null);
    try {
      const result = await onVerify(provider, trimmed);
      if (result.valid) onSetKey(trimmed);
      else setRejected(result.error ?? `Invalid ${provider.name} API key.`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${t.border}`,
        background: t.panel,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: `1px solid ${t.border}` }}>
        <div
          aria-hidden
          style={{
            padding: "10px 14px",
            borderRight: `1px solid ${t.border}`,
            minWidth: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: t.ink,
          }}
        >
          {provider.glyph}
        </div>
        <div style={{ flex: 1, padding: "8px 14px", minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", lineHeight: 1.15 }}>
            {provider.name}
          </div>
          <div
            className="ce-mono"
            style={{ fontSize: 9.5, letterSpacing: "0.14em", color: t.muted, marginTop: 2 }}
          >
            {provider.blurb.toUpperCase()} · {provider.models.length} MODELS
          </div>
        </div>
        <div style={{ padding: "10px 14px", display: "flex", alignItems: "center" }}>
          <StatusPill ok={ok} />
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: compact ? 10 : 14,
          display: "flex",
          flexDirection: "column",
          gap: compact ? 10 : 14,
          flex: 1,
        }}
      >
        {/* Model picker */}
        <div>
          <div
            className="ce-mono"
            style={{ fontSize: 9.5, letterSpacing: "0.16em", color: t.muted, marginBottom: 6 }}
          >
            DEFAULT MODEL
          </div>
          <div
            role="radiogroup"
            aria-label={`${provider.name} model`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${provider.models.length}, 1fr)`,
            }}
          >
            {provider.models.map((m, i) => {
              const selected = preferredModel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSetModel(m.id)}
                  style={{
                    border: `1px solid ${t.border}`,
                    borderLeft: i > 0 ? "none" : `1px solid ${t.border}`,
                    background: selected ? t.ink : "transparent",
                    color: selected ? t.paper : t.ink,
                    padding: "8px 10px",
                    cursor: "pointer",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.15 }}>
                    {selected ? "◼ " : "◻ "}
                    {m.label}
                  </span>
                  <span className="ce-mono" style={{ fontSize: 9, letterSpacing: "0.14em", opacity: 0.7 }}>
                    {m.tier}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key input */}
        <div>
          <div
            className="ce-mono"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.16em",
              color: t.muted,
              marginBottom: 6,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>API KEY</span>
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: t.muted, textDecoration: "none" }}
            >
              GET KEY → {provider.docsLabel.toUpperCase()} ↗
            </a>
          </div>
          <div style={{ display: "flex" }}>
            <input
              type={revealed ? "text" : "password"}
              aria-label={`${provider.name} API key`}
              aria-invalid={!!alertMessage}
              aria-busy={verifying}
              aria-describedby={alertMessage ? `${provider.id}-key-error` : undefined}
              disabled={verifying}
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
                if (rejected) setRejected(null);
              }}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void attemptSave();
                }
              }}
              placeholder={provider.keyHint}
              style={{
                flex: 1,
                borderTop: `1px solid ${alertMessage ? t.purged : t.border}`,
                borderBottom: `1px solid ${alertMessage ? t.purged : t.border}`,
                borderLeft: `1px solid ${alertMessage ? t.purged : t.border}`,
                borderRight: "none",
                background: t.paper,
                padding: "10px 12px",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 12.5,
                color: t.ink,
                outline: "none",
                minWidth: 0,
              }}
            />
            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              style={{
                border: `1px solid ${t.border}`,
                borderRight: "none",
                background: "transparent",
                color: t.ink,
                padding: "0 12px",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
              }}
            >
              {revealed ? "HIDE" : "SHOW"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (ok) {
                  onSetKey("");
                  setVal("");
                  setRejected(null);
                } else {
                  void attemptSave();
                }
              }}
              disabled={ok ? false : !canSave}
              style={{
                border: `1px solid ${t.border}`,
                background: ok ? "transparent" : canSave ? t.ink : "transparent",
                color: ok ? t.ink : canSave ? t.paper : t.muted,
                padding: "0 14px",
                cursor: ok || canSave ? "pointer" : "not-allowed",
                opacity: ok || canSave ? 1 : 0.4,
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.14em",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {verifying ? "CHECKING…" : ok ? "CLEAR" : "SAVE ↵"}
            </button>
          </div>
          {alertMessage && (
            <div
              id={`${provider.id}-key-error`}
              role="alert"
              className="ce-mono"
              style={{ fontSize: 10.5, color: t.purged, marginTop: 6, letterSpacing: "0.02em" }}
            >
              ▲ {alertMessage}
            </div>
          )}
          {verifying && (
            <div
              role="status"
              className="ce-mono"
              style={{ fontSize: 10.5, color: t.muted, marginTop: 6, letterSpacing: "0.02em" }}
            >
              ◷ Verifying with {provider.name}…
            </div>
          )}
          {ok && !alertMessage && !verifying && (
            <div
              className="ce-mono"
              style={{ fontSize: 10.5, color: t.muted, marginTop: 6, letterSpacing: "0.02em" }}
            >
              STORED · {maskKey(apiKey)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
