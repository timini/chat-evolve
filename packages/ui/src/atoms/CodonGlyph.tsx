import type { MouseEvent } from "react";
import { useTheme } from "../theme";
import { codonForIndex } from "../content";
import type { GeneKind } from "../types";

export interface CodonGlyphProps {
  /** Seed (usually the variant id) — same seed+index always yields the same base. */
  seed: string;
  index: number;
  state?: GeneKind | null;
  /** Rendered on a dark/active surface — flips the default colours. */
  active?: boolean;
  onClick?: () => void;
}

/** A single base-pair glyph (A/T/G/C). Tinted green/red when marked. */
export function CodonGlyph({ seed, index, state = null, active = false, onClick }: CodonGlyphProps) {
  const t = useTheme();
  const letter = codonForIndex(seed, index);

  const background =
    state === "dominant" ? t.dominant : state === "purged" ? t.purged : "transparent";
  const color =
    state === "dominant" || state === "purged" ? t.paper : active ? t.paper : t.ink;

  const handleClick = onClick
    ? (e: MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        onClick();
      }
    : undefined;

  return (
    <span
      className="ce-mono ce-tick"
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `codon ${letter} (${state ?? "unmarked"})` : undefined}
      aria-pressed={onClick ? state != null : undefined}
      onClick={handleClick}
      style={{
        fontSize: 11,
        fontWeight: 700,
        width: 18,
        height: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${active ? t.paper : t.border}`,
        background,
        color,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {letter}
    </span>
  );
}
