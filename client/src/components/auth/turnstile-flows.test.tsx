import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ siteKey: "runtime-key" as string | null, request: vi.fn(), mounts: vi.fn() }));
vi.mock("next-intl", () => ({ useExtracted: () => (message: string) => message }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "dark" }) }));
vi.mock("@/lib/configs", () => ({
  useConfigs: () => ({ configs: { turnstileSiteKey: state.siteKey }, isLoading: false }),
}));
vi.mock("@/lib/auth", () => ({
  authClient: {
    signIn: { email: state.request },
    signUp: { email: state.request },
    emailOtp: { sendVerificationOtp: state.request },
  },
}));
vi.mock("@/lib/userStore", () => ({ userStore: { setState: vi.fn() } }));
vi.mock("@/hooks/useSetPageTitle", () => ({ useSetPageTitle: vi.fn() }));
vi.mock("@/components/auth/SocialButtons", () => ({ SocialButtons: () => null }));
vi.mock("@/components/RybbitLogo", () => ({ RybbitLogo: () => null }));
vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: any) => {
    React.useEffect(() => {
      state.mounts();
    }, []);
    return (
      <button type="button" onClick={() => onSuccess("flow-token")}>
        Verify CAPTCHA
      </button>
    );
  },
}));
import { Login } from "@/app/invitation/components/login";
import { Signup } from "@/app/invitation/components/signup";
import ResetPassword from "@/app/reset-password/page";
import { AccountStep } from "@/app/signup/components/AccountStep";
import { useTurnstile } from "@/hooks/useTurnstile";
beforeEach(() => {
  vi.clearAllMocks();
  state.siteKey = "runtime-key";
  state.request.mockResolvedValue({ error: { message: "Try again" } });
});
afterEach(cleanup);
describe.each([
  ["invitation login", () => <Login callbackURL="/invitation" />, "Login to Accept Invitation"],
  ["invitation signup", () => <Signup callbackURL="/invitation" />, "Sign Up to Accept Invitation"],
  ["password reset email", () => <ResetPassword />, "Send Verification Code"],
] as const)("%s", (_name, page, buttonName) => {
  it("requires a challenge, sends the token, and refreshes it after rejection", async () => {
    let sentToken: string | null = null;
    state.request.mockImplementation(async (_data, options) => {
      const headers = new Headers();
      options.onRequest({ headers });
      sentToken = headers.get("x-captcha-response");
      return { error: { message: "Try again" } };
    });
    render(page());
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } });
    const password = screen.queryByLabelText("Password");
    if (password) fireEvent.change(password, { target: { value: "password123" } });
    expect((screen.getByRole("button", { name: buttonName }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.submit(screen.getByLabelText("Email").closest("form")!);
    expect(state.request).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Verify CAPTCHA"));
    fireEvent.click(screen.getByRole("button", { name: buttonName }));
    await waitFor(() => expect(state.request).toHaveBeenCalledOnce());
    expect(sentToken).toBe("flow-token");
    await waitFor(() =>
      expect((screen.getByRole("button", { name: buttonName }) as HTMLButtonElement).disabled).toBe(true)
    );
    expect(state.mounts.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
  it("works without a challenge when CAPTCHA is disabled", () => {
    state.siteKey = null;
    render(page());
    expect(screen.queryByText("Verify CAPTCHA")).toBeNull();
    expect((screen.getByRole("button", { name: buttonName }) as HTMLButtonElement).disabled).toBe(false);
  });
});
function AccountForm() {
  const { turnstileToken, setTurnstileToken, turnstileResetKey } = useTurnstile();
  return (
    <AccountStep
      email="user@example.com"
      setEmail={vi.fn()}
      password="password123"
      setPassword={vi.fn()}
      turnstileToken={turnstileToken}
      setTurnstileToken={setTurnstileToken}
      turnstileResetKey={turnstileResetKey}
      isLoading={false}
      onSubmit={state.request}
      setError={vi.fn()}
    />
  );
}
it("uses runtime CAPTCHA for the shared signup and claim account form", () => {
  render(<AccountForm />);
  expect((screen.getByRole("button", { name: "Continue" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByText("Verify CAPTCHA"));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(state.request).toHaveBeenCalledOnce();
});
