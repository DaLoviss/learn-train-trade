import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Pause, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FXSTREET_FEED_URL, FXSTREET_MAX_AGE_DAYS, NEWS_REFRESH_MS, parseHeadlines, recentHeadlines, type NewsHeadline } from "@/lib/news-feed";
import { InvestingNews } from "@/components/investing-news";

export function LiveNews() {
  const [headlines, setHeadlines] = useState<NewsHeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [now, setNow] = useState(0);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setNow(Date.now());
    setLoading(true);
    try {
      const response = await fetch(FXSTREET_FEED_URL, { ...(signal ? { signal } : {}) });
      if (!response.ok) throw new Error(`Feed unavailable (${response.status})`);
      const items = parseHeadlines(await response.json());
      if (items.length === 0) throw new Error("No headlines available");
      if (signal?.aborted) return;
      setHeadlines(items);
      setCheckedAt(new Date());
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
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { controller.abort(); window.clearInterval(interval); window.clearInterval(clock); };
  }, [refresh]);

  const current = recentHeadlines(headlines, FXSTREET_MAX_AGE_DAYS, now);
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10" aria-label="Live forex news">
      <div className="border-y border-border bg-secondary/40" aria-label="FXStreet headline ticker">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h2 className="flex items-center gap-2 font-sans text-sm font-semibold"><span className="size-2 rounded-full bg-primary" />FXStreet headlines</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground" role="status">{loading ? "Checking headlines…" : failed ? "Updates unavailable" : checkedAt ? `Checked ${checkedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</span>
            <Button variant="ghost" size="icon" title={paused ? "Play headlines" : "Pause headlines"} aria-label={paused ? "Play headlines" : "Pause headlines"} onClick={() => setPaused(!paused)} disabled={!headlines.length}>{paused ? <Play /> : <Pause />}</Button>
            <Button variant="ghost" size="icon" title="Refresh headlines" aria-label="Refresh headlines" onClick={() => { void refresh(); }} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} /></Button>
          </div>
        </div>
        {headlines.length > 0 ? (
          <div className={`news-ticker-window ${paused ? "news-ticker-paused" : ""}`}>
            <div className="news-ticker-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="news-ticker-group" aria-hidden={copy === 1 ? true : undefined}>
                  {headlines.map((headline) => (
                    <a key={headline.link} href={headline.link} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : 0} className="inline-flex shrink-0 items-center gap-3 px-6 py-4 text-sm hover:text-primary">
                      <time dateTime={headline.publishedAt} className="text-xs text-primary">{new Date(headline.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                      <span>{headline.title}</span><ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : <p className="px-4 py-5 text-sm text-muted-foreground">{loading ? "Loading latest headlines…" : <>Headlines are temporarily unavailable. <a href="https://www.fxstreet.com/news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read FXStreet news ↗</a></>}</p>}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Headlines: <a href="https://www.fxstreet.com/news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FXStreet</a> · Feed delivery: RSS2JSON{failed && headlines.length > 0 ? " · Showing the last available headlines" : ""}</p>
      <InvestingNews />
      <section className="mt-10" aria-label="FXStreet news from the last three days">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-2xl font-bold">FXStreet news</h2><p className="mt-1 text-xs text-muted-foreground">Last 3 days</p></div>
          <Button variant="ghost" size="icon" aria-label="Refresh FXStreet news" title="Refresh FXStreet news" disabled={loading} onClick={() => { void refresh(); }}><RefreshCw className={loading ? "animate-spin" : ""} /></Button>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {current.map((headline) => (
            <a key={headline.link} href={headline.link} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-4 py-5 transition-colors hover:text-primary">
              <div><time dateTime={headline.publishedAt} className="text-xs text-muted-foreground">{new Date(headline.publishedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time><h3 className="mt-2 font-sans text-base font-semibold leading-relaxed">{headline.title}</h3></div>
              <ExternalLink className="mt-1 size-4 shrink-0 text-primary" />
            </a>
          ))}
          {current.length === 0 && <p className="py-6 text-sm text-muted-foreground" role="status">{loading ? "Loading FXStreet news…" : failed ? "FXStreet news is temporarily unavailable." : "No FXStreet headlines from the last three days are available."}</p>}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">News provided by <a href="https://www.fxstreet.com/news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FXStreet</a> · Feed delivery: RSS2JSON{failed && current.length > 0 ? " · Updates temporarily unavailable" : ""}</p>
      </section>
    </section>
  );
}