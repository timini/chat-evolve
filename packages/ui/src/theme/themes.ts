// Theme palettes — ported verbatim from the ChatEvolve design (shared.jsx).
// Brutalist: warm paper, hard ink borders, green = dominant, red = purged.

export interface Theme {
  name: string;
  paper: string;
  panel: string;
  ink: string;
  muted: string;
  border: string;
  hairline: string;
  dominant: string;
  dominantFill: string;
  purged: string;
  purgedFill: string;
  accent: string;
}

export const THEMES = {
  ink: {
    name: "INK / PAPER",
    paper: "#f1ede4",
    panel: "#fbf9f3",
    ink: "#0c0c0c",
    muted: "#6b665b",
    border: "#0c0c0c",
    hairline: "rgba(12,12,12,0.16)",
    dominant: "#2b6a36",
    dominantFill: "#cfe2a7",
    purged: "#a82c1c",
    purgedFill: "#e9b6a8",
    accent: "#c2a23a",
  },
  archive: {
    name: "ARCHIVE",
    paper: "#e7e2d2",
    panel: "#f0ecdd",
    ink: "#1d1a12",
    muted: "#615a47",
    border: "#1d1a12",
    hairline: "rgba(29,26,18,0.18)",
    dominant: "#3f6b2f",
    dominantFill: "#cad9a4",
    purged: "#8e2a18",
    purgedFill: "#e3b4a3",
    accent: "#a87a1f",
  },
  lab: {
    name: "LAB",
    paper: "#f6f6f4",
    panel: "#ffffff",
    ink: "#04060b",
    muted: "#5a6068",
    border: "#04060b",
    hairline: "rgba(4,6,11,0.16)",
    dominant: "#1f6b3a",
    dominantFill: "#bedfaf",
    purged: "#a51d10",
    purgedFill: "#edb1a3",
    accent: "#1f4ad6",
  },
  soil: {
    name: "SOIL",
    paper: "#1b1a16",
    panel: "#23221c",
    ink: "#ece6d2",
    muted: "#8a8470",
    border: "#ece6d2",
    hairline: "rgba(236,230,210,0.22)",
    dominant: "#9ac466",
    dominantFill: "rgba(154,196,102,0.22)",
    purged: "#e2745c",
    purgedFill: "rgba(226,116,92,0.22)",
    accent: "#e7c66a",
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

export const DEFAULT_THEME: ThemeName = "ink";
