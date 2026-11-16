import type { Meta, StoryObj } from "@storybook/react";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Sequence" } };

export const Dominant: Story = {
  args: { children: "▲ Dominant genes", color: "#2b6a36" },
};

export const Purged: Story = {
  args: { children: "▼ Purged genes", color: "#a82c1c" },
};
