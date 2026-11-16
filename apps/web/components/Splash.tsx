import { THEMES } from "@chat-evolve/ui";

// Deterministic, theme-independent placeholder shown during SSR + first paint
// (before the persisted store is read on the client). Uses the default `ink`
// palette so the server HTML and first client render are byte-identical.
const t = THEMES.ink;

export function Splash() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: t.paper,
        color: t.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      }}
    >
      <div style={{ fontWeight: 600, letterSpacing: "0.18em", fontSize: 16 }}>CHATEVOLVE</div>
      <div style={{ fontSize: 10, letterSpacing: "0.24em", color: t.muted }}>INITIALIZING HELIX…</div>
    </div>
  );
}
