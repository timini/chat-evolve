import type { ReactNode } from "react";
import { useTheme } from "../theme";

export type ButtonVariant = "primary" | "outline";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  /** Smaller secondary line under the main label (e.g. breed stats). */
  subtitle?: ReactNode;
  /** Override the primary background (e.g. dominant green while breeding). */
  activeColor?: string;
  fullWidth?: boolean;
  align?: "left" | "center";
}

/** Hard-edged monospace button. The workbench's primary action surface. */
export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  subtitle,
  activeColor,
  fullWidth = false,
  align = "center",
}: ButtonProps) {
  const t = useTheme();
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled
          ? "transparent"
          : isPrimary
            ? (activeColor ?? t.ink)
            : "transparent",
        color: disabled ? t.muted : isPrimary ? t.paper : t.ink,
        border: `1px solid ${t.border}`,
        padding: subtitle ? "12px 18px" : "10px 16px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        fontSize: 13,
        letterSpacing: "0.16em",
        fontWeight: 600,
        textAlign: align,
        width: fullWidth ? "100%" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "center",
        gap: 2,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <span>{children}</span>
      {subtitle != null && (
        <span style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.7, fontWeight: 400 }}>
          {subtitle}
        </span>
      )}
    </button>
  );
}
