import { useEffect, useMemo, useState } from "react";
import { GROUPS } from "@/lib/instruments";
import {
  HOLIDAY_HOURS_SOURCE,
  addDaysToDateKey,
  allScheduleRows,
  formatScheduleDate,
  formatScheduleWindows,
  getDateKeyInTimeZone,
  getDaySchedule,
} from "@/lib/trading-schedule";

type DayView = "both" | "today" | "tomorrow";

const SCHEDULE_ROWS = allScheduleRows();

function ScheduleCell({
  symbol,
  category,
  dateKey,
  timeZone,
}: {
  symbol: string;
  category: string;
  dateKey: string;
  timeZone: string;
}) {
  const schedule = getDaySchedule(symbol, category, dateKey);
  const isEarly = schedule.status === "early-close";

  return (
    <div className={isEarly ? "rounded-lg border border-primary/40 bg-primary/10 p-3" : "py-1"}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={schedule.status === "closed" ? "text-muted-foreground" : "font-medium text-foreground"}>
          {formatScheduleWindows(schedule, timeZone)}
        </span>
        {isEarly && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Early close
          </span>
        )}
      </div>
      {(isEarly || schedule.status === "closed") && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{schedule.note}</p>
      )}
    </div>
  );
}

export function TradingSchedule() {
  const [clock, setClock] = useState<Date | null>(null);
  const [localTimeZone, setLocalTimeZone] = useState("UTC");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [timeZoneChoice, setTimeZoneChoice] = useState("local");
  const [dayView, setDayView] = useState<DayView>("both");
  const [earlyOnly, setEarlyOnly] = useState(false);

  useEffect(() => {
    setLocalTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    const updateClock = () => setClock(new Date());
    updateClock();
    const timer = window.setInterval(updateClock, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const timeZone = timeZoneChoice === "local" ? localTimeZone : timeZoneChoice;
  const today = clock ? getDateKeyInTimeZone(clock, timeZone) : "";
  const tomorrow = today ? addDaysToDateKey(today, 1) : "";
  const showToday = dayView !== "tomorrow";
  const showTomorrow = dayView !== "today";

  const rows = useMemo(() => {
    if (!today || !tomorrow) return [];
    const search = query.trim().toLowerCase();
    return SCHEDULE_ROWS.filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (search && !`${row.symbol} ${row.name}`.toLowerCase().includes(search)) return false;
      if (!earlyOnly) return true;
      const dates = dayView === "today" ? [today] : dayView === "tomorrow" ? [tomorrow] : [today, tomorrow];
      return dates.some((date) => getDaySchedule(row.symbol, row.category, date).status === "early-close");
    });
  }, [category, dayView, earlyOnly, query, today, tomorrow]);

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setDayView("both");
    setEarlyOnly(false);
    setTimeZoneChoice("local");
  };

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4" aria-labelledby="trading-schedule-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Plan your trading day</p>
          <h2 id="trading-schedule-title" className="mt-2 text-2xl font-bold text-gold md:text-3xl">
            Today & Tomorrow’s Trading Times
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Filter by market or instrument and look for the gold early-close label before placing a trade.
          </p>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Reset table
        </button>
      </div>

      <div className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Instrument category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="all">All categories</option>
            {GROUPS.map((group) => (
              <option key={group.title} value={group.title}>{group.title}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Find an instrument</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Gold or US30"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </label>

        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Time zone</span>
          <select
            value={timeZoneChoice}
            onChange={(event) => setTimeZoneChoice(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="local">My local time</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">New York</option>
            <option value="Europe/London">London</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Days displayed</span>
          <select
            value={dayView}
            onChange={(event) => setDayView(event.target.value as DayView)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="both">Today and tomorrow</option>
            <option value="today">Today only</option>
            <option value="tomorrow">Tomorrow only</option>
          </select>
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground sm:col-span-2 lg:col-span-4">
          <input
            type="checkbox"
            checked={earlyOnly}
            onChange={(event) => setEarlyOnly(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Show only instruments with an early closure
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>{rows.length} of {SCHEDULE_ROWS.length} instruments shown</p>
        <p>Times shown in {timeZoneChoice === "local" ? `your local time (${localTimeZone})` : timeZone.replaceAll("_", " ")}</p>
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
        <table className={`w-full border-collapse text-left text-sm ${dayView === "both" ? "min-w-[1050px]" : "min-w-[720px]"}`}>
          <caption className="sr-only">Current and next day instrument trading hours with early closure warnings</caption>
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-primary">
              <th className="px-5 py-3.5">Symbol</th>
              <th className="px-5 py-3.5">Instrument</th>
              <th className="px-5 py-3.5">Category</th>
              {showToday && <th className="px-5 py-3.5">Today{today ? ` · ${formatScheduleDate(today)}` : ""}</th>}
              {showTomorrow && <th className="px-5 py-3.5">Tomorrow{tomorrow ? ` · ${formatScheduleDate(tomorrow)}` : ""}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!clock ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Loading the latest daily schedule…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No instruments match these filters. Try resetting the table.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.symbol} className="align-top transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-4 font-semibold text-primary">{row.symbol}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{row.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{row.category}</td>
                  {showToday && (
                    <td className="px-5 py-4">
                      <ScheduleCell symbol={row.symbol} category={row.category} dateKey={today} timeZone={timeZone} />
                    </td>
                  )}
                  {showTomorrow && (
                    <td className="px-5 py-4">
                      <ScheduleCell symbol={row.symbol} category={row.category} dateKey={tomorrow} timeZone={timeZone} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Please check with your broker.</strong> These are indicative underlying market hours; broker CFD and spot-market hours can differ. Early closures follow CME holiday schedules, and unlisted holidays or exceptional closures may also affect trading.
        </p>
        <a
          href={HOLIDAY_HOURS_SOURCE}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block font-semibold text-primary underline-offset-4 hover:underline"
        >
          Check the official CME holiday schedule ↗
        </a>
      </div>
    </section>
  );
}
