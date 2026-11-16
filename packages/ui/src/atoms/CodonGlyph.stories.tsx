import type { Meta, StoryObj } from "@storybook/react";
import { CodonGlyph } from "./CodonGlyph";

const meta = {
  title: "Atoms/CodonGlyph",
  component: CodonGlyph,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { seed: "A", index: 0 },
} satisfies Meta<typeof CodonGlyph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unmarked: Story = {};
export const Dominant: Story = { args: { state: "dominant" } };
export const Purged: Story = { args: { state: "purged" } };

export const Sequence: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <CodonGlyph
          key={i}
          seed="A"
          index={i}
          state={i === 1 ? "dominant" : i === 4 ? "purged" : null}
          onClick={() => {}}
        />
      ))}
    </div>
  ),
};
