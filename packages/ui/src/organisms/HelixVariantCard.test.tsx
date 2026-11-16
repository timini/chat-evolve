import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { HelixVariantCard } from "./HelixVariantCard";
import { G2, sentencesOf } from "../content";

const variant = G2.variants[0]!; // strand A

describe("HelixVariantCard", () => {
  it("renders the strand id, role, and temperature", () => {
    renderWithTheme(
      <HelixVariantCard variant={variant} marks={{}} onCycle={() => {}} isActive={false} onSelect={() => {}} />,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("ANCHOR")).toBeInTheDocument();
    expect(screen.getByText("0.35")).toBeInTheDocument();
  });

  it("renders one row per sentence", () => {
    renderWithTheme(
      <HelixVariantCard variant={variant} marks={{}} onCycle={() => {}} isActive={false} onSelect={() => {}} />,
    );
    const rows = screen.getAllByLabelText(/^sentence \d+$/);
    expect(rows).toHaveLength(sentencesOf(variant.text).length);
  });

  it("calls onCycle with the sentence index when a row is clicked", async () => {
    const onCycle = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <HelixVariantCard variant={variant} marks={{}} onCycle={onCycle} isActive={false} onSelect={() => {}} />,
    );
    await user.click(screen.getByLabelText("sentence 2"));
    expect(onCycle).toHaveBeenCalledWith(1);
  });

  it("calls onSelect when the card is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { container } = renderWithTheme(
      <HelixVariantCard variant={variant} marks={{}} onCycle={() => {}} isActive={false} onSelect={onSelect} />,
    );
    await user.click(container.firstElementChild as Element);
    expect(onSelect).toHaveBeenCalled();
  });

  it("reflects active state via data-active", () => {
    const { container } = renderWithTheme(
      <HelixVariantCard variant={variant} marks={{}} onCycle={() => {}} isActive onSelect={() => {}} />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-active", "true");
  });
});
