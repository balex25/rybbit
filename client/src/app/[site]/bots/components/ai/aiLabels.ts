import { CLOUDFLARE_BOT_BEHAVIORS, type BotCategory } from "@rybbit/shared";
import type { BotPurpose } from "../../../../../api/analytics/endpoints";

/** Colors for the two halves of AI traffic, used by the chart and the legend. */
export const AI_AGENT_COLOR = "hsl(var(--dataviz))";
export const AI_CRAWLER_COLOR = "hsl(var(--amber-400))";

export const PURPOSE_LABELS: Record<BotPurpose, string> = {
  ai_training: "AI training crawler",
  ai_search: "AI answer engine",
  ai_agent: "AI agent",
  search: "Search engine",
  social_preview: "Link preview",
  seo: "SEO crawler",
  monitoring: "Monitoring",
  security: "Security scanner",
  scripted: "Scripted client",
  headless: "Headless browser",
  advertising: "Advertising & Marketing",
  feed_fetching: "Feed Fetcher",
  data_collection: "Data Collection",
  academic_research: "Academic Research",
  accessibility: "Accessibility",
  archiver: "Archiver",
  aggregator: "Aggregator",
  social_marketing: "Social Media Marketing",
  webhooks: "Webhooks",
  transact: "Transact",
  unknown: "Other",
};

const PURPOSE_DESCRIPTIONS: Record<string, string> = {
  ai_training: "Collecting pages to train a model. Does not send readers back.",
  ai_search: "Indexing pages so an assistant can cite them. Can send readers back.",
  ai_agent: "Someone asked an assistant to open this page, just now.",
};

/**
 * Rows written before bot identity shipped carry an empty purpose. Saying so is
 * more honest than folding them into a real category.
 */
export function formatBotPurpose(value: string) {
  return PURPOSE_LABELS[value as BotPurpose] ?? (value ? value : "Unclassified");
}

export function describeBotPurpose(value: string) {
  return PURPOSE_DESCRIPTIONS[value as BotPurpose];
}

export const AI_PURPOSE_ORDER: BotPurpose[] = ["ai_agent", "ai_search", "ai_training"];

export function formatBotBehavior(value: string) {
  return CLOUDFLARE_BOT_BEHAVIORS[value as keyof typeof CLOUDFLARE_BOT_BEHAVIORS]?.label ?? (value || "Unclassified");
}

const CATEGORY_LABELS: Record<BotCategory, string> = {
  search: "Search Engine Crawler",
  ai: "AI",
  social: "Page Preview",
  monitoring: "Monitoring & Analytics",
  seo: "Search Engine Optimization",
  security: "Security",
  framework: "Scripted Client",
  headless: "Headless Browser",
  generic: "Other",
  advertising: "Advertising & Marketing",
  feed_fetching: "Feed Fetcher",
  data_collection: "Data Collection",
  academic_research: "Academic Research",
  accessibility: "Accessibility",
  archiver: "Archiver",
  aggregator: "Aggregator",
  social_marketing: "Social Media Marketing",
  webhooks: "Webhooks",
  transact: "Transact",
};

export function formatBotCategory(value: string) {
  return (
    CATEGORY_LABELS[value as BotCategory] ??
    (value
      ? value
          .split(/[_-]/)
          .filter(Boolean)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Uncategorized")
  );
}
