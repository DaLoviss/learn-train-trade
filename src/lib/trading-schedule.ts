import { GROUPS } from "@/lib/instruments";

export type ScheduleStatus = "regular" | "early-close" | "closed";
export type MarketWindow = { open: number; close: number };
export type DayRange = "both" | "today" | "tomorrow" | "rest-of-week" | "this-week";

export const DAY_RANGE_OPTIONS: { value: DayRange; label: string }[] = [
  { value: "both", label: "Today and tomorrow" },
  { value: "today", label: "Today only" },
  { value: "tomorrow", label: "Tomorrow only" },
  { value: "rest-of-week", label: "Rest of this week (today to Sunday)" },
  { value: "this-week", label: "This week (Monday to Sunday)" },
];
export type DaySchedule = {
  dateKey: string;
  marketTimeZone: string;
  status: ScheduleStatus;
  windows: MarketWindow[];
  note: string;
};

type ScheduleKind = "forex" | "metals" | "us-index" | "exchange";
type ScheduleSpec = {
  kind: ScheduleKind;
  marketTimeZone: string;
  regularWindows?: MarketWindow[];
};

export const HOLIDAY_HOURS_SOURCE = "https://www.cmegroup.com/trading-hours.html";

const FULL_DAY: MarketWindow[] = [{ open: 0, close: 1440 }];
const CME_WEEKDAY: MarketWindow[] = [
  { open: 0, close: 960 },
  { open: 1020, close: 1440 },
];
const CME_FRIDAY: MarketWindow[] = [{ open: 0, close: 960 }];
const CME_SUNDAY: MarketWindow[] = [{ open: 1020, close: 1440 }];

const US_INDEX_SYMBOLS = new Set(["US30", "US500", "NAS100", "US2000"]);

const INDEX_SPECS: Record<string, { marketTimeZone: string; regularWindows: MarketWindow[] }> = {
  CA60: { marketTimeZone: "America/Toronto", regularWindows: [{ open: 570, close: 960 }] },
  DE40: { marketTimeZone: "Europe/Berlin", regularWindows: [{ open: 540, close: 990 }] },
  EU50: { marketTimeZone: "Europe/Berlin", regularWindows: [{ open: 540, close: 990 }] },
  UK100: { marketTimeZone: "Europe/London", regularWindows: [{ open: 480, close: 990 }] },
  CH20: { marketTimeZone: "Europe/Zurich", regularWindows: [{ open: 540, close: 990 }] },
  JP225: {
    marketTimeZone: "Asia/Tokyo",
    regularWindows: [
      { open: 540, close: 690 },
      { open: 750, close: 900 },
    ],
  },
  HK50: {
    marketTimeZone: "Asia/Hong_Kong",
    regularWindows: [
      { open: 570, close: 720 },
      { open: 780, close: 960 },
    ],
  },
  AU200: { marketTimeZone: "Australia/Sydney", regularWindows: [{ open: 600, close: 960 }] },
};

function getSpec(symbol: string, category: string): ScheduleSpec {
  if (category === "Precious Metals") {
    return { kind: "metals", marketTimeZone: "America/Chicago" };
  }

  if (category === "Stock Indices") {
    if (US_INDEX_SYMBOLS.has(symbol)) {
      return { kind: "us-index", marketTimeZone: "America/Chicago" };
    }
    const spec = INDEX_SPECS[symbol];
    if (!spec) throw new Error(`No trading schedule configured for ${symbol}`);
    return { kind: "exchange", ...spec };
  }

  return { kind: "forex", marketTimeZone: "America/New_York" };
}

