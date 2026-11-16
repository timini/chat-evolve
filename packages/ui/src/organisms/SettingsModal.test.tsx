import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { SettingsModal } from "./SettingsModal";

const baseProps = {
  keys: { anthropic: "sk-ant-EXAMPLE" },
  preferredModels: {},
  onSetKey: () => {},
  onSetModel: () => {},
  onClearAll: () => {},
  onClose: () => {},
};

describe("SettingsModal", () => {
  it("renders as a dialog with all four provider cards", () => {
    renderWithTheme(<SettingsModal {...baseProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("DeepSeek")).toBeInTheDocument();
  });

  it("calls onClose from the close button", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<SettingsModal {...baseProps} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Close settings" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClearAll from the CLEAR ALL button", async () => {
    const onClearAll = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<SettingsModal {...baseProps} onClearAll={onClearAll} />);
    await user.click(screen.getByRole("button", { name: "CLEAR ALL" }));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<SettingsModal {...baseProps} onClose={onClose} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });
});
