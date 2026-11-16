import { useTheme } from "../theme";

export interface StatusPillProps {
  /** Whether the thing this pill describes is configured / active. */
  ok: boolean;
  okLabel?: string;
  offLabel?: string;
}

/** Brutalist status chip — filled green when configured, hairline otherwise. */
export function StatusPill({
  ok,
  okLabel = "CONFIGURED",
  offLabel = "NOT CONFIGURED",
}: StatusPillProps) {
  const t = useTheme();
  return (
    <span
      className="ce-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 9.5,
        letterSpacing: "0.16em",
        padding: "4px 8px",
        border: `1px solid ${ok ? t.dominant : t.border}`,
        background: ok ? t.dominantFill : "transparent",
        color: t.ink,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          background: ok ? t.dominant : "transparent",
          border: `1px solid ${ok ? t.dominant : t.muted}`,
          borderRadius: 0,
        }}
      />
      {ok ? okLabel : offLabel}
    </span>
  );
}
