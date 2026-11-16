// Shared domain types for ChatEvolve. The component library is presentational:
// the app (Zustand store) owns this state and passes it down as props.

export type GeneKind = "dominant" | "purged";

/** A half-open word range [from, to) within a variant's tokenized text. */
export interface Gene {
  from: number;
  to: number;
  kind: GeneKind;
}

export type VariantId = "A" | "B" | "C";
export type VariantRole = "ANCHOR" | "STYLIST" | "MUTANT";

export interface Variant {
  id: VariantId;
  role: VariantRole;
  /** temperature used for this variant */
  temp: number;
  /** approximate token count, shown as metadata */
  tokens: number;
  text: string;
  genes: Gene[];
}

export interface Generation {
  id: string;
  label: string;
  parent: string | null;
  mutation: number;
  variants: Variant[];
  dominantFromParent?: string[];
  purgedFromParent?: string[];
}

/** Per-variant, per-sentence mark map: { sentenceIndex: kind }. */
export type SentenceMarks = Record<number, GeneKind>;
/** Marks for every variant in the active generation: { variantId: SentenceMarks }. */
export type VariantMarks = Record<string, SentenceMarks>;

// ── Providers / BYO keys ─────────────────────────────────────────────────────

export type ProviderId = "anthropic" | "openai" | "google" | "deepseek";

export interface ModelOption {
  id: string;
  label: string;
  tier: string;
}

export interface Provider {
  id: ProviderId;
  name: string;
  glyph: string;
  blurb: string;
  keyHint: string;
  docsLabel: string;
  docsUrl: string;
  models: ModelOption[];
  /** Expected key prefix, e.g. "sk-ant-". Used to validate pasted keys. */
  keyPrefix: string;
  /** Minimum plausible key length (rejects obvious truncations). */
  minKeyLength: number;
}

/** Result of the offline format check for a typed API key. */
export interface KeyValidation {
  /** `empty` = nothing entered, `invalid` = fails a rule, `valid` = passes. */
  state: "empty" | "invalid" | "valid";
  /** Human-readable reason when `invalid`. */
  message?: string;
}

/** Result of live key verification against a provider's API. */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Active provider + model for the current evolution session. */
export interface Session {
  provider: ProviderId | null;
  model: string | null;
}

/** A single gene in the splice payload, with its source strand. */
export interface PoolGene {
  src: VariantId;
  text: string;
}
