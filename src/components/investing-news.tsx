import { useCallback, useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INVESTING_FEED_URL, INVESTING_MAX_AGE_DAYS, NEWS_REFRESH_MS, parseProviderHeadlines, recentHeadlines, type NewsHeadline } from "@/lib/news-feed";

export function InvestingNews() {
  const [headlines, setHeadlines] = useState<NewsHeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(0);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setNow(Date.now());
    setLoading(true);
    try {
      const response = await fetch(INVESTING_FEED_URL, { ...(signal ? { signal } : {}) });
      if (!response.ok) throw new Error(`Feed unavailable (${response.status})`);
      const items = parseProviderHeadlines(await response.json(), "investing.com");
      if (signal?.aborted) return;
      setHeadlines(items);
      setFailed(false);
    } catch {
      if (signal?.aborted) return;
      setFailed(true);
    } finally {
      if (!signal?.aborted) { setNow(Date.now()); setLoading(false); }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    const interval = window.setInterval(() => { void refresh(controller.signal); }, NEWS_REFRESH_MS);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [refresh]);

  const current = recentHeadlines(headlines, INVESTING_MAX_AGE_DAYS, now);
  return (
    <section className="mt-10" aria-label="Investing.com news from the last two days">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold">Investing.com news</h2><p className="mt-1 text-xs text-muted-foreground">Last 2 days</p></div>
        <Button variant="ghost" size="icon" aria-label="Refresh Investing.com news" title="Refresh Investing.com news" disabled={loading} onClick={() => { void refresh(); }}><RefreshCw className={loading ? "animate-spin" : ""} /></Button>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {current.map((headline) => (
          <a key={headline.link} href={headline.link} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-4 py-5 transition-colors hover:text-primary">
            <div><time dateTime={headline.publishedAt} className="text-xs text-muted-foreground">{new Date(headline.publishedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time><h3 className="mt-2 font-sans text-base font-semibold leading-relaxed">{headline.title}</h3></div>
            <ExternalLink className="mt-1 size-4 shrink-0 text-primary" />
          </a>
        ))}
        {current.length === 0 && <p className="py-6 text-sm text-muted-foreground" role="status">{loading ? "Loading Investing.com news…" : failed ? "Investing.com news is temporarily unavailable." : "No Investing.com headlines from the last two days are available."}</p>}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">News provided by <a href="https://www.investing.com/news/forex-news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Investing.com</a> · Feed delivery: RSS2JSON{failed && current.length > 0 ? " · Updates temporarily unavailable" : ""}</p>
    </section>
  );
}