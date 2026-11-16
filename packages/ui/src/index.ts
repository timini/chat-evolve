// @chat-evolve/ui — atomic-design component library for ChatEvolve.

// Theme
export * from "./theme";

// Domain types + content/helpers
export * from "./types";
export { validateKeyFormat, verifyApiKey } from "./validation";
export { redactSensitiveData, sanitizeProviderErrorMessage } from "./sanitize";
export {
  PROMPT,
  PROVIDERS,
  PROVIDER_ORDER,
  G1,
  G2,
  HISTORY,
  tokenize,
  sentencesOf,
  codonForIndex,
  cycleMark,
  seedMarksForVariant,
  seedMarksForGeneration,
  genePools,
  maskKey,
} from "./content";

// Atoms
export { Eyebrow } from "./atoms/Eyebrow";
export type { EyebrowProps } from "./atoms/Eyebrow";
export { MetaCell } from "./atoms/MetaCell";
export type { MetaCellProps } from "./atoms/MetaCell";
export { StatusPill } from "./atoms/StatusPill";
export type { StatusPillProps } from "./atoms/StatusPill";
export { MutationScale } from "./atoms/MutationScale";
export type { MutationScaleProps } from "./atoms/MutationScale";
export { CodonGlyph } from "./atoms/CodonGlyph";
export type { CodonGlyphProps } from "./atoms/CodonGlyph";
export { Button } from "./atoms/Button";
export type { ButtonProps, ButtonVariant } from "./atoms/Button";
export { BrandMark } from "./atoms/BrandMark";
export type { BrandMarkProps } from "./atoms/BrandMark";

// Molecules
export { ProviderCard } from "./molecules/ProviderCard";
export type { ProviderCardProps } from "./molecules/ProviderCard";
export { SessionChip } from "./molecules/SessionChip";
export type { SessionChipProps } from "./molecules/SessionChip";
export { GenePoolItem } from "./molecules/GenePoolItem";
export type { GenePoolItemProps } from "./molecules/GenePoolItem";

// Organisms
export { TopBar } from "./organisms/TopBar";
export type { TopBarProps } from "./organisms/TopBar";
export { HelixViz } from "./organisms/HelixViz";
export type { HelixVizProps } from "./organisms/HelixViz";
export { HelixVariantCard } from "./organisms/HelixVariantCard";
export type { HelixVariantCardProps } from "./organisms/HelixVariantCard";
export { SplicePanel } from "./organisms/SplicePanel";
export type { SplicePanelProps } from "./organisms/SplicePanel";
export { ProviderGrid } from "./organisms/ProviderGrid";
export type { ProviderGridProps } from "./organisms/ProviderGrid";
export { SettingsModal } from "./organisms/SettingsModal";
export type { SettingsModalProps } from "./organisms/SettingsModal";

// Pages
export { HelixPage } from "./pages/HelixPage";
export type { HelixPageProps } from "./pages/HelixPage";
export { SetupPage } from "./pages/SetupPage";
export type { SetupPageProps } from "./pages/SetupPage";
