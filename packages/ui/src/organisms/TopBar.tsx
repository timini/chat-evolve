import type { ReactNode } from "react";
import { useTheme } from "../theme";
import { BrandMark } from "../atoms/BrandMark";
import { Eyebrow } from "../atoms/Eyebrow";

export interface TopBarProps {
  variantLabel?: string;
  version?: string;
  /** The original-intent sequence prompt. */
  prompt: string;
  /** Population indicator, e.g. "6 / 9". */
  population?: string;
  /** The session chip / keys control rendered on the right. */
  sessionChip?: ReactNode;
}

/** The workbench chrome bar: brand · sequence · population · session. */
export function TopBar({ variantLabel = "HELIX", version, prompt, population, sessionChip }: TopBarProps) {
  const t = useTheme();
  return (
    <div style={{ borderBottom: `1px solid ${t.border}`, display: "flex", background: t.panel }}>
      <div
        style={{
          padding: "0 16px",
          borderRight: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          minWidth: 220,
        }}
      >
        <BrandMark variantLabel={variantLabel} version={version} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 16px", gap: 14, minWidth: 0 }}>
        <Eyebrow>SEQUENCE</Eyebrow>
        <span
          style={{
            fontSize: 13,
            color: t.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {prompt}
        </span>
      </div>
      {population && (
        <div
          style={{
            padding: "0 16px",
            borderLeft: `1px solid ${t.border}`,
            borderRight: `1px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Eyebrow>POPULATION</Eyebrow>
          <span className="ce-mono ce-tick" style={{ fontSize: 12, fontWeight: 600 }}>
            {population}
          </span>
        </div>
      )}
      {sessionChip && (
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>{sessionChip}</div>
      )}
    </div>
  );
}
