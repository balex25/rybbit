/**
 * Bot user-agent patterns, vendored from the `isbot` package (Unlicense / public domain)
 * and annotated with categories.
 *
 * Source: https://github.com/omrilotan/isbot/blob/main/src/patterns.json
 *
 * Categories drive policy in trackEvent: some bot categories are dropped silently,
 * others can be counted and tagged. To re-sync against upstream, copy patterns.json
 * verbatim and reapply categories from this file by matching the `pattern` string.
 *
 * IMPORTANT: order matters. classifyUA returns the FIRST matching pattern, so more
 * specific patterns must appear before generic substring matches. The upstream
 * ordering already mostly satisfies this (anchored patterns first, generic
 * substrings last); preserve it on sync.
 */

import type { BotCategory, BotPurpose } from "@rybbit/shared";

export type { BotCategory, BotPurpose } from "@rybbit/shared";

export interface BotPattern {
  /** Regex source string. Compiled with the `i` flag. */
  pattern: string;
  category: BotCategory;
  /**
   * Human-readable bot name, e.g. "GPTBot". Only set on the curated
   * EXTRA_BOT_PATTERNS entries — the vendored upstream list is matched by
   * `pattern` string on re-sync, so it is deliberately left un-annotated.
   */
  name?: string;
  /** Who operates the bot, e.g. "OpenAI". */
  operator?: string;
  purpose?: BotPurpose;
}

