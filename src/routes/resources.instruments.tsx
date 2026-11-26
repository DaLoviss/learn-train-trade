import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero, meta } from "@/components/site-layout";

type Session = { name: string; startUtc: number; endUtc: number; note: string };
type Instrument = { name: string; symbol: string; activeSessions: string; startUtc: number; endUtc: number; dailyHours: string };

const SESSIONS: Session[] = [
  { name: "Sydney", startUtc: 21, endUtc: 6, note: "AUD & NZD pairs open the trading day" },
  { name: "Tokyo", startUtc: 0, endUtc: 9, note: "JPY pairs see their first wave of volume" },
  { name: "London", startUtc: 7, endUtc: 16, note: "Highest liquidity for EUR, GBP & CHF" },
  { name: "New York", startUtc: 12, endUtc: 21, note: "Peak volume during London–NY overlap" },
];

const GROUPS: { title: string; subtitle: string; items: Instrument[] }[] = [
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
];

function formatUtcHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function formatLocalWindow(startUtc: number, endUtc: number, offsetMinutes: number | null) {
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

function InstrumentsPage() {
  const [tzInfo, setTzInfo] = useState<{ offset: number; label: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const label = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
    setTzInfo({ offset: now.getTimezoneOffset(), label });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Forex Instruments"
        intro="Explore major currency pairs, cross pairs and metals along with their symbols and daily trading times."
      />

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold text-gold md:text-3xl">Daily Market Sessions</h2>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {tzInfo ? `Times shown in your local time (${tzInfo.label})` : "Times shown in UTC"}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SESSIONS.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{s.name} Session</p>
              <p className="mt-2 text-lg font-bold">{formatLocalWindow(s.startUtc, s.endUtc, tzInfo?.offset ?? null)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatUtcHour(s.startUtc)} – {formatUtcHour(s.endUtc)} UTC</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-6xl space-y-12 px-4">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-2xl font-bold text-gold md:text-3xl">{group.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{group.subtitle}</p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-primary">
                    <th className="px-5 py-3.5">Symbol</th>
                    <th className="px-5 py-3.5">Instrument</th>
                    <th className="px-5 py-3.5">Most Active Sessions</th>
                    <th className="px-5 py-3.5">Peak Trading Times</th>
                    <th className="px-5 py-3.5">Daily Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {group.items.map((item) => (
                    <tr key={item.symbol} className="transition-colors hover:bg-secondary/30">
                      <td className="px-5 py-4 font-semibold text-primary">{item.symbol}</td>
                      <td className="px-5 py-4 font-medium text-foreground">{item.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{item.activeSessions}</td>
                      <td className="px-5 py-4 text-foreground">{formatLocalWindow(item.startUtc, item.endUtc, tzInfo?.offset ?? null)}</td>
                      <td className="px-5 py-4 text-muted-foreground">{item.dailyHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export const Route = createFileRoute("/resources/instruments")({
  head: () => meta("Instruments", "Forex instruments, currency pair symbols, and daily trading session times."),
  component: InstrumentsPage,
});