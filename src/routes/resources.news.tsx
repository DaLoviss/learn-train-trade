import { createFileRoute } from "@tanstack/react-router";
import { CardGrid, PageHero, meta } from "@/components/site-layout";

export const Route = createFileRoute("/resources/news")({
  head: () => meta("Forex News", "The best free sources for forex news and the economic calendar."),
  component: () => (
    <>
      <PageHero eyebrow="Resources · News" title="Forex News" intro="Big news moves markets. These free sources help you know what is coming and react with a plan." />
      <CardGrid items={[
        { tag: "Calendar", title: "Forex Factory", text: "The go-to economic calendar with impact ratings for every release.", href: "https://www.forexfactory.com/calendar" },
        { tag: "Headlines", title: "Reuters Markets", text: "Fast, reliable global financial and currency news.", href: "https://www.reuters.com/markets/currencies/" },
        { tag: "Analysis", title: "DailyFX", text: "Free market analysis, forecasts and educational articles.", href: "https://www.dailyfx.com" },
        { tag: "Calendar", title: "Investing.com", text: "Economic calendar, live quotes and breaking news.", href: "https://www.investing.com/economic-calendar/" },
        { tag: "Central banks", title: "Federal Reserve", text: "Official US interest rate decisions and statements.", href: "https://www.federalreserve.gov/newsevents.htm" },
        { tag: "Analysis", title: "FXStreet", text: "Real-time news, rates and expert commentary.", href: "https://www.fxstreet.com" },
      ]} />
    </>
  ),
});
