import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Unit / component tests (jsdom). This is the fast, always-available TDD layer.
export default defineConfig({
  plugins: [react()],
  test: {
    name: "unit",
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
