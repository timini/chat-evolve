import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProviderGrid } from "./ProviderGrid";
import type { ProviderId } from "../types";

const meta = {
  title: "Organisms/ProviderGrid",
  component: ProviderGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ProviderGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    keys: {},
    preferredModels: {},
    onSetKey: () => {},
    onSetModel: () => {},
  },
};

export const Interactive: StoryObj = {
  render: () => {
    const [keys, setKeys] = useState<Partial<Record<ProviderId, string>>>({
      anthropic: "sk-ant-EXAMPLE",
    });
    const [models, setModels] = useState<Partial<Record<ProviderId, string>>>({});
    return (
      <ProviderGrid
        keys={keys}
        preferredModels={models}
        onSetKey={(p, k) => setKeys((s) => ({ ...s, [p]: k }))}
        onSetModel={(p, m) => setModels((s) => ({ ...s, [p]: m }))}
      />
    );
  },
};
