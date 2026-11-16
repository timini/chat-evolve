import { useTheme } from "../theme";

export interface BrandMarkProps {
  /** Variant subtitle shown after the version, e.g. "HELIX". */
  variantLabel?: string;
  version?: string;
}

/** The ChatEvolve wordmark: a stylised DNA-ellipse glyph + name + version tag. */
export function BrandMark({ variantLabel, version = "v0.4" }: BrandMarkProps) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        aria-hidden
        style={{
          width: 16,
          height: 16,
          border: `1.5px solid ${t.ink}`,
          borderRadius: "50%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -2,
            border: `1.5px solid ${t.ink}`,
            borderRadius: "50%",
            transform: "rotate(35deg) scale(1.05, 0.45)",
          }}
        />
      </div>
      <span style={{ fontWeight: 600, letterSpacing: "0.04em", fontSize: 14 }}>CHATEVOLVE</span>
      <span
        className="ce-mono"
        style={{ fontSize: 9.5, color: t.muted, letterSpacing: "0.14em", marginLeft: 4 }}
      >
        {version}
        {variantLabel ? ` · ${variantLabel}` : ""}
      </span>
    </div>
  );
}
