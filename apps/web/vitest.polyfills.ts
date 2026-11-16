// Runs before any other setup/test module so globals exist before the store
// (with its persist middleware) is first imported.

// jsdom here doesn't expose a global `localStorage`; provide an in-memory one.
if (typeof globalThis.localStorage === "undefined") {
  const data = new Map<string, string>();
  const mem: Storage = {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => (data.has(k) ? data.get(k)! : null),
    key: (i) => Array.from(data.keys())[i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
  Object.defineProperty(globalThis, "localStorage", { value: mem, configurable: true });
}

// Keep the helix animation inert under jsdom (rAF loop never re-schedules).
globalThis.requestAnimationFrame = (() => 0) as typeof requestAnimationFrame;
globalThis.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;
