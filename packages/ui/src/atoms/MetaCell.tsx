import { useTheme } from "../theme";

export interface MetaCellProps {
  label: string;
  value: string;
  /** Override the value colour (e.g. an accent). */
  accent?: string;
  /** Draw the right divider border (default true). */
  bordered?: boolean;
}

/** A grid-cell metadata pill — mono key over a tabular value, hard divider. */
export function MetaCell({ label, value, accent, bordered = true }: MetaCellProps) {
  const t = useTheme();
  return (
    <div
      style={{
        borderRight: bordered ? `1px solid ${t.border}` : undefined,
        padding: "6px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 0,
      }}
    >
      <span className="ce-mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: t.muted }}>
        {label}
      </span>
      <span
        className="ce-mono ce-tick"
        style={{
          fontSize: 12,
          color: accent ?? t.ink,
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
    </div>
  );
}
