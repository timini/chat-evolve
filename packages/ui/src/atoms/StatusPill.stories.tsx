import type { Meta, StoryObj } from "@storybook/react";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Atoms/StatusPill",
  component: StatusPill,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configured: Story = { args: { ok: true } };
export const NotConfigured: Story = { args: { ok: false } };
export const KeySet: Story = {
  args: { ok: true, okLabel: "KEY SET", offLabel: "NO KEY" },
};
