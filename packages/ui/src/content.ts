// Sample DNA content + provider catalog + pure text helpers.
// Ported from the design (shared.jsx / settings.jsx / helix.jsx). All functions
// here are pure so they can be unit-tested directly.

import type {
  Generation,
  Provider,
  ProviderId,
  Variant,
  GeneKind,
  SentenceMarks,
  PoolGene,
} from "./types";

/** The original intent that seeds every generation. */
export const PROMPT =
  "Cover letter opener · Senior Product Designer · Cardinal Financial · confident, warm.";

/** Split text into whitespace-delimited tokens (punctuation stays attached). */
export const tokenize = (s: string): string[] => s.match(/\S+/g) ?? [];

/** Split text into sentences (kept with trailing punctuation). */
export const sentencesOf = (text: string): string[] =>
  text.match(/[^.!?]+[.!?]+/g) ?? [text];

export const G1: Generation = {
  id: "G1",
  label: "GENESIS",
  parent: null,
  mutation: 0.42,
  variants: [
    {
      id: "A",
      role: "ANCHOR",
      temp: 0.3,
      tokens: 187,
      text: "Dear Hiring Team, I am writing to express my interest in the Senior Product Designer role at Cardinal Financial. With seven years of experience designing interfaces for regulated environments, I bring a deep respect for the constraints that fintech demands.",
      genes: [],
    },
    {
      id: "B",
      role: "STYLIST",
      temp: 0.7,
      tokens: 174,
      text: "Hello — I'd like to throw my hat in for the Senior Product Designer opening. After half a decade shipping payments tools at scale, I've learned the only feature that compounds is trust, and design is how you earn it.",
      genes: [],
    },
    {
      id: "C",
      role: "MUTANT",
      temp: 1.05,
      tokens: 211,
      text: "Most cover letters open with a job title. I'd rather open with a confession: I picked design because I couldn't stand watching well-meaning teams ship broken financial products to the people who could least afford them.",
      genes: [],
    },
  ],
};

export const G2: Generation = {
  id: "G2",
  label: "F1",
  parent: "G1",
  mutation: 0.58,
  dominantFromParent: ["shipping payments tools at scale", "trust is the only feature"],
  purgedFromParent: ["Dear Hiring Team", "well-meaning teams"],
  variants: [
    {
      id: "A",
      role: "ANCHOR",
      temp: 0.35,
      tokens: 192,
      text: "I'm writing about the Senior Product Designer opening at Cardinal Financial. Seven years shipping payments tools at scale has taught me that trust is the only feature that compounds, and design is the surface where customers learn whether to give it.",
      genes: [
        { from: 13, to: 18, kind: "dominant" },
        { from: 22, to: 29, kind: "dominant" },
      ],
    },
    {
      id: "B",
      role: "STYLIST",
      temp: 0.72,
      tokens: 183,
      text: "A confession before the pitch: I joined this craft because financial products kept failing the people who needed them most. Shipping payments tools at scale for six years has only sharpened that, and Cardinal looks like the inverse of broken.",
      genes: [
        { from: 20, to: 25, kind: "dominant" },
        { from: 28, to: 32, kind: "purged" },
      ],
    },
    {
      id: "C",
      role: "MUTANT",
      temp: 1.1,
      tokens: 226,
      text: "Think of this less as a cover letter than a notice of intent. Trust is the only feature that compounds — and Cardinal is one of maybe four fintech teams shipping like that's actually true. I'd like to help, with a pen and a Figma file.",
      genes: [
        { from: 13, to: 20, kind: "dominant" },
        { from: 39, to: 46, kind: "purged" },
      ],
    },
  ],
};

export const HISTORY: Generation[] = [G1, G2];

// ── Codons ────────────────────────────────────────────────────────────────

/**
 * Deterministic base-pair glyph (A/T/G/C) for a sentence: the same seed + index
 * always yields the same letter, so the "DNA sequence" reads stably.
 */
export function codonForIndex(seedStr: string, i: number): "A" | "T" | "G" | "C" {
  let h = 0;
  for (const c of seedStr) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  h = (h + i * 2654435761) >>> 0;
  return (["A", "T", "G", "C"] as const)[h % 4]!;
}

// ── Gene → sentence mark seeding ─────────────────────────────────────────────

/**
 * Convert a variant's word-range genes into a per-sentence mark map. Used to
 * seed the Helix view so the inherited DNA shows without user action.
 */
