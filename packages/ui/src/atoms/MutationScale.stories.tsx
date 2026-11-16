import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { MutationScale } from "./MutationScale";

const meta = {
  title: "Atoms/MutationScale",
  component: MutationScale,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MutationScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: 0.42 } };
export const Compact: Story = { args: { value: 0.58, compact: true } };

export const Interactive: StoryObj = {
  render: () => {
    const [v, setV] = useState(0.5);
    return <MutationScale value={v} onChange={setV} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider", { name: "Mutation rate" });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "0.6");
  },
};
