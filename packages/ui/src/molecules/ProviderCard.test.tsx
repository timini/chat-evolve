import { describe, it, expect, vi } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { ProviderCard } from "./ProviderCard";
import { PROVIDERS } from "../content";
import type { ValidationResult } from "../types";

const anthropic = PROVIDERS.anthropic;
const VALID_KEY = "sk-ant-api03-abcdefghijklmnop";

function renderCard(overrides: Partial<React.ComponentProps<typeof ProviderCard>> = {}) {
  const props = {
    provider: anthropic,
    apiKey: "",
    preferredModel: anthropic.models[0]!.id,
    onSetKey: vi.fn(),
    onSetModel: vi.fn(),
    // Default: verification succeeds (no real network in tests).
    onVerify: vi.fn(async (): Promise<ValidationResult> => ({ valid: true })),
    ...overrides,
  };
  renderWithTheme(<ProviderCard {...props} />);
  return props;
}

describe("ProviderCard — header & model picker", () => {
  it("shows the provider name and a not-configured pill when no key", () => {
    renderCard();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("NOT CONFIGURED")).toBeInTheDocument();
  });

  it("shows configured + masked key when a key is set", () => {
    renderCard({ apiKey: VALID_KEY });
    expect(screen.getByText("CONFIGURED")).toBeInTheDocument();
    expect(screen.getByText(/STORED ·/)).toBeInTheDocument();
  });

  it("calls onSetModel when a model is picked", async () => {
    const user = userEvent.setup();
    const { onSetModel } = renderCard();
    await user.click(screen.getByRole("radio", { name: /Claude Haiku 4.5/ }));
    expect(onSetModel).toHaveBeenCalledWith("claude-haiku-4-5");
  });
});

describe("ProviderCard — format (offline) states", () => {
  it("EMPTY: no error, SAVE disabled", () => {
    renderCard();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SAVE/ })).toBeDisabled();
    expect(screen.getByLabelText("Anthropic API key")).toHaveAttribute("aria-invalid", "false");
  });

  it("INVALID (wrong prefix): error + aria-invalid, SAVE disabled", async () => {
    const user = userEvent.setup();
    renderCard();
    const input = screen.getByLabelText("Anthropic API key");
    await user.type(input, "pk-wrong-1234567890");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(/sk-ant-/);
    expect(screen.getByRole("button", { name: /SAVE/ })).toBeDisabled();
  });

  it("INVALID (too short): 'too short' error", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.type(screen.getByLabelText("Anthropic API key"), "sk-ant-12");
    expect(screen.getByRole("alert")).toHaveTextContent(/short/i);
    expect(screen.getByRole("button", { name: /SAVE/ })).toBeDisabled();
  });

  it("VALID format: no error, SAVE enabled", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.type(screen.getByLabelText("Anthropic API key"), VALID_KEY);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SAVE/ })).toBeEnabled();
  });
});

