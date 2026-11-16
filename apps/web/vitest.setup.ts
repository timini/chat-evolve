import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { useEvolveStore } from "./store/useEvolveStore";

// Reset persisted store + storage between tests so they don't leak state.
beforeEach(() => {
  localStorage.clear();
  useEvolveStore.setState({
    theme: "ink",
    keys: {},
    prefs: {},
    session: { provider: null, model: null },
    entered: false,
    breeding: false,
    activeVariant: "A",
  });
});

afterEach(() => {
  cleanup();
});
