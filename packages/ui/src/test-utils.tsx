import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "./theme";
import type { ThemeName } from "./theme/themes";

/** Render a component inside the ThemeProvider, the way the app always uses it. */
export function renderWithTheme(
  ui: ReactElement,
  options: { theme?: ThemeName } & Omit<RenderOptions, "wrapper"> = {},
) {
  const { theme = "ink", ...rest } = options;
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, rest);
}