export const BOT_PATTERNS: BotPattern[] = [
  { pattern: " daum[ /]", category: "search" },
  { pattern: " deusu/", category: "search" },
  { pattern: "(?:^|[^g])news(?!sapphire)", category: "generic" },
  { pattern: "(?<! (?:channel/|google/))google(?!(app|/google| pixel))", category: "search" },
  { pattern: "(?<! cu)bots?(?:\\b|_)", category: "generic" },
  { pattern: "(?<!(?:lib))http", category: "framework" },
  { pattern: "(?<!cam)scan", category: "security" },
  { pattern: "24x7", category: "monitoring" },
  { pattern: "@[a-z][\\w-]+\\.", category: "generic" },
  { pattern: "\\(\\)", category: "generic" },
  { pattern: "\\.com\\b", category: "generic" },
  { pattern: "\\b\\w+\\.ai", category: "ai" },
  { pattern: "\\bcursor/", category: "ai" },
  { pattern: "\\bmanus-user/", category: "ai" },
  { pattern: "\\bort/", category: "generic" },
  { pattern: "\\bperl\\b", category: "framework" },
  { pattern: "\\bplaywright\\b", category: "headless" },
  { pattern: "\\bsecurityheaders\\b", category: "monitoring" },
  { pattern: "\\bselenium\\b", category: "headless" },
  { pattern: "\\btime/", category: "generic" },
  { pattern: "\\|", category: "generic" },
  { pattern: "^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)", category: "generic" },
  { pattern: "^[\\w\\-]+/[\\w]+$", category: "generic" },
  { pattern: "^[^ ]{50,}$", category: "generic" },
  { pattern: "^\\d+\\b", category: "generic" },
  { pattern: "^\\W", category: "generic" },
  { pattern: "^\\w*search\\b", category: "search" },
  { pattern: "^\\w+/[\\w\\(\\)]*$", category: "generic" },
  { pattern: "^\\w+/\\d\\.\\d\\s\\([\\w@]+\\)$", category: "generic" },
  { pattern: "^active", category: "generic" },
  { pattern: "^ad muncher", category: "generic" },
  { pattern: "^amaya", category: "generic" },
  { pattern: "^apache/", category: "framework" },
  { pattern: "^avsdevicesdk/", category: "generic" },
  { pattern: "^azure", category: "framework" },
  { pattern: "^biglotron", category: "seo" },
  { pattern: "^bot", category: "generic" },
  { pattern: "^bw/", category: "generic" },
  { pattern: "^clamav[ /]", category: "security" },
  { pattern: "^claude-code/", category: "ai" },
  { pattern: "^client/", category: "generic" },
  { pattern: "^cobweb/", category: "seo" },
  { pattern: "^custom", category: "generic" },
  { pattern: "^ddg[_-]android", category: "search" },
  { pattern: "^discourse", category: "generic" },
  { pattern: "^dispatch/\\d", category: "generic" },
  { pattern: "^downcast/", category: "generic" },
  { pattern: "^duckduckgo", category: "search" },
  { pattern: "^email", category: "generic" },
  { pattern: "^facebook", category: "social" },
  { pattern: "^getright/", category: "generic" },
  { pattern: "^gozilla/", category: "generic" },
  { pattern: "^hobbit", category: "generic" },
  { pattern: "^hotzonu", category: "generic" },
  { pattern: "^hwcdn/", category: "generic" },
  { pattern: "^igetter/", category: "generic" },
  { pattern: "^jeode/", category: "framework" },
  { pattern: "^jetty/", category: "framework" },
  { pattern: "^jigsaw", category: "framework" },
  { pattern: "^microsoft bits", category: "framework" },
  { pattern: "^movabletype", category: "generic" },
  { pattern: "^mozilla/\\d\\.\\d\\s[\\w\\.-]+$", category: "generic" },
  { pattern: "^mozilla/\\d\\.\\d\\s\\((?:compatible;)?(?:\\s?[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$", category: "generic" },
  { pattern: "^navermailapp", category: "generic" },
  { pattern: "^netsurf", category: "generic" },
  { pattern: "^offline", category: "generic" },
  { pattern: "^openai/", category: "ai" },
  { pattern: "^owler", category: "seo" },
  { pattern: "^php", category: "framework" },
  { pattern: "^postman", category: "framework" },
  { pattern: "^python", category: "framework" },
  { pattern: "^rank", category: "seo" },
  { pattern: "^read", category: "generic" },
  { pattern: "^reed", category: "generic" },
  { pattern: "^rest", category: "framework" },
  { pattern: "^rss", category: "generic" },
  { pattern: "^snapchat", category: "social" },
  { pattern: "^space bison", category: "generic" },
  { pattern: "^svn", category: "framework" },
  { pattern: "^swcd ", category: "generic" },
  { pattern: "^taringa", category: "social" },
  { pattern: "^thumbor/", category: "framework" },
  { pattern: "^track", category: "generic" },
  { pattern: "^w3c", category: "generic" },
  { pattern: "^webbandit/", category: "generic" },
  { pattern: "^webcopier", category: "generic" },
  { pattern: "^wget", category: "framework" },
  { pattern: "^whatsapp", category: "social" },
  { pattern: "^wordpress", category: "generic" },
  { pattern: "^xenu link sleuth", category: "seo" },
  { pattern: "^yahoo", category: "search" },
  { pattern: "^yandex", category: "search" },
  { pattern: "^zdm/\\d", category: "generic" },
  { pattern: "^zoom marketplace/", category: "generic" },
  { pattern: "advisor", category: "generic" },
  { pattern: "agent\\b", category: "generic" },
  { pattern: "analyzer", category: "monitoring" },
  { pattern: "archive", category: "generic" },
  { pattern: "ask jeeves/teoma", category: "search" },
  { pattern: "audit", category: "monitoring" },
  { pattern: "bit\\.ly/", category: "generic" },
  { pattern: "bluecoat drtr", category: "generic" },
  { pattern: "browsex", category: "generic" },
  { pattern: "burpcollaborator", category: "security" },
  { pattern: "capture", category: "generic" },
  { pattern: "catch", category: "generic" },
  { pattern: "check\\b", category: "monitoring" },
  { pattern: "checker", category: "monitoring" },
  { pattern: "chrome-lighthouse", category: "monitoring" },
  { pattern: "chromeframe", category: "generic" },
  { pattern: "classifier", category: "generic" },
  { pattern: "cloudflare", category: "generic" },
  { pattern: "convertify", category: "generic" },
  { pattern: "crawl", category: "generic" },
  { pattern: "cypress/", category: "headless" },
  { pattern: "dareboost", category: "monitoring" },
  { pattern: "datanyze", category: "seo" },
  { pattern: "dejaclick", category: "monitoring" },
  { pattern: "detect", category: "monitoring" },
  { pattern: "dmbrowser", category: "generic" },
  { pattern: "download", category: "generic" },
  { pattern: "exaleadcloudview", category: "search" },
  { pattern: "feed", category: "generic" },
  { pattern: "fetcher", category: "generic" },
  { pattern: "firephp", category: "framework" },
  { pattern: "functionize", category: "monitoring" },
  { pattern: "grab", category: "generic" },
  { pattern: "headless", category: "headless" },
  { pattern: "httrack", category: "generic" },
  { pattern: "hubspot marketing grader", category: "monitoring" },
  { pattern: "ibisbrowser", category: "generic" },
  { pattern: "infrawatch", category: "monitoring" },
  { pattern: "insight", category: "monitoring" },
  { pattern: "inspect", category: "monitoring" },
  { pattern: "iplabel", category: "monitoring" },
  { pattern: "java(?!;)", category: "framework" },
  { pattern: "library", category: "generic" },
  { pattern: "linkcheck", category: "seo" },
  { pattern: "mail\\.ru/", category: "search" },
  { pattern: "manager", category: "generic" },
  { pattern: "measure", category: "monitoring" },
  { pattern: "monitor\\b", category: "monitoring" },
  { pattern: "neustar wpm", category: "monitoring" },
  { pattern: "node\\b", category: "framework" },
  { pattern: "nutch", category: "seo" },
  { pattern: "offbyone", category: "generic" },
  { pattern: "onetrust", category: "generic" },
  { pattern: "optimize", category: "monitoring" },
  { pattern: "pageburst", category: "monitoring" },
  { pattern: "pagespeed", category: "monitoring" },
  { pattern: "parser", category: "framework" },
  { pattern: "phantomjs", category: "headless" },
  { pattern: "pingdom", category: "monitoring" },
  { pattern: "powermarks", category: "generic" },
  { pattern: "preview", category: "social" },
  { pattern: "proxy", category: "generic" },
  { pattern: "ptst[ /]\\d", category: "monitoring" },
  { pattern: "retriever", category: "generic" },
  { pattern: "rexx;", category: "framework" },
  { pattern: "rigor", category: "monitoring" },
  { pattern: "rss\\b", category: "generic" },
  { pattern: "scrape", category: "generic" },
  { pattern: "server", category: "generic" },
  { pattern: "sogou", category: "search" },
  { pattern: "sparkler/", category: "generic" },
  { pattern: "speedcurve", category: "monitoring" },
  { pattern: "spider", category: "generic" },
  { pattern: "splash", category: "headless" },
  { pattern: "statuscake", category: "monitoring" },
  { pattern: "supercleaner", category: "generic" },
  { pattern: "synapse", category: "generic" },
  { pattern: "synthetic", category: "monitoring" },
  { pattern: "tools", category: "generic" },
  { pattern: "torrent", category: "generic" },
  { pattern: "transcoder", category: "generic" },
  { pattern: "url", category: "generic" },
  { pattern: "validator", category: "monitoring" },
  { pattern: "virtuoso", category: "framework" },
  { pattern: "wappalyzer", category: "seo" },
  { pattern: "webglance", category: "generic" },
  { pattern: "webkit2png", category: "headless" },
  { pattern: "whatcms/", category: "seo" },
  { pattern: "xtate/", category: "generic" },
];

