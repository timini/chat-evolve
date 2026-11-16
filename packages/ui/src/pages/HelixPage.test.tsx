import { useState } from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../test-utils";
import { HelixPage } from "./HelixPage";
import { G2, cycleMark } from "../content";
import type { VariantId, VariantMarks } from "../types";

/** Stateful harness mirroring how the app wires the controlled page. */
function Harness() {
  const [marks, setMarks] = useState<VariantMarks>({ A: {}, B: {}, C: {} });
  const [active, setActive] = useState<VariantId>("A");
  const [mutation, setMutation] = useState(0.58);
  const cycle = (vid: VariantId, i: number) =>
    setMarks((m) => {
      const cur = m[vid] ?? {};
      const next = cycleMark(cur[i]);
      const copy = { ...cur };
      if (next) copy[i] = next;
      else delete copy[i];
      return { ...m, [vid]: copy };
    });
  return (
    <HelixPage
      generation={G2}
      marks={marks}
      onCycle={cycle}
      activeVariant={active}
      onSelectVariant={setActive}
      mutation={mutation}
      onMutationChange={setMutation}
      breeding={false}
      onBreed={() => {}}
      animated={false}
    />
  );
}

describe("HelixPage", () => {
  it("renders chrome, helix viz, three strands, and the splice rail", () => {
    renderWithTheme(<Harness />);
    expect(screen.getByText("CHATEVOLVE")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /DNA helix/ })).toBeInTheDocument();
    expect(screen.getByText("ANCHOR")).toBeInTheDocument();
    expect(screen.getByText("STYLIST")).toBeInTheDocument();
    expect(screen.getByText("MUTANT")).toBeInTheDocument();
    expect(screen.getByText("SPLICE PAYLOAD")).toBeInTheDocument();
  });

  it("marks a sentence dominant and reflects it in the gene pool count", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Harness />);
    expect(screen.getByTestId("dominant-count")).toHaveTextContent("0");
    // first strand's first sentence row -> dominant
    const rows = screen.getAllByLabelText("sentence 1");
    await user.click(rows[0]!);
    expect(screen.getByTestId("dominant-count")).toHaveTextContent("1");
  });
});
