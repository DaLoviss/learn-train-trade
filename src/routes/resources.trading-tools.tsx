import { createFileRoute } from "@tanstack/react-router";
import { CardGrid, PageHero, meta } from "@/components/site-layout";

export const Route = createFileRoute("/resources/trading-tools")({
  head: () => meta("Trading Tools", "Free charting platforms, calculators and journals for forex traders."),
  component: () => (
    <>
      <PageHero eyebrow="Resources · Trading Tools" title="Trading Tools" intro="The right tools make analysis faster and risk easier to control." />
      <CardGrid items={[
        { tag: "Charting", title: "TradingView", text: "Powerful browser charts, indicators and a huge idea-sharing community.", href: "https://www.tradingview.com" },
        { tag: "Platform", title: "MetaTrader 5", text: "The most widely used trading platform offered by brokers.", href: "https://www.metatrader5.com" },
        { tag: "Risk", title: "Position Size Calculator", text: "Work out the right lot size for your risk on every trade.", href: "https://www.myfxbook.com/forex-calculators/position-size" },
        { tag: "Sessions", title: "Market Hours", text: "See which trading sessions are open right now.", href: "https://www.forex.timezoneconverter.com" },
        { tag: "Sentiment", title: "Myfxbook", text: "Community sentiment, tools and account tracking.", href: "https://www.myfxbook.com" },
        { tag: "Journal", title: "Trading Journal", text: "Record every trade, review your mistakes and improve — a simple spreadsheet works great to start." },
      ]} />
    </>
  ),
});