/**
 * Additional and priority AI / social / monitoring identifiers. Some duplicate
 * upstream patterns intentionally so they win before broad generic rules like
 * "(?<! cu)bots?" and "(?<!(?:lib))http".
 *
 * These are the only entries carrying `name` / `operator` / `purpose`. The
 * upstream BOT_PATTERNS list above is re-synced by matching the `pattern`
 * string against isbot's patterns.json, so annotating it would put that
 * procedure at odds with itself; a named bot that matters belongs here instead,
 * where it also wins the first-match race.
 */
export const EXTRA_BOT_PATTERNS: BotPattern[] = [
  // https://radar.cloudflare.com/bots/directory/youbot
  // https://docs.censys.com/docs/opt-out-of-data-collection
  // https://docs.github.com/en/webhooks/webhook-events-and-payloads
  // https://help.sogou.com/spider.html
  {
    pattern: "(?:^|[\\s;(])YouBot(?=[/\\s;),]|$)",
    category: "ai",
    name: "YouBot",
    operator: "You.com",
    purpose: "ai_search",
  },
  {
    pattern: "(?:^|[\\s;(])CensysInspect(?=[/\\s;),]|$)",
    category: "security",
    name: "CensysInspect",
    operator: "Censys",
    purpose: "security",
  },
  {
    pattern: "(?:^|[\\s;(])GitHub-Hookshot(?=[/\\s;),]|$)",
    category: "webhooks",
    name: "GitHub-Hookshot",
    operator: "GitHub",
    purpose: "webhooks",
  },
  {
    pattern: "(?:^|[\\s;(])Sogou web spider(?=[/\\s;),]|$)",
    category: "search",
    name: "Sogou web spider",
    operator: "Sogou",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Sogou inst spider(?=[/\\s;),]|$)",
    category: "search",
    name: "Sogou inst spider",
    operator: "Sogou",
    purpose: "search",
  },

  // AI additions: https://docs.mistral.ai/robots and https://allenai.org/crawler
  {
    pattern: "(?:^|[\\s;(])MistralAI-Training(?=[/\\s;),]|$)",
    category: "ai",
    name: "MistralAI-Training",
    operator: "Mistral",
    purpose: "ai_training",
  },
  {
    pattern: "(?:^|[\\s;(])MistralAI-Index(?=[/\\s;),]|$)",
    category: "ai",
    name: "MistralAI-Index",
    operator: "Mistral",
    purpose: "ai_search",
  },
  {
    pattern: "(?:^|[\\s;(])AI2Bot(?=[/\\s;),]|$)",
    category: "ai",
    name: "AI2Bot",
    operator: "Allen Institute for AI",
    purpose: "ai_training",
  },

  // Google HTTP crawler tokens (robots.txt-only control tokens are not inferred).
  // https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
  // https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers
  {
    pattern: "(?:^|[\\s;(])Googlebot-Image(?=[/\\s;),]|$)",
    category: "search",
    name: "Googlebot-Image",
    operator: "Google",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Googlebot-Video(?=[/\\s;),]|$)",
    category: "search",
    name: "Googlebot-Video",
    operator: "Google",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Googlebot(?=[/\\s;),]|$)",
    category: "search",
    name: "Googlebot",
    operator: "Google",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Storebot-Google(?=[/\\s;),]|$)",
    category: "search",
    name: "Storebot-Google",
    operator: "Google",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Google-InspectionTool(?=[/\\s;),]|$)",
    category: "monitoring",
    name: "Google-InspectionTool",
    operator: "Google",
    purpose: "monitoring",
  },
  {
    pattern: "(?:^|[\\s;(])GoogleOther-Image(?=[/\\s;),]|$)",
    category: "generic",
    name: "GoogleOther-Image",
    operator: "Google",
    purpose: "unknown",
  },
  {
    pattern: "(?:^|[\\s;(])GoogleOther-Video(?=[/\\s;),]|$)",
    category: "generic",
    name: "GoogleOther-Video",
    operator: "Google",
    purpose: "unknown",
  },
  {
    pattern: "(?:^|[\\s;(])GoogleOther(?=[/\\s;),]|$)",
    category: "generic",
    name: "GoogleOther",
    operator: "Google",
    purpose: "unknown",
  },
  {
    pattern: "(?:^|[\\s;(])Google-CloudVertexBot(?=[/\\s;),]|$)",
    category: "ai",
    name: "Google-CloudVertexBot",
    operator: "Google",
    purpose: "ai_search",
  },
  {
    pattern: "(?:^|[\\s;(])AdsBot-Google-Mobile(?=[/\\s;),]|$)",
    category: "advertising",
    name: "AdsBot-Google-Mobile",
    operator: "Google",
    purpose: "advertising",
  },
  {
    pattern: "(?:^|[\\s;(])AdsBot-Google(?=[/\\s;),]|$)",
    category: "advertising",
    name: "AdsBot-Google",
    operator: "Google",
    purpose: "advertising",
  },
  {
    pattern: "(?:^|[\\s;(])Mediapartners-Google(?=[/\\s;),]|$)",
    category: "advertising",
    name: "Mediapartners-Google",
    operator: "Google",
    purpose: "advertising",
  },
  {
    pattern: "(?:^|[\\s;(])Google-Safety(?=[/\\s;),]|$)",
    category: "security",
    name: "Google-Safety",
    operator: "Google",
    purpose: "security",
  },

  // Search and preview identities: https://radar.cloudflare.com/bots/directory
  // Individual directory entries publish the HTTP User-Agent, not only the display name.
  {
    pattern: "(?:^|[\\s;(])bingbot(?=[/\\s;),]|$)",
    category: "search",
    name: "bingbot",
    operator: "Microsoft",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])MicrosoftPreview(?=[/\\s;),]|$)",
    category: "social",
    name: "MicrosoftPreview",
    operator: "Microsoft",
    purpose: "social_preview",
  },
  {
    pattern: "(?:^|[\\s;(])BingPreview(?=[/\\s;),]|$)",
    category: "social",
    name: "BingPreview",
    operator: "Microsoft",
    purpose: "social_preview",
  },
  {
    pattern: "(?:^|[\\s;(])adidxbot(?=[/\\s;),]|$)",
    category: "advertising",
    name: "adidxbot",
    operator: "Microsoft",
    purpose: "advertising",
  },
  {
    pattern: "(?:^|[\\s;(])Applebot(?=[/\\s;),]|$)",
    category: "search",
    name: "Applebot",
    operator: "Apple",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Baiduspider(?=[/\\s;),]|$)",
    category: "search",
    name: "Baiduspider",
    operator: "Baidu",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])PetalBot(?=[/\\s;),]|$)",
    category: "search",
    name: "PetalBot",
    operator: "Huawei",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Bravebot(?=[/\\s;),]|$)",
    category: "search",
    name: "Bravebot",
    operator: "Brave",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])MojeekBot(?=[/\\s;),]|$)",
    category: "search",
    name: "MojeekBot",
    operator: "Mojeek",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])SeekportBot(?=[/\\s;),]|$)",
    category: "search",
    name: "SeekportBot",
    operator: "SISTRIX",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])DuckDuckBot(?=[/\\s;),]|$)",
    category: "search",
    name: "DuckDuckBot",
    operator: "DuckDuckGo",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])DuckDuckGo-Favicons-Bot(?=[/\\s;),]|$)",
    category: "search",
    name: "DuckDuckGo-Favicons-Bot",
    operator: "DuckDuckGo",
    purpose: "search",
  },

  // https://www.yandex.com/support/webmaster/en/robot-workings/check-yandex-robots
  {
    pattern: "(?:^|[\\s;(])YandexImages(?=[/\\s;),]|$)",
    category: "search",
    name: "YandexImages",
    operator: "Yandex",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])YandexMedia(?=[/\\s;),]|$)",
    category: "search",
    name: "YandexMedia",
    operator: "Yandex",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])YandexMobileBot(?=[/\\s;),]|$)",
    category: "search",
    name: "YandexMobileBot",
    operator: "Yandex",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])YandexMetrika(?=[/\\s;),]|$)",
    category: "monitoring",
    name: "YandexMetrika",
    operator: "Yandex",
    purpose: "monitoring",
  },

  // https://searchadvisor.naver.com/guide/seo-basic-firewall
  {
    pattern: "(?:^|[\\s;(])Yeti(?=[/\\s;),]|$)",
    category: "search",
    name: "Yeti",
    operator: "Naver",
    purpose: "search",
  },
  {
    pattern: "(?:^|[\\s;(])Blueno(?=[/\\s;),]|$)",
    category: "social",
    name: "Blueno",
    operator: "Naver",
    purpose: "social_preview",
  },
  {
    pattern: "(?:^|[\\s;(])Ads-Naver(?=[/\\s;),]|$)",
    category: "advertising",
    name: "Ads-Naver",
    operator: "Naver",
    purpose: "advertising",
  },

  // SEO identities: https://ahrefs.com/robot/ and https://www.semrush.com/bot/
  // https://dataforseo.com/dataforseo-bot and https://www.babbar.tech/crawler
  // https://radar.cloudflare.com/bots/directory/blexbot and /seobilitybot
  {
    pattern: "(?:^|[\\s;(])AhrefsSiteAudit(?=[/\\s;),]|$)",
    category: "seo",
    name: "AhrefsSiteAudit",
    operator: "Ahrefs",
    purpose: "seo",
  },
  {
    pattern: "(?:^|[\\s;(])SiteAuditBot(?=[/\\s;),]|$)",
    category: "seo",
    name: "SiteAuditBot",
    operator: "Semrush",
    purpose: "seo",
  },
  {
    pattern: "(?:^|[\\s;(])SplitSignalBot(?=[/\\s;),]|$)",
    category: "seo",
    name: "SplitSignalBot",
    operator: "Semrush",
    purpose: "seo",
  },
  {
    pattern: "(?:^|[\\s;(])RyteBot(?=[/\\s;),]|$)",
    category: "seo",
    name: "RyteBot",
    operator: "Semrush",
    purpose: "seo",
  },
  {
    pattern: "(?:^|[\\s;(])DataForSeoBot(?=[/\\s;),]|$)",
    category: "seo",
    name: "DataForSeoBot",
    operator: "DataForSEO",
    purpose: "seo",
  },
  {
    pattern: "(?:^|[\\s;(])BLEXBot(?=[/\\s;),]|$)",
    category: "seo",
    name: "BLEXBot",
    operator: "WebMeUp",
    purpose: "seo",
  },
  {
    pattern: "(?:^|[\\s;(])Barkrowler(?=[/\\s;),]|$)",
    category: "seo",
    name: "Barkrowler",
    operator: "Babbar",
    purpose: "seo",
  },
  {
    pattern: "(?:^|[\\s;(])SeobilityBot(?=[/\\s;),]|$)",
    category: "seo",
    name: "SeobilityBot",
    operator: "Seobility",
    purpose: "seo",
  },

  // Named services precede generic HeadlessChrome and HTTP-library rules.
  // https://radar.cloudflare.com/bots/directory/gtmetrix and /uptrends
  // https://radar.cloudflare.com/bots/directory/accessible-web-bot
  // https://api.slack.com/robots
  {
    pattern: "(?:^|[\\s;(])GTmetrix(?=[/\\s;),]|$)",
    category: "monitoring",
    name: "GTmetrix",
    operator: "GTmetrix",
    purpose: "monitoring",
  },
  {
    pattern: "(?:^|[\\s;(])uptrends(?=[/\\s;),]|$)",
    category: "monitoring",
    name: "uptrends",
    operator: "Uptrends",
    purpose: "monitoring",
  },
  {
    pattern: "(?:^|[\\s;(])AccessibleWebBot(?=[/\\s;),]|$)",
    category: "accessibility",
    name: "AccessibleWebBot",
    operator: "Accessible Web",
    purpose: "accessibility",
  },
  {
    pattern: "(?:^|[\\s;(])Slack-ImgProxy(?=[/\\s;),]|$)",
    category: "social",
    name: "Slack-ImgProxy",
    operator: "Slack",
    purpose: "social_preview",
  },

  // Feed readers and archives have their own purposes instead of generic bot labels.
  // https://radar.cloudflare.com/bots/directory/feedly and /archive-org-bot
  // Feedly must precede FeedFetcher-Google, which appears in its compatibility comment.
  {
    pattern: "(?:^|[\\s;(])Feedly(?=[/\\s;),]|$)",
    category: "feed_fetching",
    name: "Feedly",
    operator: "Feedly",
    purpose: "feed_fetching",
  },
  {
    pattern: "(?:^|[\\s;(])FeedFetcher-Google(?=[/\\s;),]|$)",
    category: "feed_fetching",
    name: "FeedFetcher-Google",
    operator: "Google",
    purpose: "feed_fetching",
  },
  {
    pattern: "(?:^|[\\s;(])archive\\.org_bot(?=[/\\s;),]|$)",
    category: "archiver",
    name: "archive.org_bot",
    operator: "Internet Archive",
    purpose: "archiver",
  },
  {
    pattern: "(?:^|[\\s;(])special_archiver(?=[/\\s;),]|$)",
    category: "archiver",
    name: "special_archiver",
    operator: "Internet Archive",
    purpose: "archiver",
  },

  // https://radar.cloudflare.com/bots/directory/turnitinbot, /indeedjobbot, /magpiecrawler
  {
    pattern: "(?:^|[\\s;(])TurnitinBot(?=[/\\s;),]|$)",
    category: "academic_research",
    name: "TurnitinBot",
    operator: "Turnitin",
    purpose: "academic_research",
  },
  {
    pattern: "(?:^|[\\s;(])IndeedJobBot(?=[/\\s;),]|$)",
    category: "data_collection",
    name: "IndeedJobBot",
    operator: "Indeed",
    purpose: "data_collection",
  },
  {
    pattern: "(?:^|[\\s;(])magpie-crawler(?=[/\\s;),]|$)",
    category: "social_marketing",
    name: "magpie-crawler",
    operator: "Brandwatch",
    purpose: "social_marketing",
  },

  // --- AI: training crawlers -------------------------------------------------
  // Fetch pages to build a corpus. They do not send anyone back to the site.
  { pattern: "\\bgptbot\\b", category: "ai", name: "GPTBot", operator: "OpenAI", purpose: "ai_training" },
  { pattern: "\\bclaudebot\\b", category: "ai", name: "ClaudeBot", operator: "Anthropic", purpose: "ai_training" },
  { pattern: "\\bccbot\\b", category: "ai", name: "CCBot", operator: "Common Crawl", purpose: "ai_training" },
  // Compatibility for literal reports only: Extended tokens are robots.txt controls,
  // not separate HTTP crawlers. Never infer training from Googlebot or Applebot.
  {
    pattern: "\\bgoogle-extended\\b",
    category: "ai",
    name: "Google-Extended",
    operator: "Google",
    purpose: "ai_training",
  },
  {
    pattern: "\\bapplebot-extended\\b",
    category: "ai",
    name: "Applebot-Extended",
    operator: "Apple",
    purpose: "ai_training",
  },
  { pattern: "\\bbytespider\\b", category: "ai", name: "Bytespider", operator: "ByteDance", purpose: "ai_training" },
  {
    pattern: "\\bmeta-externalagent\\b",
    category: "ai",
    name: "Meta-ExternalAgent",
    operator: "Meta",
    purpose: "ai_training",
  },
  { pattern: "\\bamazonbot\\b", category: "ai", name: "Amazonbot", operator: "Amazon", purpose: "ai_training" },
  { pattern: "\\bcohere-ai\\b", category: "ai", name: "cohere-ai", operator: "Cohere", purpose: "ai_training" },
  { pattern: "\\bdiffbot\\b", category: "ai", name: "Diffbot", operator: "Diffbot", purpose: "ai_training" },
  { pattern: "\\bomgilibot\\b", category: "ai", name: "Omgilibot", operator: "Webz.io", purpose: "ai_training" },

  // --- AI: answer-engine indexers -------------------------------------------
  // Crawl to build a retrieval index that an assistant cites. Unlike training
  // crawlers these can send referral traffic back, which is why they are split
  // out rather than folded into ai_training.
  { pattern: "\\boai-searchbot\\b", category: "ai", name: "OAI-SearchBot", operator: "OpenAI", purpose: "ai_search" },
  {
    pattern: "\\bclaude-searchbot\\b",
    category: "ai",
    name: "Claude-SearchBot",
    operator: "Anthropic",
    purpose: "ai_search",
  },
  {
    pattern: "\\bperplexitybot\\b",
    category: "ai",
    name: "PerplexityBot",
    operator: "Perplexity",
    purpose: "ai_search",
  },
  {
    pattern: "\\bduckassistbot\\b",
    category: "ai",
    name: "DuckAssistBot",
    operator: "DuckDuckGo",
    purpose: "ai_search",
  },
  { pattern: "\\byouchat\\b", category: "ai", name: "YouChat", operator: "You.com", purpose: "ai_search" },
  { pattern: "\\bgrokbot\\b", category: "ai", name: "GrokBot", operator: "xAI", purpose: "ai_search" },

  // --- AI: user-triggered agents --------------------------------------------
  // A person asked an assistant to open this page, so the fetch is one real
  // human's intent rather than background crawling. Highest-value class to
  // separate: these correlate with the AI referral channel, training crawls do
  // not.
  {
    pattern: "\\bchatgpt-user\\b",
    category: "ai",
    name: "ChatGPT-User",
    operator: "OpenAI",
    purpose: "ai_agent",
  },
  { pattern: "\\bclaude-user\\b", category: "ai", name: "Claude-User", operator: "Anthropic", purpose: "ai_agent" },
  {
    pattern: "\\bperplexity-user\\b",
    category: "ai",
    name: "Perplexity-User",
    operator: "Perplexity",
    purpose: "ai_agent",
  },
  {
    pattern: "\\bmistralai-user\\b",
    category: "ai",
    name: "MistralAI-User",
    operator: "Mistral",
    purpose: "ai_agent",
  },
  {
    pattern: "\\bmeta-externalfetcher\\b",
    category: "ai",
    name: "Meta-ExternalFetcher",
    operator: "Meta",
    purpose: "ai_agent",
  },
  { pattern: "\\bgoogle-agent\\b", category: "ai", name: "Google-Agent", operator: "Google", purpose: "ai_agent" },
  { pattern: "^openai/", category: "ai", name: "OpenAI API client", operator: "OpenAI", purpose: "ai_agent" },
  { pattern: "^claude-code/", category: "ai", name: "Claude Code", operator: "Anthropic", purpose: "ai_agent" },
  { pattern: "\\bcursor/", category: "ai", name: "Cursor", operator: "Cursor", purpose: "ai_agent" },
  { pattern: "\\bmanus-user/", category: "ai", name: "Manus", operator: "Manus", purpose: "ai_agent" },
  { pattern: "\\bfirecrawl\\b", category: "ai", name: "Firecrawl", operator: "Firecrawl", purpose: "ai_agent" },

  // Search crawlers whose names can be swallowed by generic "*bot*" rules
  { pattern: "yandexbot", category: "search", name: "YandexBot", operator: "Yandex", purpose: "search" },
  { pattern: "slurp", category: "search", name: "Yahoo! Slurp", operator: "Yahoo", purpose: "search" },

  // Social link previewers not caught by upstream
  {
    pattern: "facebookexternalhit",
    category: "social",
    name: "facebookexternalhit",
    operator: "Meta",
    purpose: "social_preview",
  },
  { pattern: "facebot", category: "social", name: "Facebot", operator: "Meta", purpose: "social_preview" },
  { pattern: "twitterbot", category: "social", name: "Twitterbot", operator: "X", purpose: "social_preview" },
  { pattern: "slackbot", category: "social", name: "Slackbot", operator: "Slack", purpose: "social_preview" },
  { pattern: "discordbot", category: "social", name: "Discordbot", operator: "Discord", purpose: "social_preview" },
  { pattern: "linkedinbot", category: "social", name: "LinkedInBot", operator: "LinkedIn", purpose: "social_preview" },
  { pattern: "telegrambot", category: "social", name: "TelegramBot", operator: "Telegram", purpose: "social_preview" },
  {
    pattern: "skypeuripreview",
    category: "social",
    name: "SkypeUriPreview",
    operator: "Microsoft",
    purpose: "social_preview",
  },
  { pattern: "redditbot", category: "social", name: "RedditBot", operator: "Reddit", purpose: "social_preview" },
  {
    pattern: "pinterestbot",
    category: "social",
    name: "Pinterestbot",
    operator: "Pinterest",
    purpose: "social_preview",
  },
  { pattern: "embedly", category: "social", name: "Embedly", operator: "Embedly", purpose: "social_preview" },

  // SEO crawlers commonly seen in the wild
  { pattern: "ahrefsbot", category: "seo", name: "AhrefsBot", operator: "Ahrefs", purpose: "seo" },
  { pattern: "semrushbot", category: "seo", name: "SemrushBot", operator: "Semrush", purpose: "seo" },
  { pattern: "mj12bot", category: "seo", name: "MJ12bot", operator: "Majestic", purpose: "seo" },
  { pattern: "dotbot", category: "seo", name: "DotBot", operator: "Moz", purpose: "seo" },
  { pattern: "rogerbot", category: "seo", name: "rogerbot", operator: "Moz", purpose: "seo" },
  {
    pattern: "screaming frog seo spider",
    category: "seo",
    name: "Screaming Frog",
    operator: "Screaming Frog",
    purpose: "seo",
  },
  { pattern: "serpstatbot", category: "seo", name: "serpstatbot", operator: "Serpstat", purpose: "seo" },

  // Scripted clients and browser automation
  { pattern: "python-requests", category: "framework", name: "python-requests", purpose: "scripted" },
  { pattern: "curl/", category: "framework", name: "curl", purpose: "scripted" },
  { pattern: "^wget", category: "framework", name: "Wget", purpose: "scripted" },
  { pattern: "postmanruntime", category: "framework", name: "Postman", operator: "Postman", purpose: "scripted" },
  { pattern: "apache-httpclient", category: "framework", name: "Apache HttpClient", purpose: "scripted" },
  { pattern: "headlesschrome", category: "headless", name: "HeadlessChrome", purpose: "headless" },
  { pattern: "phantomjs", category: "headless", name: "PhantomJS", purpose: "headless" },
  { pattern: "\\bplaywright\\b", category: "headless", name: "Playwright", purpose: "headless" },
  { pattern: "\\bselenium\\b", category: "headless", name: "Selenium", purpose: "headless" },

  // Monitoring services
  { pattern: "pingdom", category: "monitoring", name: "Pingdom", operator: "Pingdom", purpose: "monitoring" },
  {
    pattern: "uptimerobot",
    category: "monitoring",
    name: "UptimeRobot",
    operator: "UptimeRobot",
    purpose: "monitoring",
  },
  { pattern: "datadog", category: "monitoring", name: "Datadog", operator: "Datadog", purpose: "monitoring" },
  { pattern: "newrelic", category: "monitoring", name: "New Relic", operator: "New Relic", purpose: "monitoring" },
  { pattern: "site24x7", category: "monitoring", name: "Site24x7", operator: "Site24x7", purpose: "monitoring" },
  {
    pattern: "betteruptime",
    category: "monitoring",
    name: "Better Uptime",
    operator: "Better Stack",
    purpose: "monitoring",
  },
  { pattern: "statuscake", category: "monitoring", name: "StatusCake", operator: "StatusCake", purpose: "monitoring" },
  {
    pattern: "chrome-lighthouse",
    category: "monitoring",
    name: "Lighthouse",
    operator: "Google",
    purpose: "monitoring",
  },
];

// EXTRA patterns come first so explicit named bots (ClaudeBot, AhrefsBot, etc.)
// get their specific category before the upstream generic substring matches
// (e.g. the "(?<! cu)bots?" rule) catch them as "generic".
export const ALL_BOT_PATTERNS: BotPattern[] = [...EXTRA_BOT_PATTERNS, ...BOT_PATTERNS];
