import { useTheme } from "../theme";
import type { PoolGene } from "../types";
import { Eyebrow } from "../atoms/Eyebrow";
import { MutationScale } from "../atoms/MutationScale";
import { Button } from "../atoms/Button";
import { GenePoolItem } from "../molecules/GenePoolItem";

export interface SplicePanelProps {
  /** Heading describing the cross, e.g. "G2 → G3 · F2 cross". */
  crossLabel?: string;
  mutation: number;
  onMutationChange: (value: number) => void;
  dominant: PoolGene[];
  purged: PoolGene[];
  breeding: boolean;
  onBreed: () => void;
}

/** The right rail: splice payload, mutation rate, gene pools, and breed action. */
export function SplicePanel({
  crossLabel = "G2 → G3 · F2 cross",
  mutation,
  onMutationChange,
  dominant,
  purged,
  breeding,
  onBreed,
}: SplicePanelProps) {
  const t = useTheme();
  const tauMax = (0.3 + mutation * 1.0).toFixed(2);

  return (
    <div
      style={{
        borderLeft: `1px solid ${t.border}`,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
        background: t.paper,
      }}
    >
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}` }}>
        <Eyebrow>SPLICE PAYLOAD</Eyebrow>
        <div style={{ marginTop: 4, fontSize: 13.5, fontWeight: 600 }}>{crossLabel}</div>
      </div>

      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}` }}>
        <Eyebrow>MUTATION RATE</Eyebrow>
        <div style={{ marginTop: 10 }}>
          <MutationScale value={mutation} onChange={onMutationChange} />
        </div>
        <div className="ce-mono" style={{ marginTop: 8, fontSize: 10.5, color: t.muted }}>
          τ ∈ [0.30, {tauMax}]
        </div>
      </div>

      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1px solid ${t.hairline}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Eyebrow color={t.dominant}>▲ DOMINANT GENES</Eyebrow>
        <span className="ce-mono ce-tick" style={{ fontSize: 11, color: t.dominant }} data-testid="dominant-count">
          {dominant.length}
        </span>
      </div>

      <div style={{ overflow: "auto", flex: 1, padding: "0 16px", minHeight: 0 }}>
        {dominant.map((g, i) => (
          <GenePoolItem key={`d${i}`} src={g.src} text={g.text} kind="dominant" />
        ))}
        <div
          style={{
            padding: "14px 0 6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Eyebrow color={t.purged}>▼ PURGED GENES</Eyebrow>
          <span className="ce-mono ce-tick" style={{ fontSize: 11, color: t.purged }} data-testid="purged-count">
            {purged.length}
          </span>
        </div>
        {purged.map((g, i) => (
          <GenePoolItem key={`p${i}`} src={g.src} text={g.text} kind="purged" />
        ))}
      </div>

      <Button
        onClick={onBreed}
        activeColor={breeding ? t.dominant : t.ink}
        fullWidth
        align="left"
        subtitle={`${dominant.length} keep · ${purged.length} cut · μ ${mutation.toFixed(2)}`}
      >
        {breeding ? "▌ SPLICING..." : "SPLICE → G3"}
      </Button>
    </div>
  );
}
