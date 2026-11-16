import type { KeyboardEvent, MouseEvent } from "react";
import { useTheme } from "../theme";

export interface MutationScaleProps {
  /** Current value in [0, 1]. */
  value: number;
  onChange?: (value: number) => void;
  /** Keyboard step (default 0.05). */
  step?: number;
  compact?: boolean;
}

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Ticked scale that doubles as the mutation-rate slider. Pointer + keyboard. */
export function MutationScale({ value, onChange, step = 0.05, compact = false }: MutationScaleProps) {
  const t = useTheme();
  const ticks = 21;

  const handlePointer = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width <= 0) return;
    onChange?.(clamp((e.clientX - r.left) / r.width));
  };

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange?.(clamp(value + step));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange?.(clamp(value - step));
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span className="ce-mono" style={{ fontSize: 10, color: t.muted, letterSpacing: "0.12em" }}>
        MUTATION
      </span>
      <div
        role="slider"
        aria-label="Mutation rate"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={Number(value.toFixed(2))}
        tabIndex={0}
        onMouseDown={handlePointer}
        onKeyDown={handleKey}
        style={{
          position: "relative",
          height: compact ? 18 : 22,
          width: compact ? 160 : 220,
          borderTop: `1px solid ${t.border}`,
          borderBottom: `1px solid ${t.border}`,
          cursor: "ew-resize",
          userSelect: "none",
          outlineOffset: 2,
        }}
      >
        {Array.from({ length: ticks }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i / (ticks - 1)) * 100}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: i % 5 === 0 ? t.border : t.hairline,
              transform: "translateX(-0.5px)",
            }}
          />
        ))}
        <div
          data-testid="mutation-indicator"
          style={{
            position: "absolute",
            left: `${value * 100}%`,
            top: -3,
            bottom: -3,
            width: 2,
            background: t.ink,
            transform: "translateX(-1px)",
          }}
        />
      </div>
      <span
        className="ce-mono ce-tick"
        style={{ fontSize: 11, color: t.ink, minWidth: 36, textAlign: "right" }}
      >
        {value.toFixed(2)}
      </span>
    </div>
  );
}
