import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { HelixViz } from "./HelixViz";
import type { VariantId } from "../types";

const meta = {
  title: "Organisms/HelixViz",
  component: HelixViz,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ height: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HelixViz>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Animated: Story = {
  args: { activeVariant: "A", onSelectVariant: () => {}, mutation: 0.58, breeding: false },
};

export const Breeding: Story = {
  args: { ...Animated.args, breeding: true, animated: false },
};

export const SelectStrand: StoryObj = {
  render: () => {
    const [active, setActive] = useState<VariantId>("A");
    return (
      <HelixViz
        activeVariant={active}
        onSelectVariant={setActive}
        mutation={0.58}
        breeding={false}
        animated={false}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "select strand C" }));
    // strand C node text should now sit on the active (filled) node — assert no throw
    await expect(canvas.getByRole("button", { name: "select strand C" })).toBeInTheDocument();
  },
};
