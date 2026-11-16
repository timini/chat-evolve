import type { Meta, StoryObj } from "@storybook/react";
import { MetaCell } from "./MetaCell";

const meta = {
  title: "Atoms/MetaCell",
  component: MetaCell,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MetaCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "TEMP τ", value: "0.35" } };

export const Accented: Story = {
  args: { label: "MUTATION", value: "0.58", accent: "#c2a23a" },
};

export const Row: StoryObj = {
  render: () => (
    <div style={{ display: "flex", border: "1px solid #0c0c0c" }}>
      <MetaCell label="GEN" value="G2 · F1" />
      <MetaCell label="POPULATION" value="6 / 9" />
      <MetaCell label="MUTATION" value="0.58" accent="#c2a23a" bordered={false} />
    </div>
  ),
};
