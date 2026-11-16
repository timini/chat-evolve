import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { SetupPage } from "./SetupPage";

const baseProps = {
  keys: {},
  preferredModels: {},
  session: { provider: null, model: null },
  onSetKey: () => {},
  onSetModel: () => {},
  onBegin: () => {},
};

describe("SetupPage", () => {
  it("shows the BYO-key headline and all providers", () => {
    renderWithTheme(<SetupPage {...baseProps} />);
    expect(screen.getByRole("heading", { name: "Bring your own key." })).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("DeepSeek")).toBeInTheDocument();
  });

  it("locks the begin button when no keys are configured", () => {
    renderWithTheme(<SetupPage {...baseProps} />);
    expect(screen.getByRole("button", { name: /LOCKED/ })).toBeDisabled();
  });

  it("enables begin and fires onBegin once a key exists", async () => {
    const onBegin = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <SetupPage
        {...baseProps}
        keys={{ anthropic: "sk-ant-EXAMPLE" }}
        session={{ provider: "anthropic", model: "claude-sonnet-4-5" }}
        onBegin={onBegin}
      />,
    );
    const begin = screen.getByRole("button", { name: /BEGIN EVOLUTION/ });
    expect(begin).toBeEnabled();
    await user.click(begin);
    expect(onBegin).toHaveBeenCalledOnce();
  });
});
