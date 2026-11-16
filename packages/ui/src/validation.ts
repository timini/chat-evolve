import type { KeyValidation, Provider, ValidationResult } from "./types";
import { sanitizeProviderErrorMessage } from "./sanitize";

/**
 * Fast, offline format check for a typed API key.
 *
 * - empty / whitespace  → `{ state: "empty" }`            (neutral, not an error)
 * - wrong prefix        → `{ state: "invalid", message }`  (e.g. must start with sk-ant-)
 * - too short           → `{ state: "invalid", message }`
 * - otherwise           → `{ state: "valid" }`
 */
export function validateKeyFormat(provider: Provider, key: string): KeyValidation {
  const trimmed = key.trim();
  if (trimmed === "") return { state: "empty" };

  if (!trimmed.startsWith(provider.keyPrefix)) {
    return {
      state: "invalid",
      message: `${provider.name} keys start with "${provider.keyPrefix}".`,
    };
  }

  if (trimmed.length < provider.minKeyLength) {
    return {
      state: "invalid",
      message: `That key looks too short for ${provider.name}.`,
    };
  }

  return { state: "valid" };
}

// ── Live verification against the provider API ───────────────────────────────
// Reuses the validation approach from ensemble-1 (hit the provider's lightweight
// `/models` endpoint; success ⇒ valid, 401/403 ⇒ bad key) — but with plain
// `fetch` so no provider SDKs are bundled into the static site.

interface VerifyRequest {
  url: string;
  headers: Record<string, string>;
}

function verifyRequest(provider: Provider, apiKey: string): VerifyRequest {
  switch (provider.id) {
    case "anthropic":
      return {
        url: "https://api.anthropic.com/v1/models",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          // Opt in to direct browser calls (mirrors the SDK's dangerouslyAllowBrowser).
          "anthropic-dangerous-direct-browser-access": "true",
        },
      };
    case "openai":
      return {
        url: "https://api.openai.com/v1/models",
        headers: { Authorization: `Bearer ${apiKey}` },
      };
    case "google":
      return {
        url: "https://generativelanguage.googleapis.com/v1beta/models",
        headers: { "x-goog-api-key": apiKey },
      };
    case "deepseek":
      return {
        url: "https://api.deepseek.com/models",
        headers: { Authorization: `Bearer ${apiKey}` },
      };
  }
}

/**
 * Verify a key by calling the provider's models endpoint. Returns
 * `{ valid: true }` on a 2xx, a friendly `{ valid: false, error }` on auth
 * failure, and a sanitized error on network/other failures. `fetchImpl` is
 * injectable for tests/stories.
 */
export async function verifyApiKey(
  provider: Provider,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ValidationResult> {
  const format = validateKeyFormat(provider, apiKey);
  if (format.state !== "valid") {
    return { valid: false, error: format.message ?? "Enter a valid API key." };
  }

  const { url, headers } = verifyRequest(provider, apiKey.trim());

  try {
    const res = await fetchImpl(url, { method: "GET", headers });
    if (res.ok) return { valid: true };
    // The request carries nothing but the key, so an auth-class status means a
    // bad key. Google returns 400 ("API key not valid"); others use 401/403.
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return { valid: false, error: `Invalid ${provider.name} API key.` };
    }
    return {
      valid: false,
      error: sanitizeProviderErrorMessage(
        `${provider.name} rejected the key (HTTP ${res.status}).`,
        `Invalid ${provider.name} API key.`,
      ),
    };
  } catch (err) {
    return {
      valid: false,
      error: sanitizeProviderErrorMessage(
        err instanceof Error ? `Couldn't reach ${provider.name}: ${err.message}` : null,
        `Couldn't reach ${provider.name}. Check your connection.`,
      ),
    };
  }
}
