import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onClick: fn(), children: "SPLICE → G3" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline", children: "CLEAR ALL" } };
export const Disabled: Story = { args: { disabled: true, children: "LOCKED" } };
export const WithSubtitle: Story = {
  args: { subtitle: "2 keep · 1 cut · μ 0.58", align: "left" },
};
