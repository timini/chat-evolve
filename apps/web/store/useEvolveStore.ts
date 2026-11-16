import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  G2,
  PROVIDERS,
  seedMarksForGeneration,
  cycleMark,
  type ProviderId,
  type Session,
  type ThemeName,
  type VariantId,
  type VariantMarks,
} from "@chat-evolve/ui";

export interface EvolveState {
  // ── Theme ────────────────────────────────────────────────────────────
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;

  // ── BYO keys / providers ─────────────────────────────────────────────
  keys: Partial<Record<ProviderId, string>>;
  prefs: Partial<Record<ProviderId, string>>; // preferred model per provider
  session: Session;
  /** User pressed "Begin evolution" — gates the workbench. */
  entered: boolean;

  setKey: (provider: ProviderId, key: string) => void;
  setPreferredModel: (provider: ProviderId, model: string) => void;
  setSession: (provider: ProviderId, model: string) => void;
  clearAllKeys: () => void;
  begin: () => void;

  // ── Evolution (current generation working state) ─────────────────────
  marks: VariantMarks;
  activeVariant: VariantId;
  mutation: number;
  breeding: boolean;

  cycleSentence: (variant: VariantId, sentenceIndex: number) => void;
  setActiveVariant: (variant: VariantId) => void;
  setMutation: (value: number) => void;
  breed: () => void;

  // ── Hydration guard (for static export / SSR safety) ─────────────────
  _hydrated: boolean;
  setHydrated: () => void;
}

const defaultModel = (provider: ProviderId, prefs: Partial<Record<ProviderId, string>>) =>
  prefs[provider] ?? PROVIDERS[provider].models[0]!.id;

export const useEvolveStore = create<EvolveState>()(
  persist(
    (set, get) => ({
      theme: "ink",
      setTheme: (theme) => set({ theme }),

      keys: {},
      prefs: {},
      session: { provider: null, model: null },
      entered: false,

      setKey: (provider, key) =>
        set((state) => {
          const keys = { ...state.keys };
          let session = state.session;
          if (key) {
            keys[provider] = key;
            // Adopt the first configured provider as the active session.
            if (!session.provider) session = { provider, model: defaultModel(provider, state.prefs) };
          } else {
            delete keys[provider];
            // Fall back if we cleared the active provider.
            if (session.provider === provider) {
              const fallback = (Object.keys(keys) as ProviderId[])[0];
              session = fallback
                ? { provider: fallback, model: defaultModel(fallback, state.prefs) }
                : { provider: null, model: null };
            }
          }
          return { keys, session };
        }),

      setPreferredModel: (provider, model) =>
        set((state) => {
          const prefs = { ...state.prefs, [provider]: model };
          const session =
            state.session.provider === provider ? { ...state.session, model } : state.session;
          return { prefs, session };
        }),

      setSession: (provider, model) =>
        set((state) => ({ session: { provider, model: model || defaultModel(provider, state.prefs) } })),

      clearAllKeys: () =>
        set({ keys: {}, prefs: {}, session: { provider: null, model: null }, entered: false }),

      begin: () => set({ entered: true }),

      marks: seedMarksForGeneration(G2),
      activeVariant: "A",
      mutation: G2.mutation,
      breeding: false,

      cycleSentence: (variant, sentenceIndex) =>
        set((state) => {
          const current = state.marks[variant] ?? {};
          const next = cycleMark(current[sentenceIndex]);
          const updated = { ...current };
          if (next) updated[sentenceIndex] = next;
          else delete updated[sentenceIndex];
          return { marks: { ...state.marks, [variant]: updated } };
        }),

      setActiveVariant: (activeVariant) => set({ activeVariant }),
      setMutation: (mutation) => set({ mutation }),

      breed: () => {
        if (get().breeding) return;
        set({ breeding: true });
        setTimeout(() => set({ breeding: false }), 1600);
      },

      _hydrated: false,
      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "chatevolve.v1",
      storage: createJSONStorage(() => localStorage),
      // Only persist durable config — not transient evolution UI state.
      partialize: (state) => ({
        theme: state.theme,
        keys: state.keys,
        prefs: state.prefs,
        session: state.session,
        entered: state.entered,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectConfigured = (s: EvolveState): ProviderId[] =>
  (Object.keys(s.keys) as ProviderId[]).filter((p) => !!s.keys[p]);

export const selectHasAnyKey = (s: EvolveState): boolean => selectConfigured(s).length > 0;
