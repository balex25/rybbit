import { describe, expect, it } from "vitest";
import { classifyUA } from "./index.js";

// HTTP identifiers from the operator and Radar references beside the curated rules.
// Full UAs catch generic browser, URL and bot-pattern precedence regressions.
describe("directory bot identities", () => {
  it.each([
    [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; YouBot/1.0; +https://docs.you.com/youbot; env:prod) Chrome/130 Safari/537.36",
      "YouBot",
      "You.com",
      "ai",
      "ai_search",
    ],
    [
      "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)",
      "CensysInspect",
      "Censys",
      "security",
      "security",
    ],
    ["GitHub-Hookshot/123abc", "GitHub-Hookshot", "GitHub", "webhooks", "webhooks"],
    [
      "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
      "Sogou web spider",
      "Sogou",
      "search",
      "search",
    ],
    ["Sogou inst spider/4.0", "Sogou inst spider", "Sogou", "search", "search"],
    [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Googlebot",
      "Google",
      "search",
      "search",
    ],
    ["Googlebot-Image/1.0", "Googlebot-Image", "Google", "search", "search"],
    ["Googlebot-Video/1.0", "Googlebot-Video", "Google", "search", "search"],
    [
      "Mozilla/5.0 (X11; Linux x86_64; Storebot-Google/1.0) AppleWebKit/537.36 Chrome/130 Safari/537.36",
      "Storebot-Google",
      "Google",
      "search",
      "search",
    ],
    [
      "Mozilla/5.0 (compatible; Google-InspectionTool/1.0)",
      "Google-InspectionTool",
      "Google",
      "monitoring",
      "monitoring",
    ],
    ["Mozilla/5.0 (compatible; GoogleOther)", "GoogleOther", "Google", "generic", "unknown"],
    ["GoogleOther-Image/1.0", "GoogleOther-Image", "Google", "generic", "unknown"],
    ["GoogleOther-Video/1.0", "GoogleOther-Video", "Google", "generic", "unknown"],
    ["Google-CloudVertexBot", "Google-CloudVertexBot", "Google", "ai", "ai_search"],
    ["AdsBot-Google (+http://www.google.com/adsbot.html)", "AdsBot-Google", "Google", "advertising", "advertising"],
    [
      "Mozilla/5.0 (Linux; Android 6.0.1) AppleWebKit/537.36 Mobile Safari/537.36 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)",
      "AdsBot-Google-Mobile",
      "Google",
      "advertising",
      "advertising",
    ],
    ["Mediapartners-Google/2.1", "Mediapartners-Google", "Google", "advertising", "advertising"],
    ["Google-Safety", "Google-Safety", "Google", "security", "security"],
    [
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "bingbot",
      "Microsoft",
      "search",
      "search",
    ],
    [
      "Mozilla/5.0 (compatible; MicrosoftPreview/2.0; +https://aka.ms/MicrosoftPreview)",
      "MicrosoftPreview",
      "Microsoft",
      "social",
      "social_preview",
    ],
    [
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b",
      "BingPreview",
      "Microsoft",
      "social",
      "social_preview",
    ],
    [
      "Mozilla/5.0 (compatible; adidxbot/2.0; +http://www.bing.com/bingbot.htm)",
      "adidxbot",
      "Microsoft",
      "advertising",
      "advertising",
    ],
    [
      "Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)",
      "Applebot",
      "Apple",
      "search",
      "search",
    ],
    [
      "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
      "Baiduspider",
      "Baidu",
      "search",
      "search",
    ],
    [
      "Mozilla/5.0 (compatible;PetalBot;+https://webmaster.petalsearch.com/site/petalbot)",
      "PetalBot",
      "Huawei",
      "search",
      "search",
    ],
    [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Bravebot/1.0; +https://search.brave.com/help/brave-search-crawler) Chrome/130 Safari/537.36",
      "Bravebot",
      "Brave",
      "search",
      "search",
    ],
    [
      "Mozilla/5.0 (compatible; MojeekBot/0.2; +https://www.mojeek.com/bot.html)",
      "MojeekBot",
      "Mojeek",
      "search",
      "search",
    ],
    ["Mozilla/5.0 (compatible; SeekportBot; +https://bot.seekport.com)", "SeekportBot", "SISTRIX", "search", "search"],
    ["DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)", "DuckDuckBot", "DuckDuckGo", "search", "search"],
    ["DuckDuckBot/1.1", "DuckDuckBot", "DuckDuckGo", "search", "search"],
    ["DuckDuckGo-Favicons-Bot/1.0", "DuckDuckGo-Favicons-Bot", "DuckDuckGo", "search", "search"],
    [
      "Mozilla/5.0 (compatible; YandexImages/3.0; +http://yandex.com/bots)",
      "YandexImages",
      "Yandex",
      "search",
      "search",
    ],
    ["Mozilla/5.0 (compatible; YandexMedia/3.0; +http://yandex.com/bots)", "YandexMedia", "Yandex", "search", "search"],
    [
      "Mozilla/5.0 (compatible; YandexMobileBot/3.0; +http://yandex.com/bots)",
      "YandexMobileBot",
      "Yandex",
      "search",
      "search",
    ],
    [
      "Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots yabs01)",
      "YandexMetrika",
      "Yandex",
      "monitoring",
      "monitoring",
    ],
    ["Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)", "Yeti", "Naver", "search", "search"],
    ["Blueno/1.0", "Blueno", "Naver", "social", "social_preview"],
    ["Ads-Naver", "Ads-Naver", "Naver", "advertising", "advertising"],
    [
      "Mozilla/5.0 (compatible) AI2Bot (+https://www.allenai.org/crawler)",
      "AI2Bot",
      "Allen Institute for AI",
      "ai",
      "ai_training",
    ],
    [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-Index/1.0; +https://docs.mistral.ai/robots)",
      "MistralAI-Index",
      "Mistral",
      "ai",
      "ai_search",
    ],
    [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-Training/1.0; +https://docs.mistral.ai/robots)",
      "MistralAI-Training",
      "Mistral",
      "ai",
      "ai_training",
    ],
    [
      "Mozilla/5.0 (compatible; AhrefsSiteAudit/6.1; +http://ahrefs.com/robot/site-audit)",
      "AhrefsSiteAudit",
      "Ahrefs",
      "seo",
      "seo",
    ],
    [
      "Mozilla/5.0 (compatible; SiteAuditBot/0.97; +http://www.semrush.com/bot.html)",
      "SiteAuditBot",
      "Semrush",
      "seo",
      "seo",
    ],
    ["SplitSignalBot/1.0", "SplitSignalBot", "Semrush", "seo", "seo"],
    ["RyteBot/1.0", "RyteBot", "Semrush", "seo", "seo"],
    [
      "Mozilla/5.0 (compatible; DataForSeoBot; +https://dataforseo.com/dataforseo-bot)",
      "DataForSeoBot",
      "DataForSEO",
      "seo",
      "seo",
    ],
    ["Mozilla/5.0 (compatible; BLEXBot/1.0; +http://webmeup-crawler.com/)", "BLEXBot", "WebMeUp", "seo", "seo"],
    ["Mozilla/5.0 (compatible; Barkrowler/0.9; +https://babbar.tech/crawler)", "Barkrowler", "Babbar", "seo", "seo"],
    ["SeobilityBot (SEO Tool; https://www.seobility.net/sites/bot.html)", "SeobilityBot", "Seobility", "seo", "seo"],
    [
      "Mozilla/5.0 (X11; Linux x86_64; GTmetrix https://gtmetrix.com/) AppleWebKit/537.36 HeadlessChrome/130 Safari/537.36 Chrome-Lighthouse",
      "GTmetrix",
      "GTmetrix",
      "monitoring",
      "monitoring",
    ],
    ["uptrends", "uptrends", "Uptrends", "monitoring", "monitoring"],
    [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; AccessibleWebBot/1.0; +https://accessibleweb.com/bot/) HeadlessChrome/81.0.4044.0 Safari/537.36",
      "AccessibleWebBot",
      "Accessible Web",
      "accessibility",
      "accessibility",
    ],
    ["Slack-ImgProxy 0.19 (+https://api.slack.com/robots)", "Slack-ImgProxy", "Slack", "social", "social_preview"],
    [
      "Feedly/1.0 (+http://www.feedly.com/fetcher.html; 1 subscribers; like FeedFetcher-Google)",
      "Feedly",
      "Feedly",
      "feed_fetching",
      "feed_fetching",
    ],
    [
      "FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)",
      "FeedFetcher-Google",
      "Google",
      "feed_fetching",
      "feed_fetching",
    ],
    [
      "Mozilla/5.0 (compatible; archive.org_bot +http://www.archive.org/details/archive.org_bot)",
      "archive.org_bot",
      "Internet Archive",
      "archiver",
      "archiver",
    ],
    [
      "Mozilla/5.0 (compatible; special_archiver/3.1.1 +http://www.archive.org/details/archive.org_bot)",
      "special_archiver",
      "Internet Archive",
      "archiver",
      "archiver",
    ],
    [
      "TurnitinBot/ContentIngest (http://www.turnitin.com/robot/crawlerinfo.html)",
      "TurnitinBot",
      "Turnitin",
      "academic_research",
      "academic_research",
    ],
    ["IndeedJobBot", "IndeedJobBot", "Indeed", "data_collection", "data_collection"],
    [
      "magpie-crawler/1.1 (U; Linux amd64; en-GB; +http://www.brandwatch.net)",
      "magpie-crawler",
      "Brandwatch",
      "social_marketing",
      "social_marketing",
    ],
  ])("identifies %s", (ua, name, operator, category, purpose) => {
    expect(classifyUA(ua)).toMatchObject({ isBot: true, name, operator, category, purpose });
  });

  it.each([
    "NotGooglebot/1.0",
    "GooglebotClone/1.0",
    "SomeBingbot/2.0",
    "Applebot-Fake/1",
    "Mozilla/5.0 (+https://example.org/Googlebot/)",
    "Mozilla/5.0 (+https://duckduckgo.com)",
  ])("does not assign a known identity from partial names or URLs: %s", ua => {
    expect(classifyUA(ua).name).toBeNull();
  });

  it.each([
    "Mozilla/5.0 (Linux; Android 14; Google Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
    "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 DuckDuckGo/5",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 YaBrowser/24.1.0.0 Safari/537.36",
  ])("preserves real browser traffic: %s", ua => {
    expect(classifyUA(ua).isBot).toBe(false);
  });

  it("matches case-insensitively and preserves the named result on repeated requests", () => {
    const ua = "Mozilla/5.0 (compatible; bInGbOt/2.0)";
    expect(classifyUA(ua)).toMatchObject({ name: "bingbot", operator: "Microsoft", purpose: "search" });
    expect(classifyUA(ua)).toMatchObject({ name: "bingbot", operator: "Microsoft", purpose: "search" });
  });
});
