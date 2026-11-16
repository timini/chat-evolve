import { describe, it, expect } from "vitest";
import { redactSensitiveData, sanitizeProviderErrorMessage } from "./sanitize";

describe("redactSensitiveData", () => {
  it("redacts Anthropic, OpenAI, and Google key shapes", () => {
    expect(redactSensitiveData("key sk-ant-api03-ABCDEFGH123 leaked")).toContain("[REDACTED]");
    expect(redactSensitiveData("sk-proj-ABCDEFGH123456")).toBe("[REDACTED]");
    expect(redactSensitiveData("AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ012345")).toBe("[REDACTED]");
  });

  it("redacts bearer tokens and url key params", () => {
    expect(redactSensitiveData("Authorization: Bearer abcdef123456")).toContain("[REDACTED]");
    expect(redactSensitiveData("https://x.com/v1?key=supersecretvalue")).toContain("[REDACTED]");
  });

  it("leaves ordinary text untouched", () => {
    expect(redactSensitiveData("Invalid API key.")).toBe("Invalid API key.");
  });
});

describe("sanitizeProviderErrorMessage", () => {
  it("returns the fallback for empty input", () => {
    expect(sanitizeProviderErrorMessage("", "fallback")).toBe("fallback");
    expect(sanitizeProviderErrorMessage(null, "fallback")).toBe("fallback");
  });

  it("redacts secrets from the message", () => {
    const out = sanitizeProviderErrorMessage("bad key sk-ant-api03-SECRETSECRET");
    expect(out).not.toContain("SECRETSECRET");
    expect(out).toContain("[REDACTED]");
  });
});
