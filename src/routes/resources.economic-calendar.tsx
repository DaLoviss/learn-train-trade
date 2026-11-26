import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero, meta } from "@/components/site-layout";
import {
  FOREX_FACTORY_CALENDAR_URL,
  filterCalendarEvents,
  formatEventTime,
  groupEventsByDay,
  type ImpactLevel,
} from "@/lib/economic-calendar";
import { getForexFactoryCalendar } from "@/lib/economic-calendar.functions";

const calendarQueryOptions = queryOptions({
  queryKey: ["forex-factory-calendar"],
  queryFn: () => getForexFactoryCalendar(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/resources/economic-calendar")({
  head: () =>
    meta(
      "Economic Calendar",
      "Follow this week's economic releases, forecasts and high-impact events powered by ForexFactory.",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(calendarQueryOptions),
  component: EconomicCalendarPage,
});

const IMPACT_OPTIONS = ["ALL", "High", "Medium", "Low"] as const;

const IMPACT_STYLES: Record<ImpactLevel, string> = {
  High: "border-destructive/50 bg-destructive/20 text-destructive-foreground",
  Medium: "border-primary/50 bg-primary/15 text-primary",
  Low: "border-border bg-secondary/60 text-muted-foreground",
  Holiday: "border-border bg-muted text-muted-foreground",
};

function EconomicCalendarPage() {
  const hydrated = useHydrated();
  const { data, refetch, isFetching } = useSuspenseQuery(calendarQueryOptions);
  const [currency, setCurrency] = useState("ALL");
  const [impact, setImpact] = useState("ALL");

  const currencies = useMemo(() => {
    const set = new Set(data.events.map((e) => e.country));
    return ["ALL", ...Array.from(set).sort()];
  }, [data.events]);

  const filtered = useMemo(
    () => filterCalendarEvents(data.events, currency, impact),
    [data.events, currency, impact],
  );

  const dayGroups = useMemo(() => groupEventsByDay(filtered, hydrated), [filtered, hydrated]);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Economic Calendar"
        intro="Track this week's market-moving releases, forecasts, and high-impact events across the major currencies."
      />
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link to="/resources" className="font-semibold text-primary hover:underline">
            ← Resources
          </Link>
          <a
            href={FOREX_FACTORY_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Open on ForexFactory ↗
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-glow">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/40 px-5 py-4">
            <div>
              <h2 className="text-xl font-bold text-gold">This Week&apos;s Schedule</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {hydrated ? "Times shown in your local timezone" : "Times shown in UTC"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="rounded-lg border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition hover:bg-primary/20 disabled:opacity-50"
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by currency">
              {currencies.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    currency === code
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {code === "ALL" ? "All Currencies" : code}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by impact">
              {IMPACT_OPTIONS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setImpact(level)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    impact === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {level === "ALL" ? "All Impact" : level}
                </button>
              ))}
            </div>
          </div>

          {data.error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">{data.error}</p>
              <a
                href={FOREX_FACTORY_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                View live calendar on ForexFactory ↗
              </a>
            </div>
          ) : dayGroups.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              No economic events match the selected filters.
            </p>
          ) : (
            <div className="divide-y divide-border">
              <div className="hidden grid-cols-[5.5rem_4.5rem_5.5rem_1fr_5.5rem_5.5rem] gap-3 bg-secondary/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                <span>Time</span>
                <span>Currency</span>
                <span>Impact</span>
                <span>Event</span>
                <span className="text-right">Forecast</span>
                <span className="text-right">Previous</span>
              </div>
              {dayGroups.map((group) => (
                <div key={group.dayKey}>
                  <div className="bg-secondary/35 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    {group.label}
                  </div>
                  <ul className="divide-y divide-border/60">
                    {group.events.map((event) => (
                      <li
                        key={event.id}
                        className="grid grid-cols-1 gap-2 px-5 py-3 text-sm transition hover:bg-secondary/25 md:grid-cols-[5.5rem_4.5rem_5.5rem_1fr_5.5rem_5.5rem] md:items-center md:gap-3"
                      >
                        <div className="flex items-center gap-2 md:contents">
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatEventTime(event.timestamp, hydrated)}
                          </span>
                          <span className="inline-block w-fit rounded bg-secondary px-2 py-0.5 text-xs font-bold tracking-wider text-foreground">
                            {event.country}
                          </span>
                          <span
                            className={`inline-block w-fit rounded border px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide ${IMPACT_STYLES[event.impact]}`}
                          >
                            {event.impact}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{event.title}</span>
                        <div className="flex gap-4 text-xs text-muted-foreground md:contents md:text-sm">
                          <span className="md:text-right">
                            <span className="md:hidden">Forecast: </span>
                            <span className="font-medium text-foreground">{event.forecast || "—"}</span>
                          </span>
                          <span className="md:text-right">
                            <span className="md:hidden">Previous: </span>
                            <span>{event.previous || "—"}</span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Weekly Economic Calendar data provided by{" "}
          <a
            href={FOREX_FACTORY_CALENDAR_URL}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            ForexFactory
          </a>
          .
        </p>
      </section>
    </>
  );
}