describe("ProviderCard — live verification on save", () => {
  it("verifies then stores the key on success (Enter)", async () => {
    const user = userEvent.setup();
    const { onSetKey, onVerify } = renderCard();
    await user.type(screen.getByLabelText("Anthropic API key"), `${VALID_KEY}{Enter}`);
    await waitFor(() => expect(onSetKey).toHaveBeenCalledWith(VALID_KEY));
    expect(onVerify).toHaveBeenCalledWith(anthropic, VALID_KEY);
  });

  it("verifies then stores the key via the SAVE button", async () => {
    const user = userEvent.setup();
    const { onSetKey } = renderCard();
    await user.type(screen.getByLabelText("Anthropic API key"), VALID_KEY);
    await user.click(screen.getByRole("button", { name: /SAVE/ }));
    await waitFor(() => expect(onSetKey).toHaveBeenCalledWith(VALID_KEY));
  });

  it("shows a CHECKING… state while verification is in flight", async () => {
    const user = userEvent.setup();
    let resolve!: (v: ValidationResult) => void;
    const onVerify = vi.fn(() => new Promise<ValidationResult>((r) => (resolve = r)));
    const { onSetKey } = renderCard({ onVerify });
    await user.type(screen.getByLabelText("Anthropic API key"), `${VALID_KEY}{Enter}`);
    expect(await screen.findByRole("button", { name: /CHECKING/ })).toBeInTheDocument();
    expect(onSetKey).not.toHaveBeenCalled();
    await act(async () => resolve({ valid: true }));
    await waitFor(() => expect(onSetKey).toHaveBeenCalledWith(VALID_KEY));
  });

  it("REJECTED: shows the provider error and does NOT store the key", async () => {
    const user = userEvent.setup();
    const onVerify = vi.fn(async (): Promise<ValidationResult> => ({
      valid: false,
      error: "Invalid Anthropic API key.",
    }));
    const { onSetKey } = renderCard({ onVerify });
    await user.type(screen.getByLabelText("Anthropic API key"), `${VALID_KEY}{Enter}`);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid Anthropic API key."),
    );
    expect(onSetKey).not.toHaveBeenCalled();
  });

  it("clears a rejection error when the user edits the key again", async () => {
    const user = userEvent.setup();
    const onVerify = vi.fn(async (): Promise<ValidationResult> => ({ valid: false, error: "nope" }));
    renderCard({ onVerify });
    const input = screen.getByLabelText("Anthropic API key");
    await user.type(input, `${VALID_KEY}{Enter}`);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("nope"));
    await user.type(input, "x");
    expect(screen.queryByText(/nope/)).not.toBeInTheDocument();
  });

  it("does NOT verify a wrong-format key on Enter", async () => {
    const user = userEvent.setup();
    const { onVerify, onSetKey } = renderCard();
    await user.type(screen.getByLabelText("Anthropic API key"), "pk-bad-1234567890{Enter}");
    expect(onVerify).not.toHaveBeenCalled();
    expect(onSetKey).not.toHaveBeenCalled();
  });

  it("does NOT verify or save on blur (network reserved for explicit save)", async () => {
    const user = userEvent.setup();
    const { onVerify, onSetKey } = renderCard();
    await user.type(screen.getByLabelText("Anthropic API key"), VALID_KEY);
    await user.tab();
    expect(onVerify).not.toHaveBeenCalled();
    expect(onSetKey).not.toHaveBeenCalled();
  });

  it("trims whitespace before verifying and storing", async () => {
    const user = userEvent.setup();
    const { onVerify, onSetKey } = renderCard();
    await user.type(screen.getByLabelText("Anthropic API key"), `  ${VALID_KEY}  {Enter}`);
    await waitFor(() => expect(onSetKey).toHaveBeenCalledWith(VALID_KEY));
    expect(onVerify).toHaveBeenCalledWith(anthropic, VALID_KEY);
  });
});

describe("ProviderCard — configured key management", () => {
  it("toggles key visibility with SHOW/HIDE", async () => {
    const user = userEvent.setup();
    renderCard({ apiKey: VALID_KEY });
    const input = screen.getByLabelText("Anthropic API key");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "SHOW" }));
    expect(input).toHaveAttribute("type", "text");
  });

  it("clears a stored key when CLEAR is clicked", async () => {
    const user = userEvent.setup();
    const { onSetKey } = renderCard({ apiKey: VALID_KEY });
    await user.click(screen.getByRole("button", { name: "CLEAR" }));
    expect(onSetKey).toHaveBeenCalledWith("");
  });

  it("a freshly-loaded stored key shows no error", () => {
    renderCard({ apiKey: VALID_KEY });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("editing a stored key to empty clears it on blur", async () => {
    const user = userEvent.setup();
    const { onSetKey } = renderCard({ apiKey: VALID_KEY });
    const input = screen.getByLabelText("Anthropic API key");
    await user.clear(input);
    await user.tab();
    expect(onSetKey).toHaveBeenCalledWith("");
  });
});
