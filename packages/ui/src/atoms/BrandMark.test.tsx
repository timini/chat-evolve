import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../test-utils";
import { BrandMark } from "./BrandMark";

describe("BrandMark", () => {
  it("renders the wordmark", () => {
    renderWithTheme(<BrandMark />);
    expect(screen.getByText("CHATEVOLVE")).toBeInTheDocument();
  });

  it("renders version and variant label", () => {
    renderWithTheme(<BrandMark version="v0.4" variantLabel="HELIX" />);
    expect(screen.getByText("v0.4 · HELIX")).toBeInTheDocument();
  });
});
