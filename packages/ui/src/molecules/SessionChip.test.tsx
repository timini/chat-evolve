import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { SessionChip } from "./SessionChip";
import type { Session } from "../types";

const session: Session = { provider: "anthropic", model: "claude-sonnet-4-5" };

describe("SessionChip", () => {
  it("renders nothing when no provider is active", () => {
    const { container } = renderWithTheme(
      <SessionChip
        session={{ provider: null, model: null }}
        configured={[]}
        onSwitch={() => {}}
        onOpenSettings={() => {}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the active provider and model", () => {
    renderWithTheme(
      <SessionChip session={session} configured={["anthropic"]} onSwitch={() => {}} onOpenSettings={() => {}} />,
    );
    expect(screen.getByText("Anthropic · Claude Sonnet 4.5")).toBeInTheDocument();
  });

  it("opens the switcher and switches session for a configured provider", async () => {
    const onSwitch = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <SessionChip
        session={session}
        configured={["anthropic", "openai"]}
        onSwitch={onSwitch}
        onOpenSettings={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { expanded: false }));
    await user.click(screen.getByRole("menuitem", { name: /GPT-5 mini/ }));
    expect(onSwitch).toHaveBeenCalledWith("openai", "gpt-5-mini");
  });

  it("disables models of providers without a key", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SessionChip session={session} configured={["anthropic"]} onSwitch={() => {}} onOpenSettings={() => {}} />,
    );
    await user.click(screen.getByRole("button", { expanded: false }));
    expect(screen.getByRole("menuitem", { name: /DeepSeek V3/ })).toBeDisabled();
  });

  it("calls onOpenSettings from the KEYS button", async () => {
    const onOpenSettings = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <SessionChip session={session} configured={["anthropic"]} onSwitch={() => {}} onOpenSettings={onOpenSettings} />,
    );
    await user.click(screen.getByRole("button", { name: "KEYS" }));
    expect(onOpenSettings).toHaveBeenCalledOnce();
  });
});
