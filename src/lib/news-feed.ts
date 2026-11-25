export type NewsHeadline = { title: string; link: string; publishedAt: string };

export const FXSTREET_FEED_URL = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.fxstreet.com%2Frss%2Fnews";
export const NEWS_REFRESH_MS = 5 * 60 * 1000;

export function parseHeadlines(data: unknown): NewsHeadline[] {
  if (!data || typeof data !== "object" || !("status" in data) || data.status !== "ok" || !("items" in data) || !Array.isArray(data.items)) {
    throw new Error("The headline feed is temporarily unavailable.");
  }
  const headlines: NewsHeadline[] = [];
  for (const item of data.items) {
    if (!item || typeof item !== "object" || typeof item.title !== "string" || typeof item.link !== "string" || typeof item.pubDate !== "string") continue;
    try {
      const url = new URL(item.link);
      const publishedAt = new Date(item.pubDate.replace(" ", "T") + "Z");
      if (url.protocol !== "https:" || !(url.hostname === "fxstreet.com" || url.hostname.endsWith(".fxstreet.com")) || !item.title.trim() || !Number.isFinite(publishedAt.getTime())) continue;
      headlines.push({ title: item.title, link: url.href, publishedAt: publishedAt.toISOString() });
    } catch { /* Ignore malformed feed items. */ }
  }
  return headlines.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 10);
}