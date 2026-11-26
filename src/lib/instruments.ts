export type Session = { name: string; startUtc: number; endUtc: number; note: string };

export type Instrument = {
  name: string;
  symbol: string;
  activeSessions: string;
  startUtc: number;
  endUtc: number;
  dailyHours: string;
};

export type InstrumentGroup = { title: string; subtitle: string; items: Instrument[] };

export const SESSIONS: Session[] = [
  { name: "Sydney", startUtc: 21, endUtc: 6, note: "AUD & NZD pairs open the trading day" },
  { name: "Tokyo", startUtc: 0, endUtc: 9, note: "JPY pairs see their first wave of volume" },
  { name: "London", startUtc: 7, endUtc: 16, note: "Highest liquidity for EUR, GBP & CHF" },
  { name: "New York", startUtc: 12, endUtc: 21, note: "Peak volume during London–NY overlap" },
];

export const INDICES_GROUP: InstrumentGroup = {
  title: "Stock Indices",
  subtitle:
    "Global benchmark indices. Most brokers quote them as CFDs, so they trade far longer than the stock exchange itself.",
  items: [
    {
      name: "US 30 (Dow Jones Industrial Average)",
      symbol: "US30",
      activeSessions: "New York",
      startUtc: 13,
      endUtc: 21,
      dailyHours: "23 hours daily from Sunday evening; 1-hour halt near 22:00 UTC",
    },
    {
      name: "US 500 (S&P 500)",
      symbol: "US500",
      activeSessions: "New York",
      startUtc: 13,
      endUtc: 21,
      dailyHours: "23 hours daily from Sunday evening; 1-hour halt near 22:00 UTC",
    },
    {
      name: "Nasdaq 100",
      symbol: "NAS100",
      activeSessions: "New York",
      startUtc: 13,
      endUtc: 21,
      dailyHours: "23 hours daily from Sunday evening; 1-hour halt near 22:00 UTC",
    },
    {
      name: "US 2000 (Russell 2000)",
      symbol: "US2000",
      activeSessions: "New York",
      startUtc: 14,
      endUtc: 21,
      dailyHours: "23 hours daily from Sunday evening; 1-hour halt near 22:00 UTC",
    },
    {
      name: "DAX 40 (Germany)",
      symbol: "DE40",
      activeSessions: "London",
      startUtc: 8,
      endUtc: 16,
      dailyHours: "Exchange 08:00–16:30 UTC — index CFDs run nearly 24 hours",
    },
    {
      name: "Euro Stoxx 50 (Eurozone)",
      symbol: "EU50",
      activeSessions: "London",
      startUtc: 8,
      endUtc: 16,
      dailyHours: "Exchange 08:00–16:30 UTC — index CFDs run nearly 24 hours",
    },
    {
      name: "FTSE 100 (United Kingdom)",
      symbol: "UK100",
      activeSessions: "London",
      startUtc: 7,
      endUtc: 16,
      dailyHours: "Exchange 07:00–15:30 UTC — index CFDs run nearly 24 hours",
    },
    {
      name: "Swiss Market Index",
      symbol: "CH20",
      activeSessions: "London",
      startUtc: 8,
      endUtc: 16,
      dailyHours: "Exchange 08:00–16:30 UTC — index CFDs run nearly 24 hours",
    },
    {
      name: "Nikkei 225 (Japan)",
      symbol: "JP225",
      activeSessions: "Tokyo",
      startUtc: 0,
      endUtc: 6,
      dailyHours: "Exchange 00:00–06:00 UTC — index CFDs run nearly 24 hours",
    },
    {
      name: "Hang Seng (Hong Kong)",
      symbol: "HK50",
      activeSessions: "Tokyo & Sydney",
      startUtc: 1,
      endUtc: 8,
      dailyHours: "Exchange 01:30–08:00 UTC — index CFDs follow the futures session",
    },
    {
      name: "ASX 200 (Australia)",
      symbol: "AU200",
      activeSessions: "Sydney & Tokyo",
      startUtc: 0,
      endUtc: 6,
      dailyHours: "Exchange 23:50–06:00 UTC — index CFDs follow the futures session",
    },
    {
      name: "S&P/TSX 60 (Canada)",
      symbol: "CA60",
      activeSessions: "New York",
      startUtc: 14,
      endUtc: 21,
      dailyHours: "Exchange 14:30–21:00 UTC — index CFDs follow the futures session",
    },
  ],
};

