import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AccountStep } from "./AccountStep";

const configState = vi.hoisted(() => ({
  configs: { turnstileSiteKey: null as string | null } as { turnstileSiteKey: string | null } | undefined,
  isLoading: false,
  error: null as Error | null,
}));
vi.mock("@/lib/configs", () => ({ useConfigs: () => configState }));
beforeEach(() => {
  configState.configs = { turnstileSiteKey: null };
  configState.isLoading = false;
  configState.error = null;
});

vi.mock("next-intl", () => ({ useExtracted: () => (message: string) => message }));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock("@/lib/const", async importOriginal => ({ ...(await importOriginal<object>()), IS_CLOUD: false }));
vi.mock("@/components/auth/SocialButtons", () => ({ SocialButtons: () => null }));
vi.mock("@/components/auth/Turnstile", () => ({ Turnstile: () => null }));

afterEach(cleanup);

function renderStep(props: Partial<React.ComponentProps<typeof AccountStep>> = {}) {
  const onSubmit = vi.fn();
  render(
    <AccountStep
      email="ada@example.com"
      setEmail={() => {}}
      password="correct horse"
      setPassword={() => {}}
      turnstileResetKey={0}
      turnstileToken=""
      setTurnstileToken={() => {}}
      isLoading={false}
      onSubmit={onSubmit}
      setError={() => {}}
      {...props}
    />
  );
  const email = screen.getByLabelText("Email") as HTMLInputElement;
  return { onSubmit, email, form: email.form! };
}

describe("AccountStep", () => {
  it("puts the fields and Continue in one form, so Enter submits", () => {
    const { onSubmit, email, form } = renderStep();

    const button = screen.getByRole("button", { name: "Continue" }) as HTMLButtonElement;
    expect(form).toBeTruthy();
    expect(button.form).toBe(form);
    expect(button.type).toBe("submit");
    expect((screen.getByLabelText("Password") as HTMLInputElement).form).toBe(email.form);

    // What the browser does on Enter: submit through the form, validation included.
    form.requestSubmit();
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("lets the browser's validation stop an invalid submit", () => {
    const empty = renderStep({ email: "", password: "" });
    empty.form.requestSubmit();
    expect(empty.email.validity.valueMissing).toBe(true);
    expect(empty.onSubmit).not.toHaveBeenCalled();
    cleanup();

    const malformed = renderStep({ email: "not-an-email" });
    malformed.form.requestSubmit();
    expect(malformed.email.validity.typeMismatch).toBe(true);
    expect(malformed.onSubmit).not.toHaveBeenCalled();
  });

  it("keeps Continue in place, focusable and busy while the account is created", () => {
    const { onSubmit, form } = renderStep({ isLoading: true });

    const button = screen.getByRole("button", { name: "Creating account..." }) as HTMLButtonElement;
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.disabled).toBe(false);
    expect(button.textContent).toContain("Continue");

    // A second Enter while the first request runs is swallowed by the busy button.
    button.click();
    expect(onSubmit).not.toHaveBeenCalled();
    form.requestSubmit();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("requires the configured self-hosted CAPTCHA for form submission", () => {
    configState.configs = { turnstileSiteKey: "self-hosted-key" };
    const pending = renderStep();
    pending.form.requestSubmit();
    expect(pending.onSubmit).not.toHaveBeenCalled();
    cleanup();

    const verified = renderStep({ turnstileToken: "verified-token" });
    verified.form.requestSubmit();
    expect(verified.onSubmit).toHaveBeenCalledOnce();
  });

  it.each(["loading", "error", "missing"])("prevents submission when runtime configuration is %s", state => {
    configState.configs = undefined;
    configState.isLoading = state === "loading";
    configState.error = state === "error" ? new Error("Config failed") : null;
    const { onSubmit, form } = renderStep();
    form.requestSubmit();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
