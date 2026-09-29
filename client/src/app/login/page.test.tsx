import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  configs: undefined as { disableSignup: boolean; turnstileSiteKey?: string | null } | undefined,
  loading: false,
  error: null as Error | null,
  signIn: vi.fn(),
  push: vi.fn(),
  setUser: vi.fn(),
  widgetMounts: vi.fn(),
}));

vi.mock("next-intl", () => ({ useExtracted: () => (message: string) => message }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: state.push }),
}));
vi.mock("@/lib/configs", () => ({
  useConfigs: () => ({ configs: state.configs, isLoading: state.loading, error: state.error }),
}));
vi.mock("@/lib/const", async importOriginal => ({
  ...(await importOriginal<typeof import("@/lib/const")>()),
  IS_CLOUD: false,
}));
vi.mock("@/lib/auth", () => ({ authClient: { signIn: { email: state.signIn } } }));
vi.mock("@/lib/userStore", () => ({ userStore: { setState: state.setUser } }));
vi.mock("@/hooks/useSetPageTitle", () => ({ useSetPageTitle: vi.fn() }));
vi.mock("@/components/SpinningGlobe", () => ({ SpinningGlobe: () => null }));
vi.mock("@/components/auth/SocialButtons", () => ({ SocialButtons: () => null }));
vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "dark" }) }));
vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ siteKey, onSuccess, onExpire, onError }: any) => {
    React.useEffect(() => {
      state.widgetMounts();
    }, []);
    return (
      <div data-testid="captcha" data-site-key={siteKey}>
        <button type="button" onClick={() => onSuccess("verified-token")}>
          Complete CAPTCHA
        </button>
        <button type="button" onClick={onExpire}>
          Expire CAPTCHA
        </button>
        <button type="button" onClick={onError}>
          Fail CAPTCHA
        </button>
      </div>
    );
  },
}));

import Page from "./page";

beforeEach(() => {
  vi.clearAllMocks();
  state.configs = { disableSignup: true };
  state.loading = false;
  state.error = null;
});
afterEach(cleanup);

describe("login page", () => {
  it("hides the registration invitation when signup is disabled", () => {
    render(<Page />);
    expect(screen.queryByRole("link", { name: "Sign up" })).toBeNull();
    expect(screen.queryByText("Don't have an account?", { exact: false })).toBeNull();
  });

  it("shows the registration link when signup is explicitly enabled", () => {
    state.configs = { disableSignup: false };
    render(<Page />);
    expect(screen.getByRole("link", { name: "Sign up" }).getAttribute("href")).toBe("/signup");
  });

  it("does not flash the registration link while configuration loads", () => {
    state.configs = undefined;
    state.loading = true;
    const { rerender } = render(<Page />);
    expect(screen.queryByRole("link", { name: "Sign up" })).toBeNull();
    state.configs = { disableSignup: true };
    state.loading = false;
    rerender(<Page />);
    expect(screen.queryByRole("link", { name: "Sign up" })).toBeNull();
  });

  it("keeps registration hidden when configuration cannot be loaded", () => {
    state.configs = undefined;
    state.error = new Error("Config unavailable");
    render(<Page />);
    expect(screen.queryByRole("link", { name: "Sign up" })).toBeNull();
    expect(screen.getByRole("button", { name: "Login" })).toBeTruthy();
  });

  it("allows existing users to log in with registration disabled", async () => {
    const user = { id: "user-1" };
    state.signIn.mockResolvedValue({ data: { user } });
    render(<Page />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => expect(state.push).toHaveBeenCalledWith("/"));
    expect(state.signIn).toHaveBeenCalledWith(
      { email: "admin@example.com", password: "test-password" },
      expect.objectContaining({ onRequest: expect.any(Function) })
    );
    expect(state.setUser).toHaveBeenCalledWith({ user });
  });
});

function fillCredentials() {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
}

describe("self-hosted login CAPTCHA", () => {
  beforeEach(() => {
    state.configs = { disableSignup: true, turnstileSiteKey: "runtime-public-key" };
  });

  it("uses the runtime key and blocks submission until the challenge is completed", () => {
    render(<Page />);
    fillCredentials();
    expect(screen.getByTestId("captcha").getAttribute("data-site-key")).toBe("runtime-public-key");
    expect((screen.getByRole("button", { name: "Login" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.submit(screen.getByLabelText("Email").closest("form")!);
    expect(state.signIn).not.toHaveBeenCalled();
  });

  it.each(["Expire CAPTCHA", "Fail CAPTCHA"])("clears a token on %s", action => {
    render(<Page />);
    fireEvent.click(screen.getByText("Complete CAPTCHA"));
    expect((screen.getByRole("button", { name: "Login" }) as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(screen.getByText(action));
    expect((screen.getByRole("button", { name: "Login" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it.each([false, true])(
    "sends the token and refreshes the challenge after failed login (network failure=%s)",
    async networkError => {
      let sentToken: string | null = null;
      state.signIn.mockImplementation(async (_credentials, options) => {
        const headers = new Headers();
        options.onRequest({ headers });
        sentToken = headers.get("x-captcha-response");
        if (networkError) throw new Error("Network unavailable");
        return { error: { message: "Invalid credentials" } };
      });
      render(<Page />);
      fillCredentials();
      fireEvent.click(screen.getByText("Complete CAPTCHA"));
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      await waitFor(() => expect(state.widgetMounts).toHaveBeenCalledTimes(2));
      expect(sentToken).toBe("verified-token");
      expect((screen.getByRole("button", { name: "Login" }) as HTMLButtonElement).disabled).toBe(true);
      expect(state.push).not.toHaveBeenCalled();
    }
  );

  it.each([true, false])("blocks submissions when config is unavailable (loading=%s)", loading => {
    state.configs = undefined;
    state.loading = loading;
    state.error = loading ? null : new Error("Config unavailable");
    render(<Page />);
    fillCredentials();
    fireEvent.submit(screen.getByLabelText("Email").closest("form")!);
    expect(state.signIn).not.toHaveBeenCalled();
  });
});
