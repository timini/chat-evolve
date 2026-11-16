import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { SplicePanel } from "./SplicePanel";
import type { PoolGene } from "../types";

const dominant: PoolGene[] = [
  { src: "A", text: "shipping payments tools at scale" },
  { src: "C", text: "Trust is the only feature that compounds." },
];
const purged: PoolGene[] = [{ src: "B", text: "has only sharpened that" }];

const baseProps = {
  mutation: 0.58,
  onMutationChange: () => {},
  dominant,
  purged,
  breeding: false,
  onBreed: () => {},
};

describe("SplicePanel", () => {
  it("shows dominant and purged gene counts", () => {
    renderWithTheme(<SplicePanel {...baseProps} />);
    expect(screen.getByTestId("dominant-count")).toHaveTextContent("2");
    expect(screen.getByTestId("purged-count")).toHaveTextContent("1");
  });

  it("renders the breed subtitle stats", () => {
    renderWithTheme(<SplicePanel {...baseProps} />);
    expect(screen.getByText("2 keep · 1 cut · μ 0.58")).toBeInTheDocument();
  });

  it("calls onBreed when the splice button is clicked", async () => {
    const onBreed = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<SplicePanel {...baseProps} onBreed={onBreed} />);
    await user.click(screen.getByRole("button", { name: /SPLICE → G3/ }));
    expect(onBreed).toHaveBeenCalledOnce();
  });

  it("shows the splicing label while breeding", () => {
    renderWithTheme(<SplicePanel {...baseProps} breeding />);
    expect(screen.getByText(/SPLICING/)).toBeInTheDocument();
  });
});
