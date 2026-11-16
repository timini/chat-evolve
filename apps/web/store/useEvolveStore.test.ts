import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useEvolveStore, selectConfigured, selectHasAnyKey } from "./useEvolveStore";

const get = () => useEvolveStore.getState();

describe("useEvolveStore — BYO keys & session", () => {
  beforeEach(() => {
    act(() => get().clearAllKeys());
  });

  it("adopts the first configured provider as the active session", () => {
    act(() => get().setKey("anthropic", "sk-ant-123"));
    expect(get().session).toEqual({ provider: "anthropic", model: "claude-sonnet-4-5" });
    expect(selectHasAnyKey(get())).toBe(true);
    expect(selectConfigured(get())).toEqual(["anthropic"]);
  });

  it("falls back to another provider when the active key is cleared", () => {
    act(() => {
      get().setKey("anthropic", "sk-ant-123");
      get().setKey("openai", "sk-proj-456");
    });
    expect(get().session.provider).toBe("anthropic");
    act(() => get().setKey("anthropic", ""));
    expect(get().session.provider).toBe("openai");
  });

  it("resets to a null session when the last key is cleared", () => {
    act(() => get().setKey("google", "AIza-789"));
    act(() => get().setKey("google", ""));
    expect(get().session).toEqual({ provider: null, model: null });
    expect(selectHasAnyKey(get())).toBe(false);
  });

  it("updates the session model when changing the active provider's preferred model", () => {
    act(() => {
      get().setKey("anthropic", "sk-ant-123");
      get().setPreferredModel("anthropic", "claude-haiku-4-5");
    });
    expect(get().session.model).toBe("claude-haiku-4-5");
  });

  it("clearAllKeys wipes keys, session, and the entered gate", () => {
    act(() => {
      get().setKey("anthropic", "sk-ant-123");
      get().begin();
    });
    expect(get().entered).toBe(true);
    act(() => get().clearAllKeys());
    expect(get().keys).toEqual({});
    expect(get().entered).toBe(false);
  });
});

describe("useEvolveStore — evolution marks", () => {
  beforeEach(() => {
    act(() => useEvolveStore.setState({ marks: { A: {}, B: {}, C: {} } }));
  });

  it("cycles a sentence none → dominant → purged → none", () => {
    act(() => get().cycleSentence("A", 0));
    expect(get().marks.A?.[0]).toBe("dominant");
    act(() => get().cycleSentence("A", 0));
    expect(get().marks.A?.[0]).toBe("purged");
    act(() => get().cycleSentence("A", 0));
    expect(get().marks.A?.[0]).toBeUndefined();
  });

  it("tracks the active variant and mutation rate", () => {
    act(() => {
      get().setActiveVariant("C");
      get().setMutation(0.81);
    });
    expect(get().activeVariant).toBe("C");
    expect(get().mutation).toBe(0.81);
  });
});
