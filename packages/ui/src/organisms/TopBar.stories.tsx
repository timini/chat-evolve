import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "./TopBar";
import { SessionChip } from "../molecules/SessionChip";
import { PROMPT } from "../content";

const meta = {
  title: "Organisms/TopBar",
  component: TopBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { prompt: PROMPT, population: "6 / 9" },
};

export const WithSessionChip: Story = {
  args: {
    prompt: PROMPT,
    population: "6 / 9",
    sessionChip: (
      <SessionChip
        session={{ provider: "anthropic", model: "claude-sonnet-4-5" }}
        configured={["anthropic"]}
        onSwitch={() => {}}
        onOpenSettings={() => {}}
      />
    ),
  },
};
