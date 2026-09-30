/**
 * Stored bot classifications. Keep existing values stable for historical data.
 * Includes Cloudflare's current behaviors and its legacy directory categories:
 * https://developers.cloudflare.com/bots/concepts/bot/verified-bots/#classification
 * AI search/training/agents remain separate purposes for Rybbit's AI reports.
 * These describe claimed user-agent identities, not verified bot ownership.
 */
export const BOT_CATEGORIES = [
  "search",
  "ai",
  "social",
  "monitoring",
  "seo",
  "security",
  "framework",
  "headless",
  "generic",
  "advertising",
  "feed_fetching",
  "data_collection",
  "academic_research",
  "accessibility",
  "archiver",
  "aggregator",
  "social_marketing",
  "webhooks",
  "transact",
] as const;
export type BotCategory = (typeof BOT_CATEGORIES)[number];

export const BOT_PURPOSES = [
  "ai_training",
  "ai_search",
  "ai_agent",
  "search",
  "social_preview",
  "seo",
  "monitoring",
  "security",
  "scripted",
  "headless",
  "advertising",
  "feed_fetching",
  "data_collection",
  "academic_research",
  "accessibility",
  "archiver",
  "aggregator",
  "social_marketing",
  "webhooks",
  "transact",
  "unknown",
] as const;
export type BotPurpose = (typeof BOT_PURPOSES)[number];

/** Primary behavior grouping for the directory view; not a claim of verification. */
export const CLOUDFLARE_BOT_BEHAVIORS = {
  search: {
    label: "Search",
    purposes: ["search", "ai_search"],
  },
  agent: {
    label: "Agent",
    purposes: ["ai_agent"],
  },
  training: {
    label: "Training",
    purposes: ["ai_training"],
  },
  transact: {
    label: "Transact",
    purposes: ["transact"],
  },
  data_collection: {
    label: "Data Collection",
    purposes: ["data_collection", "academic_research", "archiver", "aggregator", "social_marketing"],
  },
  security: {
    label: "Security Testing",
    purposes: ["security"],
  },
  seo: {
    label: "SEO",
    purposes: ["seo", "accessibility"],
  },
  advertising: {
    label: "Ads Verification",
    purposes: ["advertising"],
  },
  social_preview: {
    label: "Social / Link Preview",
    purposes: ["social_preview"],
  },
  feed_fetching: {
    label: "Feed Fetching",
    purposes: ["feed_fetching"],
  },
  monitoring: {
    label: "Monitoring & Operations",
    purposes: ["monitoring", "webhooks"],
  },
  other: {
    label: "Other",
    purposes: ["scripted", "headless", "unknown"],
  },
} satisfies Record<string, { label: string; purposes: readonly BotPurpose[] }>;
