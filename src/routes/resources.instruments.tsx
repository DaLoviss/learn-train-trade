import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero, meta } from "@/components/site-layout";
import { GROUPS, SESSIONS, formatLocalWindow, formatUtcHour } from "@/lib/instruments";

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
        intro="Explore currency pairs, metals and stock indices along with their symbols and daily trading times."
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
  head: () =>
    meta(
      "Instruments",
      "Forex currency pairs, metals and stock indices with their symbols, active sessions and daily trading times.",
    ),
  component: InstrumentsPage,
});
