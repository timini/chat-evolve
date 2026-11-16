import { useMemo } from "react";
import { useTheme } from "../theme";
import { sentencesOf, codonForIndex } from "../content";
import type { SentenceMarks, Variant } from "../types";
import { CodonGlyph } from "../atoms/CodonGlyph";

export interface HelixVariantCardProps {
  variant: Variant;
  marks: SentenceMarks;
  /** Cycle the mark of sentence `i`: none → dominant → purged → none. */
  onCycle: (sentenceIndex: number) => void;
  isActive: boolean;
  onSelect: () => void;
}

/** A single strand card: codon header + per-sentence rows you click to mark. */
export function HelixVariantCard({ variant, marks, onCycle, isActive, onSelect }: HelixVariantCardProps) {
  const t = useTheme();
  const sentences = useMemo(() => sentencesOf(variant.text), [variant.text]);

  return (
    <div
      onClick={onSelect}
      data-active={isActive}
      style={{
        background: t.panel,
        border: `1px solid ${t.border}`,
        outline: isActive ? `2px solid ${t.ink}` : "none",
        outlineOffset: -1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          borderBottom: `1px solid ${t.border}`,
          background: isActive ? t.ink : "transparent",
          color: isActive ? t.paper : t.ink,
        }}
      >
        <div
          style={{
            padding: "6px 10px",
            borderRight: `1px solid ${isActive ? t.paper : t.border}`,
            minWidth: 90,
          }}
        >
          <div className="ce-mono" style={{ fontSize: 9, letterSpacing: "0.14em", opacity: 0.7 }}>
            STRAND
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>
            {variant.id}
            <span
              className="ce-mono"
              style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, marginLeft: 6 }}
            >
              {variant.role}
            </span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            minWidth: 0,
            flexWrap: "wrap",
          }}
        >
          {sentences.map((_, i) => (
            <CodonGlyph
              key={i}
              seed={variant.id}
              index={i}
              state={marks[i] ?? null}
              active={isActive}
              onClick={() => onCycle(i)}
            />
          ))}
        </div>
        <div
          style={{
            padding: "6px 10px",
            borderLeft: `1px solid ${isActive ? t.paper : t.border}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 64,
            alignItems: "flex-end",
          }}
        >
          <div className="ce-mono" style={{ fontSize: 9, letterSpacing: "0.14em", opacity: 0.7 }}>
            τ
          </div>
          <div className="ce-mono ce-tick" style={{ fontSize: 12, fontWeight: 500 }}>
            {variant.temp.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Body — one row per sentence */}
      <div style={{ padding: "6px 0", flex: 1, overflow: "auto" }}>
        {sentences.map((s, i) => {
          const k = marks[i];
          return (
            <div
              key={i}
              role="button"
              aria-pressed={k != null}
              aria-label={`sentence ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                onCycle(i);
              }}
              style={{
                display: "flex",
                gap: 10,
                padding: "7px 12px",
                borderBottom: i < sentences.length - 1 ? `1px solid ${t.hairline}` : "none",
                cursor: "pointer",
                background:
                  k === "dominant" ? t.dominantFill : k === "purged" ? t.purgedFill : "transparent",
                transition: "background 100ms linear",
              }}
            >
              <div
                style={{
                  flex: "0 0 22px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  color: t.muted,
                  paddingTop: 1,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: t.ink }}>
                  {codonForIndex(variant.id, i)}
                </span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: t.ink,
                  textDecoration: k === "purged" ? "line-through" : "none",
                  textDecorationColor: k === "purged" ? t.purged : undefined,
                  opacity: k === "purged" ? 0.78 : 1,
                }}
              >
                {s.trim()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
