import { describe, expect, it } from "vitest";
import { INVESTING_MAX_AGE_DAYS, parseHeadlines, parseProviderHeadlines, recentHeadlines } from "@/lib/news-feed";

describe("Live headlines", () => {
  it("keeps the latest FXStreet headline first and interprets feed dates as UTC", () => {
    const headlines = parseHeadlines({ status: "ok", items: [
      { title: "Earlier news", link: "https://www.fxstreet.com/news/earlier", pubDate: "2026-11-25 22:58:05" },
      { title: "Latest news", link: "https://www.fxstreet.com/news/latest", pubDate: "2026-11-25 23:20:40" },
    ] });
    expect(headlines[0]).toEqual({ title: "Latest news", link: "https://www.fxstreet.com/news/latest", publishedAt: "2026-11-25T23:20:40.000Z" });
  });
  it("rejects unsafe and non-provider article links", () => {
    expect(parseHeadlines({ status: "ok", items: [
      { title: "Bad link", link: "javascript:alert(1)", pubDate: "2026-11-25 23:20:40" },
      { title: "Wrong source", link: "https://fxstreet.com.example.org/news", pubDate: "2026-11-25 23:20:40" },
    ] })).toEqual([]);
  });
  it("reports provider failure instead of showing invented headlines", () => {
    expect(() => parseHeadlines({ status: "error", message: "Unavailable" })).toThrow("temporarily unavailable");
  });
  it("includes Investing.com news up to exactly two days old and excludes older news", () => {
    const now = Date.parse("2026-11-25T23:43:00Z");
    const headlines = parseProviderHeadlines({ status: "ok", items: [
      { title: "Inside limit", link: "https://www.investing.com/news/forex-news/new", pubDate: "2026-11-24 23:43:00" },
      { title: "At limit", link: "https://www.investing.com/news/forex-news/boundary", pubDate: "2026-11-23 23:43:00" },
      { title: "Too old", link: "https://www.investing.com/news/forex-news/old", pubDate: "2026-11-23 23:42:59" },
    ] }, "investing.com");
    expect(INVESTING_MAX_AGE_DAYS).toBe(2);
    expect(recentHeadlines(headlines, INVESTING_MAX_AGE_DAYS, now).map((h) => h.title)).toEqual(["Inside limit", "At limit"]);
  });
  it("does not show future-dated headlines", () => {
    expect(recentHeadlines([{ title: "Future", link: "https://www.investing.com/news/future", publishedAt: "2026-11-26T00:00:00Z" }], 2, Date.parse("2026-11-25T23:43:00Z"))).toEqual([]);
  });
});