export const GROUPS: InstrumentGroup[] = [
  {
    title: "Major Pairs",
    subtitle: "The most liquid currency pairs in the world, all paired with the US Dollar.",
    items: [
      { name: "Euro / US Dollar", symbol: "EUR/USD", activeSessions: "London & New York", startUtc: 7, endUtc: 21, dailyHours: "24 hours (Mon–Fri)" },
      { name: "British Pound / US Dollar", symbol: "GBP/USD", activeSessions: "London & New York", startUtc: 7, endUtc: 21, dailyHours: "24 hours (Mon–Fri)" },
      { name: "US Dollar / Japanese Yen", symbol: "USD/JPY", activeSessions: "Tokyo & New York", startUtc: 0, endUtc: 21, dailyHours: "24 hours (Mon–Fri)" },
      { name: "US Dollar / Swiss Franc", symbol: "USD/CHF", activeSessions: "London & New York", startUtc: 7, endUtc: 21, dailyHours: "24 hours (Mon–Fri)" },
      { name: "Australian Dollar / US Dollar", symbol: "AUD/USD", activeSessions: "Sydney, Tokyo & New York", startUtc: 21, endUtc: 9, dailyHours: "24 hours (Mon–Fri)" },
      { name: "US Dollar / Canadian Dollar", symbol: "USD/CAD", activeSessions: "New York", startUtc: 12, endUtc: 21, dailyHours: "24 hours (Mon–Fri)" },
      { name: "New Zealand Dollar / US Dollar", symbol: "NZD/USD", activeSessions: "Sydney & Tokyo", startUtc: 21, endUtc: 9, dailyHours: "24 hours (Mon–Fri)" },
    ],
  },
  {
    title: "Minor & Cross Pairs",
    subtitle: "Popular currency pairs that do not include the US Dollar.",
    items: [
      { name: "Euro / British Pound", symbol: "EUR/GBP", activeSessions: "London", startUtc: 7, endUtc: 16, dailyHours: "24 hours (Mon–Fri)" },
      { name: "Euro / Japanese Yen", symbol: "EUR/JPY", activeSessions: "Tokyo & London", startUtc: 0, endUtc: 16, dailyHours: "24 hours (Mon–Fri)" },
      { name: "British Pound / Japanese Yen", symbol: "GBP/JPY", activeSessions: "Tokyo & London", startUtc: 0, endUtc: 16, dailyHours: "24 hours (Mon–Fri)" },
      { name: "Euro / Australian Dollar", symbol: "EUR/AUD", activeSessions: "Sydney & London", startUtc: 21, endUtc: 16, dailyHours: "24 hours (Mon–Fri)" },
      { name: "Australian Dollar / Japanese Yen", symbol: "AUD/JPY", activeSessions: "Sydney & Tokyo", startUtc: 21, endUtc: 9, dailyHours: "24 hours (Mon–Fri)" },
    ],
  },
  {
    title: "Precious Metals",
    subtitle: "Widely traded spot metals quoted against the US Dollar.",
    items: [
      { name: "Gold / US Dollar", symbol: "XAU/USD", activeSessions: "London & New York", startUtc: 7, endUtc: 21, dailyHours: "23 hours (22:00–21:00 UTC)" },
      { name: "Silver / US Dollar", symbol: "XAG/USD", activeSessions: "London & New York", startUtc: 7, endUtc: 21, dailyHours: "23 hours (22:00–21:00 UTC)" },
    ],
  },
  INDICES_GROUP,
];

export function formatUtcHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function formatLocalWindow(startUtc: number, endUtc: number, offsetMinutes: number | null) {
  if (offsetMinutes === null) {
    return `${formatUtcHour(startUtc)} – ${formatUtcHour(endUtc)} UTC`;
  }
  const fmt = (h: number) => {
    const total = ((h * 60 - offsetMinutes) % 1440 + 1440) % 1440;
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    const suffix = hh >= 12 ? "PM" : "AM";
    const h12 = hh % 12 || 12;
    return `${h12}:${String(mm).padStart(2, "0")} ${suffix}`;
  };
  return `${fmt(startUtc)} – ${fmt(endUtc)}`;
}
