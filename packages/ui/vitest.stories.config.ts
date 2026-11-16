import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";

// Story tests: runs every *.stories play function as a real test in a headless
// browser (Playwright/Chromium). This is the "tested in Storybook" layer —
// organisms and pages are verified through their stories.
export default defineConfig({
  plugins: [
    react(),
    storybookTest({ configDir: ".storybook" }),
  ],
  test: {
    name: "storybook",
    setupFiles: ["./.storybook/vitest.setup.ts"],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      name: "chromium",
    },
  },
});
