import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../test-utils";
import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
  it("shows the configured label when ok", () => {
    renderWithTheme(<StatusPill ok />);
    expect(screen.getByText("CONFIGURED")).toBeInTheDocument();
  });

  it("shows the not-configured label when not ok", () => {
    renderWithTheme(<StatusPill ok={false} />);
    expect(screen.getByText("NOT CONFIGURED")).toBeInTheDocument();
  });

  it("accepts custom labels", () => {
    renderWithTheme(<StatusPill ok okLabel="KEY SET" offLabel="NO KEY" />);
    expect(screen.getByText("KEY SET")).toBeInTheDocument();
  });
});
