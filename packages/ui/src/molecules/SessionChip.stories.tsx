import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { SessionChip } from "./SessionChip";
import type { ProviderId, Session } from "../types";

const meta = {
  title: "Molecules/SessionChip",
  component: SessionChip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SessionChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    session: { provider: "anthropic", model: "claude-sonnet-4-5" },
    configured: ["anthropic", "openai"],
    onSwitch: () => {},
    onOpenSettings: () => {},
  },
};

export const InteractiveSwitch: StoryObj = {
  render: () => {
    const [session, setSession] = useState<Session>({
      provider: "anthropic",
      model: "claude-sonnet-4-5",
    });
    return (
      <SessionChip
        session={session}
        configured={["anthropic", "openai"] as ProviderId[]}
        onSwitch={(provider, model) => setSession({ provider, model })}
        onOpenSettings={() => {}}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { expanded: false }));
    await userEvent.click(canvas.getByRole("menuitem", { name: /GPT-5 mini/ }));
    await expect(canvas.getByText("OpenAI · GPT-5 mini")).toBeInTheDocument();
  },
};
