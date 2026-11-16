import type { Meta, StoryObj } from "@storybook/react";
import { GenePoolItem } from "./GenePoolItem";

const meta = {
  title: "Molecules/GenePoolItem",
  component: GenePoolItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof GenePoolItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dominant: Story = {
  args: { src: "A", text: "Trust is the only feature that compounds.", kind: "dominant" },
};

export const Purged: Story = {
  args: { src: "C", text: "I'd like to help, with a pen and a Figma file.", kind: "purged" },
};
