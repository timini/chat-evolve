import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../test-utils";
import { MetaCell } from "./MetaCell";

describe("MetaCell", () => {
  it("renders label and value", () => {
    renderWithTheme(<MetaCell label="TEMP" value="0.35" />);
    expect(screen.getByText("TEMP")).toBeInTheDocument();
    expect(screen.getByText("0.35")).toBeInTheDocument();
  });

  it("applies an accent colour to the value when provided", () => {
    renderWithTheme(<MetaCell label="MUT" value="0.58" accent="#2b6a36" />);
    expect(screen.getByText("0.58")).toHaveStyle({ color: "rgb(43, 106, 54)" });
  });
});
