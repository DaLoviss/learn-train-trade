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

export const FOREX_FACTORY_FEED_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
export const FOREX_FACTORY_CALENDAR_URL = "https://www.forexfactory.com/calendar";

const VALID_IMPACTS = new Set<ImpactLevel>(["High", "Medium", "Low", "Holiday"]);

export function parseForexFactoryEvents(data: unknown): CalendarEvent[] {
  if (!Array.isArray(data)) return [];
  const parsed: CalendarEvent[] = [];

  for (let i = 0; i < data.length; i++) {
    const raw = data[i];
    if (!raw || typeof raw !== "object") continue;
    const rec = raw as Record<string, unknown>;
    const title = typeof rec["title"] === "string" ? rec["title"].trim() : "";
    const country = typeof rec["country"] === "string" ? rec["country"].trim().toUpperCase() : "";
    const date = typeof rec["date"] === "string" ? rec["date"].trim() : "";
    const impactRaw = typeof rec["impact"] === "string" ? rec["impact"].trim() : "";
    const timestamp = Date.parse(date);

    if (!title || !country || Number.isNaN(timestamp)) continue;
    const impact: ImpactLevel = VALID_IMPACTS.has(impactRaw as ImpactLevel)
      ? (impactRaw as ImpactLevel)
      : "Low";

    parsed.push({
      id: `${timestamp}-${country}-${i}`,
      title,
      country,
      date,
      timestamp,
      impact,
      actual: typeof rec["actual"] === "string" ? rec["actual"].trim() : "",
      forecast: typeof rec["forecast"] === "string" ? rec["forecast"].trim() : "",
      previous: typeof rec["previous"] === "string" ? rec["previous"].trim() : "",
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