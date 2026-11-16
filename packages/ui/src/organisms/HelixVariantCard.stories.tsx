import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { HelixVariantCard } from "./HelixVariantCard";
import { G2, seedMarksForVariant, cycleMark } from "../content";
import type { SentenceMarks } from "../types";

const variant = G2.variants[0]!;

const meta = {
  title: "Organisms/HelixVariantCard",
  component: HelixVariantCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof HelixVariantCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  args: {
    variant,
    marks: seedMarksForVariant(variant),
    onCycle: () => {},
    isActive: false,
    onSelect: () => {},
  },
};

export const Active: Story = {
  args: { ...Inactive.args, isActive: true },
};

export const ClickToMark: StoryObj = {
  render: () => {
    const [marks, setMarks] = useState<SentenceMarks>({});
    const cycle = (i: number) =>
      setMarks((m) => {
        const next = cycleMark(m[i]);
        const out = { ...m };
        if (next) out[i] = next;
        else delete out[i];
        return out;
      });
    return (
      <HelixVariantCard variant={variant} marks={marks} onCycle={cycle} isActive onSelect={() => {}} />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByLabelText("sentence 1");
    await userEvent.click(row); // -> dominant
    await expect(row).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(row); // -> purged
    await userEvent.click(row); // -> none
    await expect(row).toHaveAttribute("aria-pressed", "false");
  },
};
