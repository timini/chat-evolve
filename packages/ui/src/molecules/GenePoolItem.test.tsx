import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../test-utils";
import { GenePoolItem } from "./GenePoolItem";

describe("GenePoolItem", () => {
  it("renders the source strand and text", () => {
    renderWithTheme(<GenePoolItem src="A" text="shipping payments tools at scale" kind="dominant" />);
    expect(screen.getByText("STRAND ·A")).toBeInTheDocument();
    expect(screen.getByText("shipping payments tools at scale")).toBeInTheDocument();
  });

  it("strikes through purged genes", () => {
    renderWithTheme(<GenePoolItem src="B" text="has only sharpened that" kind="purged" />);
    expect(screen.getByText("has only sharpened that")).toHaveStyle({
      textDecoration: "line-through",
    });
  });
});
