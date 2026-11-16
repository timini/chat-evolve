import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { MutationScale } from "./MutationScale";

describe("MutationScale", () => {
  it("renders the label and the formatted value", () => {
    renderWithTheme(<MutationScale value={0.58} />);
    expect(screen.getByText("MUTATION")).toBeInTheDocument();
    expect(screen.getByText("0.58")).toBeInTheDocument();
  });

  it("exposes slider semantics", () => {
    renderWithTheme(<MutationScale value={0.5} />);
    const slider = screen.getByRole("slider", { name: "Mutation rate" });
    expect(slider).toHaveAttribute("aria-valuenow", "0.5");
  });

  it("increments on ArrowRight and clamps at 1", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<MutationScale value={0.98} step={0.05} onChange={onChange} />);
    const slider = screen.getByRole("slider", { name: "Mutation rate" });
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("decrements on ArrowLeft and clamps at 0", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<MutationScale value={0.02} step={0.05} onChange={onChange} />);
    const slider = screen.getByRole("slider", { name: "Mutation rate" });
    slider.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith(0);
  });
});
