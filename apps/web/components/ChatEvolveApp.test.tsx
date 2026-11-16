import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatEvolveApp } from "./ChatEvolveApp";

describe("ChatEvolveApp gate flow", () => {
  beforeEach(() => {
    // The setup gate verifies keys against the provider; stub fetch to accept.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 200 })),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shows the BYO-key setup gate when no keys are configured", async () => {
    render(<ChatEvolveApp />);
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Bring your own key." })).toBeInTheDocument(),
    );
  });

  it("unlocks the helix workbench after a key is added and evolution begins", async () => {
    const user = userEvent.setup();
    render(<ChatEvolveApp />);

    // Add an Anthropic key.
    const input = await screen.findByLabelText("Anthropic API key");
    await user.type(input, "sk-ant-api03-abcdefghijklmnop{Enter}");

    // Begin evolution.
    const begin = await screen.findByRole("button", { name: /BEGIN EVOLUTION/ });
    await user.click(begin);

    // Workbench chrome appears (SEQUENCE eyebrow + helix viz).
    await waitFor(() => expect(screen.getByText("SEQUENCE")).toBeInTheDocument());
    expect(screen.getByRole("img", { name: /DNA helix/ })).toBeInTheDocument();
    expect(screen.getByText("Anthropic · Claude Sonnet 4.5")).toBeInTheDocument();
  });
});
