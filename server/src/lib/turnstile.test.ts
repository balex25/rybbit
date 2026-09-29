import { afterEach, describe, expect, it, vi } from "vitest";
import { createTurnstilePlugin, getTurnstileConfig } from "./turnstile.js";

afterEach(() => vi.unstubAllGlobals());

describe("Turnstile configuration", () => {
  it("is disabled when both keys are empty", () => {
    expect(getTurnstileConfig({})).toBeNull();
    expect(getTurnstileConfig({ TURNSTILE_SITE_KEY: " ", TURNSTILE_SECRET_KEY: "" })).toBeNull();
  });

  it.each(["true", "false"])("enables CAPTCHA with runtime keys regardless of CLOUD=%s", cloud => {
    expect(
      getTurnstileConfig({ CLOUD: cloud, TURNSTILE_SITE_KEY: " public ", TURNSTILE_SECRET_KEY: " secret " })
    ).toEqual({ siteKey: "public", secretKey: "secret" });
  });

  it.each(["TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"])("rejects incomplete configuration with only %s", key => {
    expect(() => getTurnstileConfig({ [key]: "configured" })).toThrow(
      "Set both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY"
    );
  });
});

const plugin = createTurnstilePlugin({ siteKey: "public-key", secretKey: "private-key" });
function verify(path: string, token?: string) {
  return plugin.onRequest(
    new Request("https://analytics.example.com/api/auth" + path, {
      method: "POST",
      headers: token ? { "x-captcha-response": token } : {},
    }),
    { options: { basePath: "/api/auth" }, logger: { error: vi.fn() } } as never
  );
}

describe("authentication CAPTCHA enforcement", () => {
  it.each(["/sign-in/email", "/sign-up/email", "/request-password-reset", "/email-otp/send-verification-otp"])(
    "rejects missing CAPTCHA on %s before authentication",
    async path => {
      const fetch = vi.fn();
      vi.stubGlobal("fetch", fetch);
      expect((await verify(path))?.response.status).toBe(400);
      expect(fetch).not.toHaveBeenCalled();
    }
  );

  it("rejects an invalid or already-used token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] }))
    );
    expect((await verify("/sign-in/email", "invalid"))?.response.status).toBe(403);
  });

  it("passes a valid token to Cloudflare with the server secret", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal("fetch", fetch);
    expect(await verify("/sign-in/email", "valid-token")).toBeUndefined();
    expect(fetch).toHaveBeenCalledOnce();
    const [url, options] = fetch.mock.calls[0];
    expect(String(url)).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(JSON.parse(options.body)).toMatchObject({ secret: "private-key", response: "valid-token" });
  });

  it("fails closed when the verification provider is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await verify("/sign-in/email", "token"))?.response.status).toBe(500);
  });

  it.each(["/get-session", "/sign-out", "/email-otp/reset-password", "/callback/google"])(
    "does not require a fresh challenge for %s",
    async path => {
      const fetch = vi.fn();
      vi.stubGlobal("fetch", fetch);
      expect(await verify(path)).toBeUndefined();
      expect(fetch).not.toHaveBeenCalled();
    }
  );
});
