import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { HelixPage } from "./HelixPage";
import { SessionChip } from "../molecules/SessionChip";
import { G2, seedMarksForGeneration, cycleMark } from "../content";
import type { Session, VariantId, VariantMarks } from "../types";

const meta = {
  title: "Pages/HelixPage",
  component: HelixPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HelixPage>;

export default meta;

/** Full stateful workbench, seeded with the inherited G2 DNA. */
function Workbench({ animated = true }: { animated?: boolean }) {
  const [marks, setMarks] = useState<VariantMarks>(() => seedMarksForGeneration(G2));
  const [active, setActive] = useState<VariantId>("A");
  const [mutation, setMutation] = useState(0.58);
  const [breeding, setBreeding] = useState(false);
  const [session, setSession] = useState<Session>({
    provider: "anthropic",
    model: "claude-sonnet-4-5",
  });

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
      breeding={breeding}
      onBreed={() => {
        setBreeding(true);
        setTimeout(() => setBreeding(false), 1600);
      }}
      animated={animated}
      sessionChip={
        <SessionChip
          session={session}
          configured={["anthropic", "openai"]}
          onSwitch={(provider, model) => setSession({ provider, model })}
          onOpenSettings={() => {}}
        />
      }
    />
  );
}

export const Default: StoryObj = {
  render: () => <Workbench />,
};

export const MarkAndBreed: StoryObj = {
  render: () => <Workbench animated={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Seeded with inherited DNA, so dominant count starts > 0.
    const before = Number(canvas.getByTestId("dominant-count").textContent);
    // Strand A's first sentence is unmarked in the seed → clicking it adds a
    // dominant gene (rows[0] is strand A, the first card).
    const rows = canvas.getAllByLabelText("sentence 1");
    await userEvent.click(rows[0]!);
    const after = Number(canvas.getByTestId("dominant-count").textContent);
    await expect(after).toBe(before + 1);
    // Splice.
    await userEvent.click(canvas.getByRole("button", { name: /SPLICE → G3/ }));
    await expect(canvas.getByText(/SPLICING/)).toBeInTheDocument();
  },
};
