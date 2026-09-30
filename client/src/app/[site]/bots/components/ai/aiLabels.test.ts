import { BOT_CATEGORIES, BOT_PURPOSES, CLOUDFLARE_BOT_BEHAVIORS } from "@rybbit/shared";
import { describe, expect, it } from "vitest";
import { formatBotBehavior, formatBotCategory, formatBotPurpose, PURPOSE_LABELS } from "./aiLabels";

it("supports all current Cloudflare categories and the Other fallback", () => {
  expect(Object.keys(CLOUDFLARE_BOT_BEHAVIORS)).toEqual([
    "search",
    "agent",
    "training",
    "transact",
    "data_collection",
    "security",
    "seo",
    "advertising",
    "social_preview",
    "feed_fetching",
    "monitoring",
    "other",
  ]);
  expect(formatBotBehavior("advertising")).toBe("Ads Verification");
  expect(formatBotBehavior("monitoring")).toBe("Monitoring & Operations");
  expect(formatBotBehavior("social_preview")).toBe("Social / Link Preview");
});

describe("directory labels", () => {
  it.each(BOT_PURPOSES)("labels the stored purpose %s", purpose => {
    expect(PURPOSE_LABELS[purpose]).toBeTruthy();
    expect(formatBotPurpose(purpose)).not.toBe("Unclassified");
  });
  it.each(BOT_CATEGORIES)("labels the legacy family %s", category => {
    expect(formatBotCategory(category)).not.toBe(category);
  });
  it("distinguishes old missing classifications from the explicit Other category", () => {
    expect(formatBotBehavior("")).toBe("Unclassified");
    expect(formatBotPurpose("")).toBe("Unclassified");
    expect(formatBotPurpose("unknown")).toBe("Other");
    expect(formatBotCategory("")).toBe("Uncategorized");
    expect(formatBotCategory("stale_version")).toBe("Stale Version");
    expect(formatBotBehavior("future_category")).toBe("future_category");
  });
});
