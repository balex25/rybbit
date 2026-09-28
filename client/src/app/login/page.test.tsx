import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  configs: undefined as { disableSignup: boolean } | undefined,
  loading: false,
  error: null as Error | null,
  signIn: vi.fn(),
  push: vi.fn(),
  setUser: vi.fn(),
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
vi.mock("@/components/auth/Turnstile", () => ({ Turnstile: () => null }));

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
