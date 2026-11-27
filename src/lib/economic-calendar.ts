export type ImpactLevel = "High" | "Medium" | "Low" | "Holiday";

export type CalendarEvent = {
  id: string;
  title: string;
  country: string;
  date: string;
  timestamp: number;
  impact: ImpactLevel;
  actual: string;
  forecast: string;
  previous: string;
};

export const FXSTREET_CALENDAR_API_BASE =
  "https://calendar-api.fxstreet.com/en/api/v1/eventDates";
export const FXSTREET_CALENDAR_URL = "https://www.fxstreet.com/economic-calendar";

const MAJOR_CURRENCIES = new Set([
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "NZD",
  "CNY",
]);

const VOLATILITY_MAP: Record<string, ImpactLevel> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NONE: "Holiday",
};

export function getWeekRangeUtc(now: Date = new Date()): { start: string; end: string } {
  const utcDay = now.getUTCDay();
  const daysSinceMonday = (utcDay + 6) % 7;
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMonday),
  );
  const sunday = new Date(
    Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 6, 23, 59, 59),
  );
  return {
    start: monday.toISOString().replace(/\.\d{3}Z$/, "Z"),
    end: sunday.toISOString().replace(/\.\d{3}Z$/, "Z"),
  };
}

export function buildFxStreetCalendarUrl(now: Date = new Date()): string {
  const { start, end } = getWeekRangeUtc(now);
  return `${FXSTREET_CALENDAR_API_BASE}/${start}/${end}`;
}

function formatMetric(value: unknown, unit: unknown, potency: unknown): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  const suffix =
    typeof potency === "string" && potency.trim() !== "" && potency !== "ZERO"
      ? potency.trim()
      : "";
  const unitStr = typeof unit === "string" ? unit.trim() : "";
  if (unitStr === "%") return `${value}${suffix}%`;
  if (unitStr) return `${unitStr}${value}${suffix}`;
  return `${value}${suffix}`;
}

export function parseFxStreetEvents(data: unknown): CalendarEvent[] {
  if (!Array.isArray(data)) return [];
  const parsed: CalendarEvent[] = [];

  for (let i = 0; i < data.length; i++) {
    const raw = data[i];
    if (!raw || typeof raw !== "object") continue;
    const rec = raw as Record<string, unknown>;
    const title = typeof rec["name"] === "string" ? rec["name"].trim() : "";
    const country =
      typeof rec["currencyCode"] === "string" ? rec["currencyCode"].trim().toUpperCase() : "";
    const date = typeof rec["dateUtc"] === "string" ? rec["dateUtc"].trim() : "";
    const volatility =
      typeof rec["volatility"] === "string" ? rec["volatility"].trim().toUpperCase() : "";
    const timestamp = Date.parse(date);

    if (!title || !country || !MAJOR_CURRENCIES.has(country) || Number.isNaN(timestamp)) continue;
    const impact: ImpactLevel = VOLATILITY_MAP[volatility] ?? "Low";
    const id =
      typeof rec["id"] === "string" && rec["id"].trim()
        ? rec["id"].trim()
        : `${timestamp}-${country}-${i}`;

    parsed.push({
      id,
      title,
      country,
      date,
      timestamp,
      impact,
      actual: formatMetric(rec["actual"], rec["unit"], rec["potency"]),
      forecast: formatMetric(rec["consensus"], rec["unit"], rec["potency"]),
      previous: formatMetric(rec["previous"], rec["unit"], rec["potency"]),
    });
  }

  return parsed.sort((a, b) => a.timestamp - b.timestamp);
}

export function getEventDayKey(timestamp: number, useLocalTime: boolean): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: useLocalTime ? undefined : "UTC",
  }).format(new Date(timestamp));
}

export function getCalendarDays(
  events: CalendarEvent[],
  useLocalTime: boolean,
): { dayKey: string; label: string }[] {
  return groupEventsByDay(events, useLocalTime).map(({ dayKey, label }) => ({ dayKey, label }));
}

export function filterCalendarEvents(
  events: CalendarEvent[],
  currency: string,
  impact: string,
  dayKey = "ALL",
  useLocalTime = false,
): CalendarEvent[] {
  return events.filter((e) => {
    if (currency !== "ALL" && e.country !== currency) return false;
    if (impact !== "ALL" && e.impact !== impact) return false;
    if (dayKey !== "ALL" && getEventDayKey(e.timestamp, useLocalTime) !== dayKey) return false;
    return true;
  });
}

export function groupEventsByDay(
  events: CalendarEvent[],
  useLocalTime: boolean,
): { dayKey: string; label: string; events: CalendarEvent[] }[] {
  const timeZone = useLocalTime ? undefined : "UTC";
  const dayFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  });

  const groups = new Map<string, { dayKey: string; label: string; events: CalendarEvent[] }>();
  for (const event of events) {
    const d = new Date(event.timestamp);
    const dayKey = getEventDayKey(event.timestamp, useLocalTime);
    const existing = groups.get(dayKey);
    if (existing) {
      existing.events.push(event);
    } else {
      groups.set(dayKey, { dayKey, label: dayFmt.format(d), events: [event] });
    }
  }
  return Array.from(groups.values());
}

export function formatEventTime(timestamp: number, useLocalTime: boolean): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: useLocalTime ? undefined : "UTC",
  }).format(new Date(timestamp));
}