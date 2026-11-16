import { describe, it, expect, vi } from "vitest";
import { validateKeyFormat, verifyApiKey } from "./validation";
import { PROVIDERS } from "./content";

const { anthropic, openai, google, deepseek } = PROVIDERS;
const VALID_ANTHROPIC = "sk-ant-api03-abcdefghijklmnop";

describe("validateKeyFormat", () => {
  it("treats empty / whitespace input as the empty state (not an error)", () => {
    expect(validateKeyFormat(anthropic, "")).toEqual({ state: "empty" });
    expect(validateKeyFormat(anthropic, "   ")).toEqual({ state: "empty" });
  });

  it("rejects a key with the wrong prefix and explains why", () => {
    const r = validateKeyFormat(anthropic, "pk-wrong-prefix-1234567890");
    expect(r.state).toBe("invalid");
    expect(r.message).toMatch(/sk-ant-/);
  });

  it("rejects a correctly-prefixed key that is too short", () => {
    const r = validateKeyFormat(anthropic, "sk-ant-12");
    expect(r.state).toBe("invalid");
    expect(r.message).toMatch(/short/i);
  });

  it("accepts well-formed keys per provider", () => {
    expect(validateKeyFormat(anthropic, VALID_ANTHROPIC)).toEqual({ state: "valid" });
    expect(validateKeyFormat(openai, "sk-proj-abcdefghijklmnopqrst").state).toBe("valid");
    expect(validateKeyFormat(google, "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ012345").state).toBe("valid");
    expect(validateKeyFormat(deepseek, "sk-deepseekabcdefghijklmnop").state).toBe("valid");
  });

  it("ignores surrounding whitespace when validating", () => {
    expect(validateKeyFormat(anthropic, `  ${VALID_ANTHROPIC}  `).state).toBe("valid");
  });
});

describe("verifyApiKey", () => {
  const mockFetch = (status: number) =>
    vi.fn((_url: string, _init?: RequestInit) =>
      Promise.resolve(new Response(null, { status })),
    );

  it("returns valid when the provider responds 2xx", async () => {
    const res = await verifyApiKey(anthropic, VALID_ANTHROPIC, mockFetch(200) as unknown as typeof fetch);
    expect(res).toEqual({ valid: true });
  });

  it("hits the right endpoint with the right auth headers (Anthropic)", async () => {
    const spy = mockFetch(200);
    await verifyApiKey(anthropic, VALID_ANTHROPIC, spy as unknown as typeof fetch);
    const [url, init] = spy.mock.calls[0]!;
    expect(url).toBe("https://api.anthropic.com/v1/models");
    expect(init?.headers).toMatchObject({
      "x-api-key": VALID_ANTHROPIC,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    });
  });

  it("uses Bearer auth for OpenAI/DeepSeek and x-goog-api-key for Google", async () => {
    const spy = mockFetch(200);
    await verifyApiKey(openai, "sk-proj-abcdefghijklmnopqrst", spy as unknown as typeof fetch);
    expect(spy.mock.calls[0]![1]?.headers).toMatchObject({
      Authorization: "Bearer sk-proj-abcdefghijklmnopqrst",
    });
    await verifyApiKey(google, "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ012345", spy as unknown as typeof fetch);
    expect(spy.mock.calls[1]![1]?.headers).toMatchObject({
      "x-goog-api-key": "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ012345",
    });
  });

  it("returns a friendly invalid-key error on 401", async () => {
    const res = await verifyApiKey(anthropic, VALID_ANTHROPIC, mockFetch(401) as unknown as typeof fetch);
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/Invalid Anthropic API key/);
  });

  it("treats Google's 400 ('API key not valid') as an invalid key", async () => {
    const res = await verifyApiKey(
      google,
      "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ012345",
      mockFetch(400) as unknown as typeof fetch,
    );
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/Invalid Google API key/);
  });

  it("does not call the network when the format is invalid", async () => {
    const spy = mockFetch(200);
    const res = await verifyApiKey(anthropic, "bad", spy as unknown as typeof fetch);
    expect(spy).not.toHaveBeenCalled();
    expect(res.valid).toBe(false);
  });

  it("returns a sanitized, friendly error on network failure", async () => {
    const boom = vi.fn((_url: string, _init?: RequestInit) =>
      Promise.reject(new Error(`network down for key ${VALID_ANTHROPIC}`)),
    );
    const res = await verifyApiKey(anthropic, VALID_ANTHROPIC, boom as unknown as typeof fetch);
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/reach Anthropic/i);
    expect(res.error).not.toContain(VALID_ANTHROPIC); // key redacted
  });
});
