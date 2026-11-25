import { describe, expect, it } from "vitest";
import { parseHeadlines } from "@/lib/news-feed";

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
});