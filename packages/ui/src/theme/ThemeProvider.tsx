import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { THEMES, DEFAULT_THEME, type Theme, type ThemeName } from "./themes";
import { injectBaseStyles } from "./baseStyles";

const ThemeContext = createContext<Theme>(THEMES[DEFAULT_THEME]);

/** Read the active theme object from context. */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/**
 * The CSS custom properties the `.ce-dominant` / `.ce-purged` utility classes
 * depend on. Spread onto any container that wraps themed content.
 */
export function themeVars(theme: Theme): CSSProperties {
  return {
    ["--ce-dominant-fill" as string]: theme.dominantFill,
    ["--ce-dominant" as string]: theme.dominant,
    ["--ce-purged-fill" as string]: theme.purgedFill,
    ["--ce-purged" as string]: theme.purged,
    ["--ce-muted" as string]: theme.muted,
  };
}

export interface ThemeProviderProps {
  /** Theme name (looked up in THEMES) or a full Theme object. Defaults to `ink`. */
  theme?: ThemeName | Theme;
  children: ReactNode;
}

export function ThemeProvider({ theme = DEFAULT_THEME, children }: ThemeProviderProps) {
  useEffect(() => {
    injectBaseStyles();
  }, []);

  const resolved = useMemo<Theme>(
    () => (typeof theme === "string" ? THEMES[theme] : theme),
    [theme],
  );

  return <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>;
}
