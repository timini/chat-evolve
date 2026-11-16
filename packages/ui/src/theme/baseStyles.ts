// Injects the IBM Plex font link + the shared `.ce-*` utility classes once per
// document. Ported from the design's shared.jsx base style block.

const STYLE_ID = "ce-base";
const FONT_ID = "ce-fonts";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

const CSS = `
  .ce *, .ce *::before, .ce *::after { box-sizing: border-box; }
  .ce { font-family: 'IBM Plex Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .ce-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
  .ce-tick { font-variant-numeric: tabular-nums; letter-spacing: 0.02em; }
  .ce-dominant {
    background: var(--ce-dominant-fill);
    box-shadow: inset 0 -2px 0 0 var(--ce-dominant);
    padding: 0 1px;
  }
  .ce-purged {
    background: var(--ce-purged-fill);
    text-decoration: line-through;
    text-decoration-color: var(--ce-purged);
    text-decoration-thickness: 2px;
    padding: 0 1px;
    opacity: 0.78;
  }
  .ce-clickable { cursor: pointer; }
  @keyframes ce-shimmer {
    0%   { opacity: 0.3; }
    50%  { opacity: 1; }
    100% { opacity: 0.3; }
  }
  .ce-streaming { animation: ce-shimmer 1.1s ease-in-out infinite; }
  @keyframes ce-blink { 50% { opacity: 0; } }
  .ce-caret::after {
    content: '▍';
    animation: ce-blink 0.9s steps(1) infinite;
    margin-left: 1px;
    color: var(--ce-muted);
  }
`;

export function injectBaseStyles(): void {
  if (typeof document === "undefined") return;
  if (!document.getElementById(FONT_ID)) {
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }
}
