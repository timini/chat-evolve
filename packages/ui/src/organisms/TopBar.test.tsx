import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../test-utils";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("renders brand, prompt, and population", () => {
    renderWithTheme(<TopBar prompt="Cover letter opener" population="6 / 9" />);
    expect(screen.getByText("CHATEVOLVE")).toBeInTheDocument();
    expect(screen.getByText("SEQUENCE")).toBeInTheDocument();
    expect(screen.getByText("Cover letter opener")).toBeInTheDocument();
    expect(screen.getByText("6 / 9")).toBeInTheDocument();
  });

  it("renders a session chip slot", () => {
    renderWithTheme(<TopBar prompt="x" sessionChip={<button>SESSION</button>} />);
    expect(screen.getByRole("button", { name: "SESSION" })).toBeInTheDocument();
  });
});