export function seedMarksForVariant(variant: Variant): SentenceMarks {
  const sentences = sentencesOf(variant.text);
  const wordStarts: number[] = [];
  let c = 0;
  for (const s of sentences) {
    wordStarts.push(c);
    c += tokenize(s).length;
  }
  const marks: SentenceMarks = {};
  for (const g of variant.genes) {
    const si = wordStarts.findIndex(
      (ws, k) =>
        g.from >= ws && (k === wordStarts.length - 1 || g.from < wordStarts[k + 1]!),
    );
    if (si >= 0) marks[si] = g.kind;
  }
  return marks;
}

export function seedMarksForGeneration(
  generation: Generation,
): Record<string, SentenceMarks> {
  const out: Record<string, SentenceMarks> = {};
  for (const v of generation.variants) out[v.id] = seedMarksForVariant(v);
  return out;
}

/** Cycle a sentence mark: none → dominant → purged → none. */
export function cycleMark(current: GeneKind | undefined): GeneKind | undefined {
  if (current === "dominant") return "purged";
  if (current === "purged") return undefined;
  return "dominant";
}

/** Resolve the dominant / purged gene pools from a generation + its marks. */
export function genePools(
  generation: Generation,
  marks: Record<string, SentenceMarks>,
): { dominant: PoolGene[]; purged: PoolGene[] } {
  const dominant: PoolGene[] = [];
  const purged: PoolGene[] = [];
  for (const v of generation.variants) {
    const m = marks[v.id] ?? {};
    sentencesOf(v.text).forEach((s, i) => {
      if (m[i] === "dominant") dominant.push({ src: v.id, text: s.trim() });
      else if (m[i] === "purged") purged.push({ src: v.id, text: s.trim() });
    });
  }
  return { dominant, purged };
}

// ── Provider catalog ─────────────────────────────────────────────────────────

export const PROVIDERS: Record<ProviderId, Provider> = {
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    glyph: "◆",
    blurb: "Claude family",
    keyHint: "sk-ant-api03-...",
    docsLabel: "console.anthropic.com",
    docsUrl: "https://console.anthropic.com/settings/keys",
    keyPrefix: "sk-ant-",
    minKeyLength: 20,
    models: [
      { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5", tier: "FLAGSHIP" },
      { id: "claude-opus-4-1", label: "Claude Opus 4.1", tier: "POWER" },
      { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", tier: "FAST" },
    ],
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    glyph: "●",
    blurb: "GPT family",
    keyHint: "sk-proj-...",
    docsLabel: "platform.openai.com",
    docsUrl: "https://platform.openai.com/api-keys",
    keyPrefix: "sk-",
    minKeyLength: 20,
    models: [
      { id: "gpt-5", label: "GPT-5", tier: "FLAGSHIP" },
      { id: "gpt-5-mini", label: "GPT-5 mini", tier: "FAST" },
      { id: "gpt-4.1", label: "GPT-4.1", tier: "POWER" },
    ],
  },
  google: {
    id: "google",
    name: "Google",
    glyph: "▲",
    blurb: "Gemini family",
    keyHint: "AIzaSy...",
    docsLabel: "aistudio.google.com",
    docsUrl: "https://aistudio.google.com/apikey",
    keyPrefix: "AIza",
    minKeyLength: 30,
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", tier: "FLAGSHIP" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", tier: "FAST" },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", tier: "BALANCED" },
    ],
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    glyph: "◉",
    blurb: "V3 + R1",
    keyHint: "sk-...",
    docsLabel: "platform.deepseek.com",
    docsUrl: "https://platform.deepseek.com/api_keys",
    keyPrefix: "sk-",
    minKeyLength: 20,
    models: [
      { id: "deepseek-chat", label: "DeepSeek V3", tier: "BALANCED" },
      { id: "deepseek-reasoner", label: "DeepSeek R1", tier: "REASONING" },
    ],
  },
};

export const PROVIDER_ORDER: ProviderId[] = ["anthropic", "openai", "google", "deepseek"];

/** Mask an API key for display: keep first/last 4, dot the middle. */
export function maskKey(k: string): string {
  if (!k) return "";
  if (k.length <= 8) return "•".repeat(k.length);
  return k.slice(0, 4) + "•".repeat(Math.max(4, k.length - 8)) + k.slice(-4);
}
