import { captcha } from "better-auth/plugins";

export function getTurnstileConfig(env: NodeJS.ProcessEnv) {
  const siteKey = env.TURNSTILE_SITE_KEY?.trim();
  const secretKey = env.TURNSTILE_SECRET_KEY?.trim();
  if (!siteKey && !secretKey) return null;
  if (!siteKey || !secretKey) {
    throw new Error("Set both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY, or leave both empty to disable CAPTCHA.");
  }
  return { siteKey, secretKey };
}

export function createTurnstilePlugin(config: NonNullable<ReturnType<typeof getTurnstileConfig>>) {
  return captcha({
    provider: "cloudflare-turnstile",
    secretKey: config.secretKey,
    endpoints: ["/sign-in/email", "/sign-up/email", "/request-password-reset", "/email-otp/send-verification-otp"],
  });
}
