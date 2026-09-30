"use client";

import { truncateString } from "../../../../../lib/utils";
import { BotSectionTabs, type BotSectionTab } from "../BotSectionTabs";
import { formatBotBehavior, formatBotCategory, formatBotPurpose } from "../ai/aiLabels";

type Tab = "bots" | "operators" | "purposes" | "asn_orgs" | "bot_behaviors" | "bot_categories" | "ua_patterns";

export function BotMetadata() {
  const tabs: BotSectionTab<Tab>[] = [
    {
      value: "bots",
      label: "Bots",
      section: {
        dimension: "bot_name",
        title: "Bots",
        getValue: item => item.value,
        getKey: item => item.value || "unnamed",
        // Only the curated patterns carry a name. A hit on a generic rule is a
        // bot nobody has identified, and rows written before identity shipped
        // land here too.
        getLabel: item => item.value || "Unnamed",
        filterable: false,
      },
    },
    {
      value: "operators",
      label: "Operators",
      section: {
        dimension: "bot_operator",
        title: "Operators",
        getValue: item => item.value,
        getKey: item => item.value || "unknown",
        getLabel: item => item.value || "Unknown",
        filterable: false,
      },
    },
    {
      value: "purposes",
      label: "Purpose",
      section: {
        dimension: "bot_purpose",
        title: "Purpose",
        getValue: item => item.value,
        getKey: item => item.value || "unclassified",
        getLabel: item => formatBotPurpose(item.value),
        filterable: false,
      },
    },
    {
      value: "asn_orgs",
      label: "ASN Orgs",
      section: {
        dimension: "asn_org",
        title: "ASN Orgs",
        getValue: item => item.value,
        getKey: item => item.value || "unknown",
        getLabel: item => item.value || "Unknown",
        filterable: false,
      },
    },
    {
      value: "bot_behaviors",
      label: "Categories",
      section: {
        dimension: "bot_behavior",
        title: "Bot Categories",
        getValue: item => item.value,
        getKey: item => item.value || "unclassified",
        getLabel: item => formatBotBehavior(item.value),
        filterable: false,
      },
    },
    {
      value: "bot_categories",
      label: "Families",
      section: {
        dimension: "bot_category",
        title: "Bot Families",
        getValue: item => item.value,
        getKey: item => item.value || "uncategorized",
        getLabel: item => formatBotCategory(item.value),
        filterable: false,
      },
    },
    {
      value: "ua_patterns",
      label: "UA Patterns",
      section: {
        dimension: "matched_ua_pattern",
        title: "Matched UA Patterns",
        getValue: item => item.value,
        getKey: item => item.value || "none",
        getLabel: item => truncateString(item.value, 70) || "No matched pattern",
        filterable: false,
      },
    },
  ];

  return <BotSectionTabs defaultValue="bots" tabs={tabs} />;
}
