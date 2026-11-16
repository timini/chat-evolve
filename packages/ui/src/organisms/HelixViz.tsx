import { useEffect, useState } from "react";
import { useTheme } from "../theme";
import type { Theme } from "../theme/themes";
import type { VariantId } from "../types";

export interface HelixVizProps {
  activeVariant: VariantId;
  onSelectVariant: (id: VariantId) => void;
  mutation: number;
  breeding: boolean;
  /** Drives the idle rotation. Disable in tests / reduced-motion. */
  animated?: boolean;
}

const W = 1140;
const H = 360;
const PAD_X = 100;
const STRAND_Y = [80, 160, 240];
const STRAND_IDS: VariantId[] = ["A", "B", "C"];
const AMP = 36;
const FREQ = 1.6;

function GenColumn({
  x,
  label,
  sublabel,
  status,
  theme,
  isActive,
}: {
  x: number;
  label: string;
  sublabel: string;
  status: string;
  theme: Theme;
  isActive: boolean;
}) {
  return (
    <g transform={`translate(${x},0)`}>
      <line x1={0} x2={0} y1={20} y2={320} stroke={theme.hairline} strokeDasharray="3 4" />
      <rect
        x={-30}
        y={-2}
        width={60}
        height={16}
        fill={isActive ? theme.ink : theme.panel}
        stroke={theme.ink}
        strokeWidth={1}
      />
      <text
        x={0}
        y={9}
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize={9}
        letterSpacing="0.16em"
        fontWeight={600}
        fill={isActive ? theme.paper : theme.ink}
      >
        {label}
      </text>
      <text x={0} y={332} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={9} letterSpacing="0.14em" fill={theme.muted}>
        {sublabel}
      </text>
      <text x={0} y={344} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={8} letterSpacing="0.14em" fill={theme.muted}>
        {status}
      </text>
    </g>
  );
}

/** The animated triple-strand DNA helix across G1 → G2 → G3. */
export function HelixViz({ activeVariant, onSelectVariant, mutation, breeding, animated = true }: HelixVizProps) {
  const t = useTheme();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!animated) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      setPhase(((now - start) / 4500) * Math.PI * 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  const colXs = [PAD_X + 80, W / 2, W - PAD_X - 80];

  const strandPath = (baseY: number, offset: number) => {
    const pts: string[] = [];
    for (let x = 30; x <= W - 30; x += 6) {
      const tNorm = (x - PAD_X) / (W - PAD_X * 2);
      const y = baseY + Math.sin(tNorm * Math.PI * 2 * FREQ + phase + offset) * AMP;
      pts.push(`${x},${y.toFixed(2)}`);
    }
    return "M " + pts.join(" L ");
  };

  const rungs: { x1: number; y1: number; x2: number; y2: number; gi: number }[] = [];
  colXs.forEach((cx, gi) => {
    const tNorm = (cx - PAD_X) / (W - PAD_X * 2);
    const ys = STRAND_Y.map((b, i) => b + Math.sin(tNorm * Math.PI * 2 * FREQ + phase + i * 1.4) * AMP);
    rungs.push({ x1: cx, y1: ys[0]!, x2: cx, y2: ys[1]!, gi });
    rungs.push({ x1: cx, y1: ys[1]!, x2: cx, y2: ys[2]!, gi });
  });

  return (
    <div
      style={{
        borderBottom: `1px solid ${t.border}`,
        position: "relative",
        overflow: "hidden",
        background: t.paper,
        height: "100%",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%" role="img" aria-label="DNA helix across generations">
        {STRAND_Y.map((y, i) => (
          <line key={i} x1={30} x2={W - 30} y1={y} y2={y} stroke={t.hairline} />
        ))}

        <GenColumn x={colXs[0]!} label="G1" sublabel="GENESIS" status="ARCHIVED" theme={t} isActive={false} />
        <GenColumn x={colXs[1]!} label="G2" sublabel="F1 · 06 GENES" status="◼ CURRENT" theme={t} isActive />
        <GenColumn
          x={colXs[2]!}
          label="G3"
          sublabel={breeding ? "INCUBATING" : "PROJECTED"}
          status={breeding ? "▌ BREEDING" : "PENDING"}
          theme={t}
          isActive={false}
        />

        {rungs.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            x2={r.x2}
            y1={r.y1}
            y2={r.y2}
            stroke={r.gi === 1 ? t.ink : t.hairline}
            strokeWidth={r.gi === 1 ? 1.2 : 1}
            strokeDasharray={r.gi === 1 ? "none" : "2 3"}
          />
        ))}

        {STRAND_Y.map((y, i) => (
          <path key={i} d={strandPath(y, i * 1.4)} fill="none" stroke={t.ink} strokeWidth={1.5} opacity={0.85} />
        ))}

        {STRAND_Y.map((y, si) =>
          colXs.map((cx, gi) => {
            const tNorm = (cx - PAD_X) / (W - PAD_X * 2);
            const ny = y + Math.sin(tNorm * Math.PI * 2 * FREQ + phase + si * 1.4) * AMP;
            const isCurrent = gi === 1;
            const isFuture = gi === 2;
            const id = STRAND_IDS[si]!;
            const isActiveStrand = isCurrent && id === activeVariant;
            return (
              <g
                key={`${si}-${gi}`}
                role={isCurrent ? "button" : undefined}
                aria-label={isCurrent ? `select strand ${id}` : undefined}
                style={{ cursor: isCurrent ? "pointer" : "default" }}
                onClick={() => isCurrent && onSelectVariant(id)}
              >
                <rect
                  x={cx - 14}
                  y={ny - 11}
                  width={28}
                  height={22}
                  fill={isFuture ? t.paper : isActiveStrand ? t.ink : t.panel}
                  stroke={t.ink}
                  strokeWidth={isActiveStrand ? 2 : 1}
                  strokeDasharray={isFuture ? "3 3" : "none"}
                />
                <text
                  x={cx}
                  y={ny + 4}
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize={11}
                  fontWeight={700}
                  fill={isActiveStrand ? t.paper : t.muted}
                  opacity={isFuture ? 0.6 : 1}
                  style={{ pointerEvents: "none" }}
                >
                  {id}
                </text>
              </g>
            );
          }),
        )}

        <g transform={`translate(${PAD_X}, ${H - 12})`}>
          <line x1={0} x2={W - PAD_X * 2} y1={0} y2={0} stroke={t.ink} />
          <text x={0} y={-6} fontFamily="IBM Plex Mono, monospace" fontSize={9} letterSpacing="0.16em" fill={t.muted}>
            MUTATION τ-RANGE
          </text>
          <line
            x1={mutation * (W - PAD_X * 2)}
            x2={mutation * (W - PAD_X * 2)}
            y1={-4}
            y2={4}
            stroke={t.ink}
            strokeWidth={2}
          />
        </g>
      </svg>
    </div>
  );
}
