import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, meta } from "@/components/site-layout";

export const Route = createFileRoute("/resources/economic-calendar")({
  head: () => meta("Economic Calendar", "Follow economic events, forecasts and releases with the Investing.com economic calendar."),
  component: EconomicCalendarPage,
});

function EconomicCalendarPage() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Economic Calendar" intro="Keep track of economic releases and market-moving events across the major currencies." />
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link to="/resources" className="font-semibold text-primary hover:underline">← Resources</Link>
          <a href="https://www.investing.com/economic-calendar/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Open on Investing.com ↗</a>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <iframe
            title="Investing.com Economic Calendar"
            src="https://sslecal2.investing.com/?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=week&timeZone=55&lang=1"
            width="100%"
            height="700"
            className="block min-w-[650px] border-0"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Real Time Economic Calendar provided by <a href="https://www.investing.com/" target="_blank" rel="nofollow noopener noreferrer" className="font-semibold text-primary hover:underline">Investing.com</a>.
        </p>
      </section>
    </>
  );
}