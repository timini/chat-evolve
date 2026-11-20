import { Analytics } from "./analytics";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatEvolve · Evolutionary LLM Interface",
  description:
    "Breed text instead of prompting it. Mark dominant and purged genes across a triple-strand helix and splice the next generation. Bring your own API key.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="app-root">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
