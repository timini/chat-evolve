import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { SettingsModal } from "./SettingsModal";
import type { ProviderId } from "../types";

const meta = {
  title: "Organisms/SettingsModal",
  component: SettingsModal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: 700 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SettingsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    keys: { anthropic: "sk-ant-EXAMPLE1234" },
    preferredModels: {},
    onSetKey: () => {},
    onSetModel: () => {},
    onClearAll: () => {},
    onClose: () => {},
  },
};

export const ManageKeys: StoryObj = {
  render: () => {
    const [keys, setKeys] = useState<Partial<Record<ProviderId, string>>>({});
    return (
      <SettingsModal
        keys={keys}
        preferredModels={{}}
        onSetKey={(p, k) => setKeys((s) => ({ ...s, [p]: k }))}
        onSetModel={() => {}}
        onClearAll={() => setKeys({})}
        onClose={() => {}}
        onVerify={async () => ({ valid: true })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("OpenAI API key");
    await userEvent.type(input, "sk-proj-abcdefghijklmnopqrst{Enter}");
    await expect(await canvas.findByText("CONFIGURED")).toBeInTheDocument();
  },
};
