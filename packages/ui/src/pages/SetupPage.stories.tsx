import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { SetupPage } from "./SetupPage";
import { PROVIDERS } from "../content";
import type { ProviderId, Session } from "../types";

const meta = {
  title: "Pages/SetupPage",
  component: SetupPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SetupPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Locked: Story = {
  args: {
    keys: {},
    preferredModels: {},
    session: { provider: null, model: null },
    onSetKey: () => {},
    onSetModel: () => {},
    onBegin: () => {},
  },
};

export const ConfigureAndUnlock: StoryObj = {
  render: () => {
    const [keys, setKeys] = useState<Partial<Record<ProviderId, string>>>({});
    const [session, setSession] = useState<Session>({ provider: null, model: null });
    return (
      <SetupPage
        keys={keys}
        preferredModels={{}}
        session={session}
        onSetKey={(p, k) => {
          setKeys((s) => ({ ...s, [p]: k }));
          if (k && !session.provider) setSession({ provider: p, model: PROVIDERS[p].models[0]!.id });
        }}
        onSetModel={() => {}}
        onBegin={() => {}}
        onVerify={async () => ({ valid: true })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Locked until a key is added
    await expect(canvas.getByRole("button", { name: /LOCKED/ })).toBeDisabled();
    await userEvent.type(
      canvas.getByLabelText("Anthropic API key"),
      "sk-ant-api03-abcdefghijklmnop{Enter}",
    );
    // Verification is async → wait for the gate to unlock.
    await expect(await canvas.findByRole("button", { name: /BEGIN EVOLUTION/ })).toBeEnabled();
  },
};
