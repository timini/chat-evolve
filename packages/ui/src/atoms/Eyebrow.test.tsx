import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../test-utils";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders its text content", () => {
    renderWithTheme(<Eyebrow>Sequence</Eyebrow>);
    expect(screen.getByText("Sequence")).toBeInTheDocument();
  });

  it("renders as uppercase small-caps via CSS", () => {
    renderWithTheme(<Eyebrow>seq</Eyebrow>);
    expect(screen.getByText("seq")).toHaveStyle({ textTransform: "uppercase" });
  });

  it("uses the muted theme colour by default", () => {
    renderWithTheme(<Eyebrow>x</Eyebrow>);
    // ink theme muted
    expect(screen.getByText("x")).toHaveStyle({ color: "rgb(107, 102, 91)" });
  });

  it("applies a custom colour when provided", () => {
    renderWithTheme(<Eyebrow color="#2b6a36">dominant</Eyebrow>);
    expect(screen.getByText("dominant")).toHaveStyle({ color: "rgb(43, 106, 54)" });
  });
});
