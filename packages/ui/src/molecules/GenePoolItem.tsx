import { useTheme } from "../theme";
import type { GeneKind, VariantId } from "../types";

export interface GenePoolItemProps {
  src: VariantId;
  text: string;
  kind: GeneKind;
}

/** A single entry in the dominant / purged gene pool of the splice payload. */
export function GenePoolItem({ src, text, kind }: GenePoolItemProps) {
  const t = useTheme();
  const purged = kind === "purged";
  return (
    <div style={{ padding: "8px 0", borderBottom: `1px solid ${t.hairline}` }}>
      <div className="ce-mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: t.muted }}>
        STRAND ·{src}
      </div>
      <div
        style={{
          fontSize: 11.5,
          lineHeight: 1.35,
          marginTop: 2,
          textDecoration: purged ? "line-through" : "none",
          textDecorationColor: purged ? t.purged : undefined,
          opacity: purged ? 0.78 : 1,
        }}
      >
        {text}
      </div>
    </div>
  );
}
