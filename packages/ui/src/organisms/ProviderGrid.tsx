import { PROVIDERS, PROVIDER_ORDER } from "../content";
import type { Provider, ProviderId, ValidationResult } from "../types";
import { ProviderCard } from "../molecules/ProviderCard";

export interface ProviderGridProps {
  keys: Partial<Record<ProviderId, string>>;
  preferredModels: Partial<Record<ProviderId, string>>;
  onSetKey: (provider: ProviderId, key: string) => void;
  onSetModel: (provider: ProviderId, model: string) => void;
  /** Live key verification — passed straight through to each card. */
  onVerify?: (provider: Provider, key: string) => Promise<ValidationResult>;
  compact?: boolean;
}

/** The 2×2 grid of provider config cards used by setup + settings. */
export function ProviderGrid({
  keys,
  preferredModels,
  onSetKey,
  onSetModel,
  onVerify,
  compact = true,
}: ProviderGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        minHeight: 0,
      }}
    >
      {PROVIDER_ORDER.map((pid) => (
        <ProviderCard
          key={pid}
          provider={PROVIDERS[pid]}
          apiKey={keys[pid] ?? ""}
          preferredModel={preferredModels[pid] ?? PROVIDERS[pid].models[0]!.id}
          onSetKey={(key) => onSetKey(pid, key)}
          onSetModel={(model) => onSetModel(pid, model)}
          {...(onVerify ? { onVerify } : {})}
          compact={compact}
        />
      ))}
    </div>
  );
}
