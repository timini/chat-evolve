import { type ReactNode, useMemo } from "react";
import { useTheme, themeVars } from "../theme";
import { genePools, PROMPT } from "../content";
import type { Generation, VariantId, VariantMarks } from "../types";
import { TopBar } from "../organisms/TopBar";
import { HelixViz } from "../organisms/HelixViz";
import { HelixVariantCard } from "../organisms/HelixVariantCard";
import { SplicePanel } from "../organisms/SplicePanel";

export interface HelixPageProps {
  generation: Generation;
  marks: VariantMarks;
  onCycle: (variantId: VariantId, sentenceIndex: number) => void;
  activeVariant: VariantId;
  onSelectVariant: (id: VariantId) => void;
  mutation: number;
  onMutationChange: (value: number) => void;
  breeding: boolean;
  onBreed: () => void;
  prompt?: string;
  population?: string;
  sessionChip?: ReactNode;
  /** Drives the helix idle animation (disable in tests). */
  animated?: boolean;
}

/** The full Helix workbench: chrome + helix viz + strand cards + splice rail. */
export function HelixPage({
  generation,
  marks,
  onCycle,
  activeVariant,
  onSelectVariant,
  mutation,
  onMutationChange,
  breeding,
  onBreed,
  prompt = PROMPT,
  population = "6 / 9",
  sessionChip,
  animated = true,
}: HelixPageProps) {
  const t = useTheme();
  const pools = useMemo(() => genePools(generation, marks), [generation, marks]);

  return (
    <div
      className="ce"
      style={{
        ...themeVars(t),
        background: t.paper,
        color: t.ink,
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gridTemplateRows: "44px 380px 1fr",
        overflow: "hidden",
      }}
    >
      {/* Top bar spans full width */}
      <div style={{ gridColumn: "1 / -1" }}>
        <TopBar variantLabel="HELIX" prompt={prompt} population={population} sessionChip={sessionChip} />
      </div>

      {/* Helix viz */}
      <div style={{ gridColumn: 1, gridRow: 2, minHeight: 0 }}>
        <HelixViz
          activeVariant={activeVariant}
          onSelectVariant={onSelectVariant}
          mutation={mutation}
          breeding={breeding}
          animated={animated}
        />
      </div>

      {/* Variant cards */}
      <div
        style={{
          gridColumn: 1,
          gridRow: 3,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          padding: 16,
          background: t.paper,
          minHeight: 0,
        }}
      >
        {generation.variants.map((v, i) => (
          <div key={v.id} style={{ marginLeft: i === 0 ? 0 : -1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <HelixVariantCard
              variant={v}
              marks={marks[v.id] ?? {}}
              onCycle={(sentenceIndex) => onCycle(v.id, sentenceIndex)}
              isActive={activeVariant === v.id}
              onSelect={() => onSelectVariant(v.id)}
            />
          </div>
        ))}
      </div>

      {/* Splice rail spans viz + cards rows */}
      <div style={{ gridColumn: 2, gridRow: "2 / 4", minHeight: 0 }}>
        <SplicePanel
          mutation={mutation}
          onMutationChange={onMutationChange}
          dominant={pools.dominant}
          purged={pools.purged}
          breeding={breeding}
          onBreed={onBreed}
        />
      </div>
    </div>
  );
}
