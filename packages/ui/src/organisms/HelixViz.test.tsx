import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { HelixViz } from "./HelixViz";

const base = {
  activeVariant: "A" as const,
  onSelectVariant: () => {},
  mutation: 0.58,
  breeding: false,
  animated: false,
};

describe("HelixViz", () => {
  it("renders the three generation columns", () => {
    renderWithTheme(<HelixViz {...base} />);
    expect(screen.getByText("G1")).toBeInTheDocument();
    expect(screen.getByText("G2")).toBeInTheDocument();
    expect(screen.getByText("G3")).toBeInTheDocument();
  });

  it("renders selectable strand nodes for the current generation", async () => {
    const onSelectVariant = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<HelixViz {...base} onSelectVariant={onSelectVariant} />);
    await user.click(screen.getByRole("button", { name: "select strand B" }));
    expect(onSelectVariant).toHaveBeenCalledWith("B");
  });

  it("shows the breeding status on G3 while breeding", () => {
    renderWithTheme(<HelixViz {...base} breeding />);
    expect(screen.getByText("▌ BREEDING")).toBeInTheDocument();
  });
});
