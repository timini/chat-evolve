import type { ReactNode } from "react";
import { useTheme } from "../theme";

export interface EyebrowProps {
  children: ReactNode;
  /** Override the label colour (defaults to the muted theme colour). */
  color?: string;
}

/** Small-caps monospace eyebrow label — the workbench's section markers. */
export function Eyebrow({ children, color }: EyebrowProps) {
  const t = useTheme();
  return (
    <span
      className="ce-mono"
      style={{
        fontSize: 9.5,
        letterSpacing: "0.14em",
        color: color ?? t.muted,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
