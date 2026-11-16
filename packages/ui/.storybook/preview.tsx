import React from "react";
import type { Preview, Decorator } from "@storybook/react";
import { ThemeProvider } from "../src/theme";
import { THEMES, type ThemeName } from "../src/theme/themes";

// Every story renders inside a ThemeProvider so components can read the theme
// from context, and on the themed paper background to match the design.
const withTheme: Decorator = (Story, context) => {
  const name = (context.globals.theme ?? "ink") as ThemeName;
  const theme = THEMES[name];
  return (
    <ThemeProvider theme={name}>
      <div
        style={{
          background: theme.paper,
          color: theme.ink,
          padding: 24,
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Color palette",
      defaultValue: "ink",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: Object.keys(THEMES).map((k) => ({ value: k, title: k })),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
