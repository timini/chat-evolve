import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label and calls onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<Button onClick={onClick}>SPLICE → G3</Button>);
    await user.click(screen.getByRole("button", { name: /SPLICE → G3/ }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <Button onClick={onClick} disabled>
        LOCKED
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: /LOCKED/ }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a subtitle line when provided", () => {
    renderWithTheme(
      <Button subtitle="2 keep · 1 cut · μ 0.58">SPLICE → G3</Button>,
    );
    expect(screen.getByText("2 keep · 1 cut · μ 0.58")).toBeInTheDocument();
  });
});
