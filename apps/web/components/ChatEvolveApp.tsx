"use client";

import { useEffect, useState } from "react";
import {
  ThemeProvider,
  HelixPage,
  SetupPage,
  SettingsModal,
  SessionChip,
  G2,
} from "@chat-evolve/ui";
import { useEvolveStore, selectConfigured, selectHasAnyKey } from "../store/useEvolveStore";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Splash } from "./Splash";

export function ChatEvolveApp() {
  // Avoid hydration mismatch: the first client render must equal the SSR/export
  // output. We only read the persisted store after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const store = useEvolveStore();
  const [showSettings, setShowSettings] = useState(false);

  if (!mounted) return <Splash />;

  const configured = selectConfigured(store);
  const hasAnyKey = selectHasAnyKey(store);
  const gateOpen = hasAnyKey && store.entered;

  return (
    <ThemeProvider theme={store.theme}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {gateOpen ? (
          <>
            <HelixPage
              generation={G2}
              marks={store.marks}
              onCycle={store.cycleSentence}
              activeVariant={store.activeVariant}
              onSelectVariant={store.setActiveVariant}
              mutation={store.mutation}
              onMutationChange={store.setMutation}
              breeding={store.breeding}
              onBreed={store.breed}
              sessionChip={
                <SessionChip
                  session={store.session}
                  configured={configured}
                  onSwitch={store.setSession}
                  onOpenSettings={() => setShowSettings(true)}
                />
              }
            />
            {showSettings && (
              <SettingsModal
                keys={store.keys}
                preferredModels={store.prefs}
                onSetKey={store.setKey}
                onSetModel={store.setPreferredModel}
                onClearAll={() => {
                  store.clearAllKeys();
                  setShowSettings(false);
                }}
                onClose={() => setShowSettings(false)}
              />
            )}
          </>
        ) : (
          <SetupPage
            keys={store.keys}
            preferredModels={store.prefs}
            session={store.session}
            onSetKey={store.setKey}
            onSetModel={store.setPreferredModel}
            onBegin={store.begin}
          />
        )}
        <ThemeSwitcher value={store.theme} onChange={store.setTheme} />
      </div>
    </ThemeProvider>
  );
}
