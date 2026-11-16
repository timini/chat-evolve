import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { CodonGlyph } from "./CodonGlyph";
import { codonForIndex } from "../content";

describe("CodonGlyph", () => {
  it("renders the deterministic base letter for the seed + index", () => {
    const expected = codonForIndex("A", 2);
    renderWithTheme(<CodonGlyph seed="A" index={2} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
    expect(["A", "T", "G", "C"]).toContain(expected);
  });

  it("calls onClick when clickable", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<CodonGlyph seed="B" index={0} onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("reflects the dominant state with a filled background", () => {
    renderWithTheme(<CodonGlyph seed="C" index={1} state="dominant" onClick={() => {}} />);
    const el = screen.getByRole("button");
    expect(el).toHaveStyle({ background: "rgb(43, 106, 54)" }); // ink theme dominant
    expect(el).toHaveAttribute("aria-pressed", "true");
  });

  it("is not a button when not clickable", () => {
    renderWithTheme(<CodonGlyph seed="A" index={0} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
