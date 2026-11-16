import type { Meta, StoryObj } from "@storybook/react";
import { BrandMark } from "./BrandMark";

const meta = {
  title: "Atoms/BrandMark",
  component: BrandMark,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BrandMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variantLabel: "HELIX" } };
