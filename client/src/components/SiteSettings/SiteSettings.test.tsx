import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteSettings } from "./SiteSettings";

const state = vi.hoisted(() => ({ gscEnabled: true, permissions: ["sites:configure", "gsc:write"] as string[] }));
vi.mock("next-intl", () => ({ useExtracted: () => (message: string) => message }));
vi.mock("@/lib/const", async importOriginal => ({ ...(await importOriginal<object>()), IS_CLOUD: false }));
vi.mock("@/lib/configs", () => ({ useConfigs: () => ({ configs: { gscEnabled: state.gscEnabled } }) }));
vi.mock("@/hooks/usePermissions", () => ({
  useSitePermissions: () => ({ can: (permission: string) => state.permissions.includes(permission) }),
}));
vi.mock("@/api/admin/hooks/useSites", () => ({
  useGetSite: () => ({ data: { siteId: 42, organizationId: "org", type: "web" }, isLoading: false }),
  useGetSitesFromOrg: () => ({ refetch: vi.fn() }),
}));
vi.mock("@/api/admin/endpoints", () => ({ updateSiteConfig: vi.fn() }));
vi.mock("./IntegrationsTab", () => ({
  IntegrationsTab: ({ disabled }: { disabled: boolean }) => <button disabled={disabled}>Connect Search Console</button>,
}));
vi.mock("./ScriptBuilder", () => ({ ScriptBuilder: () => null }));
vi.mock("./ImportManager", () => ({ ImportManager: () => null }));
vi.mock("./GeneralTab", () => ({ GeneralTab: () => null }));
vi.mock("./TrackingTab", () => ({ TrackingTab: () => null }));
vi.mock("./ExclusionsTab", () => ({ ExclusionsTab: () => null }));
vi.mock("./EmbedTab", () => ({ EmbedTab: () => null }));
vi.mock("./DashboardEmbedTab", () => ({ DashboardEmbedTab: () => null }));
vi.mock("./UsageTab", () => ({ UsageTab: () => null }));

beforeEach(() => {
  state.gscEnabled = true;
  state.permissions = ["sites:configure", "gsc:write"];
});
afterEach(cleanup);

function openSettings() {
  render(<SiteSettings siteId={42} trigger={<button>Open settings</button>} />);
  fireEvent.click(screen.getByRole("button", { name: "Open settings" }));
}

describe("self-hosted Search Console settings", () => {
  it("shows configured integrations and lets authorized users connect", () => {
    openSettings();
    fireEvent.click(screen.getByRole("button", { name: "Integrations" }));
    expect((screen.getByRole("button", { name: "Connect Search Console" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("keeps integrations visible but read-only without the GSC permission", () => {
    state.permissions = ["sites:configure"];
    openSettings();
    fireEvent.click(screen.getByRole("button", { name: "Integrations" }));
    expect((screen.getByRole("button", { name: "Connect Search Console" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("hides integrations when Google OAuth is not configured", () => {
    state.gscEnabled = false;
    openSettings();
    expect(screen.queryByRole("button", { name: "Integrations" })).toBeNull();
  });
});
