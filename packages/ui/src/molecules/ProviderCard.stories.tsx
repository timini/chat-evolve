import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { ProviderCard } from "./ProviderCard";
import { PROVIDERS } from "../content";

const meta = {
  title: "Molecules/ProviderCard",
  component: ProviderCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ProviderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unconfigured: Story = {
  args: {
    provider: PROVIDERS.anthropic,
    apiKey: "",
    preferredModel: PROVIDERS.anthropic.models[0]!.id,
    onSetKey: () => {},
    onSetModel: () => {},
  },
};

export const Configured: Story = {
  args: {
    provider: PROVIDERS.openai,
    apiKey: "sk-proj-EXAMPLEKEY1234567890",
    preferredModel: PROVIDERS.openai.models[0]!.id,
    onSetKey: () => {},
    onSetModel: () => {},
  },
};

export const InteractiveSaveAndReveal: StoryObj = {
  render: () => {
    const [key, setKey] = useState("");
    const [model, setModel] = useState(PROVIDERS.google.models[0]!.id);
    return (
      <ProviderCard
        provider={PROVIDERS.google}
        apiKey={key}
        preferredModel={model}
        onSetKey={setKey}
        onSetModel={setModel}
        onVerify={async () => ({ valid: true })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Google API key");

    // Wrong prefix → invalid, save blocked.
    await userEvent.type(input, "sk-not-google-key-123456");
    await expect(canvas.getByRole("alert")).toHaveTextContent(/AIza/);
    await expect(canvas.getByRole("button", { name: /SAVE/ })).toBeDisabled();

    // Correct it → valid, then save (verify is async → wait for the result).
    await userEvent.clear(input);
    await userEvent.type(input, "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ012345{Enter}");
    await expect(await canvas.findByText("CONFIGURED")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("radio", { name: /Gemini 2.5 Flash/ }));
    await expect(canvas.getByRole("radio", { name: /Gemini 2.5 Flash/ })).toBeChecked();
  },
};

export const InvalidKey: StoryObj = {
  render: () => {
    const [key, setKey] = useState("");
    return (
      <ProviderCard
        provider={PROVIDERS.anthropic}
        apiKey={key}
        preferredModel={PROVIDERS.anthropic.models[0]!.id}
        onSetKey={setKey}
        onSetModel={() => {}}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Anthropic API key"), "oops-1234567890");
    await expect(canvas.getByLabelText("Anthropic API key")).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByRole("alert")).toBeInTheDocument();
  },
};