function parseDateKey(dateKey: string) {
  const parts = dateKey.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (!year || !month || !day) throw new Error(`Invalid date: ${dateKey}`);
  return { year, month, day };
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function addDaysToDateKey(dateKey: string, amount: number) {
  const { year, month, day } = parseDateKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return toDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function dayOfWeek(dateKey: string) {
  const { year, month, day } = parseDateKey(dateKey);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function startOfWeekDateKey(dateKey: string) {
  const mondayOffset = (dayOfWeek(dateKey) + 6) % 7;
  return addDaysToDateKey(dateKey, -mondayOffset);
}

export function dayRangeKeys(dayRange: DayRange, today: string) {
  if (!today) return [];
  if (dayRange === "today") return [today];
  if (dayRange === "tomorrow") return [addDaysToDateKey(today, 1)];
  if (dayRange === "both") return [today, addDaysToDateKey(today, 1)];

  const week = Array.from({ length: 7 }, (_, index) => addDaysToDateKey(startOfWeekDateKey(today), index));
  return dayRange === "this-week" ? week : week.filter((dateKey) => dateKey >= today);
}

function thanksgivingDateKey(year: number) {
  let thursdays = 0;
  for (let day = 1; day <= 30; day += 1) {
    if (new Date(Date.UTC(year, 10, day, 12)).getUTCDay() === 4) thursdays += 1;
    if (thursdays === 4) return toDateKey(year, 11, day);
  }
  throw new Error("Could not determine Thanksgiving");
}

function holidaySchedule(kind: ScheduleKind, dateKey: string): Pick<DaySchedule, "status" | "windows" | "note"> | null {
  const { year } = parseDateKey(dateKey);
  const thanksgiving = thanksgivingDateKey(year);
  const blackFriday = addDaysToDateKey(thanksgiving, 1);

  if (dateKey === thanksgiving && kind === "us-index") {
    return {
      status: "early-close",
      windows: [
        { open: 0, close: 720 },
        { open: 1020, close: 1440 },
      ],
      note: "Thanksgiving: pauses at 12:00 PM CT and reopens at 5:00 PM CT.",
    };
  }

  if (dateKey === blackFriday && kind === "us-index") {
    return {
      status: "early-close",
      windows: [{ open: 0, close: 735 }],
      note: "Day after Thanksgiving: closes early at 12:15 PM CT.",
    };
  }

  if (dateKey === thanksgiving && kind === "metals") {
    return {
      status: "early-close",
      windows: [
        { open: 0, close: 810 },
        { open: 1020, close: 1440 },
      ],
      note: "Thanksgiving: pauses at 1:30 PM CT and reopens at 5:00 PM CT.",
    };
  }

  if (dateKey === blackFriday && (kind === "metals" || kind === "forex")) {
    return {
      status: "early-close",
      windows: [{ open: 0, close: 825 }],
      note: "Day after Thanksgiving: CME futures close early at 1:45 PM CT.",
    };
  }

  return null;
}

export function getDaySchedule(symbol: string, category: string, dateKey: string): DaySchedule {
  const spec = getSpec(symbol, category);
  const holiday = holidaySchedule(spec.kind, dateKey);
  if (holiday) return { dateKey, marketTimeZone: spec.marketTimeZone, ...holiday };

  const day = dayOfWeek(dateKey);
  const base = { dateKey, marketTimeZone: spec.marketTimeZone };

  if (spec.kind === "exchange") {
    if (!spec.regularWindows) throw new Error(`Missing exchange hours for ${symbol}`);
    return day === 0 || day === 6
      ? { ...base, status: "closed", windows: [], note: "Exchange closed for the weekend." }
      : { ...base, status: "regular", windows: spec.regularWindows, note: "Underlying exchange hours." };
  }

  if (day === 6) return { ...base, status: "closed", windows: [], note: "Market closed for the weekend." };

  if (spec.kind === "forex") {
    if (day === 0) return { ...base, status: "regular", windows: [{ open: 1020, close: 1440 }], note: "Weekly opening." };
    if (day === 5) return { ...base, status: "regular", windows: [{ open: 0, close: 1020 }], note: "Weekly closing." };
    return { ...base, status: "regular", windows: FULL_DAY, note: "Open throughout the weekday." };
  }

  if (day === 0) return { ...base, status: "regular", windows: CME_SUNDAY, note: "Weekly opening." };
  if (day === 5) return { ...base, status: "regular", windows: CME_FRIDAY, note: "Weekly closing." };
  return {
    ...base,
    status: "regular",
    windows: CME_WEEKDAY,
    note: "Daily maintenance break from 4:00–5:00 PM CT.",
  };
}

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") values[part.type] = part.value;
  }
  return values;
}

export function getDateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = zonedParts(date, timeZone);
  return `${parts["year"]}-${parts["month"]}-${parts["day"]}`;
}

function timeZoneOffsetMinutes(date: Date, timeZone: string) {
  const parts = zonedParts(date, timeZone);
  const year = Number(parts["year"]);
  const month = Number(parts["month"]);
  const day = Number(parts["day"]);
  const hour = Number(parts["hour"]);
  const minute = Number(parts["minute"]);
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  return asUtc - Math.floor(date.getTime() / 60000) * 60000;
}

function zonedMinutesToUtc(dateKey: string, minutes: number, timeZone: string) {
  const { year, month, day } = parseDateKey(dateKey);
  const guess = Date.UTC(year, month - 1, day, 0, minutes);
  const initialOffset = timeZoneOffsetMinutes(new Date(guess), timeZone);
  let timestamp = guess - initialOffset;
  const correctedOffset = timeZoneOffsetMinutes(new Date(timestamp), timeZone);
  if (correctedOffset !== initialOffset) timestamp = guess - correctedOffset;
  return timestamp;
}

function formatTime(timestamp: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(timestamp));
}

function dayShift(fromDateKey: string, toDateKey: string) {
  const from = parseDateKey(fromDateKey);
  const to = parseDateKey(toDateKey);
  const fromUtc = Date.UTC(from.year, from.month - 1, from.day);
  const toUtc = Date.UTC(to.year, to.month - 1, to.day);
  return Math.round((toUtc - fromUtc) / 86400000);
}

function shiftLabel(shift: number) {
  if (shift === 0) return "";
  return shift > 0 ? ` (+${shift} day)` : ` (${shift} day)`;
}

export function formatScheduleWindows(schedule: DaySchedule, displayTimeZone: string) {
  if (schedule.status === "closed") return "Closed";

  return schedule.windows
    .map((window) => {
      const open = zonedMinutesToUtc(schedule.dateKey, window.open, schedule.marketTimeZone);
      const close = zonedMinutesToUtc(schedule.dateKey, window.close, schedule.marketTimeZone);
      const openDate = getDateKeyInTimeZone(new Date(open), displayTimeZone);
      const closeDate = getDateKeyInTimeZone(new Date(close), displayTimeZone);
      const openShift = shiftLabel(dayShift(schedule.dateKey, openDate));
      const closeShift = shiftLabel(dayShift(schedule.dateKey, closeDate));
      return `${formatTime(open, displayTimeZone)}${openShift} – ${formatTime(close, displayTimeZone)}${closeShift}`;
    })
    .join(" · ");
}

export function formatScheduleDate(dateKey: string) {
  const { year, month, day } = parseDateKey(dateKey);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function formatScheduleDateShort(dateKey: string) {
  const { year, month, day } = parseDateKey(dateKey);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function allScheduleRows() {
  return GROUPS.flatMap((group) =>
    group.items.map((item) => ({ symbol: item.symbol, name: item.name, category: group.title })),
  );
}
