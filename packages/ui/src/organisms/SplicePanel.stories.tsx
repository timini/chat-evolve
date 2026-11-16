import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SplicePanel } from "./SplicePanel";
import { G2, genePools, seedMarksForGeneration } from "../content";

const pools = genePools(G2, seedMarksForGeneration(G2));

const meta = {
  title: "Organisms/SplicePanel",
  component: SplicePanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ width: 300, height: 600 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    mutation: 0.58,
    onMutationChange: fn(),
    dominant: pools.dominant,
    purged: pools.purged,
    breeding: false,
    onBreed: fn(),
  },
} satisfies Meta<typeof SplicePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Breeding: Story = { args: { breeding: true } };
export const Empty: Story = { args: { dominant: [], purged: [] } };
